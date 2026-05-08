import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateGradientCSS,
  generatePalette,
  calculateAspectRatio,
  gcd,
  rgbToHex,
  imageToBase64,
} from '@/lib/image-color-tools';
import type { GradientConfig, GradientStop } from '@/lib/image-color-tools';

/**
 * Property-based tests for image and color tools.
 *
 * Validates: Requirements 7.2, 7.3, 7.4, 7.5, 7.6
 */

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates a valid HEX color string (#RRGGBB).
 */
function hexColorArb(): fc.Arbitrary<string> {
  return fc
    .tuple(
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 })
    )
    .map(([r, g, b]) => rgbToHex(r, g, b));
}

/**
 * Generates a valid gradient direction for linear gradients.
 */
function linearDirectionArb(): fc.Arbitrary<string> {
  return fc.oneof(
    fc.constant('to right'),
    fc.constant('to left'),
    fc.constant('to top'),
    fc.constant('to bottom'),
    fc.constant('to top right'),
    fc.constant('to bottom left'),
    fc.integer({ min: 0, max: 360 }).map((deg) => `${deg}deg`)
  );
}

/**
 * Generates a valid gradient direction for radial gradients.
 */
function radialDirectionArb(): fc.Arbitrary<string> {
  return fc.oneof(
    fc.constant('circle'),
    fc.constant('ellipse'),
    fc.constant('circle at center'),
    fc.constant('ellipse at center'),
    fc.constant('circle at top left')
  );
}

/**
 * Generates a valid gradient stop with a HEX color and optional position.
 */
function gradientStopArb(): fc.Arbitrary<GradientStop> {
  return fc.record({
    color: hexColorArb(),
    position: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
  });
}

/**
 * Generates a valid gradient configuration with 2-10 color stops.
 */
function gradientConfigArb(): fc.Arbitrary<GradientConfig> {
  return fc
    .oneof(fc.constant('linear' as const), fc.constant('radial' as const))
    .chain((type) => {
      const dirArb =
        type === 'linear' ? linearDirectionArb() : radialDirectionArb();
      return fc.tuple(
        fc.constant(type),
        dirArb,
        fc.array(gradientStopArb(), { minLength: 2, maxLength: 10 })
      );
    })
    .map(([type, direction, stops]) => ({ type, direction, stops }));
}

/**
 * Generates a valid base color string in HEX format for palette generation.
 */
function baseColorArb(): fc.Arbitrary<string> {
  return hexColorArb();
}

/**
 * Generates positive integer pairs for aspect ratio testing.
 */
function dimensionPairArb(): fc.Arbitrary<{ width: number; height: number }> {
  return fc.record({
    width: fc.integer({ min: 1, max: 100000 }),
    height: fc.integer({ min: 1, max: 100000 }),
  });
}

// ─── Property 16: CSS Gradient Code Validity ─────────────────────────────────

