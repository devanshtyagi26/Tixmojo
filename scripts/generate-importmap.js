#!/usr/bin/env node

/**
 * This script generates a proper import map for production builds
 * to correctly resolve module specifiers like "react/jsx-runtime"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

// Helper to ensure dirs exist
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Main function
async function generateImportMap() {
  try {
    console.log('Generating production import map...');
    
    // Ensure dist directory exists
    ensureDirExists(distDir);
    
    // Check if index.html exists
    if (!fs.existsSync(indexHtmlPath)) {
      console.error('Error: index.html not found in dist directory');
      return;
    }
    
    // Read the index.html file
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
    
    // Get asset files from dist directory
    const files = fs.readdirSync(path.join(distDir, 'assets'));
    
    // Find the vendor chunk (which should include React)
    const vendorJsFile = files.find(file => file.match(/^vendor-[a-zA-Z0-9]+\.js$/));
    const vendorPath = vendorJsFile ? `/assets/${vendorJsFile}` : null;
    
    if (!vendorPath) {
      console.warn('Warning: Vendor JS file not found in assets directory');
    }
    
    // Create import map
    const importMap = {
      imports: {
        'react': vendorPath || '/assets/vendor.js',
        'react/jsx-runtime': vendorPath || '/assets/vendor.js',
        'react-dom': vendorPath || '/assets/vendor.js',
        'react-dom/client': vendorPath || '/assets/vendor.js'
      }
    };
    
    // Create import map script tag
    const importMapScript = `
    <!-- Import map for production -->
    <script type="importmap">
      ${JSON.stringify(importMap, null, 2)}
    </script>
    `;
    
    // Add import map before closing head tag
    htmlContent = htmlContent.replace('</head>', `${importMapScript}\n  </head>`);
    
    // Write updated HTML back to file
    fs.writeFileSync(indexHtmlPath, htmlContent);
    
    console.log('Import map added to production index.html');
  } catch (error) {
    console.error('Error generating import map:', error);
  }
}

// Run the function
generateImportMap();