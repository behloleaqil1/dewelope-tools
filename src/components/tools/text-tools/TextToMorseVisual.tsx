'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/',
};

/**
 * TextToMorseVisual - Converts text to Morse code with visual colored blocks.
 * Dots are shown as small colored blocks and dashes as wider colored blocks.
 */
export default function TextToMorseVisual({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ char: string; morse: string }[]>([]);

  function handleConvert() {
    if (!input.trim()) {
      setResult([]);
      return;
    }

    const chars = input.toUpperCase().split('');
    const converted = chars.map((char) => ({
      char,
      morse: MORSE_MAP[char] || '',
    })).filter((item) => item.morse !== '');

    setResult(converted);
  }

  const morseText = result.map((r) => `${r.char}: ${r.morse}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to see visual Morse code..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={handleConvert} aria-label="Convert to visual Morse code" className="btn-primary">
        Convert to Visual Morse
      </button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Visual Morse Code</label>
            <div className="space-y-2">
              {result.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-700 w-8 text-center">
                    {item.char === '/' ? '⎵' : item.char}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.morse === '/' ? (
                      <div className="w-6 h-4" />
                    ) : (
                      item.morse.split('').map((symbol, sIdx) => (
                        <div
                          key={sIdx}
                          className={`rounded-sm ${
                            symbol === '.'
                              ? 'w-3 h-3 bg-blue-500'
                              : 'w-8 h-3 bg-orange-500'
                          }`}
                          aria-label={symbol === '.' ? 'dot' : 'dash'}
                        />
                      ))
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-500 ml-auto">{item.morse}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-blue-500 rounded-sm"></span> Dot (.)</span>
              <span className="flex items-center gap-1"><span className="inline-block w-8 h-3 bg-orange-500 rounded-sm"></span> Dash (-)</span>
            </div>
            <CopyToClipboard text={morseText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
