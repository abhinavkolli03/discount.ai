from flask import Flask, request, jsonify
import os
import boto3
import openai
import pandas as pd
import csv
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from io import StringIO
import tempfile

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/process_and_summarize*": {"origins": "http://localhost:3000"}})
OPENAI_API = os.getenv("OPENAI_API_KEY")

s3 = boto3.resource('s3')
BUCKET_NAME = "discount.ai-storage"

def segment_text(text, segment_length=2048):
    segments = []
    while text:
        segments.append(text[:segment_length])
        text = text[segment_length:]
    return segments

@app.route('/process_and_summarize', methods=['POST'])
def process_and_summarize():
    data = request.get_json()
    presigned_url = data.get('url')

    if not presigned_url:
        return jsonify({"error": "No presigned URL provided."}), 400

    response = requests.get(presigned_url)

    with open("temp_file.csv", "w", encoding="utf-8") as csv_file:
        csv_file.write(response.text)

    convert_csv_to_txt("temp_file.csv", "temp_file.txt")

    with open("temp_file.txt", "r", encoding="utf-8") as txt_file:
        txt_content = txt_file.read()

    openai.api_key = OPENAI_API

    segments = segment_text(txt_content)
    summaries = []

    for seg in segments:
        response = openai.Completion.create(
            engine="davinci",
            prompt=f"Summarize the following content:\n\n{seg}",
            max_tokens=150
        )
        summaries.append(response.choices[0].text.strip())

    final_summary = ' '.join(summaries)

    os.remove("temp_file.csv")
    os.remove("temp_file.txt")
    
    return jsonify({"message": "Processed successfully.", "summary": final_summary})

def convert_csv_to_txt(input_csv, output_txt):
    with open(output_txt, "w", encoding="utf-8") as my_output_file:
        with open(input_csv, "r", encoding="utf-8", errors='replace') as my_input_file:
            cleaned_lines = (line.replace('\x00', '') for line in my_input_file)
            csv_rows = csv.reader(cleaned_lines)
            for row in csv_rows:
                my_output_file.write(" ".join(row) + '\n')

@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        query = data.get('question', '')

        if query:
            response = chain({"question": query})
            result = response.get('result', '')

            if result:
                return jsonify({"answer": result})

        return jsonify({"error": "Invalid input or question not found."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5001)
