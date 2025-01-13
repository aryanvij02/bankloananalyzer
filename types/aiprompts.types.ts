export const financialDataExtractionPrompt = (pdfContent: string) => `
You are a professional at analyzing financial documents. You will be provided with a company's financial document and have to extract all data from this document. You absolutely cannot miss out anything. Below is a JSON interface you must absolutely follow and return nothing else. 

Here is the provided PDF: ${pdfContent}
export interface BankStatementExtraction {
  metadata: {
    accountInfo: {
      accountHolder: string,    // Name of account holder
      accountNumber: string,    // Account number
      bankName: string,        // Name of bank
      currency: {
        code: string,          // Standard currency code
        symbol: string         // Currency symbol
      },
      statementPeriod: {
        startDate: string,     
        endDate: string,       
        daysInPeriod: number   
      }
    }
  },
  financialData: {
    balances: {
      opening: number,         
      closing: number,         
      average: number,         
      lowest: number,          
      highest: number          
    },
    transactions: {
      inflows: [{
        date: string,          
        description: string,   
        amount: number,        
        category: string,      // e.g., "Salary", "Transfer", "Deposit"
        transactionType: string // e.g., "FPI", "TFR", "DD"
      }],
      outflows: [{
        date: string,          
        description: string,   
        amount: number,        
        category: string,      // e.g., "Utilities", "Shopping", "Insurance"
        transactionType: string // e.g., "DD", "DEB", "CPT"
      }]
    }
  }
}
`


export const financialAnalysisPrompt = (extractedData: string) => `
You are a financial analysis expert. You will be provided with a JSON object containing extracted data from a financial document. Your job is to perform precise financial analysis and calculations for this data with specific attention to:
1. Income Pattern Analysis:
- Calculate total monthly inflows with exact dates
- Identify income patterns (not just frequency but intervals between payments)
- Track trends in payment amounts (increasing/decreasing)
- Use exact dates for pattern recognition
2. Expense Pattern Analysis:
- Provide monthly breakdowns with exact totals
- Calculate precise averages
- Track spending patterns by category
- Identify exact dates of regular payments
3. Salary Analysis Requirements:
- Track intervals between salary payments
- Note variations in payment amounts
- Identify trends (increasing/decreasing)
- Classify frequency based on actual patterns, not assumptions
- Use terms like "semi-monthly" or "irregular" rather than "bi-weekly"
4. Enhanced Interface Definition:
export interface BankStatementAnalysis {
  cashFlow: {
    monthlyIncome: {
      formula: string,
      calculation: string,
      result: number,
      breakdown: { [month: string]: number },
      explanation: string
    },
    monthlyExpenses: {
      formula: string,
      calculation: string,
      result: number,
      breakdown: { [month: string]: number },
      explanation: string
    },
    netCashFlow: {
      formula: string,
      calculation: string,
      result: number,
      monthlyTrend: { [month: string]: number },
      explanation: string
    }
  },
  riskMetrics: {
    debtServiceCoverageRatio: {
      formula: string,
      calculation: string,
      result: number,
      explanation: string
    },
    cashFlowStrength: {
      formula: string,
      calculation: string,
      result: number,
      explanation: string
    },
    keyRisks: [{
      type: string,
      severity: "high" | "medium" | "low",
      explanation: string
    }]
  },
  accountBehavior: {
    overdrafts: number,
    bouncePayments: number,
    lowBalanceInstances: number,
    savingsRate: number,
    recurringPatterns: {
      salaryDeposits: {
        detected: boolean,
        frequency: string,
        pattern: string,
        trend: string,
        averageAmount: number,
        intervals: number[],
        reliability: number,
        sources: string[]
      },
      regularPayments: [{
        type: string,
        name: string,
        amount: number,
        frequency: string,
        reliability: number,
        dates: string[]
      }],
      existingLoans: {
        detected: boolean,
        lenders: string[],
        totalMonthlyPayments: number
      }
    }
  }
}
Requirements:
1. Every calculation must be exact - no rounding or approximations
2. All dates must be considered when analyzing patterns
3. Income patterns must be based on actual intervals, not assumptions
4. All transactions must be accounted for in calculations
5. Use precise terminology for payment frequencies
6. Include detailed breakdowns for each month
7. Track and report payment amount trends
You must absolutely account for every transaction and value in the data provided. You cannot miss out even a single value or transaction - and your results must be absolutely accurate - no assumptions can be made.

Here is the extracted data you will use: ${extractedData}
`


export const loanDecisionPrompt = (extractedData: string, financialAnalysis: string) => `
You are a loan decision expert. You will be provided with two JSON objects, one containing the data from a financial document and the other containing analysis of the data from that financial document. 
Your job is to make a loan decision based on the analysis provided.

Your response must be a JSON object that adheres to the following interface. You must absolutely follow this:
export interface BankStatementExtraction {
  metadata: {
    accountInfo: {
      accountHolder: string,    // Name of account holder
      accountNumber: string,    // Account number
      bankName: string,        // Name of bank
      currency: {
        code: string,          // Standard currency code
        symbol: string         // Currency symbol
      },
      statementPeriod: {
        startDate: string,     
        endDate: string,       
        daysInPeriod: number   
      }
    }
  },
  financialData: {
    balances: {
      opening: number,         
      closing: number,         
      average: number,         
      lowest: number,          
      highest: number          
    },
    transactions: {
      inflows: [{
        date: string,          
        description: string,   
        amount: number,        
        category: string,      // e.g., "Salary", "Transfer", "Deposit"
        transactionType: string // e.g., "FPI", "TFR", "DD"
      }],
      outflows: [{
        date: string,          
        description: string,   
        amount: number,        
        category: string,      // e.g., "Utilities", "Shopping", "Insurance"
        transactionType: string // e.g., "DD", "DEB", "CPT"
      }]
    }
  }
}

Here is the data: ${extractedData}
Here is the analysis: ${financialAnalysis}
`