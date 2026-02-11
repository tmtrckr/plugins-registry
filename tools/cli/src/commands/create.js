const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

function normalizeAuthor(author) {
  return author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
}

module.exports = async function create(args) {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'Plugin ID (lowercase, hyphens):', validate: (v) => /^[a-z0-9-]+$/.test(v) || 'Use only lowercase letters, numbers, hyphens' },
    { type: 'input', name: 'name', message: 'Display name:' },
    { type: 'input', name: 'author', message: 'Author name:' },
    { type: 'input', name: 'latest_version', message: 'Version (semver):', default: '1.0.0', validate: (v) => /^\d+\.\d+\.\d+/.test(v) || 'Use semver (e.g. 1.0.0)' },
    { type: 'input', name: 'description', message: 'Short description (10-500 chars):', validate: (v) => v.length >= 10 && v.length <= 500 || '10-500 characters' },
    { type: 'input', name: 'repository', message: 'GitHub repository URL:', validate: (v) => /^https:\/\/github\.com\/[^/]+\/[^/]+/.test(v) || 'Must be a GitHub URL' },
    { type: 'list', name: 'category', message: 'Category:', choices: ['integration', 'productivity', 'reporting', 'automation', 'export', 'import', 'ui', 'other'], default: 'other' },
    { type: 'input', name: 'tags', message: 'Tags (comma-separated):', default: '' },
    { type: 'input', name: 'license', message: 'License (SPDX):', default: 'MIT' }
  ]);

  const normalizedAuthor = normalizeAuthor(answers.author);
  const firstLetter = normalizedAuthor[0] || 'other';
  const pluginsDir = path.join(process.cwd(), 'plugins');
  const pluginDir = path.join(pluginsDir, firstLetter, normalizedAuthor, answers.id, answers.latest_version);
  const pluginPath = path.join(pluginDir, 'plugin.json');
  const tags = answers.tags.split(',').map(t => t.trim()).filter(Boolean);

  const manifest = {
    $schema: 'https://github.com/tmtrckr/plugins-registry/schemas/manifest.schema.json',
    id: answers.id,
    name: answers.name,
    author: answers.author,
    repository: answers.repository.replace(/\/$/, ''),
    latest_version: answers.latest_version,
    description: answers.description,
    category: answers.category,
    verified: false,
    downloads: 0,
    tags: tags.length ? tags : [answers.id],
    license: answers.license,
    min_core_version: '0.3.0',
    max_core_version: '1.0.0',
    api_version: '1.0'
  };

  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(pluginPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('Created:', pluginPath);
  console.log('Next: npm run validate-all, then submit a PR.');
  return () => {};
};
