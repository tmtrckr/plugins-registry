#!/usr/bin/env node

const [,, cmd, ...args] = process.argv;
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../..');
process.chdir(repoRoot);

const commands = {
  create: () => require('./commands/create.js'),
  validate: () => require('./commands/validate.js'),
  test: () => require('./commands/test.js'),
  search: () => require('./commands/search.js')
};

const c = commands[cmd];
if (!c) {
  console.error('Usage: tmtrckr-registry <create|validate|test|search> [args]');
  console.error('  create   - Interactive plugin manifest creation');
  console.error('  validate - Validate manifest(s) against schema');
  console.error('  test     - Run basic tests for a plugin');
  console.error('  search   - Search plugins in registry/index');
  process.exit(1);
}

(async () => {
  const fn = c();
  await fn(args);
})().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
