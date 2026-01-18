# Tintin++ Linting

Linting and formatting for Tintin++ scripts in VS Code.

## Features

- Warn on long lines (configurable).
- Warn on tab characters.
- Warn on trailing whitespace.
- Warn on invalid Tintin++ commands and enforce uppercase commands.
- Require commands to end with semicolons.
- Format Tintin++ scripts (tabs to spaces, command casing, trim trailing whitespace, wrap args, append command semicolons).

## Settings

- `tintinLint.maxLineLength`: Maximum line length before a warning is shown.
- `tintinLint.disallowTabs`: Warn when a tab character is found.
- `tintinLint.warnOnTrailingWhitespace`: Warn when trailing whitespace is found.
- `tintinLint.requireSemicolons`: Require a semicolon at the end of each command.
- `tintinLint.enforceUppercaseCommands`: Warn when commands are not uppercase.
- `tintinLint.validateCommands`: Warn when a command is not a recognized Tintin++ command.
- `tintinFormat.indentSize`: Indentation size for formatting.
- `tintinFormat.insertSpaces`: Replace tabs with spaces during formatting.
- `tintinFormat.commandCase`: Command casing to enforce during formatting.
- `tintinFormat.trimTrailingWhitespace`: Trim trailing whitespace during formatting.
- `tintinFormat.appendSemicolons`: Append a semicolon to the end of each command when missing.
- `tintinFormat.wrapArgsInBraces`: Wrap unbraced command arguments in a single set of braces.

## Formatting

Use VS Code's "Format Document" command or enable "Format on Save" to apply the formatter. The
formatter appends semicolons per command, so multiline command blocks get a single trailing
semicolon after the closing brace.

## Development

```bash
npm install
npm run compile
npm test
```

Press `F5` to launch the Extension Development Host.
