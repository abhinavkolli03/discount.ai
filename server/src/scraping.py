import os
# from dotenv import load_dotenv
import requests
import pandas as pd

from dotenv import load_dotenv

# retrieve financial data online

API_URL = os.getenv("FMP_API_URL")
BASE_URL = os.getenv("FMP_BASE_URL")


def retrieveStatement(ticker, statement):
    endpoint = f"{statement}/{ticker}?apikey={API_URL}"
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


ticker = "AMC"
incomeStatement = processData(retrieveStatement(ticker, "income-statement"))
balanceSheet = processData(retrieveStatement(
    ticker, "balance-sheet-statement"))
cashFlow = processData(retrieveStatement(ticker, "cash-flow-statement"))
