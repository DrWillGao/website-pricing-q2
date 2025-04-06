
// Error logging for Suvera Pricing Calculator
(function() {
  // Store the original console.error
  const originalConsoleError = console.error;
  
  // Create a log array to store errors
  window.suveraErrorLog = [];
  
  // Override console.error to capture errors
  console.error = function(...args) {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Add to our log
    window.suveraErrorLog.push({
      timestamp: new Date().toISOString(),
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')
    });
    
    // Keep log size reasonable
    if (window.suveraErrorLog.length > 100) {
      window.suveraErrorLog.shift();
    }
    
    // Update UI if error display exists
    const errorDisplay = document.getElementById('suvera-error-display');
    if (errorDisplay) {
      errorDisplay.textContent = JSON.stringify(window.suveraErrorLog, null, 2);
    }
  };
  
  // Add a function to show errors in the UI
  window.showSuveraErrors = function() {
    let errorDisplay = document.getElementById('suvera-error-display');
    
    if (!errorDisplay) {
      errorDisplay = document.createElement('pre');
      errorDisplay.id = 'suvera-error-display';
      errorDisplay.style.position = 'fixed';
      errorDisplay.style.bottom = '10px';
      errorDisplay.style.right = '10px';
      errorDisplay.style.maxWidth = '80%';
      errorDisplay.style.maxHeight = '50%';
      errorDisplay.style.overflow = 'auto';
      errorDisplay.style.backgroundColor = 'rgba(255, 200, 200, 0.9)';
      errorDisplay.style.padding = '10px';
      errorDisplay.style.border = '1px solid red';
      errorDisplay.style.zIndex = '9999';
      errorDisplay.style.fontSize = '12px';
      errorDisplay.style.fontFamily = 'monospace';
      document.body.appendChild(errorDisplay);
    }
    
    errorDisplay.textContent = JSON.stringify(window.suveraErrorLog, null, 2);
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = function() {
      document.body.removeChild(errorDisplay);
    };
    errorDisplay.appendChild(closeButton);
  };
})();
