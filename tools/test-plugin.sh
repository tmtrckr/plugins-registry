#!/usr/bin/env bash
# Basic test for a plugin: validate manifest and optionally run in container.
# Usage: ./test-plugin.sh <path-to-plugin.json>
# Requires Docker for isolated test (optional).
set -e

MANIFEST="${1:-}"
if [ -z "$MANIFEST" ] || [ ! -f "$MANIFEST" ]; then
  echo "Usage: $0 <path-to-plugin.json>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Testing plugin manifest: $MANIFEST"
"$(dirname "$0")/validate-manifest.sh" "$MANIFEST"

# If Docker is available and plugin has repository, could run:
# docker run -it --rm -v "$ROOT:/workspace" -w /workspace node:18 npm run validate-plugins
echo "Plugin validation passed."
