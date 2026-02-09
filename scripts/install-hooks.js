#!/usr/bin/env node

/**
 * Install git hooks for the repository
 */

const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
const preCommitHook = path.join(hooksDir, 'pre-commit');
const preCommitExample = path.join(__dirname, 'pre-commit.example');

try {
  // Check if .git/hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    console.error('❌ .git/hooks directory not found. Are you in a git repository?');
    process.exit(1);
  }

  // Check if pre-commit.example exists
  if (!fs.existsSync(preCommitExample)) {
    console.error('❌ pre-commit.example not found');
    process.exit(1);
  }

  // Copy example to actual hook
  const hookContent = fs.readFileSync(preCommitExample, 'utf8');
  fs.writeFileSync(preCommitHook, hookContent, 'utf8');

  // Make executable (Unix-like systems)
  if (process.platform !== 'win32') {
    fs.chmodSync(preCommitHook, '755');
  }

  console.log('✅ Git hooks installed successfully!');
  console.log('   Pre-commit hook will validate plugins before each commit.');
} catch (error) {
  console.error('❌ Error installing hooks:', error.message);
  process.exit(1);
}
