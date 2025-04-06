# Suvera Pricing Calculator - Webflow Embed

This directory contains a standalone version of the Suvera Pricing Calculator that can be embedded into Webflow or any other website.

## Files

- `index.html`: The main HTML file for testing the calculator
- `styles.css`: The stylesheet containing all necessary styles
- `script.js`: The bundled JavaScript that powers the calculator
- `data-loader.js`: Script that handles loading the JSON data files
- `data/`: Directory containing JSON data files (pricing.json, practices.json, pcns.json)
- `webflow-embed-template.html`: Template HTML for embedding in Webflow

## How to Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push the contents of this directory to the repository
3. Enable GitHub Pages in the repository settings
4. Your calculator will be available at `https://[your-username].github.io/[repository-name]/`

## How to Embed in Webflow

1. After deploying to GitHub Pages, copy the contents of `webflow-embed-template.html`
2. In Webflow, add an "Embed" element to your page
3. Paste the copied HTML into the embed element
4. Update the URLs in the embed code to point to your GitHub Pages URLs

```html
<!-- Example embed code (update URLs to your GitHub Pages URLs) -->
<div id="suvera-pricing-calculator" style="width: 100%; min-height: 800px;"></div>

<!-- Load required dependencies -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js"></script>

<!-- Load Suvera Pricing Calculator styles and script -->
<link rel="stylesheet" href="https://[your-username].github.io/[repository-name]/styles.css">
<script src="https://[your-username].github.io/[repository-name]/data-loader.js"></script>
<script src="https://[your-username].github.io/[repository-name]/script.js"></script>
```

## Customization

You can customize the appearance of the calculator by modifying the `styles.css` file. The calculator uses Tailwind CSS classes for styling.

## Data Files

The calculator requires three JSON data files:

1. `pricing.json`: Contains pricing tiers and associated details
2. `practices.json`: Contains practice information
3. `pcns.json`: Contains PCN (Primary Care Network) information

These files should be placed in the `data/` directory.

## Browser Compatibility

This calculator should work in all modern browsers (Chrome, Firefox, Safari, Edge).
