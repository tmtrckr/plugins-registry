# Plugins Directory

Each plugin in this registry is organized by author, with plugins grouped in author directories.

## Directory Structure

Plugins are organized as `plugins/{author}/{plugin-id}/`:

```
plugins/
├── developer-name/                   # Author directory (normalized name)
│   ├── example-plugin/               # Plugin directory
│   │   ├── plugin.json               # Plugin metadata (required)
│   │   ├── icon.png                  # Optional: Plugin icon (128x128px recommended)
│   │   ├── screenshot.png            # Optional: Plugin screenshot
│   │   └── README.md                 # Optional: Extended documentation
│   └── jira-integration/             # Another plugin by same author
│       └── plugin.json
├── another-author/                   # Another author
│   └── my-plugin/
│       └── plugin.json
└── ...
```

## Author Name Normalization

Author directory names must be normalized:
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters (keep only alphanumeric, hyphens, underscores)

**Examples:**
- `"John Doe"` → `john-doe`
- `"My Company"` → `my-company`
- `"TimeTracker"` → `timetracker`
- `"user_name"` → `user_name`

## Plugin JSON Format

Each `plugin.json` file follows the schema defined in `../../registry.schema.json` (plugin object schema).

**Important rules:**
1. The `id` field in `plugin.json` must match the plugin directory name
2. The `author` field must match the author directory name (after normalization)
3. The `$schema` path should be `../../registry.schema.json#/properties/plugins/items`

## Adding a Plugin

1. **Normalize your author name** (see above)
2. **Create author directory** if it doesn't exist: `plugins/{normalized-author}/`
3. **Create plugin directory**: `plugins/{normalized-author}/{plugin-id}/`
4. **Create `plugin.json`** with your plugin metadata
5. **Ensure**:
   - `id` matches the plugin directory name
   - `author` matches the author directory name (after normalization)
6. **Run `npm run build`** to regenerate `registry.json`
7. **Run `npm run validate`** to verify everything is correct

## Example Structure

See `developer-name/example-plugin/plugin.json` for a complete example.

