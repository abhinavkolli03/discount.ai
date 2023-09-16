import pandas as pd
import requests

# temporary constants that can be replaced with user input or external data
# sources -- 10k filings, corporate filings (all a separate function)
# values may not be accurate
rfr = 5.0 / 100
corpTax = 21.0 / 100
inflation = 2.0 / 100
marketRiskP = 5.0 / 100

ticker = "aapl"
betaEndpoint = f"https://api.newtonanalytics.com/stock-beta/?ticker={ticker}&index=^GSPC&interval=1mo​&observations=10"
print(betaEndpoint)
response = requests.get(betaEndpoint)
if response.status_code == 200:
    betaJson = response.json()
    beta = betaJson["data"]
    print(beta)
else:
    print(f"Error {response.status_code}: {response.text}")


# Read the CSV files
cash_flow_df = pd.read_csv('AAPL/cash_flow.csv')
income_df = pd.read_csv('AAPL/income_statement.csv')
balance_sheet_df = pd.read_csv('AAPL/balance_sheet.csv')

last_totaldebt_value = balance_sheet_df['totalDebt'].iloc[-1]
# last_totalasset_value = balance_sheet_df['totalCurrentAssets'].iloc[-1]
last_totalequity_value = balance_sheet_df['totalEquity'].iloc[-1]

sum_weight = last_totaldebt_value + last_totalequity_value

weightDebt = last_totaldebt_value / sum_weight
weightEquity = last_totalequity_value / sum_weight

interestExpense = cash_flow_df['interestExpense'].iloc[-1]
average_total_debt = balance_sheet_df['totalDebt'].mean()

interest_rate = interestExpense / average_total_debt * 100

costDebt = interest_rate * (1 - corpTax)
costEquity = rfr + beta * marketRiskP

wacc = weightDebt * costDebt * (1 - corpTax) + weightEquity * costEquity

# need to get the total debt, total assets, and total equity values from last
# year

# Save historical revenue data to CSV
income_df[['calendarYear', 'revenue']].to_csv(
    'historical_revenue.csv', index=False)

# Save historical cost data to CSV
income_df[['calendarYear', 'costOfRevenue']].to_csv(
    'historical_cost.csv', index=False)
