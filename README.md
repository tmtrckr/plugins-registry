# Time Tracker Plugins Registry

Centralized registry for Time Tracker application plugins. This repository maintains a list of available plugins that can be discovered and installed through the Time Tracker Marketplace.

## Overview

The registry uses a **folder-based structure** where each plugin has its own directory in `plugins/`. The `registry.json` file is automatically generated from these individual plugin files. The Time Tracker application uses this registry to:

- Discover available plugins
- Display plugin information in the Marketplace UI
- Verify plugin compatibility
- Track plugin popularity

## Registry Structure

### Folder Structure

Each plugin has its own directory in `plugins/`:

```
plugins/
├── calendar-sync/
│   ├── plugin.json          # Plugin metadata
│   ├── icon.png             # Optional: Plugin icon
│   └── README.md            # Optional: Extended documentation
└── [other-plugins]/
    └── plugin.json
```

The `registry.json` file is automatically generated from these individual plugin files using `npm run build`.

### Plugin Metadata Schema

Each plugin's `plugin.json` follows the schema defined in `registry.schema.json`. Each plugin entry includes:

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

To add your plugin to the registry:

1. **Fork this repository**
2. **Create a new directory** in `plugins/` named after your plugin ID (e.g., `plugins/my-plugin/`)
3. **Create `plugin.json`** in that directory with your plugin metadata
4. **Ensure the `id` field matches the directory name**
5. **Run `npm run build`** to regenerate `registry.json` (or let CI do it)
6. **Submit a pull request** with:
   - Plugin directory and `plugin.json` file
   - Link to your GitHub repository
   - Brief description

**Example**: To add a plugin called "jira-integration":
- Create `plugins/jira-integration/plugin.json`
- Set `"id": "jira-integration"` in the JSON file

### Plugin Requirements

- Plugin must be hosted on GitHub
- Repository must have a `plugin.toml` manifest file
- Plugin must follow the [Plugin Template](https://github.com/bthos/time-tracker-plugin-template) structure
- Plugin must have at least one GitHub Release with compiled binaries

### Example Plugin Entry

```json
{
  "id": "calendar-sync",
  "name": "Calendar Sync",
  "author": "Developer Name",
  "repository": "https://github.com/user/calendar-sync-plugin",
  "latest_version": "1.0.0",
  "description": "Sync time entries with Google Calendar, Outlook, and Apple Calendar",
  "category": "integration",
  "verified": false,
  "downloads": 0,
  "tags": ["calendar", "sync", "google", "outlook"],
  "license": "MIT",
  "min_core_version": "0.3.0",
  "max_core_version": "1.0.0",
  "api_version": "1.0"
}
```

## Registry Validation

The registry is validated against `registry.schema.json` to ensure:

- All required fields are present
- Field formats are correct (URLs, versions, etc.)
- No duplicate plugin IDs
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

### Setup

```bash
npm install
```

### Building the Registry

Build `registry.json` from individual plugin files:

```bash
npm run build
```

### Validation

Validate individual plugin files:

```bash
npm run validate-plugins
```

Validate the aggregated registry (builds registry first):

```bash
npm run validate
```

Validate everything (plugins + registry):

```bash
npm run validate-all
```

Check for duplicate plugin IDs:

```bash
npm run check-duplicates
```

Format the registry (sorts plugins and updates timestamp):

```bash
npm run format
```

### Example Plugin Entry

See `plugins/calendar-sync/plugin.json` for a complete example of a plugin entry.

## Contributing

Contributions are welcome! Please:

1. Follow the JSON schema
2. Ensure all URLs are valid
3. Provide clear descriptions
4. Use appropriate categories and tags

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This registry is maintained by the Time Tracker community. Plugin entries are provided by plugin authors and are subject to their respective licenses.

## Related Projects

- [Time Tracker App](https://github.com/bthos/time-tracker-app) - Main application
- [Plugin Template](https://github.com/bthos/time-tracker-plugin-template) - Template for creating plugins
