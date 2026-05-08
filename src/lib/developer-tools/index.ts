/**
 * Developer Tools Engine
 *
 * Pure functions for developer utilities: JSON formatting, encoding/decoding,
 * regex testing, UUID generation, hash generation, and color conversion.
 * All functions handle invalid input gracefully with descriptive error messages.
 */

// ─── JSON Formatter ──────────────────────────────────────────────────────────

export interface FormatJsonResult {
  formatted: string;
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    character?: number;
  };
}

/**
 * Validate and pretty-print JSON with error position reporting.
 *
 * @param input - Raw JSON string to format
 * @returns Object with formatted JSON, validity flag, and optional error details
 */
export function formatJson(input: string): FormatJsonResult {
  if (!input || input.trim().length === 0) {
    return { formatted: '', valid: false, error: { message: 'Input is empty' } };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    return { formatted, valid: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Invalid JSON';
    const position = parseJsonErrorPosition(errorMessage, input);
    return {
      formatted: '',
      valid: false,
      error: {
        message: errorMessage,
        line: position.line,
        character: position.character,
      },
    };
  }
}

/**
 * Parse error position from JSON.parse error message.
 */
function parseJsonErrorPosition(
  errorMessage: string,
  input: string
): { line?: number; character?: number } {
  // Most engines report "at position X" or "at line X column Y"
  const positionMatch = errorMessage.match(/position\s+(\d+)/i);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const { line, character } = offsetToLineChar(input, position);
    return { line, character };
  }

  const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      character: parseInt(lineColMatch[2], 10),
    };
  }

  return {};
}

/**
 * Convert a character offset to line and character position.
 */
function offsetToLineChar(
  input: string,
  offset: number
): { line: number; character: number } {
  let line = 1;
  let lastNewline = -1;

  for (let i = 0; i < offset && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      lastNewline = i;
    }
  }

  const character = offset - lastNewline;
  return { line, character };
}

// ─── Base64 Encode/Decode ────────────────────────────────────────────────────

/**
 * Encode a string to Base64.
 *
 * @param input - Plain text string to encode
 * @returns Base64 encoded string
 */
export function base64Encode(input: string): string {
  if (!input) return '';
  try {
    // Handle Unicode by encoding to UTF-8 first
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    // Fallback for environments without TextEncoder
    return btoa(unescape(encodeURIComponent(input)));
  }
}

/**
 * Decode a Base64 string.
 *
 * @param input - Base64 encoded string to decode
 * @returns Object with decoded result or error message
 */
export function base64Decode(input: string): { result: string; error?: string } {
  if (!input) return { result: '' };
  try {
    const binary = atob(input.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return { result: decoder.decode(bytes) };
  } catch {
    return { result: '', error: 'Invalid Base64 string. Input contains characters that are not valid in Base64 encoding.' };
  }
}

// ─── URL Encode/Decode ───────────────────────────────────────────────────────

/**
 * URL-encode a string.
 *
 * @param input - Plain text string to URL-encode
 * @returns URL-encoded string
 */
export function urlEncode(input: string): string {
  if (!input) return '';
  return encodeURIComponent(input);
}

/**
 * URL-decode a string.
 *
 * @param input - URL-encoded string to decode
 * @returns Object with decoded result or error message
 */
export function urlDecode(input: string): { result: string; error?: string } {
  if (!input) return { result: '' };
  try {
    return { result: decodeURIComponent(input) };
  } catch {
    return { result: '', error: 'Invalid URL-encoded string. Input contains malformed percent-encoding sequences.' };
  }
}

// ─── HTML Entity Encode/Decode ───────────────────────────────────────────────

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_ENTITY_REVERSE: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&#x2F;': '/',
  '&#47;': '/',
  '&nbsp;': '\u00A0',
};

/**
 * Encode special characters as HTML entities.
 *
 * @param input - Plain text string to encode
 * @returns String with HTML entities
 */
