export interface SemicolonInsertion {
  line: number;
  column: number;
}

interface CommandState {
  depth: number;
  lastNonWhitespaceAtDepth: { line: number; column: number } | null;
}

const COMMAND_NAME_REGEX = /^[A-Za-z][A-Za-z0-9_-]*/;

export function findMissingCommandSemicolons(text: string): SemicolonInsertion[] {
  const lines = text.split(/\r\n|\r|\n/);
  const insertions: SemicolonInsertion[] = [];
  const activeByDepth = new Map<number, CommandState>();
  let braceDepth = 0;

  const closeMissing = (command: CommandState | undefined) => {
    if (!command || !command.lastNonWhitespaceAtDepth) {
      return;
    }
    insertions.push({
      line: command.lastNonWhitespaceAtDepth.line,
      column: command.lastNonWhitespaceAtDepth.column + 1,
    });
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (let col = 0; col < line.length; col += 1) {
      const char = line[col];

      if (char === "#") {
        const rest = line.slice(col + 1);
        const match = rest.match(COMMAND_NAME_REGEX);
        if (match) {
          const existing = activeByDepth.get(braceDepth);
          if (existing) {
            closeMissing(existing);
            activeByDepth.delete(braceDepth);
          }
          activeByDepth.set(braceDepth, {
            depth: braceDepth,
            lastNonWhitespaceAtDepth: { line: lineIndex, column: col },
          });
          col += match[0].length;
          continue;
        }
      }

      if (char === "{") {
        const activeAtDepth = activeByDepth.get(braceDepth);
        if (activeAtDepth) {
          activeAtDepth.lastNonWhitespaceAtDepth = { line: lineIndex, column: col };
        }
        braceDepth += 1;
      } else if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
        const activeAtDepth = activeByDepth.get(braceDepth);
        if (activeAtDepth) {
          activeAtDepth.lastNonWhitespaceAtDepth = { line: lineIndex, column: col };
        }
      } else if (char === ";") {
        const active = activeByDepth.get(braceDepth);
        if (active) {
          activeByDepth.delete(braceDepth);
        }
      } else {
        const activeAtDepth = activeByDepth.get(braceDepth);
        if (activeAtDepth && char !== " " && char !== "\t") {
          activeAtDepth.lastNonWhitespaceAtDepth = { line: lineIndex, column: col };
        }
      }
    }
  }

  for (const [depth, command] of activeByDepth) {
    closeMissing(command);
    activeByDepth.delete(depth);
  }

  return insertions;
}
