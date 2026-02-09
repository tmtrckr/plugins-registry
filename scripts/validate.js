#!/usr/bin/env node

/**
 * Validates registry.json against registry.schema.json
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const registryPath = path.join(__dirname, '..', 'registry.json');
const schemaPath = path.join(__dirname, '..', 'registry.schema.json');

try {
  // Load registry and schema
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

  // Validate
  const ajv = new Ajv({ 
    allErrors: true,
    strict: false  // Disable Ajv strict-mode checks (e.g. unknown keywords) for this schema
  });
  addFormats(ajv);
  
  // Remove $schema from schema before validation (it's metadata, not part of validation)
  const schemaToValidate = { ...schema };
  delete schemaToValidate.$schema;
  
  const validate = ajv.compile(schemaToValidate);

  const valid = validate(registry);

  if (!valid) {
    console.error('❌ Registry validation failed:\n');
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }

  // Additional checks
  const ids = registry.plugins.map(p => p.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicates.length > 0) {
    console.error('❌ Duplicate plugin IDs found:', duplicates);
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
