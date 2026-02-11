# Security Policy

## Reporting Security Vulnerabilities

**DO NOT** report security vulnerabilities through public GitHub issues.

Instead, please report them via one of the following:

- **GitHub Private Vulnerability Reporting**: Use the "Security" tab in this repository and open a private report.
- **Email**: Contact the maintainers listed in [GOVERNANCE.md](GOVERNANCE.md) privately.

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x  | :white_check_mark: |
| < 1.0  | :x:                |

## Plugin Security

- All plugin submissions are validated against the registry schema.
- When distribution checksums are provided, they are verified in CI.
- Malware scanning may be run on plugin artifacts (see CI workflows).
- Use only plugins from trusted authors and verify checksums when possible.
