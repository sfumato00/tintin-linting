export interface LintConfig {
  maxLineLength: number;
  disallowTabs: boolean;
  warnOnTrailingWhitespace: boolean;
  enforceUppercaseCommands: boolean;
}

export interface LintPosition {
  line: number;
  character: number;
}

export interface LintRange {
  start: LintPosition;
  end: LintPosition;
}

export interface LintDiagnostic {
  message: string;
  range: LintRange;
  severity: "warning";
}

export function lintText(text: string, config: LintConfig): LintDiagnostic[] {
  const lines = text.split(/\r\n|\r|\n/);
  const diagnostics: LintDiagnostic[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    if (config.maxLineLength > 0 && line.length > config.maxLineLength) {
      diagnostics.push({
        message: `Line exceeds ${config.maxLineLength} characters (${line.length}).`,
        range: {
          start: { line: lineIndex, character: config.maxLineLength },
          end: { line: lineIndex, character: line.length },
        },
        severity: "warning",
      });
    }

    if (config.disallowTabs) {
      const tabIndex = line.indexOf("\t");
      if (tabIndex >= 0) {
        diagnostics.push({
          message: "Tab character found. Use spaces instead.",
          range: {
            start: { line: lineIndex, character: tabIndex },
            end: { line: lineIndex, character: tabIndex + 1 },
          },
          severity: "warning",
        });
      }
    }

    if (config.warnOnTrailingWhitespace) {
      const match = line.match(/[\t ]+$/);
      if (match && match.index !== undefined) {
        diagnostics.push({
          message: "Trailing whitespace.",
          range: {
            start: { line: lineIndex, character: match.index },
            end: { line: lineIndex, character: line.length },
          },
          severity: "warning",
        });
      }
    }

    if (config.enforceUppercaseCommands) {
      const commandRegex = /#([a-z][a-zA-Z0-9]*)\b/g;
      let match;
      while ((match = commandRegex.exec(line)) !== null) {
        diagnostics.push({
          message: `Command '#${match[1]}' should be uppercase: '#${match[1].toUpperCase()}'.`,
          range: {
            start: { line: lineIndex, character: match.index },
            end: { line: lineIndex, character: match.index + match[0].length },
          },
          severity: "warning",
        });
      }
    }
  }

  return diagnostics;
}
