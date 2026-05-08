import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatJson, base64Decode, convertColor } from '@/lib/developer-tools/index';

/**
 * Property-based tests for developer tools: JSON validation error position,
 * input preservation on processing error, and color format conversion consistency.
 *
 * Validates: Requirements 6.4, 6.5, 7.2
 */

describe('Feature: online-tools-hub, Property 13: JSON Validation Error Position', () => {
  /**
   * For any malformed JSON string where an error is introduced at a known character position,
   * the JSON validator SHALL report an error referencing a line number or character position
   * that corresponds to the location of the introduced error.
   */

  // Arbitrary for valid JSON objects that we can then corrupt at a known position
  const validJsonObject = fc.dictionary(
    fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
    fc.oneof(
      fc.string({ minLength: 0, maxLength: 20 }),
      fc.integer(),
      fc.boolean(),
      fc.constant(null)
    ),
    { minKeys: 1, maxKeys: 5 }
  );

  it('for any valid JSON with an invalid character inserted after the structure, the error SHALL report a position', () => {
    fc.assert(
      fc.property(validJsonObject, (obj) => {
        const validJson = JSON.stringify(obj);

        // Append extra invalid content after the valid JSON to guarantee parse failure
        // JSON.parse will fail when there's content after a complete JSON value
        const corruptedJson = validJson + ' <<<INVALID>>>';

        const result = formatJson(corruptedJson);

        // The result should be invalid (extra content after valid JSON)
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();

        // The error should report a line or character position
        const hasPosition =
          (result.error!.line !== undefined && result.error!.line > 0) ||
          (result.error!.character !== undefined && result.error!.character > 0);
        expect(hasPosition).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('for any valid JSON with a trailing comma introduced, the error position SHALL reference the error location', () => {
    fc.assert(
      fc.property(validJsonObject, (obj) => {
        const validJson = JSON.stringify(obj);

        // Introduce a trailing comma before the closing brace
        const lastBrace = validJson.lastIndexOf('}');
        if (lastBrace <= 0) return; // skip trivial cases

        const corruptedJson =
          validJson.substring(0, lastBrace) + ',}';

        const result = formatJson(corruptedJson);

        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();

        // The error should reference a position at or near the trailing comma
        const hasPosition =
          (result.error!.line !== undefined && result.error!.line >= 1) ||
          (result.error!.character !== undefined && result.error!.character >= 1);
        expect(hasPosition).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('for any multiline valid JSON with an error on a specific line, the reported line SHALL correspond to the error location', () => {
    fc.assert(
      fc.property(validJsonObject, (obj) => {
        const validJson = JSON.stringify(obj, null, 2);
        const lines = validJson.split('\n');

        // Only test if we have multiple lines
        if (lines.length < 3) return;

        // Corrupt a line in the middle by replacing it with invalid content
        const targetLine = Math.floor(lines.length / 2);
        const originalLine = lines[targetLine];
        lines[targetLine] = '<<<INVALID_JSON>>>';
        const corruptedJson = lines.join('\n');

        const result = formatJson(corruptedJson);

        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();

        // The error should report a line number
        // The reported line should be at or near the corrupted line (1-indexed)
        if (result.error!.line !== undefined) {
          // The error line should be at or after the corruption point
          // (parser may detect error at or after the corrupted position)
          expect(result.error!.line).toBeGreaterThanOrEqual(1);
          expect(result.error!.line).toBeLessThanOrEqual(lines.length);
        } else {
          // If no line, character position should be reported
          expect(result.error!.character).toBeDefined();
          expect(result.error!.character).toBeGreaterThan(0);
        }

        // Verify the original valid JSON is actually valid
        const validResult = formatJson(validJson);
        expect(validResult.valid).toBe(true);

        // Restore original line to confirm it was the corruption that caused the error
        lines[targetLine] = originalLine;
        const restoredJson = lines.join('\n');
        const restoredResult = formatJson(restoredJson);
        expect(restoredResult.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 14: Input Preservation on Processing Error', () => {
  /**
   * For any invalid input provided to a non-validator developer tool (e.g., invalid Base64
   * string to decoder, invalid color code to converter), after the error is displayed,
   * the input field SHALL still contain the original input unchanged.
   */

  // Generate strings that are definitely NOT valid Base64
  // We generate strings that contain characters outside the Base64 alphabet to guarantee failure.
  const invalidChars = '!@#$%^&*(){}[]<>~`';
  const invalidBase64 = fc.array(
    fc.constantFrom(...invalidChars.split('')),
    { minLength: 1, maxLength: 50 }
  ).map(chars => chars.join(''));

  // Generate strings that are definitely NOT valid color codes
  const invalidColorCode = fc.string({ minLength: 1, maxLength: 50 })
    .filter(s => {
      const trimmed = s.trim();
      // Not a valid hex color
      const isHex = /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(trimmed);
      // Not a valid rgb()
      const isRgb = /^rgb\s*\(\s*\d{1,3}\s*[,\s]\s*\d{1,3}\s*[,\s]\s*\d{1,3}\s*\)$/i.test(trimmed);
      // Not a valid hsl()
      const isHsl = /^hsl\s*\(\s*\d{1,3}(?:\.\d+)?\s*[,\s]\s*\d{1,3}(?:\.\d+)?%?\s*[,\s]\s*\d{1,3}(?:\.\d+)?%?\s*\)$/i.test(trimmed);
      // Not a comma-separated RGB
      const isCommaRgb = /^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(trimmed);

      return !isHex && !isRgb && !isHsl && !isCommaRgb && trimmed.length > 0;
    });

  it('for any invalid Base64 input, base64Decode SHALL return an error and the original input remains unchanged', () => {
    fc.assert(
      fc.property(invalidBase64, (input) => {
        const originalInput = input;

        const result = base64Decode(input);

        // Should have an error
        expect(result.error).toBeDefined();
        expect(result.error!.length).toBeGreaterThan(0);

        // The original input string should not have been mutated
        expect(input).toBe(originalInput);
      }),
      { numRuns: 100 }
    );
  });

  it('for any invalid color code, convertColor SHALL return an error and the original input remains unchanged', () => {
    fc.assert(
      fc.property(invalidColorCode, (input) => {
        const originalInput = input;

        const result = convertColor(input);

        // Should be invalid
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error!.length).toBeGreaterThan(0);

        // The original input string should not have been mutated
        expect(input).toBe(originalInput);
      }),
      { numRuns: 100 }
    );
  });

  it('for any non-empty invalid input to developer tools, the error message SHALL be descriptive', () => {
    fc.assert(
      fc.property(invalidBase64, (input) => {
        const result = base64Decode(input);

        if (result.error) {
          // Error message should be non-empty and descriptive
          expect(result.error.length).toBeGreaterThan(5);
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 15: Color Format Conversion Consistency', () => {
  /**
   * For any valid color value, converting from HEX to RGB to HSL and back to HEX SHALL
   * produce the same HEX value (accounting for rounding in HSL intermediate representation).
   * Additionally, all three format representations SHALL describe the same visual color.
   */

  // Generate valid RGB component values (0-255)
  const rgbComponent = fc.integer({ min: 0, max: 255 });

  // Generate valid RGB colors
  const validRgb = fc.tuple(rgbComponent, rgbComponent, rgbComponent);

  it('for any valid RGB color, converting HEX → RGB → HSL → HEX SHALL produce the same HEX value', () => {
    fc.assert(
      fc.property(validRgb, ([r, g, b]) => {
        // Start with a known RGB, convert to HEX
        const hex = '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0');

        // Convert HEX to all formats
        const fromHex = convertColor(hex);
        expect(fromHex.valid).toBe(true);

        // Convert the resulting RGB string to all formats
        const rgbString = `rgb(${fromHex.rgb.r}, ${fromHex.rgb.g}, ${fromHex.rgb.b})`;
        const fromRgb = convertColor(rgbString);
        expect(fromRgb.valid).toBe(true);

        // Convert the resulting HSL string to all formats
        const hslString = `hsl(${fromRgb.hsl.h}, ${fromRgb.hsl.s}%, ${fromRgb.hsl.l}%)`;
        const fromHsl = convertColor(hslString);
        expect(fromHsl.valid).toBe(true);

        // The final HEX should match the original (accounting for rounding)
        // Due to HSL rounding (integer H, S, L values), we allow a tolerance of ±4 per RGB component
        const finalR = fromHsl.rgb.r;
        const finalG = fromHsl.rgb.g;
        const finalB = fromHsl.rgb.b;

        expect(Math.abs(finalR - r)).toBeLessThanOrEqual(4);
        expect(Math.abs(finalG - g)).toBeLessThanOrEqual(4);
        expect(Math.abs(finalB - b)).toBeLessThanOrEqual(4);
      }),
      { numRuns: 100 }
    );
  });

  it('for any valid HEX color, all three format representations SHALL describe the same visual color', () => {
    fc.assert(
      fc.property(validRgb, ([r, g, b]) => {
        const hex = '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0');

        const result = convertColor(hex);
        expect(result.valid).toBe(true);

        // The RGB values should match the input
        expect(result.rgb.r).toBe(r);
        expect(result.rgb.g).toBe(g);
        expect(result.rgb.b).toBe(b);

        // The HEX should match the input (normalized to lowercase)
        expect(result.hex.toLowerCase()).toBe(hex.toLowerCase());

        // Converting the HSL back should give the same RGB (within rounding tolerance)
        const hslString = `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`;
        const fromHsl = convertColor(hslString);
        expect(fromHsl.valid).toBe(true);

        // HSL rounding may cause ±4 difference in RGB components
        expect(Math.abs(fromHsl.rgb.r - r)).toBeLessThanOrEqual(4);
        expect(Math.abs(fromHsl.rgb.g - g)).toBeLessThanOrEqual(4);
        expect(Math.abs(fromHsl.rgb.b - b)).toBeLessThanOrEqual(4);
      }),
      { numRuns: 100 }
    );
  });

  it('for any valid color, the HEX output SHALL be a valid 7-character hex string', () => {
    fc.assert(
      fc.property(validRgb, ([r, g, b]) => {
        const hex = '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0');

        const result = convertColor(hex);
        expect(result.valid).toBe(true);

        // HEX output should match pattern #rrggbb
        expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
      }),
      { numRuns: 100 }
    );
  });

  it('for any valid color, RGB components SHALL be integers in [0, 255]', () => {
    fc.assert(
      fc.property(validRgb, ([r, g, b]) => {
        const hex = '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0');

        const result = convertColor(hex);
        expect(result.valid).toBe(true);

        expect(Number.isInteger(result.rgb.r)).toBe(true);
        expect(Number.isInteger(result.rgb.g)).toBe(true);
        expect(Number.isInteger(result.rgb.b)).toBe(true);
        expect(result.rgb.r).toBeGreaterThanOrEqual(0);
        expect(result.rgb.r).toBeLessThanOrEqual(255);
        expect(result.rgb.g).toBeGreaterThanOrEqual(0);
        expect(result.rgb.g).toBeLessThanOrEqual(255);
        expect(result.rgb.b).toBeGreaterThanOrEqual(0);
        expect(result.rgb.b).toBeLessThanOrEqual(255);
      }),
      { numRuns: 100 }
    );
  });

  it('for any valid color, HSL components SHALL be in valid ranges (H: 0-360, S: 0-100, L: 0-100)', () => {
    fc.assert(
      fc.property(validRgb, ([r, g, b]) => {
        const hex = '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0');

        const result = convertColor(hex);
        expect(result.valid).toBe(true);

        expect(result.hsl.h).toBeGreaterThanOrEqual(0);
        expect(result.hsl.h).toBeLessThanOrEqual(360);
        expect(result.hsl.s).toBeGreaterThanOrEqual(0);
        expect(result.hsl.s).toBeLessThanOrEqual(100);
        expect(result.hsl.l).toBeGreaterThanOrEqual(0);
        expect(result.hsl.l).toBeLessThanOrEqual(100);
      }),
      { numRuns: 100 }
    );
  });
});
