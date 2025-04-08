#!/usr/bin/env node

/**
 * This script ensures that CSS and JavaScript files have the correct MIME type headers
 * when deployed to environments like Netlify, GitHub Pages, etc.
 * 
 * It creates additional configuration files in the dist directory to handle MIME types.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Helper function to ensure a directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Function to copy files with MIME type headers to the dist directory
const copyFileWithHeaders = (source, dest) => {
  if (fs.existsSync(source)) {
    console.log(`Copying ${source} to ${dest}`);
    fs.copyFileSync(source, dest);
  } else {
    console.warn(`Source file not found: ${source}`);
  }
};

// Main execution
try {
  // Ensure the dist directory exists
  ensureDirectoryExists(distDir);
  
  // Copy the _headers file for Netlify
  const sourceHeaders = path.resolve(__dirname, '../public/_headers');
  const destHeaders = path.resolve(distDir, '_headers');
  copyFileWithHeaders(sourceHeaders, destHeaders);
  
  // Copy the web.config file for IIS
  const sourceWebConfig = path.resolve(__dirname, '../public/web.config');
  const destWebConfig = path.resolve(distDir, 'web.config');
  copyFileWithHeaders(sourceWebConfig, destWebConfig);
  
  // Copy the .htaccess file for Apache
  const sourceHtaccess = path.resolve(__dirname, '../public/.htaccess');
  const destHtaccess = path.resolve(distDir, '.htaccess');
  copyFileWithHeaders(sourceHtaccess, destHtaccess);
  
  // Copy the _redirects file for Netlify
  const sourceRedirects = path.resolve(__dirname, '../public/_redirects');
  const destRedirects = path.resolve(distDir, '_redirects');
  copyFileWithHeaders(sourceRedirects, destRedirects);
  
  // Create a netlify.toml in the dist folder if it doesn't exist
  const netlifyToml = path.resolve(distDir, 'netlify.toml');
  if (!fs.existsSync(netlifyToml)) {
    console.log('Creating netlify.toml in dist directory');
    
    // Extract content from the root netlify.toml
    const rootNetlifyToml = path.resolve(__dirname, '../netlify.toml');
    if (fs.existsSync(rootNetlifyToml)) {
      fs.copyFileSync(rootNetlifyToml, netlifyToml);
    } else {
      // Create a minimal netlify.toml if the root one doesn't exist
      const minimalToml = `# Netlify configuration file

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.css"
  [headers.values]
    Content-Type = "text/css; charset=utf-8"
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"
    Cache-Control = "public, max-age=31536000, immutable"
`;
      fs.writeFileSync(netlifyToml, minimalToml);
    }
  }
  
  console.log('MIME type configuration completed successfully');
} catch (error) {
  console.error('Error setting up MIME types:', error);
  process.exit(1);
}