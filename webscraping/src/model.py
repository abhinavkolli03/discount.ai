from scraping import processData, retrieveStatement
import pandas as pd
import requests

ticker = "META"
projection_time_frame = 5
risk_free_rate = 0.05
market_rate = 0.10
long_term_growth_rate = 0.02



incomeStatement = pd.read_csv(ticker + '/income_statement.csv').iloc[::-1]

#variables
revenue_growth = incomeStatement["revenue"].pct_change().mean()
gross_margin = (incomeStatement["grossProfit"]/incomeStatement["revenue"]).mean()
sga_percent = (incomeStatement["sellingGeneralAndAdministrativeExpenses"]/incomeStatement["revenue"]).mean()
debtamortize = incomeStatement["depreciationAndAmortization"].mean()
tax_rate = incomeStatement["incomeTaxExpense"].iloc[-1]/incomeStatement["incomeBeforeTax"].iloc[-1]

#get rev projections
revenue = [0 for i in range(projection_time_frame+1)]
revenue[0] = incomeStatement['revenue'].iloc[-1]
for i in range(1, len(revenue)):
    revenue[i] = revenue[i-1] * (1+revenue_growth)

#get gross profit projections
gross_profit = [r*gross_margin for r in revenue]

#get ebit
sga = [r*sga_percent for r in revenue]
da = [debtamortize for i in range(projection_time_frame+1)]
ebit = [gross_profit[i] - sga[i] - da[i] for i in range(len(gross_profit))]



#get unlevered fcf
balanceSheet = pd.read_csv(ticker+'/balance_sheet.csv').iloc[::-1]

asset_growth = balanceSheet["totalCurrentAssets"].pct_change().mean()
liability_growth = balanceSheet["totalCurrentLiabilities"].pct_change().mean()
ppe_growth = balanceSheet['propertyPlantEquipmentNet'].pct_change().mean()

assets = [0 for i in range(projection_time_frame+1)]
assets[0] = balanceSheet['totalCurrentAssets'].iloc[-1]
for i in range(1, len(assets)):
    assets[i] = assets[i-1] * (1+asset_growth)

liabilities = [0 for i in range(projection_time_frame+1)]
liabilities[0] = balanceSheet['totalCurrentLiabilities'].iloc[-1]
for i in range(1, len(liabilities)):
    liabilities[i] = liabilities[i-1] * (1+liability_growth)

nwc = [assets[i]-liabilities[i] for i in range(len(assets))]
delta_nwc = [nwc[i]-nwc[i-1] for i in range(1, len(nwc))]


ppe = [0 for i in range(projection_time_frame+1)]
ppe[0] = balanceSheet['propertyPlantEquipmentNet'].iloc[-1]
for i in range(1, len(ppe)):
    ppe[i] = liabilities[i-1] * (1+ppe_growth)
delta_ppe = [nwc[i]-nwc[i-1] for i in range(1, len(ppe))]
da = da[1:]
capex = [delta_ppe[i]+da[i] for i in range(len(da))]
nopat = [e*(1-tax_rate) for e in ebit[1:]]

unleveredfcf = [nopat[i] + da[i] - capex[i] - delta_nwc[i] for i in range(len(nopat))]
print("Unlevered FCF:", unleveredfcf)



#get beta
betaEndpoint = f"https://api.newtonanalytics.com/stock-beta/?ticker={ticker.lower()}&index=^GSPC&interval=1mo​&observations=10"
response = requests.get(betaEndpoint)
if response.status_code == 200:
    betaJson = response.json()
    beta = betaJson["data"]
    print("Beta:", beta)
else:
    print(f"Error {response.status_code}: {response.text}")


#calculate WACC
last_totaldebt_value = balanceSheet['totalDebt'].iloc[-1]
last_totalequity_value = balanceSheet['totalEquity'].iloc[-1]
weightDebt = last_totaldebt_value / (last_totaldebt_value + last_totalequity_value)
weightEquity = last_totalequity_value / (last_totaldebt_value + last_totalequity_value)

interestExpense = incomeStatement['interestExpense'].iloc[-1]
average_total_debt = balanceSheet['totalDebt'].mean()
interest_rate = interestExpense / average_total_debt
costEquity = risk_free_rate + beta * market_rate

wacc = weightDebt * interest_rate * (1 - tax_rate) + weightEquity * costEquity
print("WACC:", wacc)


#get discounted cash flow and equity value
discountedfcf = [unleveredfcf[i]/(1+wacc)**(i+1) for i in range(len(unleveredfcf))]

projection_period_value = sum(discountedfcf)
terminalfcf = discountedfcf[-1]*(1+wacc)
terminalvalue = terminalfcf/(wacc-long_term_growth_rate)
companyvalue = terminalvalue+projection_period_value
equityvalue = companyvalue-last_totaldebt_value+balanceSheet["cashAndCashEquivalents"].iloc[-1]
print("Equity Value: $" + str(round(equityvalue/1000000000, 5)) + " Billion")

request = requests.get("https://api.sec-api.io/float?ticker=" + ticker + "&token=eaf3a67d704e68ed5571cde8440bfdf4e9289c504ab3093788e8f80592d97648")
sharesoutstanding = request.json()["data"][0]["float"]["outstandingShares"][0]['value']
print("Implied Share Price: $" + str(round(equityvalue/sharesoutstanding, 2)))