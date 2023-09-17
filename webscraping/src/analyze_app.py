from flask import Flask, request, jsonify
from langchain.document_loaders import CSVLoader, UnstructuredExcelLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os
import requests
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError

load_dotenv()

app = Flask(__name__)

# Set OPENAI_API_KEY environment variable
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")


def fetch_file_from_s3(bucket_name, file_name):
    # Initialize a session using Amazon S3
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name='us-east-1'
    )

    try:
        # Generate the S3 object
        s3_object = s3.get_object(Bucket=bucket_name, Key=file_name)
        body = s3_object['Body']

        # Read the entire content into memory (be cautious with large files)
        file_content = body.read()

        return file_content, s3_object.get('ContentType', 'application/octet-stream')
    except Exception as e:
        return None, str(e)


def initialize_chain(link):
    # Assuming the link is of the form "s3://bucket-name/file-name"
    parsed_link = link[5:].split("/", 1)
    if len(parsed_link) != 2:
        return "Invalid S3 link"

    bucket_name, file_name = parsed_link
    file_content, content_type = fetch_file_from_s3(bucket_name, file_name)

    if file_content is None:
        return f"Failed to fetch the file from S3: {content_type}"

    # Assuming file_content now contains the CSV content you want to load
    # You can save this to a temporary file or handle it according to your needs

    # Your existing logic here, modified to use the fetched file_content
    # Update this line to use file_content
    loader = CSVLoader(file_path=file_content)
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
