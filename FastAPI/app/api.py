from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sklearn.neighbors import NearestNeighbors
from sentence_transformers import SentenceTransformer, util
from tqdm import tqdm
from dotenv import load_dotenv
import json
import os
import uuid

import pandas as pd
import numpy as np

from pydantic import BaseModel

import ast

class Question(BaseModel):
    question: str
    

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


df = pd.read_csv('../course_vector_generator/job_vector.csv')

df["status"] = "published"

df['vectors'] = df.vectors.apply(lambda x: ast.literal_eval(str(x)))

# We use only title: {string; status: string ; slug:string, index: number}
# jobpost	date	Title	Company	AnnouncementCode	Term	Eligibility	Audience	StartDate	Duration	...	ApplicationP	OpeningDate	Deadline	Notes	AboutC	Attach	Year	Month	IT	vectors status

class Tokenizer(object):
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def get_token(self, documents):
        sentences  = [documents]
        sentence_embeddings = self.model.encode(sentences, convert_to_tensor=True)
        #encod_list = sentence_embeddings.numpy()
        _ = list(sentence_embeddings.flatten())
        encod_np_array = np.array(_)
        encod_list = encod_np_array.tolist()
        return encod_list

helper_token = Tokenizer()

df2 = df[['jobpost', 'Title', 'status', 'Year']].to_json(orient='records')

def get_similar(search_term,number_of_neighbours):

    def get_knn():
        vector_arrays = df['vectors'].to_numpy().tolist()
        return NearestNeighbors().fit(vector_arrays)        

    def get_token():
        #helper_token = Tokenizer()
        #INPUT = search_term
        token_vector = helper_token.get_token(search_term)
        return token_vector

    def flatten_neighbour_list(nb_indexes):
        nb_list = nb_indexes.tolist()
        return [item for sublist in nb_list for item in sublist]        

    knn = get_knn()
    vector = get_token()
    nb_indexes = knn.kneighbors([vector],number_of_neighbours,return_distance=False)
    nb_indexes = flatten_neighbour_list(nb_indexes)
    
    #title_arrays = df['Title'].to_numpy().tolist()
    #post_arrays = df['jobpost'].to_numpy().tolist()
    #return_array = []
    #for num in nb_indexes:
    #    return_array.append([title_arrays[num], post_arrays[num].replace('\r', '').replace('\n', '')])

    df3 = df.filter(items = nb_indexes, axis=0)

    df2 = df3[['jobpost', 'Title', 'status', 'Year']].iloc[:10].to_json(orient='records')#[1:-1].replace('},{', '} {')
    
    return df2 


@app.get("/courses", tags=["courses"])
async def read_root() -> dict:
    return {"data": df2}

@app.post("/ask")
def ask(question: Question):
    searched_df = get_similar(question.question, 10)
    return {
        "searched": searched_df
    }


'''
@app.get("/courses/")
def query_item_by_parameters(
    search_input: str | None = None
) -> dict: 
    searched_df = get_similar(search_input, 10)
    return {
        "searched": searched_df 
    }
'''