export function htmlEntityEncode(input: string): string {
  if (!input) return '';
  return input.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Decode HTML entities back to their original characters.
 *
 * @param input - String with HTML entities to decode
 * @returns Decoded plain text string
 */
export function htmlEntityDecode(input: string): string {
  if (!input) return '';
  // Decode named and numeric entities
  return input
    .replace(/&(?:#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (match, hex, dec, named) => {
      if (hex) {
        return String.fromCharCode(parseInt(hex, 16));
      }
      if (dec) {
        return String.fromCharCode(parseInt(dec, 10));
      }
      if (named) {
        const key = `&${named};`;
        return HTML_ENTITY_REVERSE[key] ?? match;
      }
      return match;
    });
}

// ─── Regex Tester ────────────────────────────────────────────────────────────

export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export interface TestRegexResult {
  valid: boolean;
  matches: RegexMatch[];
  error?: string;
}

/**
 * Test a regex pattern against a string and return all matches.
 *
 * @param pattern - Regular expression pattern string
 * @param flags - Regex flags (e.g., 'gi')
 * @param testString - String to test the pattern against
 * @returns Object with validity, matches array, and optional error
 */
export function testRegex(
  pattern: string,
  flags: string,
  testString: string
): TestRegexResult {
  if (!pattern) {
    return { valid: false, matches: [], error: 'Pattern is empty' };
  }

  try {
    // Ensure 'g' flag is present for matchAll
    const effectiveFlags = flags.includes('g') ? flags : flags + 'g';
    const regex = new RegExp(pattern, effectiveFlags);
    const matches: RegexMatch[] = [];

    const iterator = testString.matchAll(regex);
    for (const match of iterator) {
      const groups = match.slice(1).filter((g) => g !== undefined);
      matches.push({
        match: match[0],
        index: match.index ?? 0,
        groups: groups.length > 0 ? groups : undefined,
      });
    }

    return { valid: true, matches };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Invalid regular expression';
    return { valid: false, matches: [], error: errorMessage };
  }
}

// ─── UUID Generator ──────────────────────────────────────────────────────────

/**
 * Generate a v4 UUID (random).
 *
 * @returns A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: manual v4 UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Hash Generator ──────────────────────────────────────────────────────────

/**
 * Generate a hash of the input string using the specified algorithm.
 * Uses synchronous pure JS implementations for all algorithms.
 *
 * @param input - String to hash
 * @param algorithm - Hash algorithm: 'md5', 'sha1', or 'sha256'
 * @returns Promise resolving to hex-encoded hash string
 */
export async function generateHash(
  input: string,
  algorithm: 'md5' | 'sha1' | 'sha256'
): Promise<string> {
  if (!input && input !== '') {
    return '';
  }

  switch (algorithm) {
    case 'md5':
      return md5(input);
    case 'sha1':
      return sha1(input);
    case 'sha256':
      return sha256(input);
    default:
      return '';
  }
}


// ─── MD5 Implementation (Pure JS) ───────────────────────────────────────────

/**
 * Pure JavaScript MD5 implementation.
 * Based on the RFC 1321 specification.
 */
function md5(input: string): string {
  const bytes = stringToBytes(input);
  const paddedBytes = md5Pad(bytes);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < paddedBytes.length; i += 64) {
    const block = new Array(16);
    for (let j = 0; j < 16; j++) {
      block[j] =
        paddedBytes[i + j * 4] |
        (paddedBytes[i + j * 4 + 1] << 8) |
        (paddedBytes[i + j * 4 + 2] << 16) |
        (paddedBytes[i + j * 4 + 3] << 24);
    }

    const aa = a, bb = b, cc = c, dd = d;

    // Round 1
    a = md5Round(md5F, a, b, c, d, block[0], 7, 0xd76aa478);
    d = md5Round(md5F, d, a, b, c, block[1], 12, 0xe8c7b756);
    c = md5Round(md5F, c, d, a, b, block[2], 17, 0x242070db);
    b = md5Round(md5F, b, c, d, a, block[3], 22, 0xc1bdceee);
    a = md5Round(md5F, a, b, c, d, block[4], 7, 0xf57c0faf);
    d = md5Round(md5F, d, a, b, c, block[5], 12, 0x4787c62a);
    c = md5Round(md5F, c, d, a, b, block[6], 17, 0xa8304613);
    b = md5Round(md5F, b, c, d, a, block[7], 22, 0xfd469501);
    a = md5Round(md5F, a, b, c, d, block[8], 7, 0x698098d8);
    d = md5Round(md5F, d, a, b, c, block[9], 12, 0x8b44f7af);
    c = md5Round(md5F, c, d, a, b, block[10], 17, 0xffff5bb1);
    b = md5Round(md5F, b, c, d, a, block[11], 22, 0x895cd7be);
    a = md5Round(md5F, a, b, c, d, block[12], 7, 0x6b901122);
    d = md5Round(md5F, d, a, b, c, block[13], 12, 0xfd987193);
    c = md5Round(md5F, c, d, a, b, block[14], 17, 0xa679438e);
    b = md5Round(md5F, b, c, d, a, block[15], 22, 0x49b40821);

    // Round 2
    a = md5Round(md5G, a, b, c, d, block[1], 5, 0xf61e2562);
    d = md5Round(md5G, d, a, b, c, block[6], 9, 0xc040b340);
    c = md5Round(md5G, c, d, a, b, block[11], 14, 0x265e5a51);
    b = md5Round(md5G, b, c, d, a, block[0], 20, 0xe9b6c7aa);
    a = md5Round(md5G, a, b, c, d, block[5], 5, 0xd62f105d);
    d = md5Round(md5G, d, a, b, c, block[10], 9, 0x02441453);
    c = md5Round(md5G, c, d, a, b, block[15], 14, 0xd8a1e681);
    b = md5Round(md5G, b, c, d, a, block[4], 20, 0xe7d3fbc8);
    a = md5Round(md5G, a, b, c, d, block[9], 5, 0x21e1cde6);
    d = md5Round(md5G, d, a, b, c, block[14], 9, 0xc33707d6);
    c = md5Round(md5G, c, d, a, b, block[3], 14, 0xf4d50d87);
    b = md5Round(md5G, b, c, d, a, block[8], 20, 0x455a14ed);
    a = md5Round(md5G, a, b, c, d, block[13], 5, 0xa9e3e905);
    d = md5Round(md5G, d, a, b, c, block[2], 9, 0xfcefa3f8);
    c = md5Round(md5G, c, d, a, b, block[7], 14, 0x676f02d9);
    b = md5Round(md5G, b, c, d, a, block[12], 20, 0x8d2a4c8a);

    // Round 3
    a = md5Round(md5H, a, b, c, d, block[5], 4, 0xfffa3942);
    d = md5Round(md5H, d, a, b, c, block[8], 11, 0x8771f681);
    c = md5Round(md5H, c, d, a, b, block[11], 16, 0x6d9d6122);
    b = md5Round(md5H, b, c, d, a, block[14], 23, 0xfde5380c);
    a = md5Round(md5H, a, b, c, d, block[1], 4, 0xa4beea44);
    d = md5Round(md5H, d, a, b, c, block[4], 11, 0x4bdecfa9);
    c = md5Round(md5H, c, d, a, b, block[7], 16, 0xf6bb4b60);
    b = md5Round(md5H, b, c, d, a, block[10], 23, 0xbebfbc70);
    a = md5Round(md5H, a, b, c, d, block[13], 4, 0x289b7ec6);
    d = md5Round(md5H, d, a, b, c, block[0], 11, 0xeaa127fa);
    c = md5Round(md5H, c, d, a, b, block[3], 16, 0xd4ef3085);
    b = md5Round(md5H, b, c, d, a, block[6], 23, 0x04881d05);
    a = md5Round(md5H, a, b, c, d, block[9], 4, 0xd9d4d039);
    d = md5Round(md5H, d, a, b, c, block[12], 11, 0xe6db99e5);
    c = md5Round(md5H, c, d, a, b, block[15], 16, 0x1fa27cf8);
    b = md5Round(md5H, b, c, d, a, block[2], 23, 0xc4ac5665);

    // Round 4
    a = md5Round(md5I, a, b, c, d, block[0], 6, 0xf4292244);
    d = md5Round(md5I, d, a, b, c, block[7], 10, 0x432aff97);
    c = md5Round(md5I, c, d, a, b, block[14], 15, 0xab9423a7);
    b = md5Round(md5I, b, c, d, a, block[5], 21, 0xfc93a039);
    a = md5Round(md5I, a, b, c, d, block[12], 6, 0x655b59c3);
    d = md5Round(md5I, d, a, b, c, block[3], 10, 0x8f0ccc92);
    c = md5Round(md5I, c, d, a, b, block[10], 15, 0xffeff47d);
    b = md5Round(md5I, b, c, d, a, block[1], 21, 0x85845dd1);
    a = md5Round(md5I, a, b, c, d, block[8], 6, 0x6fa87e4f);
    d = md5Round(md5I, d, a, b, c, block[15], 10, 0xfe2ce6e0);
    c = md5Round(md5I, c, d, a, b, block[6], 15, 0xa3014314);
    b = md5Round(md5I, b, c, d, a, block[13], 21, 0x4e0811a1);
    a = md5Round(md5I, a, b, c, d, block[4], 6, 0xf7537e82);
    d = md5Round(md5I, d, a, b, c, block[11], 10, 0xbd3af235);
    c = md5Round(md5I, c, d, a, b, block[2], 15, 0x2ad7d2bb);
    b = md5Round(md5I, b, c, d, a, block[9], 21, 0xeb86d391);

    a = (a + aa) >>> 0;
    b = (b + bb) >>> 0;
    c = (c + cc) >>> 0;
    d = (d + dd) >>> 0;
  }

  return toHex32(a) + toHex32(b) + toHex32(c) + toHex32(d);
}

