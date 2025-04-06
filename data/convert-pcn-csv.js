import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input and output file paths
const inputFile = path.join(__dirname, 'Website Pricing _ Q2 25 - PCN data.csv');
const outputFile = path.join(__dirname, 'pcns.json');

// Read the CSV file
const csvData = fs.readFileSync(inputFile, 'utf8');
const lines = csvData.split('\n').filter(line => line.trim() !== '');

// Parse the header
const headers = lines[0].split(',').map(header => {
  return header.trim()
    .replace(/\s+/g, '_')
    .replace(/%/g, 'Percent')
    .toLowerCase();
});

// Helper function to parse CSV lines with quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  return result;
}

// Parse the data rows
const pcns = [];
let skippedRows = 0;

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  // Skip rows with incorrect number of fields
  if (values.length !== headers.length) {
    console.log(`Skipping row ${i+1}: Expected ${headers.length} fields, got ${values.length}`);
    skippedRows++;
    continue;
  }
  
  const pcn = {
    code: values[0].trim(),
    name: values[1].trim(),
    postcode: values[2].trim(),
    subIcb: values[3].trim(),
    icbCode: values[4].trim(),
    icbName: values[5].trim(),
    listSize: parseInt(values[6].trim().replace(/,/g, ''), 10) || 0,
    conditions: {
      hypertension: {
        register: parseInt(values[7].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[8].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[9].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[10].trim().replace(/%/g, '')) / 100 || 0
      },
      diabetes: {
        register: parseInt(values[11].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[12].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[13].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[14].trim().replace(/%/g, '')) / 100 || 0
      },
      cholesterol: {
        register: parseInt(values[15].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[16].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[17].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[18].trim().replace(/%/g, '')) / 100 || 0
      },
      asthma: {
        register: parseInt(values[19].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[20].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[21].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[22].trim().replace(/%/g, '')) / 100 || 0
      },
      ndh: {
        register: parseInt(values[23].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[24].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[25].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[26].trim().replace(/%/g, '')) / 100 || 0
      },
      ckd: {
        register: parseInt(values[27].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[28].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[29].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[30].trim().replace(/%/g, '')) / 100 || 0
      },
      copd: {
        register: parseInt(values[31].trim().replace(/,/g, ''), 10) || 0,
        prevalence: parseFloat(values[32].trim().replace(/%/g, '')) / 100 || 0,
        subIcbPrevalence: parseFloat(values[33].trim().replace(/%/g, '')) / 100 || 0,
        nationalPrevalence: parseFloat(values[34].trim().replace(/%/g, '')) / 100 || 0
      }
    }
  };
  
  pcns.push(pcn);
}

// Create the final JSON structure
const jsonData = {
  pcns: pcns
};

// Write the JSON file
fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`Converted ${pcns.length} PCNs to JSON format.`);
console.log(`Skipped ${skippedRows} rows due to formatting issues.`);
console.log(`Output saved to: ${outputFile}`);
