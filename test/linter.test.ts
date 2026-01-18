import * as assert from "assert";
import { lintText, LintConfig } from "../src/linter";

const baseConfig: LintConfig = {
  maxLineLength: 10,
  disallowTabs: true,
  warnOnTrailingWhitespace: true,
  enforceUppercaseCommands: true,
  validateCommands: true,
};

describe("lintText", () => {
  it("flags long lines", () => {
    const diagnostics = lintText("01234567890", baseConfig);
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Line exceeds 10 characters (11).");
    assert.deepStrictEqual(diagnostics[0].range, {
      start: { line: 0, character: 10 },
      end: { line: 0, character: 11 },
    });
  });

  it("flags tabs", () => {
    const diagnostics = lintText("hi\tthere", baseConfig);
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Tab character found. Use spaces instead.");
    assert.deepStrictEqual(diagnostics[0].range, {
      start: { line: 0, character: 2 },
      end: { line: 0, character: 3 },
    });
  });

  it("flags trailing whitespace", () => {
    const diagnostics = lintText("trim me  ", baseConfig);
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Trailing whitespace.");
    assert.deepStrictEqual(diagnostics[0].range, {
      start: { line: 0, character: 7 },
      end: { line: 0, character: 9 },
    });
  });

  it("can return multiple findings across lines", () => {
    const diagnostics = lintText("01234567890\n\tbad  ", baseConfig);
    assert.strictEqual(diagnostics.length, 3);
    assert.strictEqual(diagnostics[0].message, "Line exceeds 10 characters (11).");
    assert.strictEqual(diagnostics[1].message, "Tab character found. Use spaces instead.");
    assert.strictEqual(diagnostics[2].message, "Trailing whitespace.");
  });

  it("flags lowercase commands", () => {
    const diagnostics = lintText("#echo hi;", baseConfig);
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Command '#echo' should be uppercase: '#ECHO'.");
    assert.deepStrictEqual(diagnostics[0].range, {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 5 },
    });
  });

  it("respects disabled rules", () => {
    const config: LintConfig = {
      maxLineLength: 0,
      disallowTabs: false,
      warnOnTrailingWhitespace: false,
      enforceUppercaseCommands: false,
      validateCommands: false,
    };
    const diagnostics = lintText("01234567890\t  #echo", config);
    assert.strictEqual(diagnostics.length, 0);
  });

  it("flags unrecognized commands", () => {
    const diagnostics = lintText("#INVALIDCOMMAND", { ...baseConfig, maxLineLength: 100 });
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Unrecognized command: '#INVALIDCOMMAND'.");
  });

  it("accepts valid commands", () => {
    const diagnostics = lintText("#ECHO {hi}; #VAR {x} {1};", baseConfig);
    // Might have other warnings if I didn't match the string perfectly, but assuming config is clean
    // baseConfig has maxLineLength: 10. The string above is long.
    // Let's use a short one.
    const shortDiagnostics = lintText("#ECHO", { ...baseConfig, maxLineLength: 100 });
    assert.strictEqual(shortDiagnostics.length, 0);
  });

  it("handles mixed case validation logic", () => {
    // #echo is valid command but lowercase.
    // Should flag as lowercase AND valid (so no "Unrecognized" error, only "uppercase" error).
    const diagnostics = lintText("#echo", { ...baseConfig, maxLineLength: 100 });
    assert.strictEqual(diagnostics.length, 1);
    assert.strictEqual(diagnostics[0].message, "Command '#echo' should be uppercase: '#ECHO'.");
    // Should NOT say "Unrecognized command".
  });

  it("respects validateCommands config", () => {
    const config: LintConfig = {
      ...baseConfig,
      validateCommands: false,
      maxLineLength: 100
    };
    const diagnostics = lintText("#INVALID", config);
    // Should be 0 because it's uppercase (so no case error) and validation is off.
    assert.strictEqual(diagnostics.length, 0);
  });
});
