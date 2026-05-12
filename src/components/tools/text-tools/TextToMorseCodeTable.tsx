'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseCodeTable - Display full Morse code reference table with search.
 * Shows all letters, numbers, and punctuation with their Morse code equivalents.
 */

const MORSE_TABLE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
};

export default function TextToMorseCodeTable({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');

  const entries = Object.entries(MORSE_TABLE);
  const filtered = search.trim()
    ? entries.filter(([char]) => char.toLowerCase().includes(search.toLowerCase()))
    : entries;

  const letters = filtered.filter(([c]) => /^[A-Z]$/.test(c));
  const numbers = filtered.filter(([c]) => /^[0-9]$/.test(c));
  const punctuation = filtered.filter(([c]) => !/^[A-Z0-9]$/.test(c));

  const tableText = entries.map(([char, code]) => `${char === ' ' ? 'SPACE' : char}\t${code}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search character
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a character to filter..."
          aria-label={`Search filter for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-6">
          {letters.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Letters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {letters.map(([char, code]) => (
                  <div key={char} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border">
                    <span className="font-bold text-gray-900">{char}</span>
                    <span className="font-mono text-sm text-gray-600">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {numbers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Numbers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {numbers.map(([char, code]) => (
                  <div key={char} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border">
                    <span className="font-bold text-gray-900">{char}</span>
                    <span className="font-mono text-sm text-gray-600">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {punctuation.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Punctuation &amp; Special</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {punctuation.map(([char, code]) => (
                  <div key={char} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border">
                    <span className="font-bold text-gray-900">{char === ' ' ? '␣' : char}</span>
                    <span className="font-mono text-sm text-gray-600">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CopyToClipboard text={tableText} />
        </div>
      </OutputArea>
    </div>
  );
}
