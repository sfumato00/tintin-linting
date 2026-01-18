# Tintin++ Style Guide (Draft)

This guide defines a consistent formatting baseline for Tintin++ scripts. It is intentionally minimal so we can refine it as we build the formatter.

## Core Rules

- Use spaces for indentation, 2 spaces per level.
- Keep line length at or under 120 characters.
- Use UPPERCASE commands (e.g., `#ECHO`, `#VAR`, `#IF`).
- Use single spaces between tokens.
- No trailing whitespace.
- Use UNIX line endings (LF).

## Commands & Arguments

- Put a `;` at the end of each command.
  - Example: `#ECHO {Hello world};`
- Prefer the `{arg}` form for grouped arguments.
  - Example: `#ECHO {Hello world};`
- Put a single space between the command and the first argument.
  - Example: `#VAR {name} {value};`
- Inside braces, do not pad with extra spaces.
  - Prefer `{value}` over `{ value }.`

## Blocks & Indentation

- Indent nested commands by 2 spaces.
- Place opening and closing braces on the same line as the command when the body is short.
- For multi-line bodies, open the brace on the same line and close on its own line.

Example (single-line):

```Tintin++
#IF {condition} {#ECHO {ok};}
```

Example (multi-line):

```Tintin++
#IF {condition} {
  #ECHO {ok};
  #VAR {flag} {1};
}
```

## Comments

- Start comment lines with `#NOP` and a single space when used as a note.
  - Example: `#NOP This is a comment;`
- Keep inline comments after two spaces.
  - Example: `#ECHO {value};  #NOP explanation;`

## Naming Conventions

- Use `camelCase` for variable names (`#VAR {myVariable} {1};`).
- Use `UPPER_CASE` for global constants or configuration variables.
- Use `snake_case` for aliases or functions if preferred, but stay consistent within a file.

## Spacing

- Use a single space after a command before its arguments.
- Use a single space between arguments if they are not enclosed in braces.
- No space before the trailing semicolon.
- No trailing whitespace on any line.

## Strings & Escapes

- Use braces for strings with spaces.
- Avoid unnecessary escaping when braces suffice.

## File Layout

- Group related commands together.
- Separate logical sections with a single blank line.
- Avoid multiple consecutive blank lines.
