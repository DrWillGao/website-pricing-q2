// Suvera Pricing Calculator Webflow Loader
(function() {
  // Create container if it doesn't exist
  if (!document.getElementById('suvera-pricing-calculator')) {
    const container = document.createElement('div');
    container.id = 'suvera-pricing-calculator';
    container.style.width = '100%';
    container.style.minHeight = '800px';
    document.currentScript.parentNode.insertBefore(container, document.currentScript);
  }

  // Load script function
  function loadScript(url, callback) {
    console.log('Loading script:', url);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', url);
    };
    document.head.appendChild(script);
  }

  // Load stylesheet function
  function loadStylesheet(url) {
    console.log('Loading stylesheet:', url);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onerror = function() {
      console.error('Failed to load stylesheet:', url);
    };
    document.head.appendChild(link);
  }

  // Error logging setup
  window.suveraErrors = [];
  window.logSuveraError = function(error) {
    console.error('Suvera Error:', error);
    window.suveraErrors.push({
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack || 'No stack trace'
    });
  };

  window.showSuveraErrors = function() {
    console.log('Suvera Errors:', window.suveraErrors);
    return window.suveraErrors;
  };

  // Set up error handling
  window.addEventListener('error', function(event) {
    window.logSuveraError(event.error || new Error(event.message));
  });

  // Load dependencies in sequence
  try {
    // Load React
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', function() {
      // Load ReactDOM
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', function() {
        // Load Recharts
        loadScript('https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js', function() {
          // Load Tailwind
          loadScript('https://cdn.tailwindcss.com', function() {
            // Load Lucide
            loadScript('https://unpkg.com/lucide@latest', function() {
              // Load our custom scripts
              loadStylesheet('https://drwillgao.github.io/website-pricing-q2/styles.css');
              
              // Load data loader
              loadScript('https://drwillgao.github.io/website-pricing-q2/data-loader.js', function() {
                // Finally load main script
                loadScript('https://drwillgao.github.io/website-pricing-q2/script.js', function() {
                  console.log('All scripts loaded successfully');
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    window.logSuveraError(error);
  }
})();