function md5F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
function md5G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
function md5H(x: number, y: number, z: number): number { return x ^ y ^ z; }
function md5I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

function md5Round(
  fn: (x: number, y: number, z: number) => number,
  a: number, b: number, c: number, d: number,
  x: number, s: number, t: number
): number {
  const n = (a + fn(b, c, d) + x + t) >>> 0;
  return (b + (((n << s) | (n >>> (32 - s))) >>> 0)) >>> 0;
}

function md5Pad(bytes: number[]): number[] {
  const len = bytes.length;
  const bitLen = len * 8;

  // Append 0x80
  bytes.push(0x80);

  // Pad to 56 mod 64
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }

  // Append length in bits as 64-bit little-endian
  bytes.push(bitLen & 0xff);
  bytes.push((bitLen >>> 8) & 0xff);
  bytes.push((bitLen >>> 16) & 0xff);
  bytes.push((bitLen >>> 24) & 0xff);
  bytes.push(0, 0, 0, 0); // High 32 bits (for messages < 2^32 bits)

  return bytes;
}

function toHex32(n: number): string {
  // Little-endian hex output
  return (
    ((n & 0xff).toString(16).padStart(2, '0')) +
    (((n >>> 8) & 0xff).toString(16).padStart(2, '0')) +
    (((n >>> 16) & 0xff).toString(16).padStart(2, '0')) +
    (((n >>> 24) & 0xff).toString(16).padStart(2, '0'))
  );
}

