import * as vscode from "vscode";
import { FormatConfig, formatText } from "./formatter";
import { LintConfig, lintText } from "./linter";

const DIAGNOSTIC_SOURCE = "tintin-lint";
const DEFAULT_DELAY_MS = 200;

export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection(DIAGNOSTIC_SOURCE);
  const debounceMap = new Map<string, NodeJS.Timeout>();

  const scheduleLint = (document: vscode.TextDocument) => {
    if (!shouldLintDocument(document)) {
      return;
    }

    const key = document.uri.toString();
    const existing = debounceMap.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      debounceMap.delete(key);
      lintDocument(document, diagnosticCollection);
    }, DEFAULT_DELAY_MS);

    debounceMap.set(key, timer);
  };

  context.subscriptions.push(
    diagnosticCollection,
    vscode.workspace.onDidOpenTextDocument(scheduleLint),
    vscode.workspace.onDidChangeTextDocument((event) => scheduleLint(event.document)),
    vscode.workspace.onDidSaveTextDocument(scheduleLint),
    vscode.languages.registerDocumentFormattingEditProvider({ language: "tintin" }, {
      provideDocumentFormattingEdits(document) {
        return formatDocument(document);
      },
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnosticCollection.delete(document.uri);
      const key = document.uri.toString();
      const timer = debounceMap.get(key);
      if (timer) {
        clearTimeout(timer);
        debounceMap.delete(key);
      }
    })
  );

  for (const document of vscode.workspace.textDocuments) {
    scheduleLint(document);
  }
}

function formatDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const config = vscode.workspace.getConfiguration("tintinFormat", document.uri);
  const formatConfig: FormatConfig = {
    indentSize: config.get<number>("indentSize", 2),
    insertSpaces: config.get<boolean>("insertSpaces", true),
    lowercaseCommands: config.get<boolean>("lowercaseCommands", true),
    trimTrailingWhitespace: config.get<boolean>("trimTrailingWhitespace", true),
  };

  const eol = document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
  const originalText = document.getText();
  const formattedText = formatText(originalText, formatConfig, eol);
  if (formattedText === originalText) {
    return [];
  }

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(originalText.length)
  );
  return [vscode.TextEdit.replace(fullRange, formattedText)];
}

function shouldLintDocument(document: vscode.TextDocument): boolean {
  if (document.isUntitled) {
    return true;
  }

  if (document.languageId === "tintin") {
    return true;
  }

  const fileName = document.fileName.toLowerCase();
  return fileName.endsWith(".tt") || fileName.endsWith(".tin") || fileName.endsWith(".tintin");
}

function lintDocument(
  document: vscode.TextDocument,
  diagnosticCollection: vscode.DiagnosticCollection
) {
  const config = vscode.workspace.getConfiguration("tintinLint", document.uri);
  const lintConfig: LintConfig = {
    maxLineLength: config.get<number>("maxLineLength", 120),
    disallowTabs: config.get<boolean>("disallowTabs", true),
    warnOnTrailingWhitespace: config.get<boolean>("warnOnTrailingWhitespace", true),
    enforceUppercaseCommands: config.get<boolean>("enforceUppercaseCommands", true),
  };

  const findings = lintText(document.getText(), lintConfig);
  const diagnostics = findings.map(
    (finding) =>
      new vscode.Diagnostic(
        new vscode.Range(
          finding.range.start.line,
          finding.range.start.character,
          finding.range.end.line,
          finding.range.end.character
        ),
        finding.message,
        vscode.DiagnosticSeverity.Warning
      )
  );

  diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {
  return undefined;
}
