# Time Tracker Plugins Registry

[![GitHub license](https://img.shields.io/github/license/tmtrckr/plugins-registry)](LICENSE)
[![Validate Registry](https://github.com/tmtrckr/plugins-registry/actions/workflows/validate-registry.yml/badge.svg)](https://github.com/tmtrckr/plugins-registry/actions)

Community-driven registry for Time Tracker application plugins. This repository maintains a list of available plugins that can be discovered and installed through the Time Tracker Marketplace.

## Statistics

- **Total Plugins:** See [registry.json](registry.json) for current counts
- **Registry:** [registry.json](registry.json) is automatically built from `plugins/` by CI after PRs are merged

## Overview

The registry uses a **folder-based structure** where each plugin has its own directory in `plugins/`. The `registry.json` file is automatically generated from these individual plugin files. The Time Tracker application uses this registry to:

- Discover available plugins
- Display plugin information in the Marketplace UI
- Verify plugin compatibility
- Track plugin popularity

## Registry Structure

### Folder Structure

Plugins use a **hierarchical structure** partitioned by the first letter of the author name, then author, plugin id, and version:

```
plugins/
├── d/                              # First letter of normalized author
│   └── developer-name/
│       └── example-plugin/
│           ├── 1.0.0/
│           │   ├── plugin.json     # Plugin metadata for this version
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

**Path rule:** `plugins/{first-letter}/{normalized-author}/{plugin-id}/{version}/plugin.json`

**Important:**
- **First letter** is the first character of the normalized author name (e.g. `developer-name` → `d`).
- **Normalized author**: lowercase, spaces → hyphens, special characters removed.
- **Plugin directory** name must match the `id` field in `plugin.json`.
- **Version** directory must be semver (e.g. `1.0.0`). Multiple versions per plugin are supported.
- The `author` field in `plugin.json` is **required** and must normalize to the author directory name.

The `registry.json` file is automatically built from these plugin files by CI (latest version per plugin is used).

### Plugin Metadata Schema

Each plugin's `plugin.json` follows the schema defined in `schemas/manifest.schema.json`. Each plugin entry includes:

- **id**: Unique identifier (lowercase, alphanumeric with hyphens)
- **name**: Display name
- **author**: Plugin author
- **repository**: GitHub repository URL
- **latest_version**: Latest available version (semver)
- **description**: Plugin description
- **category**: Plugin category (integration, productivity, reporting, etc.)
- **verified**: Whether verified by registry maintainers
- **downloads**: Total download count
- **tags**: Searchable tags
- **icon**: URL to plugin icon
- **homepage**: Plugin homepage URL
- **license**: Plugin license (SPDX identifier)
- **min_core_version**: Minimum required Time Tracker version
- **max_core_version**: Maximum compatible Time Tracker version
- **api_version**: Plugin API version

## Adding a Plugin

### 🚀 Quick Start (3 Simple Steps)

**Step 1: Fork and Clone**
```bash
# 1. Fork this repository on GitHub (click "Fork" button)
# 2. Clone your fork:
git clone https://github.com/your-username/plugins-registry.git
cd plugins-registry
```

**Step 2: Create Plugin Entry**

**Option A: Interactive Script (Easiest)**
```bash
npm install
npm run create-plugin
```
The script will guide you through everything and create the correct structure automatically.

**Option B: Manual Creation**
1. Create directory: `plugins/{first-letter}/{author}/{plugin-id}/{version}/`
   - Example: `plugins/j/john-doe/jira-integration/1.0.0/`
2. Create `plugin.json` file in that directory (see example below)

**Step 3: Submit Pull Request**
```bash
git add plugins/j/john-doe/jira-integration/1.0.0/plugin.json
git commit -s -m "Add plugin: jira-integration"
git push origin main
# Then create a Pull Request on GitHub
```

That's it! CI will automatically validate your plugin and build the registry after your PR is merged.

### 📝 Example: Adding "Jira Integration" Plugin

**Author:** John Doe  
**Plugin ID:** jira-integration  
**Version:** 1.0.0

**1. Create the directory:**
```bash
mkdir -p plugins/j/john-doe/jira-integration/1.0.0
```

**2. Create `plugins/j/john-doe/jira-integration/1.0.0/plugin.json`:**
```json
{
  "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/manifest.schema.json",
  "id": "jira-integration",
  "name": "Jira Integration",
  "author": "John Doe",
  "repository": "https://github.com/johndoe/jira-integration",
  "latest_version": "1.0.0",
  "description": "Sync time entries with Jira tickets",
  "category": "integration",
  "verified": false,
  "downloads": 0,
  "tags": ["jira", "sync", "integration"],
  "license": "MIT",
  "min_core_version": "0.3.0",
  "max_core_version": "1.0.0",
  "api_version": "1.0"
}
```

**3. Commit and create PR:**
```bash
git add plugins/j/john-doe/jira-integration/1.0.0/plugin.json
git commit -s -m "Add plugin: jira-integration"
git push
```

### 📋 Understanding the Path Structure

The path follows this pattern: `plugins/{first-letter}/{author}/{plugin-id}/{version}/`

**Visual Example:**
```
plugins/
└── j/                          ← First letter of "john-doe"
    └── john-doe/               ← Normalized author name
        └── jira-integration/   ← Plugin ID
            └── 1.0.0/          ← Version
                └── plugin.json ← Your plugin file
```

**How to determine each part:**

| Part | How to Get It | Example |
|------|---------------|---------|
| **First letter** | First character of normalized author | "John Doe" → "john-doe" → `j` |
| **Author** | Normalize: lowercase, spaces→hyphens | "John Doe" → `john-doe` |
| **Plugin ID** | Your plugin identifier (lowercase, hyphens) | `jira-integration` |
| **Version** | Semantic version number | `1.0.0` |

**⚠️ Important rules:**
- `id` in `plugin.json` must match the plugin directory name
- `author` in `plugin.json` must normalize to the author directory name
- `latest_version` must match the version directory name

> 💡 **Need help?** See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions and FAQ.

### Plugin Requirements

- Plugin must be hosted on GitHub
- Repository must have a `plugin.toml` manifest file
- Plugin must follow the [Plugin Template](https://github.com/tmtrckr/plugin-template) structure
- Plugin must have at least one GitHub Release with compiled binaries

### Example Plugin Entry

For a plugin with author "Developer Name" and ID "example-plugin":

**Directory structure:**
```
plugins/
  d/                      # First letter of normalized author
    developer-name/
      example-plugin/     # Plugin ID
        1.0.0/           # Version (semver)
          plugin.json
```

**plugin.json:**
```json
{
  "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/manifest.schema.json",
  "id": "example-plugin",
  "name": "Example Plugin",
  "author": "Developer Name",
  "repository": "https://github.com/user/plugin-example",
  "latest_version": "1.0.0",
  "description": "This is an example plugin for the Time Tracker plugins registry",
  "category": "integration",
  "verified": false,
  "downloads": 0,
  "tags": ["example", "plugin", "time-tracker"],
  "license": "MIT",
  "min_core_version": "0.3.0",
  "max_core_version": "1.0.0",
  "api_version": "1.0"
}
```

**Note**: The `author` field "Developer Name" normalizes to "developer-name"; the first letter is `d`, so the path is `plugins/d/developer-name/example-plugin/1.0.0/`.

## Registry Validation

The registry is validated against `schemas/registry.schema.json` (which references `schemas/manifest.schema.json` for plugin entries) and the hierarchical layout:

- All required fields are present (including `author`)
- Field formats are correct (URLs, versions, etc.)
- No duplicate `{author}/{plugin-id}` combinations
- Path is `plugins/{letter}/{author}/{plugin-id}/{version}/` with semver version
- Author and plugin directory names match normalized author and `id` from `plugin.json`
- Repository URLs are valid GitHub repositories

## Verification Process

Plugins can be marked as `verified: true` by registry maintainers after:

- Code review of the plugin repository
- Verification of plugin.toml manifest
- Testing plugin installation and functionality
- Confirming license compatibility

## Plugin Discovery

The Time Tracker application discovers plugins through:

1. **Registry**: Plugins listed in this registry (default)
2. **Direct URL**: Users can install plugins directly by providing a GitHub repository URL
3. **Search**: Search functionality filters plugins by name, description, tags, and category

## Versioning

- Registry version follows semantic versioning
- Plugin versions follow semantic versioning
- Registry updates are tracked via `last_updated` timestamp

## Local Development

**Note**: This section covers commands for repository maintainers. Plugin contributors don't need to run any commands locally - CI handles validation and registry building automatically.

### Setup

```bash
npm install
```

### Creating a Plugin Entry

Use the interactive script to create a new plugin entry:

```bash
npm run create-plugin
```

This will guide you through all required fields and create the correct directory structure.

### Building the Registry

**Note**: Plugin contributors don't need to build the registry - CI does this automatically. The commands below are for repository maintainers.

Build `registry.json` from individual plugin files:

```bash
npm run build
```

**Note**: The `build` script generates/updates `registry.json`. Use `npm run validate` to check an existing `registry.json` without modifying it.

### Validation

**For plugin contributors**: CI automatically validates your plugin.json when you submit a PR. No local validation is required.

**For repository maintainers**: Full validation commands:

```bash
npm run validate-schemas
```

Validate individual plugin files:

```bash
npm run validate-plugins
```

Validate the aggregated registry (requires registry.json to exist - run `npm run build` first):

```bash
npm run validate
```

Validate existing files (schemas, plugins, and registry.json if present):

```bash
npm run validate-files
```

This runs: `validate-schemas` → `validate-plugins` → `validate` (skips registry validation if registry.json doesn't exist). Note: This does not build the registry - run `npm run build` first if you need to generate registry.json.

Check for duplicate plugin IDs:

```bash
npm run check-duplicates
```

Format the registry (sorts plugins and updates timestamp):

```bash
npm run format
```

### Git Hooks (Optional)

Install pre-commit hooks to automatically validate plugins before committing:

```bash
npm run install-hooks
```

This will validate plugin files before each commit. CI handles registry building automatically, so this is optional.

### Example Plugin Entry

See `plugins/d/developer-name/example-plugin/1.0.0/plugin.json` for a complete example.

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) – How to add a plugin and contribute
- [SECURITY.md](SECURITY.md) – Security policy and reporting
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) – Community standards
- [GOVERNANCE.md](GOVERNANCE.md) – Roles and decision making
- [docs/COMMUNITY.md](docs/COMMUNITY.md) – GitHub Discussions and community channels

## Contributing

Contributions are welcome! Please:

1. Follow the JSON schema
2. Ensure all URLs are valid
3. Provide clear descriptions
4. Use appropriate categories and tags
5. Sign off commits (DCO): `git commit -s -m "message"` (requires valid email - see [CONTRIBUTING.md](CONTRIBUTING.md#developer-certificate-of-origin-dco))

### Ways to Contribute

- **Add a Plugin**: Use `npm run create-plugin` (after `npm install`) or follow the [manual process](CONTRIBUTING.md)
- **Request a Plugin**: Create an [issue using the plugin submission template](.github/ISSUE_TEMPLATE/plugin_submission.yml)
- **Report Issues**: Open an issue for [bugs](.github/ISSUE_TEMPLATE/bug_report.yml) or [features](.github/ISSUE_TEMPLATE/feature_request.yml)
- **Improve Documentation**: Submit PRs to improve docs

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This registry is maintained by the Time Tracker community. Plugin entries are provided by plugin authors and are subject to their respective licenses.

## Community

- Use [GitHub Discussions](https://github.com/tmtrckr/plugins-registry/discussions) for questions and ideas (enable in repo Settings → Features if not yet available).
- See [docs/COMMUNITY.md](docs/COMMUNITY.md) for maintainer setup and channels.

## Related Projects

- [Time Tracker App](https://github.com/tmtrckr/time-tracker-app) - Main application
- [Plugin Template](https://github.com/tmtrckr/plugin-template) - Template for creating plugins
