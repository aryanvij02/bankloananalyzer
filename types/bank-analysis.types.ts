// 1. Data Extraction & Categorization Interface
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

// 2. Financial Analysis Interface
export interface BankStatementAnalysis {
  cashFlow: {
    monthlyIncome: {
      formula: string,
      calculation: string,
      result: number,
      explanation: string
    },
    monthlyExpenses: {
      formula: string,
      calculation: string,
      result: number,
      explanation: string
    },
    netCashFlow: {
      formula: string,
      calculation: string,
      result: number,
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
        averageAmount: number,
        reliability: number,
        sources: string[]
      },
      regularPayments: [{
        type: string,
        name: string,
        amount: number,
        frequency: string,
        reliability: number
      }],
      existingLoans: {
        detected: boolean,
        lenders: string[],
        totalMonthlyPayments: number
      }
    }
  }
}

// 3. Loan Decision Interface
export interface LoanDecision {
  decision: "Approve" | "Deny" | "Review Required",
  maxRecommendedLoan: {
    amount: number,
    formula: string,
    calculation: string,
    explanation: string
  },
  decisionFactors: [{
    factor: string,
    impact: "positive" | "negative",
    weight: number,
    explanation: string
  }],
  conditions: string[],
  decisionSummary: {
    summary: string,
    keyStrengths: string[],
    keyWeaknesses: string[],
    mitigatingFactors: string[],
    recommendedNextSteps: string[]
  }
}

// 1. Bank Statement Extraction Schema
export const BankStatementExtractionSchema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        accountInfo: {
          type: "object",
          properties: {
            accountHolder: { type: "string" },
            accountNumber: { type: "string" },
            bankName: { type: "string" },
            currency: {
              type: "object",
              properties: {
                code: { type: "string" },
                symbol: { type: "string" }
              },
              required: ["code", "symbol"],
              additionalProperties: false
            },
            statementPeriod: {
              type: "object",
              properties: {
                startDate: { type: "string" },
                endDate: { type: "string" },
                daysInPeriod: { type: "number" }
              },
              required: ["startDate", "endDate", "daysInPeriod"],
              additionalProperties: false
            }
          },
          required: ["accountHolder", "accountNumber", "bankName", "currency", "statementPeriod"],
          additionalProperties: false
        }
      },
      required: ["accountInfo"],
      additionalProperties: false
    },
    financialData: {
      type: "object",
      properties: {
        balances: {
          type: "object",
          properties: {
            opening: { type: "number" },
            closing: { type: "number" },
            average: { type: "number" },
            lowest: { type: "number" },
            highest: { type: "number" }
          },
          required: ["opening", "closing", "average", "lowest", "highest"],
          additionalProperties: false
        },
        transactions: {
          type: "object",
          properties: {
            inflows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  description: { type: "string" },
                  amount: { type: "number" },
                  category: { type: "string" },
                  transactionType: { type: "string" }
                },
                required: ["date", "description", "amount", "category", "transactionType"],
                additionalProperties: false
              }
            },
            outflows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string" },
                  description: { type: "string" },
                  amount: { type: "number" },
                  category: { type: "string" },
                  transactionType: { type: "string" }
                },
                required: ["date", "description", "amount", "category", "transactionType"],
                additionalProperties: false
              }
            }
          },
          required: ["inflows", "outflows"],
          additionalProperties: false
        }
      },
      required: ["balances", "transactions"],
      additionalProperties: false
    }
  },
  required: ["metadata", "financialData"],
  additionalProperties: false
} as const;

