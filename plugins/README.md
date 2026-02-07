# Plugins Directory

Each plugin in this registry has its own directory containing:

- `plugin.json` - Plugin metadata (required)
- `icon.png` - Plugin icon (optional, 128x128px recommended)
- `screenshot.png` - Plugin screenshot (optional, for marketplace display)
- `README.md` - Extended plugin documentation (optional)

## Directory Structure

```
plugins/
├── calendar-sync/
│   ├── plugin.json
│   ├── icon.png
│   └── README.md
├── jira-integration/
│   ├── plugin.json
│   └── icon.png
└── ...
```

## Plugin JSON Format

Each `plugin.json` file follows the schema defined in `../registry.schema.json` (plugin object schema).

**Important**: The `id` field in `plugin.json` must match the directory name.

## Adding a Plugin

1. Create a new directory: `plugins/your-plugin-id/`
2. Create `plugin.json` with your plugin metadata
3. Ensure the `id` field matches the directory name
4. Run `npm run build` to regenerate `registry.json`
5. Run `npm run validate` to verify everything is correct

## Example plugin.json

See `calendar-sync/plugin.json` for a complete example.
