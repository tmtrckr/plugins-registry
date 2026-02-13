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

**Quick steps:**
1. Normalize your author name (lowercase, spaces → hyphens)
2. Create directory: `plugins/{first-letter}/{normalized-author}/{plugin-id}/{version}/`
3. Add `plugin.json` file with required fields
4. Submit a pull request

**Example:**
- Author: "John Doe" → normalized: "john-doe" → first letter: `j`
- Plugin ID: `jira-integration`
- Version: `1.0.0`
- Path: `plugins/j/john-doe/jira-integration/1.0.0/plugin.json`

**Important:**
- `id` in `plugin.json` must match the plugin directory name
- `author` in `plugin.json` must normalize to the author directory name
- `latest_version` must match the version directory name

👉 **For detailed instructions and examples, see [CONTRIBUTING.md](../CONTRIBUTING.md)**

## Example

See `d/developer-name/example-plugin/1.0.0/plugin.json` for a complete example.
