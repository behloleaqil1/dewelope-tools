'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseSoundPattern - Show Morse code timing pattern (short/long/pause).
 * Converts text to visual timing representation using dots, dashes, and pauses.
 */
export default function TextToMorseSoundPattern({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
    '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const lines: string[] = [];
      const text = input.toUpperCase();

      for (const char of text) {
        if (char === ' ') {
          lines.push('');
          lines.push('  [WORD PAUSE — 7 units]');
          lines.push('');
        } else if (morseMap[char]) {
          const morse = morseMap[char];
          const timing: string[] = [];
          for (let i = 0; i < morse.length; i++) {
            if (morse[i] === '.') {
              timing.push('▪ (dit — 1 unit)');
            } else {
              timing.push('▬▬▬ (dah — 3 units)');
            }
            if (i < morse.length - 1) {
              timing.push('  · (element gap — 1 unit)');
            }
          }
          lines.push(`${char}  →  ${morse}`);
          timing.forEach(t => lines.push(`    ${t}`));
          lines.push(`    [LETTER PAUSE — 3 units]`);
        }
      }

      const summary = [
        'TIMING RULES:',
        '  ▪ Dit (dot)     = 1 unit',
        '  ▬▬▬ Dah (dash)  = 3 units',
        '  Element gap     = 1 unit (between dits/dahs)',
        '  Letter gap      = 3 units (between letters)',
        '  Word gap        = 7 units (between words)',
        '',
        '─'.repeat(40),
        '',
      ];

      setOutput([...summary, ...lines].join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

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
          placeholder="Enter text to see Morse timing pattern..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Morse Code Timing Pattern</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
