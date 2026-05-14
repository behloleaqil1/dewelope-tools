'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnicodeCharacterLookup - Search Unicode characters by name or code point
 */
export default function UnicodeCharacterLookup({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Array<{ char: string; codePoint: string; name: string }>>([]);
  const [error, setError] = useState<string | undefined>();

  function lookup() {
    setError(undefined);
    setResult([]);

    if (!input.trim()) {
      setError('Please enter a character, code point (U+XXXX), or search term');
      return;
    }

    const trimmed = input.trim();
    const results: Array<{ char: string; codePoint: string; name: string }> = [];

    // Check if input is a code point like U+0041
    const codePointMatch = trimmed.match(/^[Uu]\+([0-9A-Fa-f]{1,6})$/);
    if (codePointMatch) {
      const cp = parseInt(codePointMatch[1], 16);
      if (cp <= 0x10FFFF) {
        const char = String.fromCodePoint(cp);
        results.push({ char, codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`, name: getCharName(cp) });
      }
    } else if (trimmed.length <= 4) {
      // Treat as characters to look up
      for (const char of [...trimmed]) {
        const cp = char.codePointAt(0)!;
        results.push({ char, codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`, name: getCharName(cp) });
      }
    } else {
      // Search common characters by name
      const searchResults = searchByName(trimmed.toLowerCase());
      results.push(...searchResults);
    }

    if (results.length === 0) {
      setError('No characters found');
      return;
    }

    setResult(results);
  }

  function getCharName(cp: number): string {
    const names: Record<number, string> = {
      32: 'SPACE', 33: 'EXCLAMATION MARK', 34: 'QUOTATION MARK', 35: 'NUMBER SIGN',
      36: 'DOLLAR SIGN', 37: 'PERCENT SIGN', 38: 'AMPERSAND', 39: 'APOSTROPHE',
      48: 'DIGIT ZERO', 49: 'DIGIT ONE', 65: 'LATIN CAPITAL LETTER A', 97: 'LATIN SMALL LETTER A',
      169: 'COPYRIGHT SIGN', 174: 'REGISTERED SIGN', 8364: 'EURO SIGN', 8482: 'TRADE MARK SIGN',
      9829: 'BLACK HEART SUIT', 9733: 'BLACK STAR', 8594: 'RIGHTWARDS ARROW',
    };
    if (names[cp]) return names[cp];
    if (cp >= 65 && cp <= 90) return `LATIN CAPITAL LETTER ${String.fromCodePoint(cp)}`;
    if (cp >= 97 && cp <= 122) return `LATIN SMALL LETTER ${String.fromCodePoint(cp)}`;
    if (cp >= 48 && cp <= 57) return `DIGIT ${String.fromCodePoint(cp)}`;
    return `CHARACTER U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
  }

  function searchByName(query: string): Array<{ char: string; codePoint: string; name: string }> {
    const common: Array<[number, string]> = [
      [169, 'COPYRIGHT SIGN'], [174, 'REGISTERED SIGN'], [8482, 'TRADE MARK SIGN'],
      [8364, 'EURO SIGN'], [163, 'POUND SIGN'], [165, 'YEN SIGN'],
      [9829, 'BLACK HEART SUIT'], [9830, 'BLACK DIAMOND SUIT'], [9827, 'BLACK CLUB SUIT'],
      [9824, 'BLACK SPADE SUIT'], [9733, 'BLACK STAR'], [9734, 'WHITE STAR'],
      [8594, 'RIGHTWARDS ARROW'], [8592, 'LEFTWARDS ARROW'], [8593, 'UPWARDS ARROW'],
      [8595, 'DOWNWARDS ARROW'], [8730, 'SQUARE ROOT'], [8734, 'INFINITY'],
      [960, 'GREEK SMALL LETTER PI'], [8721, 'N-ARY SUMMATION'], [8747, 'INTEGRAL'],
      [176, 'DEGREE SIGN'], [177, 'PLUS-MINUS SIGN'], [215, 'MULTIPLICATION SIGN'],
      [247, 'DIVISION SIGN'], [8804, 'LESS-THAN OR EQUAL TO'], [8805, 'GREATER-THAN OR EQUAL TO'],
    ];
    return common
      .filter(([, name]) => name.toLowerCase().includes(query))
      .slice(0, 20)
      .map(([cp, name]) => ({ char: String.fromCodePoint(cp), codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`, name }));
  }

  const copyText = result.map(r => `${r.char} ${r.codePoint} ${r.name}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Character, Code Point (U+XXXX), or Name</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., A, U+0041, or 'heart'" aria-label={`Unicode search input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={lookup} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Lookup</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-2">Char</th><th className="text-left p-2">Code Point</th><th className="text-left p-2">Name</th></tr></thead>
                <tbody>
                  {result.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-2 text-2xl">{r.char}</td>
                      <td className="p-2 font-mono text-blue-600">{r.codePoint}</td>
                      <td className="p-2 text-gray-700">{r.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
