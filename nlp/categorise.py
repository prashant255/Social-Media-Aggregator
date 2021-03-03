import pandas as pd
import numpy as np
import re
import contractions
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import pickle
import trax.layers as tl
from sklearn.preprocessing import LabelEncoder
import sys

def preprocess(text):
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
    lemmatizer = WordNetLemmatizer()
    text = [lemmatizer.lemmatize(word) for word in text]
    return text

def text_to_vector(text, max_len, vocab, pad_token="__PAD__", num_token="__NUM__", unk_token="__UNK__"):
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

def get_model(vocab_size):
    return tl.Serial(
        tl.Embedding(vocab_size, 128),
        tl.LSTM(128),
        tl.Mean(axis=1),
        tl.Dense(12),
        tl.LogSoftmax()
    )

def categorise(model, vector, label_encoder):
    cat_vect = model(vector)
    cat_max_ind = np.argmax(cat_vect)
    category = label_encoder.inverse_transform([cat_max_ind])
    return category

def main(text):
    # load info
    info = pickle.load(open("./model/info.pkl", "rb"))
    # preprocess
    text = preprocess(text)
    # text to vector
    max_len = info["max_len"]
    vocab = info["vocab"]
    vector = text_to_vector(text, max_len, vocab)
    # run the model
    model = get_model(len(vocab))
    model.init_from_file("./model/lstm/model.pkl.gz")
    label_encoder = LabelEncoder()
    label_encoder.classes_ = info["label_encoder"]
    category = categorise(model, vector, label_encoder)
    return category

print(main(sys.argv[1]))