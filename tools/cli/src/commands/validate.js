const path = require('path');
const fs = require('fs');

module.exports = async function validate(args) {
  const target = args[0] || 'plugins';
  const script = path.join(process.cwd(), 'scripts', 'validate-plugins.js');
  if (!fs.existsSync(script)) {
    console.error('Run this from the registry repository root.');
    return () => process.exit(1);
  }
  const { execSync } = require('child_process');
  execSync(`node "${script}"`, { stdio: 'inherit' });
  return () => {};
};
