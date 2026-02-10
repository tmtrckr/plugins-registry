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
  // Use JSON.stringify to create unambiguous keys that handle authors containing '/'
  // Single pass: count occurrences, track duplicates, and build plugin groups
  const pluginCounts = new Map();
  const pluginsByAuthorId = new Map();
  const duplicates = new Set();

  for (const plugin of registry.plugins) {
    const key = JSON.stringify([plugin.author, plugin.id]);
    const count = (pluginCounts.get(key) || 0) + 1;
    pluginCounts.set(key, count);

    if (!pluginsByAuthorId.has(key)) {
      pluginsByAuthorId.set(key, []);
    }
    pluginsByAuthorId.get(key).push(plugin);

    if (count > 1) {
      duplicates.add(key);
    }
  }

  if (duplicates.size > 0) {
    console.error('❌ Duplicate plugin author+id combinations found:');
    duplicates.forEach(key => {
      const [author, id] = JSON.parse(key);
      const plugins = pluginsByAuthorId.get(key);
      const count = pluginCounts.get(key);
      console.error(`  - Author: "${author}", ID: "${id}" appears ${count} times:`);
      plugins.forEach(p => {
        console.error(`    * ${p.name} (${p.repository})`);
      });
    });
    process.exit(1);
  }
  
  console.log('✅ No duplicate plugin author+id combinations found');
  console.log(`   Total plugins: ${registry.plugins.length}`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error checking duplicates:', error.message);
  process.exit(1);
}
