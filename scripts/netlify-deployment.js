#!/usr/bin/env node

/**
 * Netlify-specific deployment script
 * Handles special configuration needed for successful Netlify deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');

// Create necessary files and directories
function setupNetlifyDeployment() {
  console.log('Setting up Netlify deployment configuration...');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Copy _redirects file
  const redirectsSource = path.join(publicDir, '_redirects');
  const redirectsDest = path.join(distDir, '_redirects');
  if (fs.existsSync(redirectsSource)) {
    fs.copyFileSync(redirectsSource, redirectsDest);
    console.log('✓ Copied _redirects file');
  } else {
    // Create default _redirects if it doesn't exist
    fs.writeFileSync(redirectsDest, `# Netlify redirects\n/*    /index.html   200\n`);
    console.log('✓ Created default _redirects file');
  }
  
  // Copy _headers file
  const headersSource = path.join(publicDir, '_headers');
  const headersDest = path.join(distDir, '_headers');
  if (fs.existsSync(headersSource)) {
    fs.copyFileSync(headersSource, headersDest);
    console.log('✓ Copied _headers file');
  } else {
    // Create default _headers if it doesn't exist
    const defaultHeaders = `# Default headers
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  
# CSS files
*.css
  Content-Type: text/css
  
# JavaScript files  
*.js
  Content-Type: application/javascript
`;
    fs.writeFileSync(headersDest, defaultHeaders);
    console.log('✓ Created default _headers file');
  }
  
  // Copy the special dist-specific netlify.toml file rather than the root one
  const distNetlifyConfigSource = path.resolve(__dirname, './dist-netlify.toml');
  const netlifyConfigDest = path.join(distDir, 'netlify.toml');
  
  if (fs.existsSync(distNetlifyConfigSource)) {
    // Copy the dist-specific netlify.toml file
    fs.copyFileSync(distNetlifyConfigSource, netlifyConfigDest);
    console.log('✓ Copied dist-specific netlify.toml file with Content-Type fixes');
  } else {
    // Fall back to the normal netlify.toml if dist-specific doesn't exist
    const netlifyConfigSource = path.resolve(__dirname, '../netlify.toml');
    if (fs.existsSync(netlifyConfigSource)) {
      fs.copyFileSync(netlifyConfigSource, netlifyConfigDest);
      console.log('✓ Copied standard netlify.toml file as fallback');
    } else {
      console.warn('⚠️ No netlify.toml file found to copy');
    }
  }
  
  // Create a verification file that Netlify can use to confirm a valid deployment
  const verificationFile = path.join(distDir, '_netlify_health_check.txt');
  fs.writeFileSync(verificationFile, `Site is ready for deployment\nDeployment timestamp: ${new Date().toISOString()}\n`);
  console.log('✓ Created deployment verification file');
  
  // Add Content-Type meta tag to index.html to help browsers
  console.log('Adding Content-Type meta to HTML files...');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
    
    // Add Content-Type meta tag if it's not already there
    if (!htmlContent.includes('<meta http-equiv="Content-Type"')) {
      htmlContent = htmlContent.replace(
        '<head>',
        '<head>\n    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
      );
      fs.writeFileSync(indexHtmlPath, htmlContent);
      console.log('✓ Added Content-Type meta tag to index.html');
    }
  } else {
    console.warn('⚠️ index.html not found in dist directory');
  }
  
  // Copy fallback.html to dist directory
  const fallbackSource = path.join(publicDir, 'fallback.html');
  const fallbackDest = path.join(distDir, 'fallback.html');
  if (fs.existsSync(fallbackSource)) {
    fs.copyFileSync(fallbackSource, fallbackDest);
    console.log('✓ Copied fallback.html file');
  }
  
  console.log('Netlify deployment configuration complete!');
}

// Run the setup
try {
  setupNetlifyDeployment();
} catch (error) {
  console.error('Error setting up Netlify deployment:', error);
  process.exit(1);
}