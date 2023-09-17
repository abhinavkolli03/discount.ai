from flask import Flask, request, jsonify
from langchain.document_loaders import CSVLoader, UnstructuredExcelLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set OPENAI_API_KEY environment variable
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

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
    app.run(debug=True)