#!/usr/bin/env node

/**
 * Interactive script to create a new plugin entry structure
 * Usage: npm run create-plugin
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const schemaPath = path.join(__dirname, '..', 'schemas', 'manifest.schema.json');

// Normalize author name for directory
function normalizeAuthorName(author) {
  return author.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

// Generate plugin ID from plugin name
function generatePluginId(pluginName) {
  return pluginName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Ask question with validation and retry on error
async function askWithValidation(prompt, validator, errorMessage) {
  while (true) {
    const answer = await question(prompt);
    const validation = validator(answer);
    if (validation.valid) {
      return validation.value !== undefined ? validation.value : answer;
    }
    console.error(`❌ ${errorMessage || validation.error || 'Invalid input'}`);
    console.log('   Please try again.\n');
  }
}

async function createPlugin() {
  console.log('🚀 Time Tracker Plugin Registry - Create Plugin Entry\n');
  console.log('This script will help you create a plugin entry structure.\n');

  try {
    // Get plugin information
    const pluginName = await askWithValidation(
      'Plugin Name (display name): ',
      (value) => {
        if (!value || value.trim() === '') {
          return { valid: false, error: 'Plugin name is required.' };
        }
        if (value.length > 100) {
          return { valid: false, error: 'Plugin name must be max 100 characters.' };
        }
        return { valid: true };
      }
    );

    // Generate plugin ID from plugin name
    const pluginId = generatePluginId(pluginName);
    if (!pluginId || pluginId.length === 0) {
      console.error('❌ Could not generate valid plugin ID from plugin name.');
      rl.close();
      process.exit(1);
    }
    console.log(`\n📝 Generated plugin ID: "${pluginId}"`);

    const author = await askWithValidation(
      'Author Name: ',
      (value) => {
        if (!value || value.trim() === '') {
          return { valid: false, error: 'Author name is required.' };
        }
        return { valid: true };
      }
    );

    const normalizedAuthor = normalizeAuthorName(author);
    console.log(`\n📝 Normalized author name: "${normalizedAuthor}"`);

    const repository = await askWithValidation(
      'GitHub Repository URL: ',
      (value) => {
        if (!value || !value.startsWith('https://github.com/')) {
          return { valid: false, error: 'Repository must be a valid GitHub URL (starting with https://github.com/).' };
        }
        return { valid: true };
      }
    );

    const latestVersion = await askWithValidation(
      'Latest Version (semver, e.g., 1.0.0): ',
      (value) => {
        if (!value || !/^\d+\.\d+\.\d+/.test(value)) {
          return { valid: false, error: 'Version must be in semver format (e.g., 1.0.0).' };
        }
        return { valid: true };
      }
    );

    const description = await askWithValidation(
      'Description (10-500 characters): ',
      (value) => {
        if (!value || value.length < 10) {
          return { valid: false, error: 'Description must be at least 10 characters.' };
        }
        if (value.length > 500) {
          return { valid: false, error: 'Description must be max 500 characters.' };
        }
        return { valid: true };
      }
    );

    console.log('\n📋 Categories:');
    console.log('  1. integration');
    console.log('  2. productivity');
    console.log('  3. reporting');
    console.log('  4. automation');
    console.log('  5. export');
    console.log('  6. import');
    console.log('  7. ui');
    console.log('  8. other');
    const categoryChoice = await question('Category (1-8, default: 8): ');
    const categories = ['integration', 'productivity', 'reporting', 'automation', 'export', 'import', 'ui', 'other'];
    const category = categories[parseInt(categoryChoice) - 1] || 'other';

    const tagsInput = await question('Tags (comma-separated, e.g., calendar,sync,google): ');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);

    const license = await question('License (SPDX identifier, default: MIT): ') || 'MIT';

    const minCoreVersion = await question('Minimum Time Tracker Version (e.g., 0.3.0): ') || '0.3.0';
    const maxCoreVersion = await question('Maximum Time Tracker Version (e.g., 1.0.0): ') || '1.0.0';
    const apiVersion = await question('Plugin API Version (e.g., 1.0): ') || '1.0';

    const homepage = await question('Homepage URL (optional, press Enter to skip): ') || repository;
    const icon = await question('Icon URL (optional, press Enter to skip): ') || '';

    // Hierarchical structure: plugins/{first-letter}/{author}/{plugin-id}/{version}/
    const firstLetter = normalizedAuthor[0] || 'other';
    const pluginDir = path.join(pluginsDir, firstLetter, normalizedAuthor, pluginId, latestVersion);
    const pluginJsonPath = path.join(pluginDir, 'plugin.json');

    if (fs.existsSync(pluginJsonPath)) {
      console.error(`\n❌ Plugin version already exists at ${firstLetter}/${normalizedAuthor}/${pluginId}/${latestVersion}/`);
      console.error('   Please use a different version or plugin name.');
      rl.close();
      process.exit(1);
    }

    fs.mkdirSync(pluginDir, { recursive: true });

    const pluginJson = {
      "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/manifest.schema.json",
      "id": pluginId,
      "name": pluginName,
      "author": author,
      "repository": repository,
      "latest_version": latestVersion,
      "description": description,
      "category": category,
      "verified": false,
      "downloads": 0,
      "tags": tags,
      "license": license,
      "min_core_version": minCoreVersion,
      "max_core_version": maxCoreVersion,
      "api_version": apiVersion
    };

    if (homepage && homepage !== repository) {
      pluginJson.homepage = homepage;
    }

    if (icon) {
      pluginJson.icon = icon;
    }

    fs.writeFileSync(
      pluginJsonPath,
      JSON.stringify(pluginJson, null, 2) + '\n',
      'utf8'
    );

    console.log('\n✅ Plugin entry created successfully!');
    console.log(`\n📁 Location: plugins/${firstLetter}/${normalizedAuthor}/${pluginId}/${latestVersion}/plugin.json`);
    console.log('\n📝 Next steps:');
    console.log('  1. Review the created plugin.json file');
    console.log('  2. Run: npm run validate-all');
    console.log('  3. Run: npm run build');
    console.log('  4. Commit and create a Pull Request');
    console.log('\n💡 Tip: You can add icon.png, screenshot.png, or README.md to the plugin directory.');

    rl.close();
  } catch (error) {
    console.error('❌ Error creating plugin:', error.message);
    rl.close();
    process.exit(1);
  }
}

createPlugin();
