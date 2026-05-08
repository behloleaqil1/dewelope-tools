import { describe, it, expect } from 'vitest';
import {
  formatJson,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEntityEncode,
  htmlEntityDecode,
  testRegex,
  generateUUID,
  generateHash,
  convertColor,
} from '@/lib/developer-tools';

describe('Developer Tools', () => {
  // ─── JSON Formatter ──────────────────────────────────────────────────────

  describe('formatJson', () => {
    it('should format valid JSON', () => {
      const result = formatJson('{"name":"test","value":42}');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('{\n  "name": "test",\n  "value": 42\n}');
      expect(result.error).toBeUndefined();
    });

    it('should handle arrays', () => {
      const result = formatJson('[1,2,3]');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('[\n  1,\n  2,\n  3\n]');
    });

    it('should report error for invalid JSON', () => {
      const result = formatJson('{invalid}');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBeTruthy();
    });

    it('should report error position for malformed JSON', () => {
      // Trailing comma produces "at position X" in V8
      const result = formatJson('{"a":1,}');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      // Should have line/character info when engine reports position
      expect(result.error!.line).toBeDefined();
      expect(result.error!.character).toBeDefined();
    });

    it('should handle empty input', () => {
      const result = formatJson('');
      expect(result.valid).toBe(false);
      expect(result.error!.message).toBe('Input is empty');
    });

    it('should handle whitespace-only input', () => {
      const result = formatJson('   ');
      expect(result.valid).toBe(false);
    });
  });

  // ─── Base64 Encode/Decode ────────────────────────────────────────────────

  describe('base64Encode / base64Decode', () => {
    it('should encode a simple string', () => {
      expect(base64Encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
    });

    it('should decode a valid Base64 string', () => {
      const result = base64Decode('SGVsbG8sIFdvcmxkIQ==');
      expect(result.result).toBe('Hello, World!');
      expect(result.error).toBeUndefined();
    });

    it('should round-trip encode/decode', () => {
      const original = 'Test string with special chars: àéîõü';
      const encoded = base64Encode(original);
      const decoded = base64Decode(encoded);
      expect(decoded.result).toBe(original);
    });

    it('should handle empty input', () => {
      expect(base64Encode('')).toBe('');
      expect(base64Decode('').result).toBe('');
    });

    it('should return error for invalid Base64', () => {
      const result = base64Decode('not-valid-base64!!!');
      expect(result.error).toBeDefined();
    });
  });

  // ─── URL Encode/Decode ─────────────────────────────────────────────────

  describe('urlEncode / urlDecode', () => {
    it('should encode special characters', () => {
      expect(urlEncode('hello world')).toBe('hello%20world');
      expect(urlEncode('a=1&b=2')).toBe('a%3D1%26b%3D2');
    });

    it('should decode URL-encoded strings', () => {
      const result = urlDecode('hello%20world');
      expect(result.result).toBe('hello world');
      expect(result.error).toBeUndefined();
    });

    it('should round-trip encode/decode', () => {
      const original = 'https://example.com/path?q=hello world&lang=en';
      const encoded = urlEncode(original);
      const decoded = urlDecode(encoded);
      expect(decoded.result).toBe(original);
    });

    it('should handle empty input', () => {
      expect(urlEncode('')).toBe('');
      expect(urlDecode('').result).toBe('');
    });

    it('should return error for invalid URL encoding', () => {
      const result = urlDecode('%ZZ');
      expect(result.error).toBeDefined();
    });
  });

  // ─── HTML Entity Encode/Decode ─────────────────────────────────────────

  describe('htmlEntityEncode / htmlEntityDecode', () => {
    it('should encode HTML special characters', () => {
      expect(htmlEntityEncode('<div class="test">')).toBe(
        '&lt;div class=&quot;test&quot;&gt;'
      );
    });

    it('should encode ampersands', () => {
      expect(htmlEntityEncode('a & b')).toBe('a &amp; b');
    });

    it('should decode HTML entities', () => {
      expect(htmlEntityDecode('&lt;div&gt;')).toBe('<div>');
      expect(htmlEntityDecode('&amp;')).toBe('&');
      expect(htmlEntityDecode('&quot;')).toBe('"');
    });

    it('should decode numeric entities', () => {
      expect(htmlEntityDecode('&#60;')).toBe('<');
      expect(htmlEntityDecode('&#x3C;')).toBe('<');
    });

    it('should handle empty input', () => {
      expect(htmlEntityEncode('')).toBe('');
      expect(htmlEntityDecode('')).toBe('');
    });

    it('should round-trip encode/decode for basic chars', () => {
      const original = '<script>alert("xss")</script>';
      const encoded = htmlEntityEncode(original);
      const decoded = htmlEntityDecode(encoded);
      expect(decoded).toBe(original);
    });
  });

  // ─── Regex Tester ──────────────────────────────────────────────────────

  describe('testRegex', () => {
    it('should find matches', () => {
      const result = testRegex('\\d+', 'g', 'abc 123 def 456');
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.matches[0].match).toBe('123');
      expect(result.matches[0].index).toBe(4);
      expect(result.matches[1].match).toBe('456');
    });

    it('should return groups', () => {
      const result = testRegex('(\\w+)@(\\w+)', 'g', 'user@host');
      expect(result.valid).toBe(true);
      expect(result.matches[0].groups).toEqual(['user', 'host']);
    });

    it('should handle invalid regex', () => {
      const result = testRegex('[invalid', '', 'test');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty pattern', () => {
      const result = testRegex('', '', 'test');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Pattern is empty');
    });

    it('should handle no matches', () => {
      const result = testRegex('xyz', 'g', 'abc');
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(0);
    });

    it('should respect flags', () => {
      const result = testRegex('hello', 'gi', 'Hello HELLO hello');
      expect(result.valid).toBe(true);
      expect(result.matches).toHaveLength(3);
    });
  });

  // ─── UUID Generator ────────────────────────────────────────────────────

  describe('generateUUID', () => {
    it('should generate a valid v4 UUID format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set(Array.from({ length: 100 }, () => generateUUID()));
      expect(uuids.size).toBe(100);
    });
  });

  // ─── Hash Generator ────────────────────────────────────────────────────

  describe('generateHash', () => {
    it('should generate correct MD5 hash', async () => {
      const hash = await generateHash('hello', 'md5');
      expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    });

    it('should generate correct MD5 for empty string', async () => {
      const hash = await generateHash('', 'md5');
      expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('should generate correct SHA-1 hash', async () => {
      const hash = await generateHash('hello', 'sha1');
      expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    it('should generate correct SHA-1 for empty string', async () => {
      const hash = await generateHash('', 'sha1');
      expect(hash).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });

    it('should generate correct SHA-256 hash', async () => {
      const hash = await generateHash('hello', 'sha256');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    it('should generate correct SHA-256 for empty string', async () => {
      const hash = await generateHash('', 'sha256');
      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  // ─── Color Converter ───────────────────────────────────────────────────

  describe('convertColor', () => {
    it('should convert HEX to RGB and HSL', () => {
      const result = convertColor('#ff0000');
      expect(result.valid).toBe(true);
      expect(result.hex).toBe('#ff0000');
      expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
      expect(result.hsl).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('should handle 3-digit HEX', () => {
      const result = convertColor('#f00');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle HEX without #', () => {
      const result = convertColor('ff0000');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert RGB format', () => {
      const result = convertColor('rgb(0, 128, 255)');
      expect(result.valid).toBe(true);
      expect(result.hex).toBe('#0080ff');
      expect(result.rgb).toEqual({ r: 0, g: 128, b: 255 });
    });

    it('should convert HSL format', () => {
      const result = convertColor('hsl(120, 100%, 50%)');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 0, g: 255, b: 0 });
      expect(result.hex).toBe('#00ff00');
    });

    it('should handle black', () => {
      const result = convertColor('#000000');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 0, g: 0, b: 0 });
      expect(result.hsl).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('should handle white', () => {
      const result = convertColor('#ffffff');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 255, g: 255, b: 255 });
      expect(result.hsl).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('should return error for invalid input', () => {
      const result = convertColor('not-a-color');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for empty input', () => {
      const result = convertColor('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Input is empty');
    });

    it('should reject RGB values > 255', () => {
      const result = convertColor('rgb(256, 0, 0)');
      expect(result.valid).toBe(false);
    });

    it('should convert comma-separated RGB', () => {
      const result = convertColor('255, 128, 0');
      expect(result.valid).toBe(true);
      expect(result.rgb).toEqual({ r: 255, g: 128, b: 0 });
    });
  });
});
