from flask import Flask, request, jsonify
import os
import boto3
import openai
import pandas as pd
import csv
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/process_and_summarize*": {"origins": "http://localhost:3000"}})
OPENAI_API = os.getenv("OPENAI_API_KEY")

# Create the necessary objects
file = "AAPL/income_statement.csv"
loader = CSVLoader(file_path=file)
index_creator = VectorstoreIndexCreator()
docsearch = index_creator.from_loaders([loader])
chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=docsearch.vectorstore.as_retriever(),
    input_key="question"
)

    return chain


chain_instance = None


@app.route('/ask<link>', methods=['POST'])
def ask_question(link):
    global chain_instance

    try:
        if chain_instance is None:
            chain_instance = initialize_chain(link)

        data = request.get_json()
        query = data.get('question', '')

        if query:
            response = chain_instance({"question": query})
            result = response.get('result', '')

            if result:
                return jsonify({"answer": result})

        return jsonify({"error": "Invalid input or question not found."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)