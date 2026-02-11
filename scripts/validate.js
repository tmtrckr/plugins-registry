#!/usr/bin/env node

/**
 * Validates registry.json against schemas/registry.schema.json
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const rootDir = path.join(__dirname, '..');
const registryPath = path.join(rootDir, 'registry.json');
const registrySchemaPath = path.join(rootDir, 'schemas', 'registry.schema.json');
const manifestSchemaPath = path.join(rootDir, 'schemas', 'manifest.schema.json');

try {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const registrySchema = JSON.parse(fs.readFileSync(registrySchemaPath, 'utf8'));
  const manifestSchema = JSON.parse(fs.readFileSync(manifestSchemaPath, 'utf8'));

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: false
  });
  addFormats(ajv);
  ajv.addSchema(manifestSchema);

  const schemaToValidate = { ...registrySchema };
  delete schemaToValidate.$schema;

  const validate = ajv.compile(schemaToValidate);

  const valid = validate(registry);

  if (!valid) {
    console.error('❌ Registry validation failed:\n');
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }

  // Additional checks - check for duplicates by author+id combination
  // Use JSON.stringify to create unambiguous keys that handle authors containing '/'
  // Single pass: count occurrences and track duplicates
  const pluginCounts = new Map();
  const duplicates = new Set();
<<<<<<< HEAD

  for (const plugin of registry.plugins) {
    const key = JSON.stringify([plugin.author, plugin.id]);
    const count = (pluginCounts.get(key) || 0) + 1;
    pluginCounts.set(key, count);
    if (count > 1) {
      duplicates.add(key);
    }
  }

=======
  
  for (const plugin of registry.plugins) {
    const key = JSON.stringify([plugin.author, plugin.id]);
    const count = (pluginCounts.get(key) || 0) + 1;
    pluginCounts.set(key, count);
    if (count > 1) {
      duplicates.add(key);
    }
  }

>>>>>>> 4a0d7950fd07350b5532f4f0b0af7e7bda834e31
  if (duplicates.size > 0) {
    const duplicatePairs = Array.from(duplicates).map(key => JSON.parse(key));
    console.error('❌ Duplicate plugin author+id combinations found:', duplicatePairs);
    process.exit(1);
  }

  // Check repository URLs format
  const invalidRepos = registry.plugins.filter(p => {
    const repoPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    return p.repository && !repoPattern.test(p.repository);
  });

  if (invalidRepos.length > 0) {
    console.error('❌ Invalid repository URLs found:');
    invalidRepos.forEach(p => {
      console.error(`  - ${p.id}: ${p.repository}`);
    });
    process.exit(1);
  }

  console.log('✅ Registry validation passed!');
  console.log(`   Found ${registry.plugins.length} plugin(s)`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error validating registry:', error.message);
  process.exit(1);
}
