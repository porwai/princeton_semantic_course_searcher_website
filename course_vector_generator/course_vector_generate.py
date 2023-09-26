from sentence_transformers import SentenceTransformer, util
import json

import pandas as pd
import numpy as np

import ast

df = pd.read_csv('../course_vector_generator/job_vector.csv')

df["status"] = "published"

for index, row in df.iterrows():
    row['vectors_n'] = ast.literal_eval(row['vectors'])

print(df['vectors_n'][0])