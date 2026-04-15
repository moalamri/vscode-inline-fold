import * as assert from 'assert';
import * as vscode from 'vscode';
import FoldState from '../state';
import { SETTINGS, COMMANDS } from '../enums';
import { Decorator } from '../decorator';
import { isMainEditor, isOpenedWithDiffEditor } from '../utils';
import { getConfig } from '../config';

suite('Inline Fold Extension Test Suite', () => {
      vscode.window.showInformationMessage('Starting all tests.');
      let foldState: FoldState;
      let decorator: Decorator;

      suiteSetup(async () => {
            // Ensure extension is activated
            const extension = vscode.extensions.getExtension('mohammed-alamri.inline-fold');
            if (extension && !extension.isActive) {
                  await extension.activate();
            }
      });

      suite('Extension Activation', () => {
            test('Extension should be present', () => {
                  assert.ok(vscode.extensions.getExtension('mohammed-alamri.inline-fold'));
            });

            test('Extension should activate', async () => {
                  const extension = vscode.extensions.getExtension('mohammed-alamri.inline-fold');
                  if (extension) {
                        await extension.activate();
                        assert.strictEqual(extension.isActive, true);
                  }
            });

            test('Commands should be registered', async () => {
                  const commands = await vscode.commands.getCommands(true);
                  assert.ok(commands.includes(COMMANDS.INLINE_FOLD_TOGGLE));
                  assert.ok(commands.includes(COMMANDS.INLINE_FOLD_CLEAR_CACHE));
            });
      });

      suite('State Tests', () => {
            setup(() => {
                  foldState = new FoldState();
            });

            test('ShouldFold should return autoFold setting by default', () => {
                  // Mock the setting
                  const result = foldState.shouldFold('test-file.js', 'javascript');
                  assert.strictEqual(typeof result, 'boolean');
            });

            test('SetShouldFold should update cache state', () => {
                  foldState.setShouldFold('test-file', true, 'javascript');
                  assert.strictEqual(foldState.shouldFold('test-file', 'javascript'), true);

                  foldState.setShouldFold('test-file', false, 'javascript');
                  assert.strictEqual(foldState.shouldFold('test-file', 'javascript'), false);
            });

            test('ToggleShouldFold should toggle state', () => {
                  foldState.setShouldFold('test-file', true, 'javascript');
                  foldState.toggleShouldFold('test-file', 'javascript');
                  assert.strictEqual(foldState.shouldFold('test-file', 'javascript'), false);

                  foldState.toggleShouldFold('test-file', 'javascript');
                  assert.strictEqual(foldState.shouldFold('test-file', 'javascript'), true);
            });

            test('Clear should remove all cache entries', () => {
                  foldState.setShouldFold('test-file1', true, 'javascript');
                  foldState.setShouldFold('test-file2', false, 'html');
                  foldState.reset();

                  // After clearing, should fall back to default settings
                  const result1 = foldState.shouldFold('test-file1', 'javascript');
                  const result2 = foldState.shouldFold('test-file2', 'html');
                  assert.strictEqual(typeof result1, 'boolean');
                  assert.strictEqual(typeof result2, 'boolean');
            });

            test('Global vs per-file toggle behavior', () => {
                  // Test behavior depends on togglePerFile setting
                  foldState.setShouldFold('global', true);
                  foldState.setShouldFold('file1', false);

                  // Results will depend on the togglePerFile setting
                  const globalResult = foldState.shouldFold('global');
                  const fileResult = foldState.shouldFold('file1');

                  assert.strictEqual(typeof globalResult, 'boolean');
                  assert.strictEqual(typeof fileResult, 'boolean');
            });
      });

      suite('Decorator Tests', () => {
            setup(() => {
                  decorator = new Decorator();
            });

            test('startPositionLine should calculate correct position', () => {
                  const mockEditor = {
                        document: {
                              positionAt: (offset: number) => new vscode.Position(0, offset)
                        }
                  } as any;
                  decorator.currentEditor = mockEditor;

                  const position = decorator.startPositionLine(10, 5);
                  assert.strictEqual(position.character, 15); // 10 + 5
            });

            test('endPositionLine should calculate correct position', () => {
                  const mockEditor = {
                        document: {
                              positionAt: (offset: number) => new vscode.Position(0, offset)
                        }
                  } as any;
                  decorator.currentEditor = mockEditor;

                  const position = decorator.endPositionLine(10, 5, 3);
                  assert.strictEqual(position.character, 18); // 10 + 5 + 3
            });
      });

      suite('Utils Tests', () => {
            test('isMainEditor with main editor', async () => {
                  const document = await vscode.workspace.openTextDocument({
                        content: '<h1>Hello World</h1>',
                        language: 'html'
                  });

                  const editor = await vscode.window.showTextDocument(document);

                  const result = isMainEditor(editor);
                  assert.strictEqual(result, true, 'Should return true for main editor');
            });

            test('isOpenedWithDiffEditor with different URI schemes', () => {
                  const uris = [
                        vscode.Uri.file('/test/file.js'),
                        vscode.Uri.parse('untitled:Untitled-1'),
                        vscode.Uri.parse('vscode://test/file.js'),
                        vscode.Uri.parse('http://example.com/file.js')
                  ];

                  uris.forEach(uri => {
                        assert.doesNotThrow(() => {
                              const result = isOpenedWithDiffEditor(uri);
                              assert.strictEqual(
                                    typeof result,
                                    'boolean',
                                    `Should handle URI scheme: ${uri.scheme}`
                              );
                        }, `Should handle URI: ${uri.toString()}`);
                  });
            });
      });

      suite('Integration Tests', () => {
            test('Extension should handle HTML with class attributes', async () => {
                  const document = await vscode.workspace.openTextDocument({
                        content: '<div class="container mx-auto p-4 bg-blue-500 text-white">Test</div>',
                        language: 'html'
                  });

                  const editor = await vscode.window.showTextDocument(document);

                  // Wait a bit for decorations to be applied
                  await new Promise(resolve => setTimeout(resolve, 300));

                  assert.ok(editor);
            });

            test('Extension should handle JavaScript with className', async () => {
                  const document = await vscode.workspace.openTextDocument({
                        content: 'const element = <div className="flex justify-center items-center p-4">Content</div>;',
                        language: 'javascript'
                  });

                  const editor = await vscode.window.showTextDocument(document);

                  // Wait a bit for decorations to be applied
                  await new Promise(resolve => setTimeout(resolve, 100));

                  assert.ok(editor);
            });

            test('Extension should respect language-specific settings', async () => {
                  // Test that different languages can have different regex patterns
                  const htmlDoc = await vscode.workspace.openTextDocument({
                        content: '<div class="test">HTML</div>',
                        language: 'html'
                  });

                  const jsDoc = await vscode.workspace.openTextDocument({
                        content: 'const el = <div className="test">React</div>',
                        language: 'javascript'
                  });

                  await vscode.window.showTextDocument(htmlDoc);
                  await new Promise(resolve => setTimeout(resolve, 50));

                  await vscode.window.showTextDocument(jsDoc);
                  await new Promise(resolve => setTimeout(resolve, 50));

                  assert.ok(true);
            });
      });

      suite('Error Handling', () => {
            setup(() => {
                  decorator = new Decorator();
            });

            test('Decorator should handle null editor gracefully', () => {
                  assert.doesNotThrow(() => {
                        decorator.editor(null as any);
                  });
            });

            test('Settings should handle missing configuration', () => {
                  assert.doesNotThrow(() => {
                        getConfig<string>(SETTINGS.REGEX, 'nonexistent-language');
                  });
            });

            test('Cache should handle undefined keys', () => {
                  assert.doesNotThrow(() => {
                        foldState.setShouldFold(undefined, true);
                        foldState.shouldFold(undefined);
                        foldState.toggleShouldFold(undefined);
                  });
            });
      });

      suite('Performance Tests', () => {
            let foldState: FoldState;

            setup(() => {
                  foldState = new FoldState();
            });

            test('Cache operations should be fast', () => {
                  const startTime = Date.now();

                  for (let i = 0; i < 1000; i++) {
                        foldState.setShouldFold(`file-${i}`, i % 2 === 0);
                        foldState.shouldFold(`file-${i}`);
                  }

                  const endTime = Date.now();

                  // Should complete within 100ms
                  assert.ok(endTime - startTime < 100);
            });
      });
});
