import os
from dotenv import load_dotenv
import requests
import pandas as pd

load_dotenv()

API_KEY = os.getenv("FINANCIAL_API_KEY")
BASE_URL = "https://financialmodelingprep.com/api/v3/"

#retrieve financial data online
def retrieveStatement(ticker, statement):
    endpoint = f"{statement}/{ticker}?apikey={API_KEY}"
    response = requests.get(BASE_URL + endpoint)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error {response.status_code}: {response.text}")
        return None

def processData(profile):
    data = pd.DataFrame(profile)
    excluded_columns = ['link', 'finalLink']
    
    for column in excluded_columns:
        if column in data.columns:
            data.drop(column, axis=1, inplace=True)
    
    return data

ticker = "AMZN"
incomeStatement = processData(retrieveStatement(ticker, "income-statement"))
balanceSheet = processData(retrieveStatement(ticker, "balance-sheet-statement"))
cashFlow = processData(retrieveStatement(ticker, "cash-flow-statement"))

os.makedirs(ticker, exist_ok=True)
incomeStatement.to_csv(f"{ticker}/income_statement.csv", index=False)
balanceSheet.to_csv(f"{ticker}/balance_sheet.csv", index=False)
cashFlow.to_csv(f"{ticker}/cash_flow.csv", index=False)
