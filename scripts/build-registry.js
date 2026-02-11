#!/usr/bin/env node

/**
 * Builds registry.json from plugin.json files in hierarchical structure:
 * plugins/{first-letter}/{author}/{plugin-id}/{version}/plugin.json
 */

const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const registryPath = path.join(__dirname, '..', 'registry.json');

const SEMVER_DIR = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/;

function normalizeAuthorName(author) {
  return (author || '').toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

function findPluginFiles(dir, relPath = '') {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  const pluginJsonPath = path.join(dir, 'plugin.json');
  if (fs.existsSync(pluginJsonPath)) {
    found.push({ dir, relPath: relPath || path.basename(dir) });
    return found;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      const fullPath = path.join(dir, entry.name);
      const nextRel = relPath ? path.join(relPath, entry.name) : entry.name;
      found.push(...findPluginFiles(fullPath, nextRel));
    }
  }
  return found;
}

function parseVersion(v) {
  const match = (v || '').match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)] : [0, 0, 0];
}

function compareVersions(a, b) {
  const va = parseVersion(a), vb = parseVersion(b);
  for (let i = 0; i < 3; i++) {
    if (va[i] !== vb[i]) return va[i] - vb[i];
  }
  return 0;
}

try {
  if (!fs.existsSync(pluginsDir)) {
    const registry = {
      "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/registry.schema.json",
      "version": "1.0.0",
      "last_updated": new Date().toISOString(),
      "plugins": [],
      "statistics": { total_plugins: 0, total_versions: 0, total_authors: 0 }
    };
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
    console.log('⚠️  plugins/ directory not found, created empty registry');
    process.exit(0);
  }

  const allFiles = findPluginFiles(pluginsDir);
  const segments = (p) => p.split(path.sep).filter(Boolean);
  const errors = [];
  const byKey = new Map(); // key -> { pluginData (latest), versions: string[], path: string }

  for (const { dir, relPath } of allFiles) {
    const pluginJsonPath = path.join(dir, 'plugin.json');
    if (!fs.existsSync(pluginJsonPath)) continue;
    const parts = segments(relPath);
    const isValidHierarchy = parts.length === 4 && SEMVER_DIR.test(parts[3]);
    if (!isValidHierarchy) {
      errors.push(`Invalid path (expected plugins/{letter}/{author}/{plugin-id}/{version}/): ${relPath}`);
      continue;
    }
    const [letter, authorDir, pluginId, versionDir] = parts;
    const pluginPath = path.join('plugins', parts.slice(0, 3).join(path.sep)).replace(/\\/g, '/');
    let pluginData;
    try {
      pluginData = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    } catch (e) {
      errors.push(`Error parsing ${relPath}/plugin.json: ${e.message}`);
      continue;
    }
    if (!pluginData.author || pluginData.author.trim() === '') {
      errors.push(`Plugin "${pluginData.id}" is missing required "author" field`);
      continue;
    }
    const normalizedAuthor = normalizeAuthorName(pluginData.author);
    if (pluginData.id !== pluginId) {
      errors.push(`Plugin ID "${pluginData.id}" in ${relPath} doesn't match directory "${pluginId}"`);
      continue;
    }
    if (normalizedAuthor !== authorDir) {
      errors.push(`Plugin "${pluginData.id}" author (normalized: "${normalizedAuthor}") doesn't match directory "${authorDir}"`);
      continue;
    }
    const firstLetter = normalizedAuthor[0] || 'other';
    if (firstLetter !== letter) {
      errors.push(`Plugin "${pluginData.id}" author "${normalizedAuthor}" should be under letter "${firstLetter}", not "${letter}"`);
      continue;
    }
    const key = normalizedAuthor + '/' + pluginData.id;
    const version = pluginData.latest_version || versionDir;
    let entry = byKey.get(key);
    if (!entry) {
      entry = { pluginData: null, versions: [], path: pluginPath };
      byKey.set(key, entry);
    }
    if (!entry.versions.includes(versionDir)) {
      entry.versions.push(versionDir);
    }
    if (!entry.pluginData || compareVersions(version, entry.pluginData.latest_version || '0.0.0') > 0) {
      entry.pluginData = { ...pluginData, latest_version: version };
    }
  }

  if (errors.length > 0) {
    console.error('❌ Errors found:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  const authorSet = new Set();
  const pluginsWithMeta = Array.from(byKey.entries()).map(([key, entry]) => {
    entry.versions.sort(compareVersions);
    authorSet.add(normalizeAuthorName(entry.pluginData.author));
    return {
      ...entry.pluginData,
      versions: entry.versions,
      path: entry.path
    };
  });
  const sortedPlugins = pluginsWithMeta.sort((a, b) => a.id.localeCompare(b.id));
  const totalVersions = sortedPlugins.reduce((sum, p) => sum + (p.versions ? p.versions.length : 0), 0);
  const statistics = {
    total_plugins: sortedPlugins.length,
    total_versions: totalVersions,
    total_authors: authorSet.size
  };

  let lastUpdated = new Date().toISOString();
  if (fs.existsSync(registryPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (JSON.stringify(existing.plugins || []) === JSON.stringify(sortedPlugins) && existing.last_updated) {
        lastUpdated = existing.last_updated;
      }
    } catch (_) {}
  }

  const registry = {
    "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/registry.schema.json",
    "version": "1.0.0",
    "last_updated": lastUpdated,
    "plugins": sortedPlugins,
    "statistics": statistics
  };
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
  console.log('✅ Registry built successfully!');
  console.log(`   Found ${sortedPlugins.length} plugin(s), ${totalVersions} version(s), ${authorSet.size} author(s)`);
  process.exit(0);
} catch (error) {
  console.error('❌ Error building registry:', error.message);
  process.exit(1);
}
