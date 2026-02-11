#!/usr/bin/env node

/**
 * Validates plugin.json files in hierarchical structure only:
 * plugins/{first-letter}/{author}/{plugin-id}/{version}/plugin.json
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const schemaPath = path.join(__dirname, '..', 'schemas', 'manifest.schema.json');

const SEMVER_DIR = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/;

function normalizeAuthorName(author) {
  return (author || '').toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

function findAndValidate(dir, pathSegments, validateFn) {
  let errors = 0;
  let validated = 0;
  if (!fs.existsSync(dir)) return { errors, validated };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const pluginJsonPath = path.join(fullPath, 'plugin.json');
    const segs = [...pathSegments, entry.name];

    if (fs.existsSync(pluginJsonPath)) {
      const pluginPath = segs.join('/');
      if (segs.length !== 4 || !SEMVER_DIR.test(segs[3])) {
        console.error(`❌ ${pluginPath}/: Invalid path. Expected plugins/{letter}/{author}/{plugin-id}/{version}/`);
        errors++;
        continue;
      }
      const [letter, authorDir, pluginId, versionDir] = segs;
      try {
        const pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
        if (pluginData.id !== pluginId) {
          console.error(`❌ ${pluginPath}/: ID "${pluginData.id}" doesn't match directory "${pluginId}"`);
          errors++;
          continue;
        }
        if (!pluginData.author || pluginData.author.trim() === '') {
          console.error(`❌ ${pluginPath}/plugin.json: Missing required "author" field`);
          errors++;
          continue;
        }
        const normalizedAuthor = normalizeAuthorName(pluginData.author);
        if (normalizedAuthor !== authorDir) {
          console.error(`❌ ${pluginPath}/plugin.json: Author (normalized: "${normalizedAuthor}") doesn't match directory "${authorDir}"`);
          errors++;
          continue;
        }
        const firstLetter = normalizedAuthor[0] || 'other';
        if (firstLetter !== letter) {
          console.error(`❌ ${pluginPath}/plugin.json: Author should be under letter "${firstLetter}", not "${letter}"`);
          errors++;
          continue;
        }
        const valid = validateFn(pluginData);
        if (!valid) {
          console.error(`❌ ${pluginPath}/plugin.json: Schema validation failed`);
          validateFn.errors.forEach(err => {
            console.error(`   - ${err.instancePath || err.schemaPath}: ${err.message}`);
          });
          errors++;
        } else {
          console.log(`✅ ${pluginPath}/plugin.json`);
          validated++;
        }
      } catch (e) {
        console.error(`❌ ${pluginPath}/plugin.json: ${e.message}`);
        errors++;
      }
    } else {
      const result = findAndValidate(fullPath, segs, validateFn);
      errors += result.errors;
      validated += result.validated;
    }
  }
  return { errors, validated };
}

try {
  if (!fs.existsSync(pluginsDir)) {
    console.log('⚠️  plugins/ directory not found');
    process.exit(0);
  }
  const rawSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const pluginSchema = { ...rawSchema };
  delete pluginSchema.$schema;
  delete pluginSchema.$id;
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);
  const validate = ajv.compile(pluginSchema);

  const { errors, validated } = findAndValidate(pluginsDir, [], validate);
  console.log(`\n📊 Validation summary: ${validated} passed, ${errors} failed`);
  if (errors > 0) process.exit(1);
  console.log(`\n✅ All ${validated} plugin(s) validated successfully!`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error validating plugins:', error.message);
  process.exit(1);
}
