import { describe, it, expect } from 'vitest';
import {
  validateNumeric,
  validateRange,
  validateNonEmpty,
  validateTextLength,
  validateFileSize,
  validateFileType,
} from '@/lib/validation';

describe('validateNumeric', () => {
  it('accepts valid integers', () => {
    expect(validateNumeric('42')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('0')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('123456789')).toEqual({ valid: true, fieldName: undefined });
  });

  it('accepts valid decimals', () => {
    expect(validateNumeric('3.14')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('0.5')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('.5')).toEqual({ valid: true, fieldName: undefined });
  });

  it('accepts negative numbers', () => {
    expect(validateNumeric('-1')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('-3.14')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('-0.001')).toEqual({ valid: true, fieldName: undefined });
  });

  it('accepts values with leading/trailing whitespace', () => {
    expect(validateNumeric('  42  ')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric('\t3.14\n')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNumeric(' -7 ')).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects non-numeric strings', () => {
    expect(validateNumeric('abc').valid).toBe(false);
    expect(validateNumeric('12abc').valid).toBe(false);
    expect(validateNumeric('1.2.3').valid).toBe(false);
    expect(validateNumeric('--5').valid).toBe(false);
    expect(validateNumeric('').valid).toBe(false);
    expect(validateNumeric('   ').valid).toBe(false);
  });

  it('returns field-specific error messages', () => {
    const result = validateNumeric('abc', 'temperature');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid number');
    expect(result.fieldName).toBe('temperature');
  });

  it('includes fieldName on valid results', () => {
    const result = validateNumeric('42', 'amount');
    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('amount');
  });
});

describe('validateRange', () => {
  it('accepts values within range', () => {
    expect(validateRange(5, 0, 10)).toEqual({ valid: true, fieldName: undefined });
    expect(validateRange(0, 0, 10)).toEqual({ valid: true, fieldName: undefined });
    expect(validateRange(10, 0, 10)).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects values below minimum', () => {
    const result = validateRange(-1, 0, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('0');
    expect(result.error).toContain('100');
  });

  it('rejects values above maximum', () => {
    const result = validateRange(101, 0, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('0');
    expect(result.error).toContain('100');
  });

  it('includes min and max in error message', () => {
    const result = validateRange(500, -999999999, 999999999);
    expect(result.valid).toBe(true);

    const failResult = validateRange(1000000000, -999999999, 999999999);
    expect(failResult.error).toBe('Value must be between -999999999 and 999999999');
  });

  it('returns fieldName', () => {
    const result = validateRange(200, 0, 100, 'weight');
    expect(result.fieldName).toBe('weight');
  });
});

describe('validateNonEmpty', () => {
  it('accepts non-empty strings', () => {
    expect(validateNonEmpty('hello')).toEqual({ valid: true, fieldName: undefined });
    expect(validateNonEmpty('a')).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects empty strings', () => {
    expect(validateNonEmpty('').valid).toBe(false);
    expect(validateNonEmpty('').error).toBe('This field is required');
  });

  it('rejects whitespace-only strings', () => {
    expect(validateNonEmpty('   ').valid).toBe(false);
    expect(validateNonEmpty('\t\n').valid).toBe(false);
  });

  it('returns fieldName', () => {
    const result = validateNonEmpty('', 'input');
    expect(result.fieldName).toBe('input');
  });
});

describe('validateTextLength', () => {
  it('accepts text within limit', () => {
    expect(validateTextLength('hello', 100)).toEqual({ valid: true, fieldName: undefined });
    expect(validateTextLength('', 100)).toEqual({ valid: true, fieldName: undefined });
  });

  it('accepts text at exact limit', () => {
    expect(validateTextLength('abc', 3)).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects text exceeding limit', () => {
    const result = validateTextLength('abcdef', 5);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5');
  });

  it('uses 100,000 character limit for text tools', () => {
    const longText = 'a'.repeat(100001);
    const result = validateTextLength(longText, 100000);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Input exceeds maximum length of 100,000 characters');
  });

  it('returns fieldName', () => {
    const result = validateTextLength('too long', 3, 'description');
    expect(result.fieldName).toBe('description');
  });
});

describe('validateFileSize', () => {
  it('accepts files within size limit', () => {
    const fiveMB = 5 * 1024 * 1024;
    expect(validateFileSize(1024, fiveMB)).toEqual({ valid: true, fieldName: undefined });
    expect(validateFileSize(fiveMB, fiveMB)).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects files exceeding size limit', () => {
    const fiveMB = 5 * 1024 * 1024;
    const result = validateFileSize(fiveMB + 1, fiveMB);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('File must be smaller than 5 MB');
  });

  it('returns fieldName', () => {
    const result = validateFileSize(10000000, 5242880, 'image');
    expect(result.fieldName).toBe('image');
  });
});

describe('validateFileType', () => {
  it('accepts valid file types', () => {
    const accepted = ['PNG', 'JPEG', 'GIF', 'WEBP', 'SVG'];
    expect(validateFileType('PNG', accepted)).toEqual({ valid: true, fieldName: undefined });
    expect(validateFileType('JPEG', accepted)).toEqual({ valid: true, fieldName: undefined });
  });

  it('is case-insensitive', () => {
    const accepted = ['PNG', 'JPEG', 'GIF'];
    expect(validateFileType('png', accepted)).toEqual({ valid: true, fieldName: undefined });
    expect(validateFileType('Png', accepted)).toEqual({ valid: true, fieldName: undefined });
  });

  it('rejects unsupported file types', () => {
    const accepted = ['PNG', 'JPEG', 'GIF', 'WEBP', 'SVG'];
    const result = validateFileType('BMP', accepted);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Supported formats: PNG, JPEG, GIF, WEBP, SVG');
  });

  it('returns fieldName', () => {
    const result = validateFileType('BMP', ['PNG'], 'upload');
    expect(result.fieldName).toBe('upload');
  });
});
