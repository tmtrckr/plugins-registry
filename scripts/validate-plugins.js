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
  // Create plugin schema without $schema (it's a subschema, not a full schema)
  const pluginSchema = {
    ...fullSchema.properties.plugins.items
  };
  
  // Normalize author name for directory matching
  function normalizeAuthorName(author) {
    return author.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '');
  }

  const ajv = new Ajv({ 
    allErrors: true,
    strict: false  // Allow Draft 2020-12 features
  });
  addFormats(ajv);
  const validate = ajv.compile(pluginSchema);
  
  // Recursively find and validate plugins in plugins/{author}/{plugin-id}/plugin.json structure
  function validatePlugins(dir, authorPath = '') {
    let errors = 0;
    let validated = 0;
    
    if (!fs.existsSync(dir)) {
      return { errors, validated };
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
        const pluginPath = authorPath ? `${authorPath}/${entry.name}` : entry.name;
        
        try {
          const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
          
          // Check ID matches directory name
          if (pluginData.id !== entry.name) {
            console.error(`❌ ${pluginPath}/: ID "${pluginData.id}" doesn't match directory name`);
            errors++;
            continue;
          }
          
          // Validate that author is present
          if (!pluginData.author || pluginData.author.trim() === '') {
            console.error(`❌ ${pluginPath}/plugin.json: Missing required "author" field`);
            errors++;
            continue;
          }
          
          // Validate that author matches directory structure
          if (authorPath) {
            const normalizedAuthor = normalizeAuthorName(pluginData.author);
            if (normalizedAuthor !== authorPath) {
              console.error(`❌ ${pluginPath}/plugin.json: Author "${pluginData.author}" (normalized: "${normalizedAuthor}") doesn't match directory author "${authorPath}"`);
              errors++;
              continue;
            }
          }
          
          // Validate schema
          const valid = validate(pluginData);
          if (!valid) {
            console.error(`❌ ${pluginPath}/plugin.json: Schema validation failed`);
            validate.errors.forEach(err => {
              const errPath = err.instancePath || err.schemaPath || 'root';
              console.error(`   - ${errPath}: ${err.message}`);
            });
            errors++;
          } else {
            console.log(`✅ ${pluginPath}/plugin.json`);
            validated++;
          }
        } catch (error) {
          console.error(`❌ ${pluginPath}/plugin.json: ${error.message}`);
          errors++;
        }
      } else {
        // This might be an author directory - recurse into it
        const result = validatePlugins(fullPath, entry.name);
        errors += result.errors;
        validated += result.validated;
      }
    }
    
    return { errors, validated };
  }
  
  const { errors, validated } = validatePlugins(pluginsDir);
  
  console.log(`\n📊 Validation summary: ${validated} passed, ${errors} failed`);
  
  if (errors > 0) {
    process.exit(1);
  }
  
  console.log(`\n✅ All ${validated} plugin(s) validated successfully!`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error validating plugins:', error.message);
  process.exit(1);
}
