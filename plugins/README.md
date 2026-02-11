# Plugins Directory

Plugins are stored in a **hierarchical structure**: `plugins/{first-letter}/{author}/{plugin-id}/{version}/`.

## Directory Structure

```
plugins/
├── d/                              # First letter of normalized author
│   └── developer-name/
│       └── example-plugin/
│           ├── 1.0.0/
│           │   ├── plugin.json     # Required
│           │   └── README.md       # Optional
│           └── 1.1.0/
│               └── plugin.json
├── j/
│   └── john-doe/
│       └── jira-integration/
│           └── 1.0.0/
│               └── plugin.json
└── ...
```

## Rules

- **First letter**: First character of the normalized author name (e.g. `developer-name` → `d`).
- **Author normalization**: Lowercase, spaces → hyphens, remove special characters.
- **Plugin ID**: Directory name must match the `id` field in `plugin.json`.
- **Version**: Directory name must be semver (e.g. `1.0.0`). Multiple versions per plugin are allowed.
- **plugin.json**: Required in each version directory; must follow the registry schema.

## Adding a Plugin

1. Normalize your author name and determine the first letter.
2. Create `plugins/{letter}/{normalized-author}/{plugin-id}/{version}/`.
3. Add `plugin.json` with `id`, `author`, `latest_version` (matching the version directory), and other required fields.
4. Run `npm run validate-all` from the repository root.

## Example

See `d/developer-name/example-plugin/1.0.0/plugin.json` for a full example.
