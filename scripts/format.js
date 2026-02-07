#!/usr/bin/env node

/**
 * Formats registry.json with consistent indentation
 * Rebuilds registry from plugins/ directory first, then formats it
 */

// First rebuild from plugins
require('./build-registry.js');

// Then format (plugins are already sorted by build-registry.js)
const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'registry.json');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  
  // Ensure plugins are sorted (should already be sorted by build-registry.js)
  registry.plugins.sort((a, b) => a.id.localeCompare(b.id));
  
  // Update last_updated timestamp
  registry.last_updated = new Date().toISOString();
  
  // Write formatted JSON
  fs.writeFileSync(
    registryPath,
    JSON.stringify(registry, null, 2) + '\n',
    'utf8'
  );
  
  console.log('✅ Registry formatted successfully!');
} catch (error) {
  console.error('❌ Error formatting registry:', error.message);
  process.exit(1);
}
