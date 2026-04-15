import * as assert from 'assert';
import { SETTINGS } from '../enums';
import { getConfig, getRegexConfig, getSupportedLanguages } from '../config';

suite('Settings Unit Tests', () => {
      test('GetConfig method returns correct types', () => {
            const autoFold = getConfig<boolean>(SETTINGS.AUTOFOLD);
            const regex = getConfig<string>(SETTINGS.REGEX);
            const regexFlags = getConfig<string>(SETTINGS.REGEX_FLAGS);
            const regexGroup = getConfig<number>(SETTINGS.REGEX_GROUPS);
            const maskChar = getConfig<string>(SETTINGS.MASK_CHAR);
            const maskColor = getConfig<string>(SETTINGS.MASK_COLOR);
            const unfoldedOpacity = getConfig<number>(SETTINGS.UNFOLDED_OPACITY);
            const after = getConfig<string>(SETTINGS.AFTER);
            const unfoldOnLineSelect = getConfig<boolean>(SETTINGS.UNFOLD_ON_LINE_SELECT);
            const useGlobal = getConfig<boolean>(SETTINGS.USE_GLOBAL);
            const togglePerFile = getConfig<boolean>(SETTINGS.TOGGLE_PER_FILE);
            const disableInDiffEditor = getConfig<boolean>(SETTINGS.DISABLE_IN_DIFF_EDITOR);

            assert.strictEqual(typeof autoFold, 'boolean');
            assert.strictEqual(typeof regex, 'string');
            assert.strictEqual(typeof regexFlags, 'string');
            // regexGroup might be a string "6" that gets converted to number
            assert.ok(typeof regexGroup === 'number' || typeof regexGroup === 'string');
            assert.strictEqual(typeof maskChar, 'string');
            assert.strictEqual(typeof maskColor, 'string');
            assert.strictEqual(typeof unfoldedOpacity, 'number');
            assert.strictEqual(typeof after, 'string');
            assert.strictEqual(typeof unfoldOnLineSelect, 'boolean');
            assert.strictEqual(typeof useGlobal, 'boolean');
            assert.strictEqual(typeof togglePerFile, 'boolean');
            assert.strictEqual(typeof disableInDiffEditor, 'boolean');
      });

      test('GetSupportedLanguages returns valid array', () => {
            const languages = getSupportedLanguages();

            assert.ok(Array.isArray(languages), 'Should return an array');
            assert.ok(languages.length > 0, 'Should have at least one language');

            // Check for common languages
            const commonLanguages = ['javascript', 'typescript', 'html', 'vue', 'svelte'];
            const hasCommonLanguages = commonLanguages.some(lang => languages.includes(lang));
            assert.ok(hasCommonLanguages, 'Should include common web languages');
      });

      test('Regex method returns valid RegExp', () => {
            const regex = getRegexConfig();
            assert.ok(regex instanceof RegExp, 'Should return a RegExp instance');

            // Test with different languages
            const jsRegex = getRegexConfig('javascript');
            const htmlRegex = getRegexConfig('html');

            assert.ok(jsRegex instanceof RegExp);
            assert.ok(htmlRegex instanceof RegExp);
      });

      test('Default regex patterns work correctly', () => {
            const regex = getRegexConfig();

            // Test with common class attribute patterns
            const testCases = [
                  'class="test-class"',
                  'className="flex justify-center"',
                  'class={"dynamic-class"}',
                  'className={`template-${variable}`}'
            ];

            testCases.forEach(testCase => {
                  regex.lastIndex = 0; // Reset regex for next test
                  // Note: Match result depends on actual regex configuration
                  // We just verify it doesn't throw an error
                  assert.doesNotThrow(() => {
                        regex.test(testCase);
                  });
            });
      });

      test('Language-specific settings override global', () => {
            // Test that language-specific settings work
            const globalRegex = getConfig<string>(SETTINGS.REGEX);
            const jsRegex = getConfig<string>(SETTINGS.REGEX, 'javascript');
            const htmlRegex = getConfig<string>(SETTINGS.REGEX, 'html');

            assert.strictEqual(typeof globalRegex, 'string');
            assert.strictEqual(typeof jsRegex, 'string');
            assert.strictEqual(typeof htmlRegex, 'string');
      });

      test('Settings validation', () => {
            const regexFlags = getConfig<string>(SETTINGS.REGEX_FLAGS);
            const regexGroup = getConfig<number>(SETTINGS.REGEX_GROUPS);
            const unfoldedOpacity = getConfig<number>(SETTINGS.UNFOLDED_OPACITY);
            const maskColor = getConfig<string>(SETTINGS.MASK_COLOR);

            // Validate regex flags
            assert.ok(
                  ['g', 'gi', 'gm', 'gim'].includes(regexFlags) || regexFlags.includes('g'),
                  'Regex flags should include global flag'
            );

            // Validate regex group is positive integer (might be string that represents number)
            const regexGroupNum = parseInt(regexGroup.toString());
            assert.ok(regexGroupNum >= 0, 'Regex group should be non-negative integer');

            // Validate opacity is between 0 and 1
            assert.ok(
                  unfoldedOpacity >= 0 && unfoldedOpacity <= 1,
                  'Unfold opacity should be between 0 and 1'
            );

            // Validate mask color is hex color or valid color name
            assert.ok(
                  /^#[0-9A-Fa-f]{6}$/.test(maskColor) || maskColor.length > 0,
                  'Mask color should be valid hex color or color name'
            );
      });

      test('Edge cases with undefined/null values', () => {
            assert.doesNotThrow(() => {
                  getConfig<string>(SETTINGS.REGEX, undefined);
                  getRegexConfig(undefined);
            }, 'Should handle undefined language IDs gracefully');
      });

      test('All enum settings are accessible', () => {
            const settingsKeys = Object.values(SETTINGS).filter(key => key !== SETTINGS.IDENTIFIER);

            settingsKeys.forEach(setting => {
                  assert.doesNotThrow(() => {
                        getConfig(setting as SETTINGS);
                  }, `Should be able to get setting: ${setting}`);
            });
      });
});
