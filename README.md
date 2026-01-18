# Tintin++ Linting

Lightweight linting diagnostics for Tintin++ scripts in VS Code.

## Features

- Warn on long lines (configurable).
- Warn on tab characters.
- Warn on trailing whitespace.

## Settings

- `tintinLint.maxLineLength`: Maximum line length before a warning is shown.
- `tintinLint.disallowTabs`: Warn when a tab character is found.
- `tintinLint.warnOnTrailingWhitespace`: Warn when trailing whitespace is found.

## Development

```bash
npm install
npm run compile
```

Press `F5` to launch the Extension Development Host.
