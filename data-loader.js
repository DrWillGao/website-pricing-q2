// Data Loader for Suvera Pricing Calculator
// This script handles loading the JSON data files for the Webflow embed

// Define the base URL for data files
// In production, this will be the GitHub Pages URL
const DATA_BASE_URL = 'https://drwillgao.github.io/website-pricing-q2/data/';

// Create a class to handle data loading
class DataLoader {
  constructor() {
    this.practicesData = null;
    this.pcnsData = null;
    this.pricingData = null;
    this.dataLoaded = false;
    this.dataLoadCallbacks = [];
    
    // Start loading data immediately
    this.loadAllData();
    
    // Add to window for debugging
    window.SuveraDataLoader = this;
  }
  
  // Load all data files
  async loadAllData() {
    try {
      console.log('Loading data files...');
      
      // Load all data files in parallel
      const [practices, pcns, pricing] = await Promise.all([
        fetch(`${DATA_BASE_URL}practices.json`).then(response => response.json()),
        fetch(`${DATA_BASE_URL}pcns.json`).then(response => response.json()),
        fetch(`${DATA_BASE_URL}pricing.json`).then(response => response.json())
      ]);
      
      // Store the loaded data
      this.practicesData = practices;
      this.pcnsData = pcns;
      this.pricingData = pricing;
      
      // Mark data as loaded
      this.dataLoaded = true;
      
      // Call any callbacks waiting for data
      this.dataLoadCallbacks.forEach(callback => callback());
      this.dataLoadCallbacks = [];
      
      console.log('All data loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading data:', error);
      
      // If data loading fails, fall back to sample data
      console.log('Falling back to sample data');
      this.useSampleData();
      return false;
    }
  }
  
  // Use sample data if loading fails
  useSampleData() {
    // Sample practices data
    this.practicesData = {
      practices: [
        {
          name: "Half Penny Steps Health Centre",
          code: "Y02842",
          icb: "NHS North West London Integrated Care Board (QRV)",
          pcn: "Inclusive Health PCN (U91471)",
          listSize: 6408,
          conditions: {
            hypertension: { register: 800 },
            diabetes: { register: 400 },
            cholesterol: { register: 600 },
            asthma: { register: 300 },
            ndh: { register: 150 },
            ckd: { register: 200 },
            copd: { register: 180 }
          }
        }
      ]
    };
    
    // Sample PCNs data
    this.pcnsData = {
      pcns: [
        {
          name: "Inclusive Health PCN",
          code: "U91471",
          icb: "NHS North West London Integrated Care Board (QRV)",
          listSize: 35000,
          practices: ["Y02842"]
        }
      ]
    };
    
    // Use the actual pricing data structure
    this.pricingData = {
      pricingTiers: [
        {
          patientConditionInvites: 600,
          tiers: {
            essential: {
              totalPrice: 9000,
              monthlyPrice: 750,
              clinicalPharmacists: 0.1,
              careCoordinators: 0.05,
              appointmentsSaved: 1200
            },
            core: {
              totalPrice: 15000,
              monthlyPrice: 1250,
              clinicalPharmacists: 0.2,
              careCoordinators: 0.05,
              appointmentsSaved: 1320
            },
            complete: {
              totalPrice: 16500,
              monthlyPrice: 1375,
              clinicalPharmacists: 0.2,
              careCoordinators: 0.1,
              appointmentsSaved: 1440
            }
          }
        }
      ]
    };
    
    // Mark data as loaded
    this.dataLoaded = true;
    
    // Call any callbacks waiting for data
    this.dataLoadCallbacks.forEach(callback => callback());
    this.dataLoadCallbacks = [];
  }
  
  // Register a callback for when data is loaded
  onDataLoaded(callback) {
    if (this.dataLoaded) {
      // If data is already loaded, call the callback immediately
      callback();
    } else {
      // Otherwise, add it to the queue
      this.dataLoadCallbacks.push(callback);
    }
  }
  
  // Get all practices
  getPractices() {
    return this.practicesData?.practices || [];
  }
  
  // Get all PCNs
  getPCNs() {
    return this.pcnsData?.pcns || [];
  }
  
  // Get pricing data
  getPricingData() {
    return this.pricingData?.pricingTiers || [];
  }
  
  // Get a practice by code
  getPracticeByCode(code) {
    return this.getPractices().find(practice => practice.code === code);
  }
  
  // Get a PCN by code
  getPCNByCode(code) {
    return this.getPCNs().find(pcn => pcn.code === code);
  }
  
  // Get practices by PCN code
  getPracticesByPCN(pcnCode) {
    const pcn = this.getPCNByCode(pcnCode);
    if (!pcn || !pcn.practices) return [];
    
    return pcn.practices
      .map(practiceCode => this.getPracticeByCode(practiceCode))
      .filter(Boolean);
  }
  
  // Search for practices and PCNs
  searchOrganizations(query) {
    if (!query || query.length < 2) return { practices: [], pcns: [] };
    
    query = query.toLowerCase();
    
    // Search practices
    const practices = this.getPractices().filter(practice => 
      practice.name.toLowerCase().includes(query) || 
      practice.code.toLowerCase().includes(query)
    );
    
    // Search PCNs
    const pcns = this.getPCNs().filter(pcn => 
      pcn.name.toLowerCase().includes(query) || 
      pcn.code.toLowerCase().includes(query)
    );
    
    return { practices, pcns };
  }
}

// Create a global instance of the data loader
window.dataLoader = new DataLoader();
