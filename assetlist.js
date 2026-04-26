const ASSET_DB = {
    "sectors": [
        {
            "id": 1,
            "name": "Energy",
            "swap_recommendations": [4,3],
            "color": "#6B6C6F"
        },
        {
            "id": 2,
            "name": "Materials",
            "swap_recommendations": [5,3,7],
            "color": "#616FAC"
        },
        {
            "id": 3,
            "name": "Industrials",
            "swap_recommendations": [10,2,1],
            "color": "#1E239F"
        },
        {
            "id": 4,
            "name": "Consumer Discretionary",
            "swap_recommendations": [1],
            "color": "#F9BF30"
        },
        {
            "id": 5,
            "name": "Consumer Staples",
            "swap_recommendations": [2,11],
            "color": "#E8801A"
        },
        {
            "id": 6,
            "name": "Health Care",
            "swap_recommendations": [11],
            "color": "#D93D58"
        },
        {
            "id": 7,
            "name": "Financials",
            "swap_recommendations": [2,8,9],
            "color": "#C1C1C1"
        },
        {
            "id": 8,
            "name": "Information Technology",
            "swap_recommendations": [7],
            "color": "#218954"
        },
        {
            "id": 9,
            "name": "Communication Services",
            "swap_recommendations": [7],
            "color": "#567CD3"
        },
        {
            "id": 10,
            "name": "Utilities",
            "swap_recommendations": [3],
            "color": "#31BCA9"
        },
        {
            "id": 11,
            "name": "Real Estate",
            "swap_recommendations": [6,5],
            "color": "#C4CBE6"
        },
        {
            "id": 12,
            "name": "Cash Positions",
            "swap_recommendations": [1,2,3,4,5,6,7,8,9,10,11],
            "color": "#2838CE"
        }
    ],
    "asset_kl": [
        {
            "id": 1,
            "name": "Contract",
            "taxable_inc": 1
        },
        {
            "id": 2,
            "name": "Stock",
            "taxable_inc": 1
        },
        {
            "id": 3,
            "name": "Mixed-ETF",
            "taxable_inc": 0.85
        },
        {
            "id": 4,
            "name": "Equity-ETF",
            "taxable_inc": 0.7
        },
        {
            "id": 5,
            "name": "ETF-NoEx",
            "taxable_inc": 1
        },
        {
            "id": 6,
            "name": "Liquidity EUR",
            "taxable_inc": 0
        }
    ],
    "assets": [
    {
        "name": "VanEck Morningstar Developed Markets Dividend Leaders UCITS ETF",
        "ISIN": "NL0011683594",
        "preis_eur": 52.31,
        "sector": 7,
        "asset_class": 4,
        "dividend_y_y_eur": 1.74,
        "perf_y_y_eur": 1.15
    },
    {
        "name": "iShares Developed Markets Property Yield UCITS ETF",
        "ISIN": "IE00B1FZS350",
        "preis_eur": 21.61,
        "sector": 11,
        "asset_class": 5,
        "dividend_y_y_eur": 0.65,
        "perf_y_y_eur": 1.12
    },
    {
        "name": "Realty Income (O)",
        "ISIN": "US7561091049",
        "preis_eur": 54.34,
        "sector": 11,
        "asset_class": 2,
        "dividend_y_y_eur": 2.76,
        "perf_y_y_eur": 1.08
    },
    {
        "name": "Cash Position EUR",
        "ISIN": "0",
        "preis_eur": 1,
        "sector": 12,
        "asset_class": 6,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": -1.027
    },
    {
        "name": "Prologis",
        "ISIN": "US74340W1036",
        "preis_eur": 116.92,
        "sector": 11,
        "asset_class": 2,
        "dividend_y_y_eur": 3.44,
        "perf_y_y_eur": 1
    },
    {
        "name": "LTC Properties",
        "ISIN": "US5021751020",
        "preis_eur": 34.1,
        "sector": 11,
        "asset_class": 2,
        "dividend_y_y_eur": 1.92,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares Asia Property Yield UCITS ETF",
        "ISIN": "IE00B1FZS244",
        "preis_eur": 19.74,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 0.69,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares UK Property UCITS ETF",
        "ISIN": "IE00B1TXLS18",
        "preis_eur": 4.64,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 0.21,
        "perf_y_y_eur": 1
    },
    {
        "name": "BNP Paribas Easy FTSE EPRA/NAREIT Eurozone Capped UCITS ETF QD",
        "ISIN": "LU0192223062",
        "preis_eur": 6.86,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 0.4,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares MSCI Target UK Real Estate UCITS ETF",
        "ISIN": "IE00BRHZ0398",
        "preis_eur": 4.11,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 0.3,
        "perf_y_y_eur": 1
    },
    {
        "name": "VanEck Global Real Estate UCITS ETF",
        "ISIN": "NL0009690239",
        "preis_eur": 39.55,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 1.34,
        "perf_y_y_eur": 1
    },
    {
        "name": "HSBC FTSE EPRA NAREIT Developed UCITS ETF USD",
        "ISIN": "IE00B5L01S80",
        "preis_eur": 20.2,
        "sector": 11,
        "asset_class": 4,
        "dividend_y_y_eur": 0.62,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares STOXX Europe 600 Personal & Household Goods UCITS ETF (DE)",
        "ISIN": "DE000A0H08N1",
        "preis_eur": 92.56,
        "sector": 5,
        "asset_class": 4,
        "dividend_y_y_eur": 2.35,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares STOXX Global Select Dividend 100 UCITS ETF (DE)",
        "ISIN": "DE000A0F5UH1",
        "preis_eur": 36.91,
        "sector": 7,
        "asset_class": 4,
        "dividend_y_y_eur": 1.42,
        "perf_y_y_eur": 1
    },
    {
        "name": "British American Tobacco plc",
        "ISIN": "GB0002875804",
        "preis_eur": 49.0,
        "sector": 5,
        "asset_class": 2,
        "dividend_y_y_eur": 2.8,
        "perf_y_y_eur": 1
    },
    {
        "name": "Intel Corp.",
        "ISIN": "US4581401001",
        "preis_eur": 70.76,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Microsoft",
        "ISIN": "US5949181045",
        "preis_eur": 360.0,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 3.12,
        "perf_y_y_eur": 1
    },
    {
        "name": "Alphabet Inc. Cl. C",
        "ISIN": "US02079K1079",
        "preis_eur": 267.52,
        "sector": 9,
        "asset_class": 2,
        "dividend_y_y_eur": 0.72,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi MSCI Semiconductors UCITS ETF Acc",
        "ISIN": "LU1900066033",
        "preis_eur": 83.3,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "VanEck Semiconductor UCITS ETF",
        "ISIN": "IE00BMC38736",
        "preis_eur": 65.89,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI Europe Information Technology Screened UCITS ETF 1C",
        "ISIN": "LU0292104469",
        "preis_eur": 84.8,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi US Tech 100 Equal Weight UCITS ETF DR USD D",
        "ISIN": "IE000Y9MG996",
        "preis_eur": 13.45,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 0.11,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Information Technology UCITS ETF 1D",
        "ISIN": "IE00BGQYRS42",
        "preis_eur": 115.1,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 0.38,
        "perf_y_y_eur": 1
    },
    {
        "name": "Coca-Cola Co.",
        "ISIN": "US1912161007",
        "preis_eur": 65.9,
        "sector": 5,
        "asset_class": 2,
        "dividend_y_y_eur": 1.8,
        "perf_y_y_eur": 1
    },
    {
        "name": "Unilever PLC",
        "ISIN": "GB00BVZK7T90",
        "preis_eur": 48.99,
        "sector": 5,
        "asset_class": 2,
        "dividend_y_y_eur": 1.6,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares MSCI Europe Consumer Staples Sector UCITS ETF EUR (Acc)",
        "ISIN": "IE00BMW42074",
        "preis_eur": 5.75,
        "sector": 5,
        "asset_class": 4,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Consumer Staples UCITS ETF 1D",
        "ISIN": "IE00BGQYRQ28",
        "preis_eur": 43.05,
        "sector": 5,
        "asset_class": 4,
        "dividend_y_y_eur": 0.82,
        "perf_y_y_eur": 1
    },
    {
        "name": "Cash Position (LU30253445516)",
        "ISIN": "LU30253445516",
        "preis_eur": 10.23,
        "sector": 12,
        "asset_class": 3,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Cash Position (FR0010510800)",
        "ISIN": "FR0010510800",
        "preis_eur": 113.48,
        "sector": 12,
        "asset_class": 3,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Cash Position (LU1190417599)",
        "ISIN": "LU1190417599",
        "preis_eur": 108.9,
        "sector": 12,
        "asset_class": 3,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Cash Position (LU0290358497)",
        "ISIN": "LU0290358497",
        "preis_eur": 148.94,
        "sector": 12,
        "asset_class": 3,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Marvell Technology Group",
        "ISIN": "US5738741041",
        "preis_eur": 109.75,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Broadcom",
        "ISIN": "US11135F1012",
        "preis_eur": 316.0,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 2.24,
        "perf_y_y_eur": 1
    },
    {
        "name": "Micron Technology",
        "ISIN": "US5951121038",
        "preis_eur": 357.0,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0.52,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi MSCI World Swap II UCITS ETF Dist",
        "ISIN": "FR0010315770",
        "preis_eur": 393.48,
        "sector": 8,
        "asset_class": 4,
        "dividend_y_y_eur": 4.47,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amazon.com Inc.",
        "ISIN": "US0231351067",
        "preis_eur": 201.4,
        "sector": 4,
        "asset_class": 2,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Apple Inc.",
        "ISIN": "US0378331005",
        "preis_eur": 221.22,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0.22,
        "perf_y_y_eur": 1
    },
    {
        "name": "Palo Alto Networks",
        "ISIN": "US6974351057",
        "preis_eur": 132.3,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Qualcomm Inc.",
        "ISIN": "US7475251036",
        "preis_eur": 126.0,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 0.76,
        "perf_y_y_eur": 1
    },
    {
        "name": "SAP SE",
        "ISIN": "DE0007164600",
        "preis_eur": 137.22,
        "sector": 8,
        "asset_class": 2,
        "dividend_y_y_eur": 2.5,
        "perf_y_y_eur": 1
    },
    {
        "name": "Tesla Inc.",
        "ISIN": "US88160R1014",
        "preis_eur": 296.8,
        "sector": 4,
        "asset_class": 2,
        "dividend_y_y_eur": 0,
        "perf_y_y_eur": 1
    },
    {
        "name": "Var Energi",
        "ISIN": "NO0011202772",
        "preis_eur": 4.15,
        "sector": 1,
        "asset_class": 2,
        "dividend_y_y_eur": 0.44,
        "perf_y_y_eur": 1
    },
    {
        "name": "Aker BP",
        "ISIN": "NO0010345853",
        "preis_eur": 31.15,
        "sector": 1,
        "asset_class": 2,
        "dividend_y_y_eur": 2.28,
        "perf_y_y_eur": 1
    },
    {
        "name": "Meta Platforms A",
        "ISIN": "US30303M1027",
        "preis_eur": 535.4,
        "sector": 9,
        "asset_class": 2,
        "dividend_y_y_eur": 0.45,
        "perf_y_y_eur": 1
    },
    {
        "name": "Johnson & Johnson",
        "ISIN": "US4781601046",
        "preis_eur": 202.47,
        "sector": 6,
        "asset_class": 2,
        "dividend_y_y_eur": 4.44,
        "perf_y_y_eur": 1
    },
    {
        "name": "Equinor ASA",
        "ISIN": "NO0010096985",
        "preis_eur": 34.9,
        "sector": 1,
        "asset_class": 2,
        "dividend_y_y_eur": 1.28,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S&P Global Materials ESG UCITS ETF DR EUR (D)",
        "ISIN": "IE000WP7CVZ7",
        "preis_eur": 14.24,
        "sector": 2,
        "asset_class": 4,
        "dividend_y_y_eur": 0.21,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares MSCI World Materials Sector Advanced UCITS ETF USD (Dist)",
        "ISIN": "IE00BJ5JP766",
        "preis_eur": 4.93,
        "sector": 2,
        "asset_class": 4,
        "dividend_y_y_eur": 0.07,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi STOXX Europe 600 Basic Resources UCITS ETF Dist",
        "ISIN": "LU2082996385",
        "preis_eur": 160.61,
        "sector": 2,
        "asset_class": 4,
        "dividend_y_y_eur": 3.09,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Industrials UCITS ETF 1D",
        "ISIN": "IE00BCHWNV48",
        "preis_eur": 95.0,
        "sector": 3,
        "asset_class": 4,
        "dividend_y_y_eur": 0.88,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S&P Global Industrials ESG UCITS ETF EUR (D)",
        "ISIN": "IE00026BEVM6",
        "preis_eur": 16.49,
        "sector": 3,
        "asset_class": 4,
        "dividend_y_y_eur": 0.19,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares MSCI World Industrials Sector Advanced UCITS ETF USD (Dist)",
        "ISIN": "IE00BJ5JP659",
        "preis_eur": 6.85,
        "sector": 3,
        "asset_class": 4,
        "dividend_y_y_eur": 0.08,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi STOXX Europe 600 Industrials UCITS ETF Dist",
        "ISIN": "LU2082997789",
        "preis_eur": 197.0,
        "sector": 3,
        "asset_class": 4,
        "dividend_y_y_eur": 3.09,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S.A.",
        "ISIN": "FR0004125920",
        "preis_eur": 74.6,
        "sector": 7,
        "asset_class": 2,
        "dividend_y_y_eur": 4.25,
        "perf_y_y_eur": 1
    },
    {
        "name": "Danske Bank",
        "ISIN": "DK0010274414",
        "preis_eur": 42.22,
        "sector": 7,
        "asset_class": 2,
        "dividend_y_y_eur": 0.77,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Health Care UCITS ETF 1D",
        "ISIN": "IE00BCHWNW54",
        "preis_eur": 50.79,
        "sector": 6,
        "asset_class": 4,
        "dividend_y_y_eur": 0.68,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S&P Global Health Care ESG UCITS ETF DR EUR (D)",
        "ISIN": "IE000JKS50V3",
        "preis_eur": 10.33,
        "sector": 6,
        "asset_class": 4,
        "dividend_y_y_eur": 0.16,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares MSCI World Health Care Sector Advanced UCITS ETF USD (Dist)",
        "ISIN": "IE00BJ5JNZ06",
        "preis_eur": 6.4,
        "sector": 6,
        "asset_class": 4,
        "dividend_y_y_eur": 0.07,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi STOXX Europe 600 Healthcare UCITS ETF Dist",
        "ISIN": "LU2082997516",
        "preis_eur": 193.0,
        "sector": 6,
        "asset_class": 4,
        "dividend_y_y_eur": 2.5,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S&P Global Utilities ESG UCITS ETF DR EUR (D)",
        "ISIN": "IE00052T92P8",
        "preis_eur": 12.65,
        "sector": 10,
        "asset_class": 4,
        "dividend_y_y_eur": 0.31,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi STOXX Europe 600 Utilities UCITS ETF Dist",
        "ISIN": "LU2082999215",
        "preis_eur": 159.32,
        "sector": 10,
        "asset_class": 4,
        "dividend_y_y_eur": 5.18,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares STOXX Europe 600 Utilities UCITS ETF (DE)",
        "ISIN": "DE000A0Q4R02",
        "preis_eur": 59.31,
        "sector": 10,
        "asset_class": 4,
        "dividend_y_y_eur": 1.5,
        "perf_y_y_eur": 1
    },
    {
        "name": "Deka Future Energy ESG UCITS ETF",
        "ISIN": "DE000ETFL607",
        "preis_eur": 94.0,
        "sector": 1,
        "asset_class": 4,
        "dividend_y_y_eur": 0.4,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi MSCI New Energy UCITS ETF Dist",
        "ISIN": "FR0010524777",
        "preis_eur": 41.6,
        "sector": 1,
        "asset_class": 4,
        "dividend_y_y_eur": 0.14,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Banks UCITS ETF 1D",
        "ISIN": "IE00BDVPTJ63",
        "preis_eur": 30.53,
        "sector": 7,
        "asset_class": 4,
        "dividend_y_y_eur": 0.55,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Financials UCITS ETF 1D",
        "ISIN": "IE00BCHWNT26",
        "preis_eur": 31.84,
        "sector": 7,
        "asset_class": 4,
        "dividend_y_y_eur": 0.38,
        "perf_y_y_eur": 1
    },
    {
        "name": "Xtrackers MSCI USA Energy UCITS ETF 1D",
        "ISIN": "IE00BCHWNS19",
        "preis_eur": 50.23,
        "sector": 1,
        "asset_class": 4,
        "dividend_y_y_eur": 1.08,
        "perf_y_y_eur": 1
    },
    {
        "name": "HANetf Alerian Midstream Energy Dividend UCITS ETF Dist",
        "ISIN": "IE00BKPTXQ89",
        "preis_eur": 16.8,
        "sector": 1,
        "asset_class": 4,
        "dividend_y_y_eur": 2.16,
        "perf_y_y_eur": 1
    },
    {
        "name": "Amundi S&P Global Consumer Staples ESG UCITS ETF EUR (D)",
        "ISIN": "IE0005NYD352",
        "preis_eur": 9.7,
        "sector": 5,
        "asset_class": 4,
        "dividend_y_y_eur": 0.21,
        "perf_y_y_eur": 1
    },
    {
        "name": "iShares STOXX Europe 600 Oil & Gas UCITS ETF (DE)",
        "ISIN": "DE000A0H08M3",
        "preis_eur": 54.71,
        "sector": 1,
        "asset_class": 4,
        "dividend_y_y_eur": 1.2,
        "perf_y_y_eur": 1
    }
]
}