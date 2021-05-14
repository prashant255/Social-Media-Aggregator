import pandas as pd
import numpy as np
import re
import contractions
import pickle
from sklearn.preprocessing import LabelEncoder
import sys

import tensorflow as tf

# for web application
import flask
from flask import request
from flask import jsonify
app = flask.Flask(__name__)
app.config["DEBUG"] = True

# nltk 
import nltk
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')
from nltk import word_tokenize
from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer

# spaCy
import spacy
spacy.cli.download('en_core_web_sm')

# trax
import trax.layers as tl
from trax.fastmath import numpy as fastnp

# categorisation
class Categorise():
    def __init__(self, info):
        self.vocab = info['vocab']
        self.max_len = info['max_len']
        self.label_encoder = LabelEncoder()
        self.label_encoder.classes_ = info['label_encoder'] 

    def preprocess(self, text):
        url_remove = re.compile(r'https?://\S+|www\.\S+')
        text = url_remove.sub(r'', text)
        text = text.lower()
        text = re.sub(r'@\w+', '', text)
        text = re.sub(r'#\w+', '', text)
        text = re.sub(r'[^\w\s\d]', '', text)
        text = contractions.fix(text)
        text = word_tokenize(text)
        STOPWORDS = set(stopwords.words('english'))
        text = [word for word in text if word not in STOPWORDS]
        sp = spacy.load('en_core_web_sm')
        text = [word.lemma_ for word in sp(" ".join(text))]
        return text

    def text_to_vector(self, text, pad_token="__PAD__", num_token="__NUM__", unk_token="__UNK__"):
        max_len = self.max_len
        vocab = self.vocab
        vector = []
        if len(text) > max_len: text = text[:max_len]
        for word in text:
            if word.isnumeric(): vector.append(vocab[num_token])
            elif word in vocab: vector.append(vocab[word])
            else: vector.append(vocab[unk_token])
        # padding the tweet
        pad = [vocab[pad_token]] * (max_len - len(vector))
        vector += pad
        vector = np.array([vector])
        return vector

    def categorise(self, model, text):
        text = self.preprocess(text)
        vector = self.text_to_vector(text)
        label_encoder = self.label_encoder
        cat_vect = model(vector)
        cat_max_ind = np.argmax(cat_vect)
        category = label_encoder.inverse_transform([cat_max_ind])
        return str(np.squeeze(category))

# def get_model(vocab_size):
#     return tl.Serial(
#         tl.Embedding(vocab_size, 128),
#         tl.LSTM(128),
#         tl.Mean(axis=1),
#         tl.Dense(12),
#         tl.LogSoftmax()
#     )

# dupicate detection
class Duplicates():

    def __init__(self, vocab):
        self.vocab = vocab

    def Siamese(self, d_model=128, mode='train'):

        vocab_size = len(self.vocab)

        def normalize(x):
            return x / fastnp.sqrt(fastnp.sum(x * x, axis=-1, keepdims=True))
    
        q_processor = tl.Serial(
            tl.Embedding(vocab_size, d_model),
            tl.LSTM(d_model),
            tl.Mean(axis=1),
            tl.Fn('Nomalize', lambda x: normalize(x))
        )
        
        model = tl.Parallel(q_processor, q_processor)
        return model

    def text_to_vector(self, text, max_len):
        pad = self.vocab["<PAD>"]
        text = nltk.word_tokenize(text)
        vector = []
        for word in text: 
            vector += [self.vocab.get(word, 0)]
        vector = vector + [pad] * (max_len - len(vector))
        return vector

    def is_duplicate(self, q1, q2, model, threshold, max_len):
        q1 = np.array([self.text_to_vector(q1, max_len)])
        q2 = np.array([self.text_to_vector(q2, max_len)])
        v1, v2 = model((q1, q2))
        d = fastnp.dot(v1, v2.T)
        res = d > threshold
        return np.squeeze(res)

# main 
def duplicate_detection_fn(obj, model, questions, vocab):
    # calculate info
    max_len = len(max(questions, key=lambda x: len(x)))
    max_len = 2**int(np.ceil(np.log2(max_len)))
    
    # make groups
    assert len(questions) >= 1
    groups = [[questions[0]]]
    for question in questions[1:]:
        groups_len = len(groups)
        idx = -1
        grouped = False
        for idx in range(groups_len):
            question1 = question
            question2 = groups[idx][0]
            if obj.is_duplicate(question1, question2, model, 0.7, max_len):
                groups[idx].append(question)
                grouped = True
                break
        if not grouped and idx == groups_len-1:
            groups.append([question])
    
    return groups

def categorise_fn(obj, model, text):
    return obj.categorise(model, text)

# initialise the server
duplicate_vocab = pickle.load(open("./duplicates_model/vocab.pkl", "rb"))
duplicate_obj = Duplicates(duplicate_vocab)
duplicate_model = duplicate_obj.Siamese()
duplicate_model.init_from_file("./duplicates_model/model.pkl.gz")

categorise_info = pickle.load(open("./categorise_model/info.pkl", "rb"))
# model = get_model(len(vocab))
# model.init_from_file("./model/lstm/model.pkl.gz")
categorise_model = tf.keras.models.load_model("./categorise_model/keras_checkpoint")
categorise_obj = Categorise(categorise_info)

# helper function
def duplicate_detection(questions):
    return duplicate_detection_fn(duplicate_obj, duplicate_model, questions, duplicate_vocab)

def categorise(text):
    return categorise_fn(categorise_obj, categorise_model, text)

from datetime import date

# routing the application
@app.route('/categorise', methods=["POST"])
def cat():
    if request.json and 'text' in request.json:
        ip = request.json['text']
        res = categorise(ip)
        # save result in logs
        with open(f'./logs/predictions_{date.today().strftime("%d_%m_%y")}.csv', 'a') as f:
            ip = ip.replace('"', '\"')
            f.write(f'"{ip}","{res}"\n')
        return jsonify(category=(res))
    return "Hungry for text!"

@app.route('/duplicate', methods=['POST'])
def dd():
    if request.json and 'questions' in request.json:
        questions = request.json['questions']
        return jsonify(groups=(duplicate_detection(questions)))
    return "Hey get the questions!"
    
app.run()