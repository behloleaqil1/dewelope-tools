import { describe, it, expect } from 'vitest';
import {
  parseColor,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  generateGradientCSS,
  generatePalette,
  calculateAspectRatio,
  gcd,
} from '@/lib/image-color-tools';

describe('parseColor', () => {
  it('parses 6-digit HEX color', () => {
    const result = parseColor('#FF5733');
    expect(result).not.toBeNull();
    expect(result!.hex).toBe('#FF5733');
    expect(result!.rgb).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('parses 3-digit HEX color', () => {
    const result = parseColor('#F00');
    expect(result).not.toBeNull();
    expect(result!.hex).toBe('#FF0000');
    expect(result!.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses RGB color', () => {
    const result = parseColor('rgb(128, 64, 32)');
    expect(result).not.toBeNull();
    expect(result!.rgb).toEqual({ r: 128, g: 64, b: 32 });
    expect(result!.hex).toBe('#804020');
  });

  it('parses HSL color', () => {
    const result = parseColor('hsl(0, 100%, 50%)');
    expect(result).not.toBeNull();
    expect(result!.rgb).toEqual({ r: 255, g: 0, b: 0 });
    expect(result!.hex).toBe('#FF0000');
  });

  it('returns null for invalid input', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('not-a-color')).toBeNull();
    expect(parseColor('#GGGGGG')).toBeNull();
    expect(parseColor('rgb(300, 0, 0)')).toBeNull();
    expect(parseColor('hsl(400, 50%, 50%)')).toBeNull();
  });

  it('handles lowercase hex', () => {
    const result = parseColor('#ff5733');
    expect(result).not.toBeNull();
    expect(result!.hex).toBe('#FF5733');
  });

  it('trims whitespace', () => {
    const result = parseColor('  #FF0000  ');
    expect(result).not.toBeNull();
    expect(result!.hex).toBe('#FF0000');
  });
});

describe('rgbToHex', () => {
  it('converts black', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts white', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
  });

  it('converts red', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
  });
});

describe('rgbToHsl', () => {
  it('converts pure red', () => {
    const hsl = rgbToHsl(255, 0, 0);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts pure green', () => {
    const hsl = rgbToHsl(0, 255, 0);
    expect(hsl.h).toBe(120);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts pure blue', () => {
    const hsl = rgbToHsl(0, 0, 255);
    expect(hsl.h).toBe(240);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts gray (no saturation)', () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(50);
  });
});

