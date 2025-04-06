// Script to convert CSV data to JSON format with detailed condition structure
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const csvFilePath = path.join(__dirname, 'Website Pricing _ Q2 25 - Practice data.csv');
const jsonOutputPath = path.join(__dirname, 'practices.json');

// Function to convert percentage string to decimal
function percentToDecimal(percentStr) {
  if (!percentStr || typeof percentStr !== 'string') return 0;
  return parseFloat(percentStr.replace('%', '')) / 100;
}

// Function to clean and parse number values
function parseNumber(value) {
  if (!value) return 0;
  return parseInt(value.toString().replace(/,/g, ''));
}

// Read the CSV file
const csvData = fs.readFileSync(csvFilePath, 'utf8');
const lines = csvData.split('\n');
const headers = lines[0].split(',');

// Process data
const practices = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  // Split the line by commas, handling quoted values
  const row = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let j = 0; j < lines[i].length; j++) {
    const char = lines[i][j];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  row.push(currentValue);
  
  // Create an object from the row
  const rowData = {};
  for (let j = 0; j < headers.length; j++) {
    rowData[headers[j]] = row[j];
  }
  
  // Extract practice data
  const practice = {
    name: rowData['2. Organisation Name'],
    code: rowData['1. ODS code'],
    pcnCode: rowData['3. PCN ODS code'],
    icb: rowData['8. ICB Name'],
    icbCode: rowData['7. ICB Code'],
    pcn: rowData['5. PCN name'],
    listSize: parseNumber(rowData['9. Total Patient List Size']),
    postcode: rowData['4. Post Code'],
    conditions: {
      hypertension: {
        register: parseNumber(rowData['10. HYP Register']),
        prevalence: percentToDecimal(rowData['11. HYP Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['12. HYP Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['13. National HYP Prevalence'])
      },
      diabetes: {
        register: parseNumber(rowData['14. DM Register']),
        prevalence: percentToDecimal(rowData['15. DM Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['16. DM Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['17. National DM Prevalence'])
      },
      cholesterol: {
        register: parseNumber(rowData['18. CHOL Register']),
        prevalence: percentToDecimal(rowData['19. CHOL Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['20. CHOL Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['21. National CHOL Prevalence'])
      },
      asthma: {
        register: parseNumber(rowData['22. AST Register']),
        prevalence: percentToDecimal(rowData['23. AST Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['24. AST Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['25. National AST Prevalence'])
      },
      ndh: {
        register: parseNumber(rowData['26. NDH Register']),
        prevalence: percentToDecimal(rowData['27. NDH Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['28. NDH Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['29. National NDH Prevalence'])
      },
      ckd: {
        register: parseNumber(rowData['30. CKD Register']),
        prevalence: percentToDecimal(rowData['31. CKD Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['32. CKD Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['33. National CKD Prevalence'])
      },
      copd: {
        register: parseNumber(rowData['34. COPD Register']),
        prevalence: percentToDecimal(rowData['35. COPD Practice Prevalence']),
        subIcbPrevalence: percentToDecimal(rowData['36. COPD Sub ICB Prevalence ']),
        nationalPrevalence: percentToDecimal(rowData['37. National COPD Prevalence'])
      }
    }
  };
  
  practices.push(practice);
}

// Create JSON structure
const jsonData = {
  practices: practices
};

// Write to file
fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
console.log(`Converted ${practices.length} practices to JSON format`);
console.log(`Output saved to ${jsonOutputPath}`);
