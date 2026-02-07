#!/usr/bin/env node

/**
 * Builds registry.json from individual plugin.json files in plugins/ directory
 */

const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const registryPath = path.join(__dirname, '..', 'registry.json');
const schemaPath = path.join(__dirname, '..', 'registry.schema.json');

try {
  // Check if plugins directory exists
  if (!fs.existsSync(pluginsDir)) {
    console.log('⚠️  plugins/ directory not found, creating empty registry');
    const registry = {
      "$schema": "./registry.schema.json",
      "version": "1.0.0",
      "last_updated": new Date().toISOString(),
      "plugins": []
    };
    fs.writeFileSync(
      registryPath,
      JSON.stringify(registry, null, 2) + '\n',
      'utf8'
    );
    process.exit(0);
  }

  // Read all plugin directories
  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  const pluginDirs = entries
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith('.')); // Ignore hidden directories
  
  const plugins = [];
  const errors = [];
  
  // Load each plugin.json
  for (const pluginDir of pluginDirs) {
    const pluginJsonPath = path.join(pluginsDir, pluginDir, 'plugin.json');
    
    if (!fs.existsSync(pluginJsonPath)) {
      errors.push(`Missing plugin.json in ${pluginDir}/`);
      continue;
    }
    
    try {
      const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      
      // Validate that id matches directory name
      if (pluginData.id !== pluginDir) {
        errors.push(`Plugin ID "${pluginData.id}" in ${pluginDir}/plugin.json doesn't match directory name`);
        continue;
      }
      
      plugins.push(pluginData);
    } catch (error) {
      errors.push(`Error parsing ${pluginDir}/plugin.json: ${error.message}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Errors found:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  // Sort plugins by id
  plugins.sort((a, b) => a.id.localeCompare(b.id));
  
  // Build registry
  const registry = {
    "$schema": "./registry.schema.json",
    "version": "1.0.0",
    "last_updated": new Date().toISOString(),
    "plugins": plugins
  };
  
  // Write registry.json
  fs.writeFileSync(
    registryPath,
    JSON.stringify(registry, null, 2) + '\n',
    'utf8'
  );
  
  console.log('✅ Registry built successfully!');
  console.log(`   Found ${plugins.length} plugin(s)`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error building registry:', error.message);
  process.exit(1);
}
