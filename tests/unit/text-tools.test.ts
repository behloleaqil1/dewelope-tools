import { describe, it, expect } from 'vitest';
import {
  wordCount,
  characterCount,
  caseConvert,
  generateLoremIpsum,
  reverseText,
  removeDuplicateLines,
  findAndReplace,
  generateSlugFromText,
} from '@/lib/text-tools';

describe('wordCount', () => {
  it('returns zeros for empty string', () => {
    const result = wordCount('');
    expect(result).toEqual({
      words: 0,
      sentences: 0,
      paragraphs: 0,
      characters: 0,
      charactersNoSpaces: 0,
    });
  });

  it('returns zeros for whitespace-only string', () => {
    const result = wordCount('   \n\t  ');
    expect(result).toEqual({
      words: 0,
      sentences: 0,
      paragraphs: 0,
      characters: 0,
      charactersNoSpaces: 0,
    });
  });

  it('counts words correctly', () => {
    const result = wordCount('Hello world foo bar');
    expect(result.words).toBe(4);
  });

  it('counts sentences correctly', () => {
    const result = wordCount('Hello world. How are you? I am fine!');
    expect(result.sentences).toBe(3);
  });

  it('counts paragraphs correctly', () => {
    const result = wordCount('First paragraph.\n\nSecond paragraph.\n\nThird paragraph.');
    expect(result.paragraphs).toBe(3);
  });

  it('counts characters correctly', () => {
    const result = wordCount('Hello world');
    expect(result.characters).toBe(11);
    expect(result.charactersNoSpaces).toBe(10);
  });
});

describe('characterCount', () => {
  it('returns zeros for empty string', () => {
    const result = characterCount('');
    expect(result).toEqual({ total: 0, withoutSpaces: 0, lines: 0 });
  });

  it('counts total characters including spaces', () => {
    const result = characterCount('Hello world');
    expect(result.total).toBe(11);
  });

  it('counts characters without spaces', () => {
    const result = characterCount('Hello world');
    expect(result.withoutSpaces).toBe(10);
  });

  it('counts lines correctly', () => {
    const result = characterCount('line1\nline2\nline3');
    expect(result.lines).toBe(3);
  });

  it('counts single line correctly', () => {
    const result = characterCount('single line');
    expect(result.lines).toBe(1);
  });
});

describe('caseConvert', () => {
  it('returns empty string for empty input', () => {
    expect(caseConvert('', 'upper')).toBe('');
  });

  it('converts to uppercase', () => {
    expect(caseConvert('hello world', 'upper')).toBe('HELLO WORLD');
  });

  it('converts to lowercase', () => {
    expect(caseConvert('HELLO WORLD', 'lower')).toBe('hello world');
  });

  it('converts to title case', () => {
    expect(caseConvert('hello world foo', 'title')).toBe('Hello World Foo');
  });

  it('converts to sentence case', () => {
    expect(caseConvert('hello world. foo bar.', 'sentence')).toBe('Hello world. Foo bar.');
  });
});

describe('generateLoremIpsum', () => {
  it('returns empty string for 0 paragraphs', () => {
    expect(generateLoremIpsum(0)).toBe('');
  });

  it('returns empty string for negative count', () => {
    expect(generateLoremIpsum(-5)).toBe('');
  });

  it('generates exactly 1 paragraph', () => {
    const result = generateLoremIpsum(1);
    const paragraphs = result.split('\n\n');
    expect(paragraphs).toHaveLength(1);
  });

  it('generates exactly 5 paragraphs', () => {
    const result = generateLoremIpsum(5);
    const paragraphs = result.split('\n\n');
    expect(paragraphs).toHaveLength(5);
  });

  it('generates exactly 50 paragraphs', () => {
    const result = generateLoremIpsum(50);
    const paragraphs = result.split('\n\n');
    expect(paragraphs).toHaveLength(50);
  });

  it('clamps to 50 if given a larger number', () => {
    const result = generateLoremIpsum(100);
    const paragraphs = result.split('\n\n');
    expect(paragraphs).toHaveLength(50);
  });

  it('each paragraph is non-empty', () => {
    const result = generateLoremIpsum(10);
    const paragraphs = result.split('\n\n');
    paragraphs.forEach(p => {
      expect(p.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('reverseText', () => {
  it('returns empty string for empty input', () => {
    expect(reverseText('', 'characters')).toBe('');
    expect(reverseText('', 'words')).toBe('');
  });

  it('reverses characters', () => {
    expect(reverseText('hello', 'characters')).toBe('olleh');
  });

  it('reverses words', () => {
    expect(reverseText('hello world foo', 'words')).toBe('foo world hello');
  });
});

describe('removeDuplicateLines', () => {
  it('returns empty string for empty input', () => {
    expect(removeDuplicateLines('')).toBe('');
  });

  it('removes duplicate lines', () => {
    const input = 'line1\nline2\nline1\nline3\nline2';
    const expected = 'line1\nline2\nline3';
    expect(removeDuplicateLines(input)).toBe(expected);
  });

  it('preserves order of first occurrences', () => {
    const input = 'c\nb\na\nc\nb';
    const expected = 'c\nb\na';
    expect(removeDuplicateLines(input)).toBe(expected);
  });

  it('keeps all lines if no duplicates', () => {
    const input = 'a\nb\nc';
    expect(removeDuplicateLines(input)).toBe(input);
  });
});

describe('findAndReplace', () => {
  it('returns empty string for empty input', () => {
    expect(findAndReplace('', 'find', 'replace')).toBe('');
  });

  it('returns original text if find is empty', () => {
    expect(findAndReplace('hello world', '', 'replace')).toBe('hello world');
  });

  it('replaces all occurrences (case-sensitive by default)', () => {
    expect(findAndReplace('hello Hello hello', 'hello', 'hi')).toBe('hi Hello hi');
  });

  it('replaces case-insensitively when option set', () => {
    expect(
      findAndReplace('hello Hello HELLO', 'hello', 'hi', { caseSensitive: false })
    ).toBe('hi hi hi');
  });

  it('supports regex mode', () => {
    expect(
      findAndReplace('foo123bar456', '\\d+', 'NUM', { regex: true })
    ).toBe('fooNUMbarNUM');
  });

  it('returns original text for invalid regex', () => {
    expect(
      findAndReplace('hello world', '[invalid', 'x', { regex: true })
    ).toBe('hello world');
  });
});

describe('generateSlugFromText', () => {
  it('returns empty string for empty input', () => {
    expect(generateSlugFromText('')).toBe('');
  });

  it('generates a valid slug from text', () => {
    expect(generateSlugFromText('Hello World')).toBe('hello-world');
  });

  it('handles special characters', () => {
    expect(generateSlugFromText('Hello, World! How are you?')).toBe('hello-world-how-are-you');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlugFromText('hello   world')).toBe('hello-world');
  });
});
