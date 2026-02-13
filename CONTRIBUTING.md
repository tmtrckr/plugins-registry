# Contributing to Time Tracker Plugins Registry

Thank you for your interest in contributing to the Time Tracker Plugins Registry!

## Quick Summary

Adding a plugin is simple:
1. **Fork** this repository
2. **Create** `plugins/{letter}/{author}/{plugin-id}/{version}/plugin.json`
3. **Submit** a Pull Request

CI handles validation and registry building automatically. No local setup required (unless you want to use the interactive script).

👉 **See [FAQ](#frequently-asked-questions-faq) below for common questions.**

## Developer Certificate of Origin (DCO)

**What is DCO?**  
DCO is a simple way to certify that you have the right to submit your contribution. It's required for all contributions.

**How to sign off:**
Just add `-s` flag when committing:

```bash
git commit -s -m "Add plugin: your-plugin-name"
```

This automatically adds `Signed-off-by: Your Name <your.email@example.com>` to your commit.

**⚠️ Important:** All PRs are checked for DCO sign-off. Commits without sign-off will fail the DCO check.

## How to Add a Plugin

### Prerequisites

Before adding your plugin, make sure:

✅ Your plugin is hosted on GitHub  
✅ Your plugin repository has a `plugin.toml` manifest file  
✅ You have at least one GitHub Release with version tag (e.g., `v1.0.0`)  
✅ Your repository includes a README and license file

> 💡 **New to plugin development?** Check out the [Plugin Template](https://github.com/tmtrckr/plugin-template) for a complete example.

### Step 1: Fork and Clone

1. **Fork this repository** on GitHub (click the "Fork" button)
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/plugins-registry.git
   cd plugins-registry
   ```

> 💡 **Tip**: You only need `npm install` if you want to use the interactive script. For manual creation, you can skip it.

### Step 2: Create Plugin Entry

**Option A: Interactive Script (Easiest! 🎯)**

```bash
npm install
npm run create-plugin
```

The script will:
- ✅ Ask you questions about your plugin
- ✅ Automatically normalize your author name
- ✅ Create the correct directory structure
- ✅ Generate a properly formatted `plugin.json`
- ✅ Validate everything for you

**Option B: Manual Creation**

If you prefer to create the entry manually:

**1. Normalize your author name:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Example: "John Doe" → "john-doe"
- First letter: `j` (this becomes the partition folder)

**2. Create the directory structure:**
```bash
mkdir -p plugins/j/john-doe/your-plugin-id/1.0.0
```

**3. Create `plugin.json`** in that directory:

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

**⚠️ Important Rules:**
- Path format: `plugins/{first-letter}/{normalized-author}/{plugin-id}/{version}/plugin.json`
- `id` field must match the plugin directory name
- `author` field must normalize to the author directory name  
- `latest_version` must match the version directory name

**📖 Field Descriptions:**

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

### Step 3: Quick Check Before Submitting

Before creating your PR, verify:

✅ `plugin.json` is valid JSON (no syntax errors)  
✅ All required fields are filled in  
✅ `id` matches your plugin directory name  
✅ `author` normalizes to your author directory name  
✅ Repository URL is correct and accessible

> 💡 **Optional**: If you have Node.js, you can run `npm install && npm run validate-plugins` to check locally. But don't worry - CI will validate everything automatically when you submit your PR!

### Step 4: Submit Pull Request

1. **Commit your changes** (with DCO sign-off):
   ```bash
   git add plugins/{letter}/{normalized-author}/{plugin-id}/{version}/plugin.json
   git commit -s -m "Add plugin: your-plugin-name"
   ```
   
   **Important**: Do NOT commit `registry.json` - CI will automatically build and commit it after your PR is merged to main.

2. **Push to your fork:**
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** with:
   - Clear title: "Add plugin: [Plugin Name]"
   - Description explaining what the plugin does
   - Link to your plugin repository
   - Screenshots or demo (if applicable)

### Step 5: What Happens Next

**When you submit your PR:**
- ✅ CI automatically validates your plugin
- ✅ Maintainers review your submission
- ✅ Automated checks verify schema compliance and repository URLs

**After your PR is merged:**
- ✅ CI automatically builds the registry
- ✅ Your plugin appears in `registry.json`
- ✅ Your plugin is available in the Time Tracker Marketplace!

### Review Process

- Registry maintainers will review your submission
- Automated validation will check schema compliance
- Repository URL will be verified
- Plugin may be tested for basic functionality
- Once approved, your plugin will be merged and available in the registry

## Updating an Existing Plugin

### Updating Plugin Metadata

To update description, tags, or other metadata:

1. Edit `plugin.json` in your existing version directory
   - Example: `plugins/j/john-doe/jira-integration/1.0.0/plugin.json`
2. Commit and submit a PR

### Adding a New Version

To add a new version of your plugin:

1. Create a new version directory:
   ```bash
   mkdir -p plugins/j/john-doe/jira-integration/1.1.0
   ```
2. Create `plugin.json` in the new version directory
3. Update `latest_version` in the new `plugin.json` to match the directory name
4. Commit and submit a PR

**Example structure for multiple versions:**
```
plugins/j/john-doe/jira-integration/
├── 1.0.0/
│   └── plugin.json
└── 1.1.0/
    └── plugin.json  ← New version
```

**⚠️ Important:**
- Do NOT change the `author` field or move the plugin to a different author path
- Do NOT commit `registry.json` - CI handles this automatically

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

## Frequently Asked Questions (FAQ)

### Do I need to install Node.js to add a plugin?

**No!** You only need Node.js if you want to use the interactive `create-plugin` script. For manual creation, you can just create the files directly.

### Do I need to build the registry locally?

**No!** CI automatically builds `registry.json` after your PR is merged. Just create your `plugin.json` file and submit a PR.

### What if I make a mistake in my plugin.json?

Don't worry! CI will validate your plugin when you submit a PR and tell you what's wrong. You can fix it and update your PR.

### Can I update my plugin later?

Yes! You can:
- Update metadata by editing the existing `plugin.json`
- Add a new version by creating a new version directory

### What if my author name has special characters?

Special characters are removed during normalization. For example:
- "José García" → "jose-garcia"
- "O'Brien" → "obrien"
- "Smith & Co." → "smith-co"

### Can I have multiple versions of my plugin?

Yes! Create separate version directories:
```
plugins/j/john-doe/my-plugin/
├── 1.0.0/
│   └── plugin.json
└── 1.1.0/
    └── plugin.json
```

### Do I need to commit registry.json?

**No!** Never commit `registry.json`. CI builds and commits it automatically after your PR is merged.

### How long does it take for my plugin to appear?

After your PR is merged, CI automatically builds the registry (usually takes 1-2 minutes). Your plugin will then appear in `registry.json` and be available in the marketplace.

## Questions?

If you have questions about contributing:

- Open an issue in this repository
- Check the [Plugin Template documentation](https://github.com/tmtrckr/plugin-template)
- Review existing plugin entries for examples

## Code of Conduct

We follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions. We welcome contributions from everyone.
