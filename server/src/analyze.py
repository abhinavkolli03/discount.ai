from langchain.document_loaders import CSVLoader, UnstructuredExcelLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

file = "AAPL/income_statement.csv"

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
loader = CSVLoader(file_path='file')
index_creator = VectorstoreIndexCreator()
docsearch = index_creator.from_loaders([loader])
chain = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=docsearch.vectorstore.as_retriever(), input_key="question")


query = "What is the terminal value of the company?"
def ask_question(query):
    response = chain({"question": query})
    return response['result']
print(ask_question(query))