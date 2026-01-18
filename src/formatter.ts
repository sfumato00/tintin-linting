export interface FormatConfig {
  indentSize: number;
  insertSpaces: boolean;
  commandCase: "lower" | "upper" | "preserve";
  trimTrailingWhitespace: boolean;
}

const COMMAND_REGEX = /^(\s*#)([A-Za-z][A-Za-z0-9_-]*)/;

export function formatText(text: string, config: FormatConfig, eol: string): string {
  const lines = text.split(/\r\n|\r|\n/);
  const formatted = lines.map((line) => formatLine(line, config));
  return formatted.join(eol);
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

  return result;
}
