const path = require('path');
const fs = require('fs');

module.exports = async function test(args) {
  const manifestPath = args[0];
  if (!manifestPath || !fs.existsSync(path.resolve(process.cwd(), manifestPath))) {
    console.error('Usage: tmtrckr-registry test <path-to-plugin.json>');
    console.error('Example: tmtrckr-registry test plugins/developer-name/example-plugin/plugin.json');
    return () => process.exit(1);
  }
  const validateScript = path.join(process.cwd(), 'scripts', 'validate-plugins.js');
  if (!fs.existsSync(validateScript)) {
    console.error('Run this from the registry repository root.');
    return () => process.exit(1);
  }
  const { execSync } = require('child_process');
  execSync(`node "${validateScript}"`, { stdio: 'inherit' });
  return () => {};
};
