import * as assert from "assert";
import { FormatConfig, formatText } from "../src/formatter";

const baseConfig: FormatConfig = {
  indentSize: 2,
  insertSpaces: true,
  lowercaseCommands: true,
  trimTrailingWhitespace: true,
};

describe("formatText", () => {
  it("replaces tabs with spaces", () => {
    const text = "#echo\t{hi}";
    const formatted = formatText(text, baseConfig, "\n");
    assert.strictEqual(formatted, "#echo  {hi}");
  });

  it("lowercases commands", () => {
    const text = "#ECHO {Hi}";
    const formatted = formatText(text, baseConfig, "\n");
    assert.strictEqual(formatted, "#echo {Hi}");
  });

  it("trims trailing whitespace", () => {
    const text = "#echo {hi}   ";
    const formatted = formatText(text, baseConfig, "\n");
    assert.strictEqual(formatted, "#echo {hi}");
  });

  it("preserves line endings when requested", () => {
    const text = "#ECHO {Hi}\r\n#VAR {x} {1}\r\n";
    const formatted = formatText(text, baseConfig, "\r\n");
    assert.strictEqual(formatted, "#echo {Hi}\r\n#var {x} {1}\r\n");
  });

  it("respects disabled options", () => {
    const config: FormatConfig = {
      indentSize: 4,
      insertSpaces: false,
      lowercaseCommands: false,
      trimTrailingWhitespace: false,
    };
    const text = "#ECHO\t{Hi}   ";
    const formatted = formatText(text, config, "\n");
    assert.strictEqual(formatted, "#ECHO\t{Hi}   ");
  });
});
