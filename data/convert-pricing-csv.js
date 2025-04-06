import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input and output file paths
const inputFile = path.join(__dirname, 'Website Pricing _ Q2 25 - Website Pricing.csv');
const outputFile = path.join(__dirname, 'pricing.json');

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

// Helper function to clean currency values
function cleanCurrencyValue(value) {
  return value.replace(/[£,]/g, '').trim();
}

// Read the CSV file
const csvData = fs.readFileSync(inputFile, 'utf8');
const lines = csvData.split('\n').filter(line => line.trim() !== '');

// Parse the header
const headers = parseCSVLine(lines[0]).map(header => {
  // Extract the actual header name without numbering
  const match = header.match(/\d+\.\s*(.*?):/);
  if (match) {
    return match[1].trim().toLowerCase().replace(/\s+/g, '_');
  }
  return header.trim().toLowerCase().replace(/\s+/g, '_');
});

// Parse the data rows
const pricingTiers = [];
let skippedRows = 0;

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  // Skip rows with incorrect number of fields
  if (values.length !== headers.length) {
    console.log(`Skipping row ${i+1}: Expected ${headers.length} fields, got ${values.length}`);
    skippedRows++;
    continue;
  }
  
  // Get the patient condition invites (first column)
  const patientConditionInvites = parseInt(values[0].replace(/[",]/g, '').trim());
  
  // Create the pricing tier object
  const tier = {
    patientConditionInvites: patientConditionInvites,
    tiers: {
      essential: {
        totalPrice: parseFloat(cleanCurrencyValue(values[1])),
        monthlyPrice: parseFloat(cleanCurrencyValue(values[2])),
        clinicalPharmacists: parseFloat(values[3]),
        careCoordinators: parseFloat(values[4]),
        appointmentsSaved: parseInt(values[5].replace(/[",]/g, '').trim())
      },
      core: {
        totalPrice: parseFloat(cleanCurrencyValue(values[6])),
        monthlyPrice: parseFloat(cleanCurrencyValue(values[7])),
        clinicalPharmacists: parseFloat(values[8]),
        careCoordinators: parseFloat(values[9]),
        appointmentsSaved: parseInt(values[10].replace(/[",]/g, '').trim())
      },
      complete: {
        totalPrice: parseFloat(cleanCurrencyValue(values[11])),
        monthlyPrice: parseFloat(cleanCurrencyValue(values[12])),
        clinicalPharmacists: parseFloat(values[13]),
        careCoordinators: parseFloat(values[14]),
        appointmentsSaved: parseInt(values[15].replace(/[",]/g, '').trim())
      }
    }
  };
  
  pricingTiers.push(tier);
}

// Create the final JSON structure
const jsonData = {
  pricingTiers: pricingTiers,
  basePricing: {
    essential: {
      basePrice: 1500,
      baseAppointmentsSaved: 45,
      cpRate: 0.25,
      ccRate: 0.10,
      description: "General Pharmacist Services"
    },
    core: {
      basePrice: 2000,
      baseAppointmentsSaved: 68,
      cpRate: 0.30,
      ccRate: 0.10,
      description: "Long-term condition clinics"
    },
    complete: {
      basePrice: 2250,
      baseAppointmentsSaved: 95,
      cpRate: 0.35,
      ccRate: 0.10,
      description: "Comprehensive clinical services"
    }
  },
  conditionMultipliers: {
    priceMultiplier: 0.05,
    appointmentMultiplier: 0.08
  },
  listSizeFactors: [
    { min: 0, max: 5000, factor: 0.85 },
    { min: 5001, max: 10000, factor: 0.90 },
    { min: 10001, max: 15000, factor: 0.95 },
    { min: 15001, max: 20000, factor: 1.00 },
    { min: 20001, max: 30000, factor: 1.05 },
    { min: 30001, max: 50000, factor: 1.10 },
    { min: 50001, max: 100000, factor: 1.15 },
    { min: 100001, max: 999999, factor: 1.20 }
  ]
};

// Write the JSON file
fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf8');

console.log(`Converted ${pricingTiers.length} pricing tiers to JSON format.`);
console.log(`Skipped ${skippedRows} rows due to formatting issues.`);
console.log(`Output saved to: ${outputFile}`);