// 2. Bank Statement Analysis Schema
export const BankStatementAnalysisSchema = {
  type: "object",
  properties: {
    cashFlow: {
      type: "object",
      properties: {
        monthlyIncome: {
          type: "object",
          properties: {
            formula: { type: "string" },
            calculation: { type: "string" },
            result: { type: "number" },
            breakdown: {
              type: "object",
              additionalProperties: { type: "number" }
            },
            explanation: { type: "string" }
          },
          required: ["formula", "calculation", "result", "breakdown", "explanation"],
          additionalProperties: false
        },
        monthlyExpenses: {
          type: "object",
          properties: {
            formula: { type: "string" },
            calculation: { type: "string" },
            result: { type: "number" },
            breakdown: {
              type: "object",
              additionalProperties: { type: "number" }
            },
            explanation: { type: "string" }
          },
          required: ["formula", "calculation", "result", "breakdown", "explanation"],
          additionalProperties: false
        },
        netCashFlow: {
          type: "object",
          properties: {
            formula: { type: "string" },
            calculation: { type: "string" },
            result: { type: "number" },
            monthlyTrend: {
              type: "object",
              additionalProperties: { type: "number" }
            },
            explanation: { type: "string" }
          },
          required: ["formula", "calculation", "result", "monthlyTrend", "explanation"],
          additionalProperties: false
        }
      },
      required: ["monthlyIncome", "monthlyExpenses", "netCashFlow"],
      additionalProperties: false
    },
    riskMetrics: {
      type: "object",
      properties: {
        debtServiceCoverageRatio: {
          type: "object",
          properties: {
            formula: { type: "string" },
            calculation: { type: "string" },
            result: { type: "number" },
            explanation: { type: "string" }
          },
          required: ["formula", "calculation", "result", "explanation"],
          additionalProperties: false
        },
        cashFlowStrength: {
          type: "object",
          properties: {
            formula: { type: "string" },
            calculation: { type: "string" },
            result: { type: "number" },
            explanation: { type: "string" }
          },
          required: ["formula", "calculation", "result", "explanation"],
          additionalProperties: false
        },
        keyRisks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              severity: { type: "string", enum: ["high", "medium", "low"] },
              explanation: { type: "string" }
            },
            required: ["type", "severity", "explanation"],
            additionalProperties: false
          }
        }
      },
      required: ["debtServiceCoverageRatio", "cashFlowStrength", "keyRisks"],
      additionalProperties: false
    },
    accountBehavior: {
      type: "object",
      properties: {
        overdrafts: { type: "number" },
        bouncePayments: { type: "number" },
        lowBalanceInstances: { type: "number" },
        savingsRate: { type: "number" },
        recurringPatterns: {
          type: "object",
          properties: {
            salaryDeposits: {
              type: "object",
              properties: {
                detected: { type: "boolean" },
                frequency: { type: "string" },
                pattern: { type: "string" },
                trend: { type: "string" },
                averageAmount: { type: "number" },
                intervals: { type: "array", items: { type: "number" } },
                reliability: { type: "number" },
                sources: { type: "array", items: { type: "string" } }
              },
              required: ["detected", "frequency", "pattern", "trend", "averageAmount", "intervals", "reliability", "sources"],
              additionalProperties: false
            },
            regularPayments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  name: { type: "string" },
                  amount: { type: "number" },
                  frequency: { type: "string" },
                  reliability: { type: "number" },
                  dates: { type: "array", items: { type: "string" } }
                },
                required: ["type", "name", "amount", "frequency", "reliability", "dates"],
                additionalProperties: false
              }
            },
            existingLoans: {
              type: "object",
              properties: {
                detected: { type: "boolean" },
                lenders: { type: "array", items: { type: "string" } },
                totalMonthlyPayments: { type: "number" }
              },
              required: ["detected", "lenders", "totalMonthlyPayments"],
              additionalProperties: false
            }
          },
          required: ["salaryDeposits", "regularPayments", "existingLoans"],
          additionalProperties: false
        }
      },
      required: ["overdrafts", "bouncePayments", "lowBalanceInstances", "savingsRate", "recurringPatterns"],
      additionalProperties: false
    }
  },
  required: ["cashFlow", "riskMetrics", "accountBehavior"],
  additionalProperties: false
} as const;

// 3. Loan Decision Schema
export const LoanDecisionSchema = {
  type: "object",
  properties: {
    decision: { 
      type: "string",
      enum: ["Approve", "Deny", "Review Required"]
    },
    maxRecommendedLoan: {
      type: "object",
      properties: {
        amount: { type: "number" },
        formula: { type: "string" },
        calculation: { type: "string" },
        explanation: { type: "string" }
      },
      required: ["amount", "formula", "calculation", "explanation"],
      additionalProperties: false
    },
    decisionFactors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          factor: { type: "string" },
          impact: { type: "string", enum: ["positive", "negative"] },
          weight: { type: "number" },
          explanation: { type: "string" }
        },
        required: ["factor", "impact", "weight", "explanation"],
        additionalProperties: false
      }
    },
    conditions: {
      type: "array",
      items: { type: "string" }
    },
    decisionSummary: {
      type: "object",
      properties: {
        summary: { type: "string" },
        keyStrengths: { type: "array", items: { type: "string" } },
        keyWeaknesses: { type: "array", items: { type: "string" } },
        mitigatingFactors: { type: "array", items: { type: "string" } },
        recommendedNextSteps: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "keyStrengths", "keyWeaknesses", "mitigatingFactors", "recommendedNextSteps"],
      additionalProperties: false
    }
  },
  required: ["decision", "maxRecommendedLoan", "decisionFactors", "conditions", "decisionSummary"],
  additionalProperties: false
} as const;