import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { 
  financialDataExtractionPrompt, 
  financialAnalysisPrompt, 
  loanDecisionPrompt 
} from '@/types/aiprompts.types';
import { 
  BankStatementExtractionSchema,
  BankStatementAnalysisSchema,
  LoanDecisionSchema
} from '@/types/bank-analysis.types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    // Get the raw request text first
    const rawText = await request.text();
    
    // Parse it safely
    const { pdfContent } = JSON.parse(
      rawText.replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    );

    if (!pdfContent) {
      return NextResponse.json(
        { error: 'PDF content is missing' },
        { status: 400 }
      );
    }

    console.log("Received PDF content length:", pdfContent.length);

    // Clean the text for OpenAI processing
    const cleanedContent = pdfContent
      .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim();                   // Remove leading/trailing spaces

    // Step 1: Extract financial data
    console.log("Starting extraction...");
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: financialDataExtractionPrompt(cleanedContent) }],
      response_format: { 
        type: "json_schema",
        json_schema: {
          name: "bank_statement_extraction",
          strict: true,
          schema: BankStatementExtractionSchema
        }
      }
    });

    const extractedData = extractionResponse.choices[0].message.content;
    
    if (!extractedData) {
      throw new Error('Failed to extract data from bank statement');
    }

    // Step 2: Analyze the extracted data
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: financialAnalysisPrompt(extractedData as string) }],
      response_format: { 
        type: "json_schema",
        json_schema: {
          name: "bank_statement_analysis",
          strict: true,
          schema: BankStatementAnalysisSchema
        }
      }
    });

    const financialAnalysis = analysisResponse.choices[0].message.content;

    if (!financialAnalysis) {
        throw new Error('Failed to analyze the extracted data');
      }

    // Step 3: Make loan decision
    const decisionResponse = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: loanDecisionPrompt(extractedData, financialAnalysis) }],
      response_format: { 
        type: "json_schema",
        json_schema: {
          name: "loan_decision",
          strict: true,
          schema: LoanDecisionSchema
        }
      }
    });

    const loanDecision = decisionResponse.choices[0].message.content;

    if (!loanDecision) {
        throw new Error('Failed to make a loan decision');
      }

    return NextResponse.json({ extractedData, financialAnalysis, loanDecision });

  } catch (error) {
    console.error('Full error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process financial analysis pipeline',
        details: error.message,
        type: error.type,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