describe('Feature: online-tools-hub, Property 16: CSS Gradient Code Validity', () => {
  it('for any valid gradient configuration, the generated CSS code SHALL be a syntactically valid CSS gradient declaration', () => {
    /**
     * Validates: Requirements 7.3
     */
    fc.assert(
      fc.property(gradientConfigArb(), (config) => {
        const css = generateGradientCSS(config);

        // Must be a non-empty string
        expect(css).toBeTruthy();
        expect(typeof css).toBe('string');

        // Must start with either linear-gradient( or radial-gradient(
        if (config.type === 'linear') {
          expect(css).toMatch(/^linear-gradient\(/);
        } else {
          expect(css).toMatch(/^radial-gradient\(/);
        }

        // Must end with a closing parenthesis
        expect(css).toMatch(/\)$/);

        // Must contain at least 2 color values (from the stops)
        // Each stop color is a HEX value like #RRGGBB
        const hexMatches = css.match(/#[0-9A-Fa-f]{6}/g);
        expect(hexMatches).not.toBeNull();
        expect(hexMatches!.length).toBeGreaterThanOrEqual(2);
        expect(hexMatches!.length).toBeLessThanOrEqual(10);

        // Parentheses must be balanced
        const openCount = (css.match(/\(/g) || []).length;
        const closeCount = (css.match(/\)/g) || []).length;
        expect(openCount).toBe(closeCount);
      }),
      { numRuns: 100 }
    );
  });

  it('linear gradients SHALL include the direction in the output', () => {
    /**
     * Validates: Requirements 7.3
     */
    fc.assert(
      fc.property(
        fc.tuple(
          linearDirectionArb(),
          fc.array(gradientStopArb(), { minLength: 2, maxLength: 10 })
        ),
        ([direction, stops]) => {
          const config: GradientConfig = { type: 'linear', direction, stops };
          const css = generateGradientCSS(config);

          expect(css).toContain('linear-gradient(');
          expect(css).toContain(direction);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('radial gradients SHALL include the shape/direction in the output', () => {
    /**
     * Validates: Requirements 7.3
     */
    fc.assert(
      fc.property(
        fc.tuple(
          radialDirectionArb(),
          fc.array(gradientStopArb(), { minLength: 2, maxLength: 10 })
        ),
        ([direction, stops]) => {
          const config: GradientConfig = { type: 'radial', direction, stops };
          const css = generateGradientCSS(config);

          expect(css).toContain('radial-gradient(');
          expect(css).toContain(direction);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 17: Image to Base64 Round-Trip (Note) ──────────────────────────

describe('Feature: online-tools-hub, Property 17: Image to Base64 Round-Trip', () => {
  /**
   * NOTE: Property 17 requires actual File objects and FileReader API which are
   * not available in a jsdom/Node.js unit test environment. The imageToBase64
   * function uses the browser's FileReader API to read files as data URLs.
   *
   * This property requires integration testing with actual file I/O in a
   * browser environment (e.g., Playwright or Cypress).
   *
   * The conceptual property is:
   * For any valid image file (PNG, JPEG, GIF, WEBP, SVG) of size ≤5 MB,
   * encoding to Base64 and decoding the Base64 string back SHALL produce
   * byte-identical data to the original file.
   *
   * Validates: Requirements 7.4
   */
  it('conceptual: imageToBase64 function exists and is callable (full round-trip requires browser environment)', () => {
    // Verify the function exists and is exported
    expect(typeof imageToBase64).toBe('function');
  });
});

// ─── Property 18: Palette Generation Constraints ─────────────────────────────

describe('Feature: online-tools-hub, Property 18: Palette Generation Constraints', () => {
  it('for any valid base color, the Palette Generator SHALL produce exactly 5 colors', () => {
    /**
     * Validates: Requirements 7.5
     */
    fc.assert(
      fc.property(baseColorArb(), (baseColor) => {
        const palette = generatePalette(baseColor);

        expect(palette).toHaveLength(5);
      }),
      { numRuns: 100 }
    );
  });

  it('each palette color SHALL have a valid HEX code matching #[0-9A-Fa-f]{6}', () => {
    /**
     * Validates: Requirements 7.5
     */
    fc.assert(
      fc.property(baseColorArb(), (baseColor) => {
        const palette = generatePalette(baseColor);

        for (const color of palette) {
          expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('each palette color SHALL have valid RGB values (each component in [0, 255])', () => {
    /**
     * Validates: Requirements 7.5
     */
    fc.assert(
      fc.property(baseColorArb(), (baseColor) => {
        const palette = generatePalette(baseColor);

        for (const color of palette) {
          expect(color.rgb.r).toBeGreaterThanOrEqual(0);
          expect(color.rgb.r).toBeLessThanOrEqual(255);
          expect(color.rgb.g).toBeGreaterThanOrEqual(0);
          expect(color.rgb.g).toBeLessThanOrEqual(255);
          expect(color.rgb.b).toBeGreaterThanOrEqual(0);
          expect(color.rgb.b).toBeLessThanOrEqual(255);

          // RGB values should be integers
          expect(Number.isInteger(color.rgb.r)).toBe(true);
          expect(Number.isInteger(color.rgb.g)).toBe(true);
          expect(Number.isInteger(color.rgb.b)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('all 5 palette colors SHALL be distinct from each other', () => {
    /**
     * Validates: Requirements 7.5
     */
    fc.assert(
      fc.property(baseColorArb(), (baseColor) => {
        const palette = generatePalette(baseColor);

        const hexValues = palette.map((c) => c.hex);
        const uniqueHexValues = new Set(hexValues);

        expect(uniqueHexValues.size).toBe(5);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 19: Aspect Ratio Simplification ────────────────────────────────

describe('Feature: online-tools-hub, Property 19: Aspect Ratio Simplification', () => {
  it('for any positive integer width and height, the simplified ratio SHALL have GCD(w, h) = 1', () => {
    /**
     * Validates: Requirements 7.6
     */
    fc.assert(
      fc.property(dimensionPairArb(), ({ width, height }) => {
        const result = calculateAspectRatio(width, height);

        // The simplified ratio components should be coprime
        const g = gcd(result.simplified.w, result.simplified.h);
        expect(g).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  it('the simplified ratio w/h SHALL equal the original width/height ratio', () => {
    /**
     * Validates: Requirements 7.6
     */
    fc.assert(
      fc.property(dimensionPairArb(), ({ width, height }) => {
        const result = calculateAspectRatio(width, height);

        // The ratio should be preserved: simplified.w / simplified.h === width / height
        const originalRatio = width / height;
        const simplifiedRatio = result.simplified.w / result.simplified.h;

        // Use relative tolerance for floating-point comparison
        const diff = Math.abs(originalRatio - simplifiedRatio);
        const tolerance = Math.max(1e-9, Math.abs(originalRatio) * 1e-9);
        expect(diff).toBeLessThanOrEqual(tolerance);
      }),
      { numRuns: 100 }
    );
  });

  it('the ratio string SHALL be in the format "w:h"', () => {
    /**
     * Validates: Requirements 7.6
     */
    fc.assert(
      fc.property(dimensionPairArb(), ({ width, height }) => {
        const result = calculateAspectRatio(width, height);

        // Ratio string should match the pattern "number:number"
        expect(result.ratio).toMatch(/^\d+:\d+$/);

        // The numbers in the string should match the simplified values
        const [wStr, hStr] = result.ratio.split(':');
        expect(parseInt(wStr, 10)).toBe(result.simplified.w);
        expect(parseInt(hStr, 10)).toBe(result.simplified.h);
      }),
      { numRuns: 100 }
    );
  });

  it('the simplified width and height SHALL be positive integers', () => {
    /**
     * Validates: Requirements 7.6
     */
    fc.assert(
      fc.property(dimensionPairArb(), ({ width, height }) => {
        const result = calculateAspectRatio(width, height);

        expect(result.simplified.w).toBeGreaterThan(0);
        expect(result.simplified.h).toBeGreaterThan(0);
        expect(Number.isInteger(result.simplified.w)).toBe(true);
        expect(Number.isInteger(result.simplified.h)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
