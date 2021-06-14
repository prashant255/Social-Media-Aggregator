import numpy as np
import re
import contractions
import pickle
from sklearn.preprocessing import LabelEncoder
import json

import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical

# for web application
import flask
from flask import request
from flask import jsonify
app = flask.Flask(__name__)
app.config["DEBUG"] = True


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

    def categorise(self, vector):
        cat_vect = self.model.predict(vector)
        cat_max_ind = np.argmax(cat_vect)
        category = self.label_encoder.inverse_transform([cat_max_ind])
        return str(np.squeeze(category))

    def train(self, vector, cat):
        cat = self.label_encoder.transform([cat])
        cat = np.asarray(to_categorical(cat, num_classes=len(self.label_encoder.classes_))).astype(np.float32)
        self.model.fit(np.array(vector), np.array(cat), epochs=5)

        # save the model
        self.model.save('./categorise_model/model')

# dupicate detection
class Duplicates():
    def __init__(self):
        # config
        with open('./duplicates_model/info.pkl', 'rb') as file:
            info = pickle.load(file)
        self.threshold = info['threshold']
        self.emd_dim = 128

        # model
        self.model = load_model('./duplicates_model/model/')

    def random_we(self):
        return np.random.rand(self.emd_dim)

    def get_word_embeddings(self, vector):
        o1, _ = self.model.predict((vector, vector))
        return o1.squeeze().tolist()

    def get_avg_word_embeddings(self, vector):
        emb = self.model.get_layer(index=0)
        we = tf.reduce_mean(emb(vector), axis=-2)
        return we.numpy().squeeze().tolist()

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
    # we = duplicate_obj.get_avg_word_embeddings(vector)
    return cat, we

def group(postEmbedding, otherEmbedding):
    return duplicate_obj.get_group_id(postEmbedding, otherEmbedding)

def random_embeddings():
    return duplicate_obj.random_we().tolist()

def train(text, cat):
    vector = vectorise_obj.vectorise(text)
    categorise_obj.train(vector, cat)

from datetime import date

# routing the application
@app.route('/catnwe', methods=["POST"])
def cat():
    if request.json and 'text' in request.json and len(request.json['text']) > 4:
        ip = request.json['text']
        cat, we = cat_n_we(ip)
    else: 
        cat = "miscellaneous"
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

@app.route('/train', methods=['POST'])
def tc():
    if request.json and 'text' in request.json and 'category' in request.json:
        text, cat = request.json['text'], request.json['category']
        train(text, cat)
        return "success"
    return "Wheres text and category?"
    
app.run()