// ─── SHA-1 Implementation (Pure JS) ─────────────────────────────────────────

/**
 * Pure JavaScript SHA-1 implementation.
 * Based on the FIPS 180-4 specification.
 */
function sha1(input: string): string {
  const bytes = stringToBytes(input);
  const paddedBytes = shaPad(bytes);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < paddedBytes.length; i += 64) {
    const w = new Array(80);

    for (let j = 0; j < 16; j++) {
      w[j] =
        (paddedBytes[i + j * 4] << 24) |
        (paddedBytes[i + j * 4 + 1] << 16) |
        (paddedBytes[i + j * 4 + 2] << 8) |
        paddedBytes[i + j * 4 + 3];
    }

    for (let j = 16; j < 80; j++) {
      const val = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = (val << 1) | (val >>> 31);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;

    for (let j = 0; j < 80; j++) {
      let f: number, k: number;

      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  return toHexBE(h0) + toHexBE(h1) + toHexBE(h2) + toHexBE(h3) + toHexBE(h4);
}

// ─── SHA-256 Implementation (Pure JS) ────────────────────────────────────────

const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

/**
 * Pure JavaScript SHA-256 implementation.
 * Based on the FIPS 180-4 specification.
 */
function sha256(input: string): string {
  const bytes = stringToBytes(input);
  const paddedBytes = shaPad(bytes);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  for (let i = 0; i < paddedBytes.length; i += 64) {
    const w = new Array(64);

    for (let j = 0; j < 16; j++) {
      w[j] =
        (paddedBytes[i + j * 4] << 24) |
        (paddedBytes[i + j * 4 + 1] << 16) |
        (paddedBytes[i + j * 4 + 2] << 8) |
        paddedBytes[i + j * 4 + 3];
    }

    for (let j = 16; j < 64; j++) {
      const s0 = (rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3)) >>> 0;
      const s1 = (rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10)) >>> 0;
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + SHA256_K[j] + w[j]) >>> 0;
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return (
    toHexBE(h0) + toHexBE(h1) + toHexBE(h2) + toHexBE(h3) +
    toHexBE(h4) + toHexBE(h5) + toHexBE(h6) + toHexBE(h7)
  );
}

function rotr(n: number, bits: number): number {
  return ((n >>> bits) | (n << (32 - bits))) >>> 0;
}

// ─── Shared Hash Utilities ───────────────────────────────────────────────────

function stringToBytes(str: string): number[] {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str));
}

function shaPad(bytes: number[]): number[] {
  const len = bytes.length;
  const bitLen = len * 8;

  // Append 0x80
  bytes.push(0x80);

  // Pad to 56 mod 64
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }

  // Append length in bits as 64-bit big-endian
  bytes.push(0, 0, 0, 0); // High 32 bits
  bytes.push((bitLen >>> 24) & 0xff);
  bytes.push((bitLen >>> 16) & 0xff);
  bytes.push((bitLen >>> 8) & 0xff);
  bytes.push(bitLen & 0xff);

  return bytes;
}

