#!/usr/bin/env bash
# Validate a plugin manifest against registry schema and optionally verify checksum.
# Usage: ./validate-manifest.sh <path-to-plugin.json>
set -e

MANIFEST="${1:-}"
SCHEMA="$(dirname "$0")/../schemas/manifest.schema.json"
# Validate plugin.json against manifest schema

if [ -z "$MANIFEST" ] || [ ! -f "$MANIFEST" ]; then
  echo "Usage: $0 <path-to-plugin.json>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Validating manifest against schema..."
MANIFEST_PATH="$MANIFEST" ROOT="$ROOT" node -e "
const fs = require('fs');
const path = require('path');
const schemaPath = path.join(process.env.ROOT, 'schemas', 'manifest.schema.json');
const manifestPath = process.env.MANIFEST_PATH;
const raw = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const pluginSchema = { ...raw };
delete pluginSchema['\$schema'];
delete pluginSchema['\$id'];
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ validateSchema: false });
addFormats(ajv);
const validate = ajv.compile(pluginSchema);
const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!validate(data)) {
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}
console.log('Schema OK');
" || exit 1

# If distribution.url and checksums.sha256 exist, verify checksum
URL=$(jq -r '.distribution.url // empty' "$MANIFEST" 2>/dev/null) || true
if [ -n "$URL" ]; then
  EXPECTED=$(jq -r '.distribution.checksums.sha256 // empty' "$MANIFEST" 2>/dev/null) || true
  if [ -n "$EXPECTED" ]; then
    echo "Verifying checksum..."
    curl -sfL "$URL" -o /tmp/plugin_verify.bin || { echo "Failed to download"; exit 1; }
    ACTUAL=$(sha256sum /tmp/plugin_verify.bin 2>/dev/null | cut -d' ' -f1 || openssl dgst -sha256 /tmp/plugin_verify.bin 2>/dev/null | awk '{print $2}')
    rm -f /tmp/plugin_verify.bin
    if [ "$EXPECTED" != "$ACTUAL" ]; then
      echo "Checksum mismatch. Expected: $EXPECTED, Actual: $ACTUAL"
      exit 1
    fi
    echo "Checksum OK"
  fi
fi

echo "Manifest is valid."
