export interface LintConfig {
  maxLineLength: number;
  disallowTabs: boolean;
  warnOnTrailingWhitespace: boolean;
  enforceUppercaseCommands: boolean;
  validateCommands: boolean;
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

const VALID_COMMANDS = new Set([
  "ACTION", "ALIAS", "ALL", "BELL", "BREAK", "BUFFER", "BUTTON", "CASE", "CAT", "CHAT", "CLASS",
  "CONFIG", "CONTINUE", "CR", "CURSOR", "DAEMON", "DEBUG", "DEFAULT", "DELAY", "DRAW", "ECHO",
  "ELSE", "ELSEIF", "END", "EVENT", "FOREACH", "FORMAT", "FUNCTION", "GAG", "GREP", "HELP",
  "HIGHLIGHT", "HISTORY", "IF", "IGNORE", "INFO", "KILL", "LINE", "LIST", "LOCAL", "LOG", "LOOP",
  "MACRO", "MAP", "MATH", "MESSAGE", "NOP", "PARSE", "PATH", "PATHDIR", "PORT", "PROMPT", "READ",
  "REGEXP", "REPEAT", "REPLACE", "RETURN", "RUN", "SCAN", "SCREEN", "SCRIPT", "SEND", "SESSION",
  "SHOWME", "SNOOP", "SPEEDWALK", "SPLIT", "SUBSTITUTE", "SUSPEND", "SWITCH", "SYSTEM", "TAB",
  "TEXTIN", "TICKER", "TIME", "VARIABLE", "WHILE", "WRITE", "ZAP",
  // UN- variants
  "UNACTION", "UNALIAS", "UNBUTTON", "UNCLASS", "UNDEF", "UNEVENT", "UNFUNCTION", "UNGAG",
  "UNHIGHLIGHT", "UNLIST", "UNMACRO", "UNPATHDIR", "UNPROMPT", "UNSUBSTITUTE", "UNTAB",
  "UNTICKER", "UNVARIABLE",
  // Common abbreviations
  "VAR", "UNVAR"
]);

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

    // Check for commands
    if (config.enforceUppercaseCommands || config.validateCommands) {
      const commandRegex = /#([a-zA-Z][a-zA-Z0-9]*)\b/g;
      let match;
      while ((match = commandRegex.exec(line)) !== null) {
        const commandName = match[1];
        const commandUpper = commandName.toUpperCase();

        if (config.enforceUppercaseCommands && commandName !== commandUpper) {
          diagnostics.push({
            message: `Command '#${commandName}' should be uppercase: '#${commandUpper}'.`,
            range: {
              start: { line: lineIndex, character: match.index },
              end: { line: lineIndex, character: match.index + match[0].length },
            },
            severity: "warning",
          });
        }

        if (config.validateCommands && !VALID_COMMANDS.has(commandUpper)) {
          diagnostics.push({
            message: `Unrecognized command: '#${commandName}'.`,
            range: {
              start: { line: lineIndex, character: match.index },
              end: { line: lineIndex, character: match.index + match[0].length },
            },
            severity: "warning",
          });
        }
      }
    }
  }

  return diagnostics;
}
