import { NextRequest, NextResponse } from 'next/server';
import '@ungap/with-resolvers';
import * as pdfjs from 'pdfjs-dist/build/pdf.min.mjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Initialize PDF.js (only need to import worker)
    await import('pdfjs-dist/build/pdf.worker.min.mjs');

    const arrayBuffer = await pdfFile.arrayBuffer();

    // Load the PDF document with simplified options
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;

    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return NextResponse.json({ 
      text: fullText,
      pageCount: pdf.numPages 
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: `Failed to process PDF: ${error.message}` },
      { status: 500 }
    );
  }
}
