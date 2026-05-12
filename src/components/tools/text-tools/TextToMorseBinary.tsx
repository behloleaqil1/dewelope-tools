'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
};

/**
 * TextToMorseBinary - Convert text to Morse code as binary representation.
 * Dit = 1, Dah = 111, intra-char gap = 0, inter-char gap = 000, word gap = 0000000.
 */
export default function TextToMorseBinary({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const words = input.toUpperCase().split(/\s+/);
      const binaryWords: string[] = [];

      for (const word of words) {
        const binaryChars: string[] = [];
        for (const char of word) {
          const morse = MORSE_MAP[char];
          if (morse) {
            // Convert each dit/dah to binary, separated by 0 (intra-char gap)
            const binarySymbols = morse.split('').map((s) => (s === '.' ? '1' : '111'));
            binaryChars.push(binarySymbols.join('0'));
          }
        }
        // Inter-character gap is 000
        binaryWords.push(binaryChars.join('000'));
      }

      // Word gap is 0000000
      setOutput(binaryWords.join('0000000'));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to Morse binary
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here... e.g. SOS"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Morse Binary Output</label>
            <div className="text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 break-all leading-relaxed">
              {output}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              1 = dit, 111 = dah, 0 = intra-char gap, 000 = inter-char gap, 0000000 = word gap
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
