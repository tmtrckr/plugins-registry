# Contributing to Time Tracker Plugins Registry

Thank you for your interest in contributing to the Time Tracker Plugins Registry!

## How to Add a Plugin

### Step 1: Prepare Your Plugin

Before submitting your plugin to the registry, ensure:

1. **Your plugin follows the Plugin Template structure**
   - See [Plugin Template](https://github.com/bthos/time-tracker-plugin-template) for details
   - Must have a `plugin.toml` manifest file
   - Must be hosted on GitHub

2. **Your plugin has at least one release**
   - Create a GitHub Release with version tag (e.g., `v1.0.0`)
   - Release should include compiled binaries for supported platforms
   - See Plugin Template for GitHub Actions workflow

3. **Your plugin repository includes:**
   - Clear README with installation instructions
   - License file
   - Plugin manifest (`plugin.toml`)

### Step 2: Add Plugin Entry

1. **Fork this repository**

2. **Create a new directory** in `plugins/` named after your plugin ID:
   ```bash
   mkdir plugins/your-plugin-id
   ```

3. **Create `plugin.json`** in that directory with your plugin metadata:

```json
{
  "$schema": "../../registry.schema.json#/properties/plugins/items",
  "id": "your-plugin-id",
  "name": "Your Plugin Name",
  "author": "Your Name",
  "repository": "https://github.com/yourusername/your-plugin-repo",
  "latest_version": "1.0.0",
  "description": "Clear description of what your plugin does (10-500 characters)",
  "category": "integration",
  "verified": false,
  "downloads": 0,
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "min_core_version": "0.3.0",
  "max_core_version": "1.0.0",
  "api_version": "1.0"
}
```

**Important**: The `id` field must match the directory name exactly.

**Field Guidelines:**

- **id**: Lowercase, alphanumeric with hyphens only (e.g., `calendar-sync`, `jira-integration`)
- **name**: Display name (max 100 characters)
- **author**: Your name or organization
- **repository**: Full GitHub URL (must be valid)
- **latest_version**: Latest release version (semver format)
- **description**: 10-500 characters, clear and concise
- **category**: One of: `integration`, `productivity`, `reporting`, `automation`, `export`, `import`, `ui`, `other`
- **tags**: Array of searchable tags (max 10, each max 30 characters)
- **license**: SPDX license identifier (e.g., `MIT`, `Apache-2.0`, `GPL-3.0`)
- **min_core_version**: Minimum Time Tracker version required
- **max_core_version**: Maximum compatible Time Tracker version
- **api_version**: Plugin API version your plugin uses

### Step 3: Validate Your Entry

Before submitting, validate your entry:

1. **Check JSON syntax**: Ensure valid JSON
2. **Validate against schema**: Your entry must match `registry.schema.json`
3. **Verify ID matches directory**: The `id` field must match the directory name
4. **Verify repository URL**: Ensure the GitHub repository exists and is accessible
5. **Check for duplicates**: Ensure no other plugin has the same `id`
6. **Build and validate**: Run `npm run build && npm run validate` to ensure everything works

### Step 4: Submit Pull Request

1. **Build the registry** (optional, CI will do this):
   ```bash
   npm run build
   ```

2. **Commit your changes:**
   ```bash
   git add plugins/your-plugin-id/plugin.json
   git add registry.json  # If you built it locally
   git commit -m "Add plugin: your-plugin-name"
   ```

2. **Push to your fork:**
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** with:
   - Clear title: "Add plugin: [Plugin Name]"
   - Description explaining what the plugin does
   - Link to your plugin repository
   - Screenshots or demo (if applicable)

### Step 5: Review Process

- Registry maintainers will review your submission
- Automated validation will check schema compliance
- Repository URL will be verified
- Plugin may be tested for basic functionality
- Once approved, your plugin will be merged and available in the registry

## Updating an Existing Plugin

To update your plugin entry:

1. Edit `plugin.json` in your plugin's directory (e.g., `plugins/your-plugin-id/plugin.json`)
2. Update `latest_version` if you've released a new version
3. Update `description`, `tags`, or other fields as needed
4. Run `npm run build` to regenerate `registry.json` (or let CI do it)
5. Submit a pull request with changes

## Plugin Verification

Plugins can be marked as `verified: true` by maintainers after:

- Code review confirms plugin follows best practices
- Plugin manifest is valid and complete
- Plugin installs and runs correctly
- License is compatible
- Repository is well-maintained

Verified plugins are marked with a badge in the Marketplace UI.

## Guidelines

### Plugin ID Naming

- Use lowercase letters, numbers, and hyphens only
- Be descriptive but concise (e.g., `calendar-sync`, `jira-integration`)
- Avoid generic names (e.g., `plugin1`, `test-plugin`)
- Match your repository name when possible

### Descriptions

- Be clear and specific about what the plugin does
- Include key features or use cases
- Avoid marketing language
- Minimum 10 characters, maximum 500 characters

### Categories

Choose the most appropriate category:

- **integration**: Integrates with external services (calendars, PM tools, etc.)
- **productivity**: Enhances productivity features
- **reporting**: Adds reporting or analytics capabilities
- **automation**: Automates tasks or workflows
- **export**: Adds export formats or destinations
- **import**: Adds import capabilities
- **ui**: UI enhancements or themes
- **other**: Doesn't fit other categories

### Tags

- Use 3-10 relevant tags
- Include technology names (e.g., `google`, `jira`, `slack`)
- Include functionality keywords (e.g., `sync`, `export`, `automation`)
- Use lowercase, avoid spaces

## Questions?

If you have questions about contributing:

- Open an issue in this repository
- Check the [Plugin Template documentation](https://github.com/bthos/time-tracker-plugin-template)
- Review existing plugin entries for examples

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributions from everyone.
