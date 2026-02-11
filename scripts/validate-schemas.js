#!/usr/bin/env node

/**
 * Validates schema files (manifest.schema.json, registry.schema.json) against
 * the JSON Schema meta-schema (draft 2020-12). Catches schema syntax/structural errors.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const rootDir = path.join(__dirname, '..');
const schemasDir = path.join(rootDir, 'schemas');
const manifestPath = path.join(schemasDir, 'manifest.schema.json');
const registryPath = path.join(schemasDir, 'registry.schema.json');

const ajvRefsDir = path.join(rootDir, 'node_modules', 'ajv', 'dist', 'refs', 'json-schema-2020-12');

function addMetaSchema(ajv) {
  const metaNames = ['core', 'applicator', 'unevaluated', 'validation', 'meta-data', 'format-annotation', 'content'];
  for (const name of metaNames) {
    const p = path.join(ajvRefsDir, 'meta', name + '.json');
    const schema = JSON.parse(fs.readFileSync(p, 'utf8'));
    ajv.addSchema(schema);
  }
  const mainMeta = JSON.parse(fs.readFileSync(path.join(ajvRefsDir, 'schema.json'), 'utf8'));
  ajv.addSchema(mainMeta);
}

function validateSchemaFile(ajv, filePath, label) {
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const valid = ajv.validateSchema(schema);
  if (!valid) {
    console.error(`❌ ${label}: Schema validation failed`);
    console.error(JSON.stringify(ajv.errors, null, 2));
    return false;
  }
  console.log(`✅ ${label}`);
  return true;
}

try {
  // validateSchema: false when adding refs so we can load the draft 2020-12 meta-schema
  // (it has circular refs). validateSchema(ourSchema) still validates our schemas against it.
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: false
  });
  addFormats(ajv);
  addMetaSchema(ajv);

  let ok = true;

  // 1. Validate manifest first (no $ref to other schemas)
  if (!validateSchemaFile(ajv, manifestPath, 'schemas/manifest.schema.json')) {
    ok = false;
  }

  // 2. Add manifest so registry's $ref can resolve, then validate registry
  const manifestSchema = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  ajv.addSchema(manifestSchema);

  if (!validateSchemaFile(ajv, registryPath, 'schemas/registry.schema.json')) {
    ok = false;
  }

  if (!ok) {
    process.exit(1);
  }

  console.log('\n✅ All schema files are valid.');
  process.exit(0);
} catch (error) {
  console.error('❌ Error validating schemas:', error.message);
  process.exit(1);
}