function toHexBE(n: number): string {
  return (
    (((n >>> 24) & 0xff).toString(16).padStart(2, '0')) +
    (((n >>> 16) & 0xff).toString(16).padStart(2, '0')) +
    (((n >>> 8) & 0xff).toString(16).padStart(2, '0')) +
    ((n & 0xff).toString(16).padStart(2, '0'))
  );
}


// ─── Color Code Converter ────────────────────────────────────────────────────

export interface ColorRgb {
  r: number;
  g: number;
  b: number;
}

export interface ColorHsl {
  h: number;
  s: number;
  l: number;
}

export interface ConvertColorResult {
  hex: string;
  rgb: ColorRgb;
  hsl: ColorHsl;
  valid: boolean;
  error?: string;
}

/**
 * Convert a color from any supported format (HEX, RGB, HSL) to all formats.
 *
 * Supported input formats:
 * - HEX: #RGB, #RRGGBB (with or without #)
 * - RGB: rgb(r, g, b) or r, g, b or r g b
 * - HSL: hsl(h, s%, l%) or h, s%, l%
 *
 * @param input - Color string in any supported format
 * @returns Object with hex, rgb, hsl values and validity flag
 */
export function convertColor(input: string): ConvertColorResult {
  const invalidResult: ConvertColorResult = {
    hex: '',
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    valid: false,
    error: 'Invalid color format. Expected HEX (#RRGGBB), RGB (rgb(r,g,b)), or HSL (hsl(h,s%,l%))',
  };

  if (!input || input.trim().length === 0) {
    return { ...invalidResult, error: 'Input is empty' };
  }

  const trimmed = input.trim();

  // Try parsing as HEX
  const hexResult = parseHex(trimmed);
  if (hexResult) {
    const hsl = rgbToHsl(hexResult);
    return {
      hex: rgbToHex(hexResult),
      rgb: hexResult,
      hsl,
      valid: true,
    };
  }

  // Try parsing as RGB
  const rgbResult = parseRgb(trimmed);
  if (rgbResult) {
    const hsl = rgbToHsl(rgbResult);
    return {
      hex: rgbToHex(rgbResult),
      rgb: rgbResult,
      hsl,
      valid: true,
    };
  }

  // Try parsing as HSL
  const hslResult = parseHsl(trimmed);
  if (hslResult) {
    const rgb = hslToRgb(hslResult);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: hslResult,
      valid: true,
    };
  }

  return invalidResult;
}

/**
 * Parse a HEX color string.
 */
function parseHex(input: string): ColorRgb | null {
  // Match #RGB, #RRGGBB, RGB, RRGGBB
  const hexMatch = input.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!hexMatch) return null;

  let hex = hexMatch[1];
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/**
 * Parse an RGB color string.
 */
function parseRgb(input: string): ColorRgb | null {
  // Match rgb(r, g, b) or rgb(r g b)
  const rgbFuncMatch = input.match(
    /^rgb\s*\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)$/i
  );
  if (rgbFuncMatch) {
    const r = parseInt(rgbFuncMatch[1], 10);
    const g = parseInt(rgbFuncMatch[2], 10);
    const b = parseInt(rgbFuncMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return { r, g, b };
    }
    return null;
  }

  // Match r, g, b (comma-separated)
  const commaMatch = input.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
  if (commaMatch) {
    const r = parseInt(commaMatch[1], 10);
    const g = parseInt(commaMatch[2], 10);
    const b = parseInt(commaMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return { r, g, b };
    }
    return null;
  }

  return null;
}

/**
 * Parse an HSL color string.
 */
function parseHsl(input: string): ColorHsl | null {
  // Match hsl(h, s%, l%) or hsl(h s% l%)
  const hslFuncMatch = input.match(
    /^hsl\s*\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*\)$/i
  );
  if (hslFuncMatch) {
    const h = parseFloat(hslFuncMatch[1]);
    const s = parseFloat(hslFuncMatch[2]);
    const l = parseFloat(hslFuncMatch[3]);
    if (h <= 360 && s <= 100 && l <= 100) {
      return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
    }
    return null;
  }

  return null;
}

/**
 * Convert RGB to HEX string.
 */
function rgbToHex(rgb: ColorRgb): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
  const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
  const b = Math.max(0, Math.min(255, Math.round(rgb.b)));
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}

/**
 * Convert RGB to HSL.
 */
function rgbToHsl(rgb: ColorRgb): ColorHsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB.
 */
function hslToRgb(hsl: ColorHsl): ColorRgb {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
