import os
from dotenv import load_dotenv
import requests

load_dotenv()

API_KEY = os.getenv("FINANCIAL_API_KEY")
BASE_URL = "https://financialmodelingprep.com/api/v3/"

def get_company_profile(ticker):
    endpoint = f"income-statement/{ticker}?apikey={API_KEY}"
    response = requests.get(BASE_URL + endpoint)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error {response.status_code}: {response.text}")
        return None

ticker = "AAPL"
profile = get_company_profile(ticker)
print(profile)
