# Tintin++ Linting

Linting and formatting for Tintin++ scripts in VS Code.

## Features

- Warn on long lines (configurable).
- Warn on tab characters.
- Warn on trailing whitespace.
- Format Tintin++ scripts (tabs to spaces, lowercase commands, trim trailing whitespace).

## Settings

- `tintinLint.maxLineLength`: Maximum line length before a warning is shown.
- `tintinLint.disallowTabs`: Warn when a tab character is found.
- `tintinLint.warnOnTrailingWhitespace`: Warn when trailing whitespace is found.
- `tintinFormat.indentSize`: Indentation size for formatting.
- `tintinFormat.insertSpaces`: Replace tabs with spaces during formatting.
- `tintinFormat.lowercaseCommands`: Lowercase Tintin++ commands (e.g., `#echo`).
- `tintinFormat.trimTrailingWhitespace`: Trim trailing whitespace during formatting.

## Formatting

Use VS Code's "Format Document" command or enable "Format on Save" to apply the formatter.

## Development

```bash
npm install
npm run compile
npm test
```

Press `F5` to launch the Extension Development Host.
