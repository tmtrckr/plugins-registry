#!/usr/bin/env node

/**
 * Checks for duplicate plugin IDs in registry.json
 */

const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'registry.json');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  // Check for duplicates by author+id combination (uniqueness is per author)
  const authorIds = registry.plugins.map(p => p.author + '/' + p.id);
  const duplicates = authorIds.filter((aid, index) => authorIds.indexOf(aid) !== index);
  
  if (duplicates.length > 0) {
    console.error('❌ Duplicate plugin author+id combinations found:');
    duplicates.forEach(aid => {
      const [author, id] = aid.split('/');
      const plugins = registry.plugins.filter(p => p.author === author && p.id === id);
      console.error(`  - "${aid}" appears ${plugins.length} times:`);
      plugins.forEach(p => {
        console.error(`    * ${p.name} (${p.repository})`);
      });
    });
    process.exit(1);
  }
  
  console.log('✅ No duplicate plugin author+id combinations found');
  console.log(`   Total plugins: ${authorIds.length}`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error checking duplicates:', error.message);
  process.exit(1);
}
