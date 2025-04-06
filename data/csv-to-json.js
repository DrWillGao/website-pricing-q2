// Script to convert CSV data to JSON format with detailed condition structure
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const csvFilePath = path.join(__dirname, 'Website Pricing _ Q2 25 - Practice data.csv');
const jsonOutputPath = path.join(__dirname, 'practices-new.json');

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

// Data structure
const practices = [];

// Process CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Extract practice data
    const practice = {
      name: row['2. Organisation Name'],
      code: row['1. ODS code'],
      pcnCode: row['3. PCN ODS code'],
      icb: row['8. ICB Name'],
      icbCode: row['7. ICB Code'],
      pcn: row['5. PCN name'],
      listSize: parseNumber(row['9. Total Patient List Size']),
      postcode: row['4. Post Code'],
      conditions: {
        hypertension: {
          register: parseNumber(row['10. HYP Register']),
          prevalence: percentToDecimal(row['11. HYP Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['12. HYP Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['13. National HYP Prevalence'])
        },
        diabetes: {
          register: parseNumber(row['14. DM Register']),
          prevalence: percentToDecimal(row['15. DM Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['16. DM Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['17. National DM Prevalence'])
        },
        cholesterol: {
          register: parseNumber(row['18. CHOL Register']),
          prevalence: percentToDecimal(row['19. CHOL Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['20. CHOL Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['21. National CHOL Prevalence'])
        },
        asthma: {
          register: parseNumber(row['22. AST Register']),
          prevalence: percentToDecimal(row['23. AST Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['24. AST Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['25. National AST Prevalence'])
        },
        ndh: {
          register: parseNumber(row['26. NDH Register']),
          prevalence: percentToDecimal(row['27. NDH Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['28. NDH Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['29. National NDH Prevalence'])
        },
        ckd: {
          register: parseNumber(row['30. CKD Register']),
          prevalence: percentToDecimal(row['31. CKD Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['32. CKD Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['33. National CKD Prevalence'])
        },
        copd: {
          register: parseNumber(row['34. COPD Register']),
          prevalence: percentToDecimal(row['35. COPD Practice Prevalence']),
          subIcbPrevalence: percentToDecimal(row['36. COPD Sub ICB Prevalence ']),
          nationalPrevalence: percentToDecimal(row['37. National COPD Prevalence'])
        }
      }
    };
    
    practices.push(practice);
  })
  .on('end', () => {
    // Create JSON structure
    const jsonData = {
      practices: practices
    };
    
    // Write to file
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
    console.log(`Converted ${practices.length} practices to JSON format`);
    console.log(`Output saved to ${jsonOutputPath}`);
  });
