#!/usr/bin/env node

/**
 * Interactive script to create a new plugin entry structure
 * Usage: npm run create-plugin
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const schemaPath = path.join(__dirname, '..', 'registry.schema.json');

// Normalize author name for directory
function normalizeAuthorName(author) {
  return author.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

// Validate plugin ID format
function validatePluginId(id) {
  return /^[a-z0-9-]+$/.test(id) && id.length >= 1 && id.length <= 50;
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

async function createPlugin() {
  console.log('🚀 Time Tracker Plugin Registry - Create Plugin Entry\n');
  console.log('This script will help you create a plugin entry structure.\n');

  try {
    // Get plugin information
    const pluginId = await question('Plugin ID (lowercase, alphanumeric with hyphens): ');
    if (!validatePluginId(pluginId)) {
      console.error('❌ Invalid plugin ID. Must be lowercase, alphanumeric with hyphens only.');
      process.exit(1);
    }

    const pluginName = await question('Plugin Name (display name): ');
    if (!pluginName || pluginName.length > 100) {
      console.error('❌ Plugin name is required and must be max 100 characters.');
      process.exit(1);
    }

    const author = await question('Author Name: ');
    if (!author || author.trim() === '') {
      console.error('❌ Author name is required.');
      process.exit(1);
    }

    const normalizedAuthor = normalizeAuthorName(author);
    console.log(`\n📝 Normalized author name: "${normalizedAuthor}"`);

    const repository = await question('GitHub Repository URL: ');
    if (!repository || !repository.startsWith('https://github.com/')) {
      console.error('❌ Repository must be a valid GitHub URL.');
      process.exit(1);
    }

    const latestVersion = await question('Latest Version (semver, e.g., 1.0.0): ');
    if (!latestVersion || !/^\d+\.\d+\.\d+/.test(latestVersion)) {
      console.error('❌ Version must be in semver format (e.g., 1.0.0).');
      process.exit(1);
    }

    const description = await question('Description (10-500 characters): ');
    if (!description || description.length < 10 || description.length > 500) {
      console.error('❌ Description must be 10-500 characters.');
      process.exit(1);
    }

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

    // Create directory structure
    const authorDir = path.join(pluginsDir, normalizedAuthor);
    const pluginDir = path.join(authorDir, pluginId);
    const pluginJsonPath = path.join(pluginDir, 'plugin.json');

    // Check if plugin already exists
    if (fs.existsSync(pluginJsonPath)) {
      console.error(`❌ Plugin already exists at ${normalizedAuthor}/${pluginId}/`);
      process.exit(1);
    }

    // Create directories
    fs.mkdirSync(pluginDir, { recursive: true });

    // Create plugin.json
    const pluginJson = {
      "$schema": "../../../registry.schema.json#/properties/plugins/items",
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
    console.log(`\n📁 Location: plugins/${normalizedAuthor}/${pluginId}/plugin.json`);
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
