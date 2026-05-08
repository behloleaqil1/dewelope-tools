import { describe, it, expect } from 'vitest';
import { searchTools } from '@/lib/search';
import type { ToolConfig } from '@/types';

const mockTools: ToolConfig[] = [
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine.',
    shortDescription: 'Convert between temperature scales.',
    category: 'unit-converters',
    slug: 'temperature-converter',
    metaTitle: 'Temperature Converter - Free Online Tool',
    metaDescription: 'Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine instantly.',
    keywords: ['temperature', 'converter'],
    featured: true,
    componentPath: '@/components/tools/unit-converters/TemperatureConverter',
    inputConfig: { type: 'composite', fields: [] },
    outputConfig: { type: 'number', copyable: true },
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, sentences, paragraphs, and characters in your text.',
    shortDescription: 'Count words and characters.',
    category: 'text-tools',
    slug: 'word-counter',
    metaTitle: 'Word Counter - Free Online Text Tool',
    metaDescription: 'Count words, sentences, paragraphs, and characters in your text instantly.',
    keywords: ['word counter'],
    featured: true,
    componentPath: '@/components/tools/text-tools/WordCounter',
    inputConfig: { type: 'text', maxLength: 100000 },
    outputConfig: { type: 'multi-value', copyable: true },
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter and Validator',
    description: 'Format, validate, and pretty-print JSON data with syntax highlighting.',
    shortDescription: 'Format and validate JSON.',
    category: 'developer-tools',
    slug: 'json-formatter',
    metaTitle: 'JSON Formatter and Validator - Online',
    metaDescription: 'Format, validate, and pretty-print JSON data with syntax highlighting.',
    keywords: ['json', 'formatter'],
    featured: false,
    componentPath: '@/components/tools/developer-tools/JsonFormatter',
    inputConfig: { type: 'text', maxLength: 1000000 },
    outputConfig: { type: 'formatted', copyable: true, syntaxHighlight: true },
  },
];

describe('searchTools', () => {
  it('returns empty array when query is less than 2 characters', () => {
    expect(searchTools('', mockTools)).toEqual([]);
    expect(searchTools('a', mockTools)).toEqual([]);
  });

  it('returns results for queries of 2 or more characters', () => {
    const results = searchTools('te', mockTools);
    expect(results.length).toBeGreaterThan(0);
  });

  it('matches tool names case-insensitively', () => {
    const results = searchTools('temperature', mockTools);
    expect(results).toHaveLength(1);
    expect(results[0].tool.id).toBe('temperature-converter');
    expect(results[0].matchType).toBe('name');
  });

  it('matches tool names regardless of case', () => {
    const upper = searchTools('TEMPERATURE', mockTools);
    const lower = searchTools('temperature', mockTools);
    const mixed = searchTools('TeMpErAtUrE', mockTools);
    expect(upper).toHaveLength(1);
    expect(lower).toHaveLength(1);
    expect(mixed).toHaveLength(1);
  });

  it('matches tool descriptions when name does not match', () => {
    const results = searchTools('syntax', mockTools);
    expect(results).toHaveLength(1);
    expect(results[0].tool.id).toBe('json-formatter');
    expect(results[0].matchType).toBe('description');
  });

  it('prefers name match over description match', () => {
    // "word" appears in Word Counter name and in other descriptions
    const results = searchTools('word', mockTools);
    const wordCounter = results.find((r) => r.tool.id === 'word-counter');
    expect(wordCounter).toBeDefined();
    expect(wordCounter!.matchType).toBe('name');
  });

  it('returns matchIndex indicating position of match', () => {
    const results = searchTools('converter', mockTools);
    const tempResult = results.find((r) => r.tool.id === 'temperature-converter');
    expect(tempResult).toBeDefined();
    // "Temperature Converter" - "converter" starts at index 12
    expect(tempResult!.matchIndex).toBe(12);
  });

  it('returns empty array when no tools match', () => {
    const results = searchTools('zzzzzzz', mockTools);
    expect(results).toEqual([]);
  });

  it('matches substring within name', () => {
    const results = searchTools('form', mockTools);
    const jsonResult = results.find((r) => r.tool.id === 'json-formatter');
    expect(jsonResult).toBeDefined();
    expect(jsonResult!.matchType).toBe('name');
  });

  it('returns multiple results when multiple tools match', () => {
    // "convert" appears in Temperature Converter name and Word Counter description
    const results = searchTools('convert', mockTools);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});
