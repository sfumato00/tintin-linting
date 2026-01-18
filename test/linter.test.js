"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const linter_1 = require("../src/linter");
const baseConfig = {
    maxLineLength: 10,
    disallowTabs: true,
    warnOnTrailingWhitespace: true,
    enforceUppercaseCommands: true,
};
describe("lintText", () => {
    it("flags long lines", () => {
        const diagnostics = (0, linter_1.lintText)("01234567890", baseConfig);
        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].message, "Line exceeds 10 characters (11).");
        assert.deepStrictEqual(diagnostics[0].range, {
            start: { line: 0, character: 10 },
            end: { line: 0, character: 11 },
        });
    });
    it("flags tabs", () => {
        const diagnostics = (0, linter_1.lintText)("hi\tthere", baseConfig);
        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].message, "Tab character found. Use spaces instead.");
        assert.deepStrictEqual(diagnostics[0].range, {
            start: { line: 0, character: 2 },
            end: { line: 0, character: 3 },
        });
    });
    it("flags trailing whitespace", () => {
        const diagnostics = (0, linter_1.lintText)("trim me  ", baseConfig);
        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].message, "Trailing whitespace.");
        assert.deepStrictEqual(diagnostics[0].range, {
            start: { line: 0, character: 7 },
            end: { line: 0, character: 9 },
        });
    });
    it("can return multiple findings across lines", () => {
        const diagnostics = (0, linter_1.lintText)("01234567890\n\tbad  ", baseConfig);
        assert.strictEqual(diagnostics.length, 3);
        assert.strictEqual(diagnostics[0].message, "Line exceeds 10 characters (11).");
        assert.strictEqual(diagnostics[1].message, "Tab character found. Use spaces instead.");
        assert.strictEqual(diagnostics[2].message, "Trailing whitespace.");
    });
    it("flags lowercase commands", () => {
        const diagnostics = (0, linter_1.lintText)("#echo hi;", baseConfig);
        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].message, "Command '#echo' should be uppercase: '#ECHO'.");
        assert.deepStrictEqual(diagnostics[0].range, {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 5 },
        });
    });
    it("respects disabled rules", () => {
        const config = {
            maxLineLength: 0,
            disallowTabs: false,
            warnOnTrailingWhitespace: false,
            enforceUppercaseCommands: false,
        };
        const diagnostics = (0, linter_1.lintText)("01234567890\t  #echo", config);
        assert.strictEqual(diagnostics.length, 0);
    });
});
//# sourceMappingURL=linter.test.js.map