describe('hslToRgb', () => {
  it('converts pure red', () => {
    const rgb = hslToRgb(0, 100, 50);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts pure green', () => {
    const rgb = hslToRgb(120, 100, 50);
    expect(rgb).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts black', () => {
    const rgb = hslToRgb(0, 0, 0);
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts white', () => {
    const rgb = hslToRgb(0, 0, 100);
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('generateGradientCSS', () => {
  it('generates linear gradient with two stops', () => {
    const result = generateGradientCSS({
      type: 'linear',
      direction: 'to right',
      stops: [
        { color: '#FF0000' },
        { color: '#0000FF' },
      ],
    });
    expect(result).toBe('linear-gradient(to right, #FF0000, #0000FF)');
  });

  it('generates linear gradient with positions', () => {
    const result = generateGradientCSS({
      type: 'linear',
      direction: '45deg',
      stops: [
        { color: '#FF0000', position: 0 },
        { color: '#00FF00', position: 50 },
        { color: '#0000FF', position: 100 },
      ],
    });
    expect(result).toBe('linear-gradient(45deg, #FF0000 0%, #00FF00 50%, #0000FF 100%)');
  });

  it('generates radial gradient', () => {
    const result = generateGradientCSS({
      type: 'radial',
      direction: 'circle',
      stops: [
        { color: 'red' },
        { color: 'blue' },
      ],
    });
    expect(result).toBe('radial-gradient(circle, red, blue)');
  });

  it('returns empty string for less than 2 stops', () => {
    const result = generateGradientCSS({
      type: 'linear',
      direction: 'to right',
      stops: [{ color: '#FF0000' }],
    });
    expect(result).toBe('');
  });

  it('clamps to max 10 stops', () => {
    const stops = Array.from({ length: 12 }, (_, i) => ({
      color: `#${i.toString(16).padStart(2, '0')}0000`,
    }));
    const result = generateGradientCSS({
      type: 'linear',
      direction: 'to right',
      stops,
    });
    // Should only have 10 color stops
    const commaCount = (result.match(/,/g) || []).length;
    // "linear-gradient(to right, " + 10 stops separated by 9 commas + direction comma = 10 commas
    expect(commaCount).toBe(10);
  });

  it('uses default direction for linear when empty', () => {
    const result = generateGradientCSS({
      type: 'linear',
      direction: '',
      stops: [{ color: 'red' }, { color: 'blue' }],
    });
    expect(result).toBe('linear-gradient(to right, red, blue)');
  });
});

describe('generatePalette', () => {
  it('returns exactly 5 colors for valid input', () => {
    const palette = generatePalette('#FF5733');
    expect(palette).toHaveLength(5);
  });

  it('returns colors with valid HEX format', () => {
    const palette = generatePalette('#3366CC');
    for (const color of palette) {
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('returns colors with valid RGB values', () => {
    const palette = generatePalette('#3366CC');
    for (const color of palette) {
      expect(color.rgb.r).toBeGreaterThanOrEqual(0);
      expect(color.rgb.r).toBeLessThanOrEqual(255);
      expect(color.rgb.g).toBeGreaterThanOrEqual(0);
      expect(color.rgb.g).toBeLessThanOrEqual(255);
      expect(color.rgb.b).toBeGreaterThanOrEqual(0);
      expect(color.rgb.b).toBeLessThanOrEqual(255);
    }
  });

  it('returns 5 distinct colors', () => {
    const palette = generatePalette('#FF5733');
    const hexValues = palette.map(c => c.hex);
    const uniqueHexValues = new Set(hexValues);
    expect(uniqueHexValues.size).toBe(5);
  });

  it('returns empty array for invalid color', () => {
    const palette = generatePalette('not-a-color');
    expect(palette).toEqual([]);
  });

  it('handles grayscale base color', () => {
    const palette = generatePalette('#808080');
    expect(palette).toHaveLength(5);
    const hexValues = palette.map(c => c.hex);
    const uniqueHexValues = new Set(hexValues);
    expect(uniqueHexValues.size).toBe(5);
  });
});

describe('calculateAspectRatio', () => {
  it('simplifies 1920x1080 to 16:9', () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.ratio).toBe('16:9');
    expect(result.simplified).toEqual({ w: 16, h: 9 });
  });

  it('simplifies 1280x720 to 16:9', () => {
    const result = calculateAspectRatio(1280, 720);
    expect(result.ratio).toBe('16:9');
    expect(result.simplified).toEqual({ w: 16, h: 9 });
  });

  it('simplifies 800x600 to 4:3', () => {
    const result = calculateAspectRatio(800, 600);
    expect(result.ratio).toBe('4:3');
    expect(result.simplified).toEqual({ w: 4, h: 3 });
  });

  it('handles 1:1 ratio', () => {
    const result = calculateAspectRatio(500, 500);
    expect(result.ratio).toBe('1:1');
    expect(result.simplified).toEqual({ w: 1, h: 1 });
  });

  it('handles prime dimensions', () => {
    const result = calculateAspectRatio(7, 11);
    expect(result.ratio).toBe('7:11');
    expect(result.simplified).toEqual({ w: 7, h: 11 });
  });

  it('returns 0:0 for invalid dimensions', () => {
    expect(calculateAspectRatio(0, 100)).toEqual({ ratio: '0:0', simplified: { w: 0, h: 0 } });
    expect(calculateAspectRatio(100, 0)).toEqual({ ratio: '0:0', simplified: { w: 0, h: 0 } });
    expect(calculateAspectRatio(-1, 100)).toEqual({ ratio: '0:0', simplified: { w: 0, h: 0 } });
  });

  it('preserves ratio: simplified w/h equals original width/height', () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.simplified.w / result.simplified.h).toBeCloseTo(1920 / 1080);
  });
});

describe('gcd', () => {
  it('computes GCD of 12 and 8', () => {
    expect(gcd(12, 8)).toBe(4);
  });

  it('computes GCD of 1920 and 1080', () => {
    expect(gcd(1920, 1080)).toBe(120);
  });

  it('computes GCD of coprime numbers', () => {
    expect(gcd(7, 11)).toBe(1);
  });

  it('computes GCD when one is 1', () => {
    expect(gcd(1, 100)).toBe(1);
  });

  it('computes GCD of equal numbers', () => {
    expect(gcd(42, 42)).toBe(42);
  });
});
