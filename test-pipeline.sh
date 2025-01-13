#!/bin/bash

# Step 1: Extract PDF text
echo "Step 1: Extracting PDF text..."
PDF_RESPONSE=$(curl -X POST \
  -F "pdf=@/Users/aryanvij/Downloads/Untitled.pdf" \
  http://localhost:3000/api/pdfExtractor)

# Extract and display the text content from the response
echo -e "\nPDF Extraction Response:"
echo $PDF_RESPONSE | jq '.'

PDF_CONTENT=$(echo $PDF_RESPONSE | jq -r '.text')

echo -e "\nStep 2: Running analysis pipeline..."
# Step 2: Run the analysis pipeline with better error visibility
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -v \
  -d "{\"pdfContent\": \"$PDF_CONTENT\"}" \
  http://localhost:3000/api/dataAnalysisPipeline 2>&1 | tee /tmp/pipeline_response.txt

echo -e "\nFull Response:"
cat /tmp/pipeline_response.txt | jq '.' 2>/dev/null || cat /tmp/pipeline_response.txt 