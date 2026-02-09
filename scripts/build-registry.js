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

  // Normalize author name for directory matching
  function normalizeAuthorName(author) {
    return author.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');
  }

  // Recursively find plugins in plugins/{author}/{plugin-id}/plugin.json structure
  function findPlugins(dir, authorPath = '') {
    const plugins = [];
    const errors = [];
    
    if (!fs.existsSync(dir)) {
      return { plugins, errors };
    }
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) {
        continue;
      }
      
      const fullPath = path.join(dir, entry.name);
      const pluginJsonPath = path.join(fullPath, 'plugin.json');
      
      if (fs.existsSync(pluginJsonPath)) {
        // This is a plugin directory
        try {
          const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
          
          // Validate that id matches directory name
          if (pluginData.id !== entry.name) {
            errors.push(`Plugin ID "${pluginData.id}" in ${authorPath ? authorPath + '/' : ''}${entry.name}/plugin.json doesn't match directory name`);
            continue;
          }
          
          // Validate that author is present
          if (!pluginData.author || pluginData.author.trim() === '') {
            errors.push(`Plugin "${pluginData.id}" is missing required "author" field`);
            continue;
          }
          
          // Validate that author matches directory structure
          if (authorPath) {
            const normalizedAuthor = normalizeAuthorName(pluginData.author);
            if (normalizedAuthor !== authorPath) {
              errors.push(`Plugin "${pluginData.id}" author "${pluginData.author}" (normalized: "${normalizedAuthor}") doesn't match directory author "${authorPath}"`);
              continue;
            }
          }
          
          plugins.push(pluginData);
        } catch (error) {
          errors.push(`Error parsing ${authorPath ? authorPath + '/' : ''}${entry.name}/plugin.json: ${error.message}`);
        }
      } else {
        // This might be an author directory - recurse into it
        const result = findPlugins(fullPath, entry.name);
        plugins.push(...result.plugins);
        errors.push(...result.errors);
      }
    }
    
    return { plugins, errors };
  }
  
  const { plugins, errors } = findPlugins(pluginsDir);
  
  if (errors.length > 0) {
    console.error('❌ Errors found:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  // Sort plugins by id
  plugins.sort((a, b) => a.id.localeCompare(b.id));
  
  // Preserve existing last_updated timestamp if registry.json exists and plugins haven't changed
  let lastUpdated = new Date().toISOString();
  if (fs.existsSync(registryPath)) {
    try {
      const existingRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      const existingPluginsJson = JSON.stringify(existingRegistry.plugins || []);
      const newPluginsJson = JSON.stringify(plugins);
      
      // Only update timestamp if plugins actually changed
      if (existingPluginsJson === newPluginsJson && existingRegistry.last_updated) {
        lastUpdated = existingRegistry.last_updated;
      }
    } catch (error) {
      // If we can't parse existing registry, use new timestamp
      // (this is fine, registry might be corrupted or in wrong format)
    }
  }
  
  // Build registry
  const registry = {
    "$schema": "./registry.schema.json",
    "version": "1.0.0",
    "last_updated": lastUpdated,
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
