// Suvera Pricing Calculator Webflow Loader
// This script dynamically loads all required dependencies for the Suvera Pricing Calculator

// Create container if it doesn't exist
if (!document.getElementById('suvera-pricing-calculator')) {
  const container = document.createElement('div');
  container.id = 'suvera-pricing-calculator';
  container.style.width = '100%';
  container.style.minHeight = '800px';
  document.currentScript.parentNode.insertBefore(container, document.currentScript);
}

// Function to load JavaScript files
function loadScript(url, callback) {
  console.log('Loading script:', url);
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  
  // Handle callback
  if (callback) {
    script.onload = callback;
  }
  
  // Add to document
  document.head.appendChild(script);
}

// Function to load CSS files
function loadStylesheet(url) {
  console.log('Loading stylesheet:', url);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// Error handling
window.suveraErrors = [];
window.logSuveraError = function(error) {
  console.error('Suvera Calculator Error:', error);
  window.suveraErrors.push({
    timestamp: new Date().toISOString(),
    error: error.toString(),
    stack: error.stack
  });
};

window.showSuveraErrors = function() {
  console.log('Suvera Calculator Errors:', window.suveraErrors);
  return window.suveraErrors;
};

// Set up error handling
window.addEventListener('error', function(event) {
  window.logSuveraError(event.error || new Error(event.message));
});

// Load dependencies in sequence
console.log('Starting to load Suvera Pricing Calculator dependencies...');

// Load React first
loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
  // Then React DOM
  loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
    // Then Recharts
    loadScript('https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js', function() {
      // Then Tailwind CSS
      loadScript('https://cdn.tailwindcss.com', function() {
        // Then Lucide icons
        loadScript('https://unpkg.com/lucide@latest', function() {
          // Load our custom styles
          loadStylesheet('https://drwillgao.github.io/website-pricing-q2/styles.css');
          
          // Load our custom scripts
          loadScript('https://drwillgao.github.io/website-pricing-q2/error-log.js', function() {
            loadScript('https://drwillgao.github.io/website-pricing-q2/data-loader.js', function() {
              loadScript('https://drwillgao.github.io/website-pricing-q2/script.js', function() {
                console.log('All Suvera Pricing Calculator scripts loaded successfully');
              });
            });
          });
        });
      });
    });
  });
});
