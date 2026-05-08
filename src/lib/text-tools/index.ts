/**
 * Text Tools Engine
 *
 * Pure functions for text manipulation and analysis.
 * All functions handle empty input gracefully (return empty/zero).
 */

import { generateSlug } from '@/lib/slug';

// ─── Word Count ──────────────────────────────────────────────────────────────

export interface WordCountResult {
  words: number;
  sentences: number;
  paragraphs: number;
  characters: number;
  charactersNoSpaces: number;
}

/**
 * Count words, sentences, paragraphs, and characters in text.
 *
 * @param text - Input text to analyze
 * @returns Object with word, sentence, paragraph, and character counts
 */
export function wordCount(text: string): WordCountResult {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      sentences: 0,
      paragraphs: 0,
      characters: 0,
      charactersNoSpaces: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Words: split on whitespace, filter empty strings
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Sentences: split on sentence-ending punctuation followed by space or end
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Paragraphs: split on double newlines or more
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);

  return { words, sentences, paragraphs, characters, charactersNoSpaces };
}

// ─── Character Count ─────────────────────────────────────────────────────────

export interface CharacterCountResult {
  total: number;
  withoutSpaces: number;
  lines: number;
}

/**
 * Count characters (total and without spaces) and lines in text.
 *
 * @param text - Input text to analyze
 * @returns Object with total characters, characters without spaces, and line count
 */
export function characterCount(text: string): CharacterCountResult {
  if (!text) {
    return { total: 0, withoutSpaces: 0, lines: 0 };
  }

  const total = text.length;
  const withoutSpaces = text.replace(/\s/g, '').length;
  const lines = text.length === 0 ? 0 : text.split('\n').length;

  return { total, withoutSpaces, lines };
}

// ─── Case Convert ────────────────────────────────────────────────────────────

export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence';

/**
 * Convert text to the specified case.
 *
 * @param text - Input text to convert
 * @param mode - Target case: 'upper', 'lower', 'title', or 'sentence'
 * @returns Converted text string
 */
export function caseConvert(text: string, mode: CaseMode): string {
  if (!text) {
    return '';
  }

  switch (mode) {
    case 'upper':
      return text.toUpperCase();

    case 'lower':
      return text.toLowerCase();

    case 'title':
      return text.replace(/\b\w/g, char => char.toUpperCase());

    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());

    default:
      return text;
  }
}

// ─── Lorem Ipsum Generator ───────────────────────────────────────────────────

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus nulla gravida orci.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
  'Donec eu libero sit amet quam egestas semper aenean ultricies mi vitae est.',
  'Mauris placerat eleifend leo quisque sit amet est et sapien ullamcorper pharetra.',
  'Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.',
  'Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.',
  'Donec non enim in turpis pulvinar facilisis ut felis.',
  'Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.',
  'Aliquam erat volutpat nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.',
  'Phasellus ultrices nulla quis nibh populis a lacinia ante.',
  'Etiam pede massa, dapibus vitae, rhoncus sed, cursus sed, enim.',
  'Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio.',
  'Nunc porta vulputate tellus nunc rutrum turpis sed pede.',
  'Sed bibendum ipsum ut sapien varius pellentesque nibh aliquam.',
  'Cras vel libero id lectus rhoncus porta mollis vitae.',
  'Suspendisse potenti nullam accumsan lorem in dui cras sit amet.',
  'Integer nec odio praesent libero sed cursus ante dapibus diam.',
  'Nulla quis sem at nibh elementum imperdiet duis sagittis ipsum.',
  'Praesent mauris fusce nec tellus sed augue semper porta.',
];

/**
 * Generate Lorem Ipsum placeholder text with the specified number of paragraphs.
 *
 * @param paragraphs - Number of paragraphs to generate (1-50)
 * @returns Generated Lorem Ipsum text with paragraphs separated by double newlines
 */
export function generateLoremIpsum(paragraphs: number): string {
  if (paragraphs <= 0) {
    return '';
  }

  // Clamp to valid range
  const count = Math.min(Math.max(Math.round(paragraphs), 1), 50);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    // Each paragraph has 3-6 sentences
    const sentenceCount = 3 + (i % 4); // Varies between 3-6
    const paragraphSentences: string[] = [];

    for (let j = 0; j < sentenceCount; j++) {
      const sentenceIndex = (i * sentenceCount + j) % LOREM_SENTENCES.length;
      paragraphSentences.push(LOREM_SENTENCES[sentenceIndex]);
    }

    result.push(paragraphSentences.join(' '));
  }

  return result.join('\n\n');
}

// ─── Text Reverse ────────────────────────────────────────────────────────────

export type ReverseMode = 'characters' | 'words';

/**
 * Reverse text by characters or words.
 *
 * @param text - Input text to reverse
 * @param mode - Reverse mode: 'characters' reverses all characters, 'words' reverses word order
 * @returns Reversed text string
 */
export function reverseText(text: string, mode: ReverseMode): string {
  if (!text) {
    return '';
  }

  switch (mode) {
    case 'characters':
      return text.split('').reverse().join('');

    case 'words':
      return text.split(/\s+/).reverse().join(' ');

    default:
      return text;
  }
}

// ─── Remove Duplicate Lines ──────────────────────────────────────────────────

/**
 * Remove duplicate lines from text, keeping the first occurrence of each line.
 *
 * @param text - Input text with potential duplicate lines
 * @returns Text with duplicate lines removed
 */
export function removeDuplicateLines(text: string): string {
  if (!text) {
    return '';
  }

  const lines = text.split('\n');
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      uniqueLines.push(line);
    }
  }

  return uniqueLines.join('\n');
}

// ─── Find and Replace ────────────────────────────────────────────────────────

export interface FindAndReplaceOptions {
  caseSensitive?: boolean;
  regex?: boolean;
}

/**
 * Find and replace text with optional case sensitivity and regex support.
 *
 * @param text - Input text to search
 * @param find - String or pattern to find
 * @param replace - Replacement string
 * @param options - Optional settings for case sensitivity and regex mode
 * @returns Text with replacements applied
 */
export function findAndReplace(
  text: string,
  find: string,
  replace: string,
  options?: FindAndReplaceOptions
): string {
  if (!text || !find) {
    return text || '';
  }

  const caseSensitive = options?.caseSensitive ?? true;
  const useRegex = options?.regex ?? false;

  try {
    let pattern: RegExp;

    if (useRegex) {
      const flags = caseSensitive ? 'g' : 'gi';
      pattern = new RegExp(find, flags);
    } else {
      // Escape special regex characters for literal matching
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitive ? 'g' : 'gi';
      pattern = new RegExp(escaped, flags);
    }

    return text.replace(pattern, replace);
  } catch {
    // If regex is invalid, return original text
    return text;
  }
}

// ─── Slug Generator ──────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from text input.
 * Reuses the slug utility from src/lib/slug.ts.
 *
 * @param text - Input text to convert to a slug
 * @returns URL-safe slug string
 */
export function generateSlugFromText(text: string): string {
  if (!text) {
    return '';
  }

  return generateSlug(text);
}
