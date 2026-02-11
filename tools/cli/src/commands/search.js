const path = require('path');
const fs = require('fs');

module.exports = async function search(args) {
  const query = (args[0] || '').toLowerCase();
  const registryPath = path.join(process.cwd(), 'registry.json');
  if (!fs.existsSync(registryPath)) {
    console.error('Run npm run build first.');
    return () => process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const plugins = data.plugins || [];
  const filtered = query
    ? plugins.filter(p =>
        (p.id && p.id.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(query)))
      )
    : plugins;
  if (filtered.length === 0) {
    console.log(query ? `No plugins matching "${query}".` : 'No plugins in registry.');
    return () => {};
  }
  filtered.forEach(p => {
    console.log(`${p.id} (${p.latest_version || p.version || '-'}) - ${p.name}`);
    if (p.description) console.log('  ' + p.description.slice(0, 80) + (p.description.length > 80 ? '...' : ''));
  });
  return () => {};
};
