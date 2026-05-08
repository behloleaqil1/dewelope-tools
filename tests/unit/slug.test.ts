import { describe, it, expect } from 'vitest';
import { generateSlug, validateSlugsUnique } from '@/lib/slug';

describe('generateSlug', () => {
  it('converts input to lowercase', () => {
    expect(generateSlug('Temperature Converter')).toBe('temperature-converter');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('word counter')).toBe('word-counter');
  });

  it('replaces special characters with hyphens', () => {
    expect(generateSlug('JSON Formatter & Validator')).toBe('json-formatter-validator');
  });

  it('removes characters that are not lowercase letters, numbers, or hyphens', () => {
    expect(generateSlug('Base64 Encoder/Decoder')).toBe('base64-encoder-decoder');
  });

  it('collapses multiple consecutive hyphens into one', () => {
    expect(generateSlug('find---and---replace')).toBe('find-and-replace');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('--hello-world--')).toBe('hello-world');
  });

  it('handles numeric content', () => {
    expect(generateSlug('SHA-256 Hash')).toBe('sha-256-hash');
  });

  it('returns "untitled" for empty input', () => {
    expect(generateSlug('')).toBe('untitled');
  });

  it('returns "untitled" for input with only special characters', () => {
    expect(generateSlug('!@#$%^&*()')).toBe('untitled');
  });

  it('handles already-valid slugs', () => {
    expect(generateSlug('temperature-converter')).toBe('temperature-converter');
  });

  it('handles underscores by replacing with hyphens', () => {
    expect(generateSlug('date_time_tools')).toBe('date-time-tools');
  });

  it('handles mixed special characters and spaces', () => {
    expect(generateSlug('URL Encoder & Decoder (v2)')).toBe('url-encoder-decoder-v2');
  });
});

describe('validateSlugsUnique', () => {
  it('returns true for an empty array', () => {
    expect(validateSlugsUnique([])).toBe(true);
  });

  it('returns true for a single slug', () => {
    expect(validateSlugsUnique(['temperature'])).toBe(true);
  });

  it('returns true when all slugs are unique', () => {
    expect(validateSlugsUnique(['temperature', 'length', 'weight'])).toBe(true);
  });

  it('returns false when duplicates exist', () => {
    expect(validateSlugsUnique(['temperature', 'length', 'temperature'])).toBe(false);
  });

  it('returns false when adjacent duplicates exist', () => {
    expect(validateSlugsUnique(['slug-a', 'slug-a'])).toBe(false);
  });

  it('handles a large array of unique slugs', () => {
    const slugs = Array.from({ length: 100 }, (_, i) => `tool-${i}`);
    expect(validateSlugsUnique(slugs)).toBe(true);
  });

  it('detects duplicate in a large array', () => {
    const slugs = Array.from({ length: 100 }, (_, i) => `tool-${i}`);
    slugs.push('tool-50');
    expect(validateSlugsUnique(slugs)).toBe(false);
  });
});
