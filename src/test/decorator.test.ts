import * as assert from 'assert';
import { Decorator } from '../decorator';
import FoldState from '../state';

suite('Decorator Unit Tests', () => {
      let decorator: Decorator;

      suiteSetup(() => {
            decorator = new Decorator();
      });

      test('startLine boundary calculations', () => {
            // Test case where line - offset < 0
            decorator.setStartLine(10);
            assert.strictEqual(decorator.startLine, 0, 'Should not go below 0');

            // Test case where line - offset >= 0
            decorator.setStartLine(100);
            assert.strictEqual(decorator.startLine, 50, 'Should calculate correct start line');

            // Test edge case
            decorator.setStartLine(50);
            assert.strictEqual(decorator.startLine, 0, 'Should handle exact offset value');
      });

      test('endLine boundary calculations', () => {
            // Mock CurrentEditor for testing
            const mockEditor = {
                  document: { lineCount: 100 }
            } as any;
            decorator.currentEditor = mockEditor;

            // Test normal case
            decorator.setEndLine(10);
            assert.strictEqual(decorator.endLine, 60, 'Should add offset to line number');

            // Test case where line + offset > lineCount
            decorator.setEndLine(80);
            assert.strictEqual(decorator.endLine, 100, 'Should not exceed document line count');

            // Test edge case
            decorator.setEndLine(50);
            assert.strictEqual(decorator.endLine, 100, 'Should handle edge case correctly');
      });
});
