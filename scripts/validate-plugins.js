#!/usr/bin/env node

/**
 * Validates individual plugin.json files in plugins/ directory
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const schemaPath = path.join(__dirname, '..', 'registry.schema.json');

try {
  // Check if plugins directory exists
  if (!fs.existsSync(pluginsDir)) {
    console.log('⚠️  plugins/ directory not found');
    process.exit(0);
  }

  // Load schema - extract plugin item schema
  const fullSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const pluginSchema = {
    $schema: fullSchema.$schema,
    ...fullSchema.properties.plugins.items
  };
  
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(pluginSchema);
  
  // Read all plugin directories
  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  const pluginDirs = entries
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith('.')); // Ignore hidden directories
  
  if (pluginDirs.length === 0) {
    console.log('ℹ️  No plugins found in plugins/ directory');
    process.exit(0);
  }
  
  let errors = 0;
  let validated = 0;
  
  for (const pluginDir of pluginDirs) {
    const pluginJsonPath = path.join(pluginsDir, pluginDir, 'plugin.json');
    
    if (!fs.existsSync(pluginJsonPath)) {
      console.error(`❌ ${pluginDir}/: Missing plugin.json`);
      errors++;
      continue;
    }
    
    try {
      const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      
      // Check ID matches directory
      if (pluginData.id !== pluginDir) {
        console.error(`❌ ${pluginDir}/: ID "${pluginData.id}" doesn't match directory name`);
        errors++;
        continue;
      }
      
      // Validate schema
      const valid = validate(pluginData);
      if (!valid) {
        console.error(`❌ ${pluginDir}/plugin.json: Validation failed`);
        validate.errors.forEach(err => {
          const path = err.instancePath || err.schemaPath || 'root';
          console.error(`   - ${path}: ${err.message}`);
        });
        errors++;
      } else {
        console.log(`✅ ${pluginDir}/plugin.json`);
        validated++;
      }
    } catch (error) {
      console.error(`❌ ${pluginDir}/plugin.json: ${error.message}`);
      errors++;
    }
  }
  
  console.log(`\n📊 Validation summary: ${validated} passed, ${errors} failed`);
  
  if (errors > 0) {
    process.exit(1);
  }
  
  console.log(`\n✅ All ${pluginDirs.length} plugin(s) validated successfully!`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error validating plugins:', error.message);
  process.exit(1);
}
