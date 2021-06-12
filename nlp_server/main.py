# import pandas as pd
import numpy as np
import re
import contractions
import pickle
from sklearn.preprocessing import LabelEncoder
import json

# import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.models import load_model
# import tensorflow.keras.backend as K
from tensorflow.keras.preprocessing.sequence import pad_sequences

# for web application
import flask
from flask import request
from flask import jsonify
app = flask.Flask(__name__)
app.config["DEBUG"] = True

# # nltk 
# import nltk
# # nltk.download('punkt')
# # nltk.download('stopwords')
# # nltk.download('wordnet')
# from nltk import word_tokenize
# from nltk.corpus import stopwords
# # from nltk.stem import WordNetLemmatizer

# # spaCy
# import spacy
# # spacy.cli.download('en_core_web_sm')


class Vectorise():
    def __init__(self):
        info = pickle.load(open("./info.pkl", "rb"))
        self.max_len = info['max_len']

        # tokeniseer
        with open('./tokenizer.json') as file:
            tok_json = json.load(file)
        self.tok = tokenizer_from_json(tok_json)

    def preprocess(self, text):
        url = re.compile(r'https?://\S+|www\.\S+')
        text = url.sub('<url>', text)
        text = re.sub(r'\d+', ' <number> ', text)
        text = re.sub(r'#\w+', '<hashtag>', text)
        text = re.sub(r'@\w+', '<user>', text)
        text = contractions.fix(text)
        text = ''.join(c for c in text if ord(c) < 128)
        return text
    
    def vectorise(self, text):
        text = self.preprocess(text)
        vector = self.tok.texts_to_sequences([text])
        vector = pad_sequences(vector, maxlen=self.max_len, padding='post')
        return vector

# categorisation
class Categorise():
    def __init__(self):
        # load config
        info = pickle.load(open("./categorise_model/info.pkl", "rb"))
        self.label_encoder = LabelEncoder()
        self.label_encoder.classes_ = info['label_encoder'] 

        # model
        self.model = load_model("./categorise_model/model")

    # def preprocess(self, text):
    #     url_remove = re.compile(r'https?://\S+|www\.\S+')
    #     text = url_remove.sub(r'', text)
    #     text = text.lower()
    #     text = re.sub(r'@\w+', '', text)
    #     text = re.sub(r'#\w+', '', text)
    #     text = re.sub(r'[^\w\s\d]', '', text)
    #     text = contractions.fix(text)
    #     text = word_tokenize(text)
    #     STOPWORDS = set(stopwords.words('english'))
    #     text = [word for word in text if word not in STOPWORDS]
    #     sp = spacy.load('en_core_web_sm')
    #     text = [word.lemma_ for word in sp(" ".join(text))]
    #     return text

    # def preprocess(self, text):
    #     url = re.compile(r'https?://\S+|www\.\S+')
    #     text = url.sub('<url>', text)
    #     text = re.sub(r'\d+', ' <number> ', text)
    #     text = re.sub(r'#\w+', '<hashtag>', text)
    #     text = re.sub(r'@\w+', '<user>', text)
    #     text = contractions.fix(text)
    #     text = ''.join(c for c in text if ord(c) < 128)
    #     return text

    # def text_to_vector(self, text, pad_token="__PAD__", num_token="__NUM__", unk_token="__UNK__"):
    #     max_len = self.max_len
    #     vocab = self.vocab
    #     vector = []
    #     if len(text) > max_len: text = text[:max_len]
    #     for word in text:
    #         if word.isnumeric(): vector.append(vocab[num_token])
    #         elif word in vocab: vector.append(vocab[word])
    #         else: vector.append(vocab[unk_token])
    #     # padding the tweet
    #     pad = [vocab[pad_token]] * (max_len - len(vector))
    #     vector += pad
    #     vector = np.array([vector])
    #     return vector

    def categorise(self, vector):
        # text = self.preprocess(text)
        # vector = self.tok.texts_to_sequences([text])
        # vector = pad_sequences(vector, maxlen=self.max_len, padding='post')
        cat_vect = self.model.predict(vector)
        cat_max_ind = np.argmax(cat_vect)
        category = self.label_encoder.inverse_transform([cat_max_ind])
        return str(np.squeeze(category))

# dupicate detection
class Duplicates():
    def __init__(self):
        # config
        with open('./duplicates_model/info.pkl', 'rb') as file:
            info = pickle.load(file)
        self.threshold = info['threshold']
        self.emd_dim = 128

        # model
        self.model = load_model('./duplicates_model/model/') #, custom_objects={'normalise': self.normalise}

    # def normalise(self, x):
    #     return x / K.sqrt(K.sum(x * x, axis=-1, keepdims=True))

    # def preprocess_duplicate(self, text):
    #     text = ''.join(c for c in text if ord(c) < 128)
    #     text = self.tok.texts_to_sequences([text])
    #     text = pad_sequences(text, maxlen=self.max_len, padding='post')
    #     return text

    def random_we(self):
        return np.random.rand(self.emd_dim)

    def get_word_embeddings(self, vector):
        # text = self.preprocess_duplicate(text)
        o1, _ = self.model.predict((vector, vector))
        return o1.squeeze().tolist()

    def get_group_id(self, postEmbedding, otherEmbedding):
        for grp in otherEmbedding:
            if np.dot(postEmbedding, grp['embedding']) > self.threshold:
                return grp['id']
        return -1

# main 
vectorise_obj = Vectorise()
duplicate_obj = Duplicates()
categorise_obj = Categorise()

# helper function
def cat_n_we(text):
    vector = vectorise_obj.vectorise(text)
    cat = categorise_obj.categorise(vector)
    we = duplicate_obj.get_word_embeddings(vector)
    return cat, we

# def word_embeddings(text):
#     return duplicate_obj.get_word_embeddings(text)

# def categorise(text):
#     return categorise_obj.categorise(text)

def group(postEmbedding, otherEmbedding):
    return duplicate_obj.get_group_id(postEmbedding, otherEmbedding)

def random_embeddings():
    return duplicate_obj.random_we().tolist()

from datetime import date

# routing the application
@app.route('/catnwe', methods=["POST"])
def cat():
    if request.json and 'text' in request.json and len(request.json['text']) > 0:
        ip = request.json['text']
        cat, we = cat_n_we(ip)
        print(type(cat), type(we))
    else: 
        cat = "personal"
        we = random_embeddings()
    # save result in logs
    with open(f'./logs/predictions_{date.today().strftime("%d_%m_%y")}.csv', 'a') as f:
        ip = ip.replace('"', '\"')
        f.write(f'"{ip}","{cat}"\n')
    return jsonify(category=(cat), embedding=(we))

@app.route('/group', methods=['POST'])
def dd():
    if request.json and 'postEmbedding' in request.json and 'otherEmbedding' in request.json:
        postEmbedding = request.json['postEmbedding']
        otherEmbedding = request.json['otherEmbedding']
        groupId = group(postEmbedding, otherEmbedding)
        return jsonify(groupId=(groupId))
    return "Hey get the embeddings!"
    
app.run()