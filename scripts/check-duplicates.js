#!/usr/bin/env node

/**
 * Checks for duplicate plugin IDs in registry.json
 */

const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'registry.json');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const ids = registry.plugins.map(p => p.id);
  
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  
  if (duplicates.length > 0) {
    console.error('❌ Duplicate plugin IDs found:');
    duplicates.forEach(id => {
      const plugins = registry.plugins.filter(p => p.id === id);
      console.error(`  - "${id}" appears ${plugins.length} times:`);
      plugins.forEach(p => {
        console.error(`    * ${p.name} (${p.repository})`);
      });
    });
    process.exit(1);
  }
  
  console.log('✅ No duplicate plugin IDs found');
  console.log(`   Total plugins: ${ids.length}`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error checking duplicates:', error.message);
  process.exit(1);
}
