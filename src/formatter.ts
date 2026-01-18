import { findMissingCommandSemicolons } from "./command-parser";

export interface FormatConfig {
  indentSize: number;
  insertSpaces: boolean;
  commandCase: "lower" | "upper" | "preserve";
  trimTrailingWhitespace: boolean;
  appendSemicolons: boolean;
  wrapArgsInBraces: boolean;
}

const COMMAND_REGEX = /^(\s*#)([A-Za-z][A-Za-z0-9_-]*)/;

export function formatText(text: string, config: FormatConfig, eol: string): string {
  const lines = text.split(/\r\n|\r|\n/);
  const formatted = lines.map((line) => formatLine(line, config));
  let result = formatted.join(eol);

  if (config.appendSemicolons) {
    result = appendMissingCommandSemicolons(result);
  }

  return result;
}

function formatLine(line: string, config: FormatConfig): string {
  let result = line;

  if (config.insertSpaces) {
    const spaces = " ".repeat(Math.max(0, config.indentSize));
    result = result.replace(/\t/g, spaces);
  }

  if (config.commandCase !== "preserve") {
    result = result.replace(COMMAND_REGEX, (_match, prefix, command) => {
      const normalized =
        config.commandCase === "upper" ? command.toUpperCase() : command.toLowerCase();
      return `${prefix}${normalized}`;
    });
  }

  if (config.trimTrailingWhitespace) {
    result = result.replace(/[ \t]+$/g, "");
  }

  if (config.wrapArgsInBraces) {
    const commandMatch = result.match(/^(\s*#[A-Za-z][A-Za-z0-9_-]*)(\s+)(.*)$/);
    if (commandMatch) {
      const args = commandMatch[3];
      const trimmedArgs = args.trim();
      const hasBraces = /[{}]/.test(trimmedArgs);
      if (trimmedArgs.length > 0 && !hasBraces) {
        let normalizedArgs = trimmedArgs;
        let hasSemicolon = false;
        if (normalizedArgs.endsWith(";")) {
          hasSemicolon = true;
          normalizedArgs = normalizedArgs.slice(0, -1).trimEnd();
        }
        result = `${commandMatch[1]} {${normalizedArgs}}${hasSemicolon ? ";" : ""}`;
      }
    }
  }

  return result;
}

function appendMissingCommandSemicolons(text: string): string {
  const insertions = findMissingCommandSemicolons(text);
  if (insertions.length === 0) {
    return text;
  }

  const lines = text.split(/\r\n|\r|\n/);
  const insertionsByLine = new Map<number, number[]>();

  for (const insertion of insertions) {
    const list = insertionsByLine.get(insertion.line) ?? [];
    list.push(insertion.column);
    insertionsByLine.set(insertion.line, list);
  }

  for (const [lineIndex, columns] of insertionsByLine) {
    const line = lines[lineIndex] ?? "";
    const sortedColumns = columns
      .map((col) => Math.min(Math.max(0, col), line.length))
      .sort((a, b) => b - a);
    let updatedLine = line;
    for (const col of sortedColumns) {
      updatedLine = `${updatedLine.slice(0, col)};${updatedLine.slice(col)}`;
    }
    lines[lineIndex] = updatedLine;
  }

  const eolMatch = text.match(/\r\n|\r|\n/);
  const eol = eolMatch ? eolMatch[0] : "\n";
  return lines.join(eol);
}
