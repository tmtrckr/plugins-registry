# Contributing to Time Tracker Plugins Registry

Thank you for your interest in contributing to the Time Tracker Plugins Registry!

## Developer Certificate of Origin (DCO)

By contributing to this project, you agree to the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). You must sign off your commits to certify that you have the right to submit your contribution.

To sign off your commits, add the `-s` flag when committing:

```bash
git commit -s -m "Add plugin: your-plugin-name"
```

This adds a line like the following to your commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

All pull requests are checked for DCO sign-off. Commits without sign-off will cause the DCO check to fail.

## How to Add a Plugin

### Step 1: Prepare Your Plugin

Before submitting your plugin to the registry, ensure:

1. **Your plugin follows the Plugin Template structure**
   - See [Plugin Template](https://github.com/tmtrckr/plugin-template) for details
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

### Step 2: Fork the Repository

**Important**: Before creating a plugin entry, you must fork this repository:

1. **Fork this repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/plugins-registry.git
   cd plugins-registry
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Step 3: Add Plugin Entry

**Option A: Use the Interactive Script (Recommended)**

The easiest way to create a plugin entry is using the interactive script:

```bash
npm run create-plugin
```

This script will:
- Guide you through all required fields
- Automatically normalize your author name
- Create the correct directory structure
- Generate a properly formatted `plugin.json` file
- Validate the entry format

**Option B: Manual Creation**

1. **Normalize author name**: lowercase, spaces → hyphens, remove special characters (e.g. "John Doe" → "john-doe"). The **first letter** of the normalized name is the partition (e.g. `j`).

2. **Create the versioned path**:
   ```bash
   mkdir -p plugins/j/john-doe/your-plugin-id/1.0.0
   ```
   Use your normalized author, plugin id, and version (semver).

3. **Create `plugin.json`** in that version directory (e.g. `plugins/j/john-doe/your-plugin-id/1.0.0/plugin.json`):

```json
{
  "$schema": "https://github.com/tmtrckr/plugins-registry/schemas/manifest.schema.json",
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

**Important**:
- Path must be `plugins/{first-letter}/{normalized-author}/{plugin-id}/{version}/plugin.json`
- `id` must match the plugin directory name; `author` must normalize to the author directory name
- Version directory must be semver (e.g. `1.0.0`)

**Field Guidelines:**

- **id**: Lowercase, alphanumeric with hyphens only (e.g., `calendar-sync`, `jira-integration`)
- **name**: Display name (max 100 characters)
- **author**: Your name or organization (required, will be normalized for directory structure)
- **repository**: Full GitHub URL (must be valid)
- **latest_version**: Latest release version (semver format)
- **description**: 10-500 characters, clear and concise
- **category**: One of: `integration`, `productivity`, `reporting`, `automation`, `export`, `import`, `ui`, `other`
- **tags**: Array of searchable tags (max 10, each max 30 characters)
- **license**: SPDX license identifier (e.g., `MIT`, `Apache-2.0`, `GPL-3.0`)
- **min_core_version**: Minimum Time Tracker version required
- **max_core_version**: Maximum compatible Time Tracker version
- **api_version**: Plugin API version your plugin uses

**Checksums (optional but recommended):** If you provide a `distribution` object with a direct download `url`, you must include a `checksums.sha256` field. CI will verify that the file at the URL matches the SHA256 checksum. This ensures integrity of plugin artifacts. Example:

```json
"distribution": {
  "type": "binary",
  "url": "https://github.com/user/repo/releases/download/v1.0.0/plugin.zip",
  "checksums": {
    "sha256": "hex-encoded-64-character-sha256-hash"
  }
}
```

You can compute SHA256 locally with `sha256sum` (Linux/macOS) or `certutil -hashfile file.zip SHA256` (Windows).

### Step 4: Validate Your Entry

Before submitting, validate your entry:

1. **Check JSON syntax**: Ensure valid JSON
2. **Validate against schema**: Your entry must match `registry.schema.json`
3. **Verify ID matches directory**: The `id` field must match the plugin directory name
4. **Verify author matches directory**: The `author` field (when normalized) must match the author directory name
5. **Verify author is present**: The `author` field is required and cannot be empty
6. **Verify repository URL**: Ensure the GitHub repository exists and is accessible
7. **Check for duplicates**: Ensure no other plugin has the same `{author}/{id}` combination
8. **Build and validate**: Run `npm run build && npm run validate` to ensure everything works

### Step 5: Install Git Hooks (Optional but Recommended)

Install pre-commit hooks to automatically validate your changes before committing:

```bash
npm run install-hooks
```

This will:
- Install a pre-commit hook that validates plugins before each commit
- Automatically build the registry when plugin files change
- Prevent invalid commits from being made

### Step 6: Submit Pull Request

1. **Validate your changes:**
   ```bash
   npm run validate-all
   ```
   
   This will:
   - Validate individual plugin files
   - Build the registry from plugins
   - Validate the registry against the schema

2. **Commit your changes** (with DCO sign-off):
   ```bash
   git add plugins/{letter}/{normalized-author}/{plugin-id}/{version}/plugin.json
   git commit -s -m "Add plugin: your-plugin-name"
   ```
   
   **Important Notes:**
   - **Do NOT commit `registry.json`** - CI will automatically regenerate it when your PR is merged
   - The build script preserves timestamps when plugins haven't changed, so you won't see unnecessary diffs
   - If you installed pre-commit hooks, validation will run automatically and will unstage `registry.json` if only the timestamp changed

2. **Push to your fork:**
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** with:
   - Clear title: "Add plugin: [Plugin Name]"
   - Description explaining what the plugin does
   - Link to your plugin repository
   - Screenshots or demo (if applicable)

### Step 6: Review Process

- Registry maintainers will review your submission
- Automated validation will check schema compliance
- Repository URL will be verified
- Plugin may be tested for basic functionality
- Once approved, your plugin will be merged and available in the registry

## Updating an Existing Plugin

To update your plugin entry:

1. For **metadata changes** (description, tags, etc.): edit `plugin.json` in the version directory (e.g. `plugins/d/developer-name/example-plugin/1.0.0/plugin.json`).
2. For a **new version**: create a new version directory (e.g. `plugins/d/developer-name/example-plugin/1.1.0/`) and add a new `plugin.json` there.
3. Do not change the `author` field or move the plugin to a different author path without coordination.
4. Run `npm run validate-all`, then commit and submit a pull request. Do **not** commit `registry.json` (CI regenerates it).

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
- Check the [Plugin Template documentation](https://github.com/tmtrckr/plugin-template)
- Review existing plugin entries for examples

## Code of Conduct

We follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions. We welcome contributions from everyone.
