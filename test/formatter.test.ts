import * as assert from "assert";
import { FormatConfig, formatText } from "../src/formatter";

const baseConfig: FormatConfig = {
  indentSize: 2,
  insertSpaces: true,
  commandCase: "lower",
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

  it("uppercases commands", () => {
    const config: FormatConfig = { ...baseConfig, commandCase: "upper" };
    const text = "#echo {Hi}";
    const formatted = formatText(text, config, "\n");
    assert.strictEqual(formatted, "#ECHO {Hi}");
  });

  it("preserves command casing", () => {
    const config: FormatConfig = { ...baseConfig, commandCase: "preserve" };
    const text = "#EcHo {Hi}";
    const formatted = formatText(text, config, "\n");
    assert.strictEqual(formatted, "#EcHo {Hi}");
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
      commandCase: "preserve",
      trimTrailingWhitespace: false,
    };
    const text = "#ECHO\t{Hi}   ";
    const formatted = formatText(text, config, "\n");
    assert.strictEqual(formatted, "#ECHO\t{Hi}   ");
  });
});
