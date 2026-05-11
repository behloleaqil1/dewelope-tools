/**
 * Image and Color Tools Engine
 *
 * Pure functions for color manipulation, gradient generation, palette creation,
 * image-to-base64 conversion, and aspect ratio calculation.
 * All functions handle invalid input gracefully.
 */

// ─── Color Parsing ───────────────────────────────────────────────────────────

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ParsedColor {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
}

/**
 * Parse a color string (HEX, RGB, or HSL) and return all three representations.
 *
 * Supported formats:
 * - HEX: #RGB, #RRGGBB
 * - RGB: rgb(r, g, b)
 * - HSL: hsl(h, s%, l%)
 *
 * @param input - Color string in HEX, RGB, or HSL format
 * @returns Parsed color with hex, rgb, and hsl values, or null if invalid
 */
export function parseColor(input: string): ParsedColor | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();

  // Try HEX
  const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rgb: RGBColor = { r, g, b };
    const hsl = rgbToHsl(r, g, b);
    return { hex: `#${hex.toUpperCase()}`, rgb, hsl };
  }

  // Try RGB
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r > 255 || g > 255 || b > 255) {
      return null;
    }
    const rgb: RGBColor = { r, g, b };
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    return { hex, rgb, hsl };
  }

  // Try HSL
  const hslMatch = trimmed.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);
    if (h > 360 || s > 100 || l > 100) {
      return null;
    }
    const hsl: HSLColor = { h, s, l };
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { hex, rgb, hsl };
  }

  return null;
}

// ─── Color Conversion Helpers ────────────────────────────────────────────────

/**
 * Convert RGB values to a HEX color string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB values to HSL.
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) * 60;
    } else {
      h = ((rNorm - gNorm) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL values to RGB.
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

// ─── Gradient Generator ──────────────────────────────────────────────────────

export interface GradientStop {
  color: string;
  position?: number;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  direction: string;
  stops: GradientStop[];
}

/**
 * Generate valid CSS gradient code from a configuration.
 *
 * Supports linear and radial gradients with 2-10 color stops.
 * Each stop can optionally specify a position (0-100 percentage).
 *
 * @param config - Gradient configuration with type, direction, and color stops
 * @returns Valid CSS gradient declaration string
 */
export function generateGradientCSS(config: GradientConfig): string {
  const { type, direction, stops } = config;

  if (!stops || stops.length < 2) {
    return '';
  }

  // Clamp to max 10 stops
  const validStops = stops.slice(0, 10);

  const stopStrings = validStops.map((stop) => {
    if (stop.position !== undefined) {
      const pos = Math.max(0, Math.min(100, stop.position));
      return `${stop.color} ${pos}%`;
    }
    return stop.color;
  });

  const stopsCSS = stopStrings.join(', ');

  if (type === 'radial') {
    const shape = direction || 'circle';
    return `radial-gradient(${shape}, ${stopsCSS})`;
  }

  // Linear gradient
  const dir = direction || 'to right';
  return `linear-gradient(${dir}, ${stopsCSS})`;
}

// ─── Palette Generator ───────────────────────────────────────────────────────

export interface PaletteColor {
  hex: string;
  rgb: RGBColor;
}

/**
 * Generate a palette of 5 distinct complementary colors from a base color.
 *
 * Uses HSL color space to create harmonious colors by rotating the hue
 * and adjusting saturation/lightness for variety.
 *
 * @param baseColor - Base color string in HEX, RGB, or HSL format
 * @returns Array of exactly 5 distinct palette colors with HEX and RGB values
 */
