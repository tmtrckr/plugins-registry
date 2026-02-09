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
  const seen = new Set();
  const duplicates = new Set();

  for (const aid of authorIds) {
    if (seen.has(aid)) {
      duplicates.add(aid);
    } else {
      seen.add(aid);
    }
  }

  if (duplicates.size > 0) {
    console.error('❌ Duplicate plugin author+id combinations found:');
    const pluginsByAuthorId = new Map();
    registry.plugins.forEach(p => {
      const aid = p.author + '/' + p.id;
      if (!pluginsByAuthorId.has(aid)) {
        pluginsByAuthorId.set(aid, []);
      }
      pluginsByAuthorId.get(aid).push(p);
    });

    duplicates.forEach(aid => {
      const plugins = pluginsByAuthorId.get(aid);
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
