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
# spacy.cli.download('en_core_web_sm')

# trax
import trax.layers as tl
from trax.math import numpy as fastnp

# duplicate
import json
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.models import load_model
import tensorflow.keras.backend as K
from tensorflow.keras.preprocessing.sequence import pad_sequences

# categorisation
class Categorise():
    def __init__(self):
        # load config
        info = pickle.load(open("./categorise_model/info.pkl", "rb"))
        self.vocab = info['vocab']
        self.max_len = info['max_len']
        self.label_encoder = LabelEncoder()
        self.label_encoder.classes_ = info['label_encoder'] 

        # model
        self.model = load_model("./categorise_model/keras_checkpoint")

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

    def categorise(self, text):
        text = self.preprocess(text)
        vector = self.text_to_vector(text)
        label_encoder = self.label_encoder
        cat_vect = self.model(vector)
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
    def __init__(self):
        # config
        with open('./duplicates_model/config.pickle', 'rb') as file:
            config = pickle.load(file)
        self.max_len = config['MAX_LEN']
        self.threshold = config['THRESHOLD']

        # tokeniser
        with open('./duplicates_model/tokenizer.json') as file:
            tok_json = json.load(file)
        self.tok = tokenizer_from_json(tok_json)

        # model
        self.model = load_model('./duplicates_model/model/', custom_objects={'normalise': self.normalise})

    def normalise(self, x):
        return x / K.sqrt(K.sum(x * x, axis=-1, keepdims=True))

    def preprocess_duplicate(self, text):
        text = ''.join(c for c in text if ord(c) < 128)
        text = self.tok.texts_to_sequences([text])
        text = pad_sequences(text, maxlen=self.max_len, padding='post')
        return text

    def get_word_embeddings(self, text):
        text = self.preprocess_duplicate(text)
        o1, _ = self.model.predict((text, text))
        return o1

    def get_group_id(self, postEmbedding, otherEmbedding):
        for grp in otherEmbedding:
            if np.dot(postEmbedding, grp['embedding']) > self.threshold:
                return grp['id']
        return -1

# main 
duplicate_obj = Duplicates()
categorise_obj = Categorise()

# helper function
def word_embeddings(text):
    return duplicate_obj.get_word_embeddings(text)

def categorise(text):
    return categorise_obj.categorise(text)

def group(postEmbedding, otherEmbedding):
    return duplicate_obj.get_group_id(postEmbedding, otherEmbedding)

from datetime import date

# routing the application
@app.route('/catnwe', methods=["POST"])
def cat():
    if request.json and 'text' in request.json:
        ip = request.json['text']
        cat = categorise(ip)
        we = word_embeddings(ip).squeeze().tolist()
        # # save result in logs
        # with open(f'./logs/predictions_{date.today().strftime("%d_%m_%y")}.csv', 'a') as f:
        #     ip = ip.replace('"', '\"')
        #     f.write(f'"{ip}","{res}"\n')
        return jsonify(category=(cat), embedding=(we))
    return "Hungry for text!"

@app.route('/group', methods=['POST'])
def dd():
    if request.json and 'postEmbedding' in request.json and 'otherEmbedding' in request.json:
        postEmbedding = request.json['postEmbedding']
        otherEmbedding = request.json['otherEmbedding']
        groupId = group(postEmbedding, otherEmbedding)
        return jsonify(groupId=(groupId))
    return "Hey get the embeddings!"
    
app.run()