export function generatePalette(baseColor: string): PaletteColor[] {
  const parsed = parseColor(baseColor);
  if (!parsed) {
    return [];
  }

  const { h, s, l } = parsed.hsl;

  // Generate 5 colors using complementary/analogous harmony
  const hueOffsets = [0, 72, 144, 216, 288]; // Evenly spaced around the color wheel
  const satAdjustments = [0, -10, 5, -5, 10];
  const lightAdjustments = [0, 10, -10, 15, -15];

  const palette: PaletteColor[] = hueOffsets.map((offset, i) => {
    const newH = (h + offset) % 360;
    const newS = Math.max(0, Math.min(100, s + satAdjustments[i]));
    const newL = Math.max(0, Math.min(100, l + lightAdjustments[i]));

    const rgb = hslToRgb(newH, newS, newL);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    return { hex, rgb };
  });

  // Ensure all 5 colors are distinct by checking hex values
  const seen = new Set<string>();
  const distinctPalette: PaletteColor[] = [];

  for (const color of palette) {
    if (!seen.has(color.hex)) {
      seen.add(color.hex);
      distinctPalette.push(color);
    }
  }

  // If we have duplicates (rare edge case with very low saturation),
  // generate additional colors with more variation
  let extraOffset = 30;
  while (distinctPalette.length < 5) {
    const newH = (h + extraOffset) % 360;
    const newS = Math.max(10, Math.min(100, s + extraOffset % 20));
    const newL = Math.max(10, Math.min(90, l + (extraOffset % 30) - 15));

    const rgb = hslToRgb(newH, newS, newL);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    if (!seen.has(hex)) {
      seen.add(hex);
      distinctPalette.push({ hex, rgb });
    }
    extraOffset += 17;
  }

  return distinctPalette.slice(0, 5);
}

// ─── Image to Base64 ─────────────────────────────────────────────────────────

/**
 * Convert an image File to a Base64 data URL string.
 *
 * Reads the file using FileReader and returns the complete data URL
 * including the MIME type prefix (e.g., "data:image/png;base64,...").
 *
 * @param file - Image file (PNG, JPEG, GIF, WEBP, SVG; max 5MB)
 * @returns Promise resolving to the Base64 data URL string
 * @throws Error if file is invalid, too large, or unsupported format
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const supportedTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.size > maxSize) {
      reject(new Error('File must be smaller than 5 MB'));
      return;
    }

    if (!supportedTypes.includes(file.type)) {
      reject(new Error('Supported formats: PNG, JPEG, GIF, WEBP, SVG'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// ─── Aspect Ratio Calculator ─────────────────────────────────────────────────

export interface AspectRatioResult {
  ratio: string;
  simplified: { w: number; h: number };
}

/**
 * Calculate the simplified aspect ratio for given width and height dimensions.
 *
 * Uses the Greatest Common Divisor (GCD) to simplify the ratio.
 * For example, 1920x1080 simplifies to 16:9.
 *
 * @param width - Width in pixels (positive integer)
 * @param height - Height in pixels (positive integer)
 * @returns Simplified aspect ratio string and numeric components
 */
export function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
    return { ratio: '0:0', simplified: { w: 0, h: 0 } };
  }

  // Round to integers for GCD calculation
  const w = Math.round(width);
  const h = Math.round(height);

  const divisor = gcd(w, h);
  const simplifiedW = w / divisor;
  const simplifiedH = h / divisor;

  return {
    ratio: `${simplifiedW}:${simplifiedH}`,
    simplified: { w: simplifiedW, h: simplifiedH },
  };
}

/**
 * Calculate the Greatest Common Divisor of two positive integers using Euclidean algorithm.
 *
 * @param a - First positive integer
 * @param b - Second positive integer
 * @returns The GCD of a and b
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}


// ─── RGB to Hex Converter (standalone) ───────────────────────────────────────

/**
 * Convert individual R, G, B values to a hex color string.
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string (e.g., "#FF5733") or error message
 */
export function rgbValuesToHex(r: number, g: number, b: number): { hex: string; valid: boolean; error?: string } {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return { hex: '', valid: false, error: 'RGB values must be between 0 and 255' };
  }
  if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)) {
    return { hex: '', valid: false, error: 'RGB values must be integers' };
  }
  const hex = rgbToHex(r, g, b);
  return { hex, valid: true };
}

// ─── Image Info ──────────────────────────────────────────────────────────────

export interface ImageInfoResult {
  width: number;
  height: number;
  fileSize: number;
  fileSizeFormatted: string;
  type: string;
  aspectRatio: string;
  name: string;
}

/**
 * Format a file size in bytes to a human-readable string.
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(2)} ${units[i]}`;
}
