'use client';

import { useState, useEffect, useRef } from 'react';
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
 * TextToMorseLight - Show Morse code as light/dark blocks (visual signal).
 * Dots are small light blocks, dashes are wide light blocks, with dark gaps between.
 */
export default function TextToMorseLight({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [signals, setSignals] = useState<{ type: 'dot' | 'dash' | 'char-gap' | 'word-gap'; char?: string }[]>([]);
  const [morseText, setMorseText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) {
      setSignals([]);
      setMorseText('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result: { type: 'dot' | 'dash' | 'char-gap' | 'word-gap'; char?: string }[] = [];
      const morseChars: string[] = [];
      const upper = input.toUpperCase();

      for (let i = 0; i < upper.length; i++) {
        const ch = upper[i];
        const morse = MORSE_MAP[ch];
        if (!morse) continue;

        if (ch === ' ') {
          result.push({ type: 'word-gap' });
          morseChars.push('/');
        } else {
          if (i > 0 && upper[i - 1] !== ' ' && MORSE_MAP[upper[i - 1]]) {
            result.push({ type: 'char-gap', char: ch });
          }
          for (const symbol of morse) {
            result.push({ type: symbol === '.' ? 'dot' : 'dash', char: ch });
          }
          morseChars.push(morse);
        }
      }

      setSignals(result);
      setMorseText(morseChars.join(' '));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to visualize as Morse light signals
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text (e.g. SOS, HELLO)..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-24 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={signals.length > 0}>
        {signals.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visual Light Signal</label>
              <div className="flex flex-wrap items-center gap-1 bg-gray-900 p-4 rounded-lg" role="img" aria-label={`Morse code light signal for: ${input}`}>
                {signals.map((signal, idx) => {
                  if (signal.type === 'dot') {
                    return <div key={idx} className="w-3 h-6 bg-yellow-300 rounded-sm shadow-[0_0_6px_rgba(253,224,71,0.8)]" title="Dot (.)" />;
                  }
                  if (signal.type === 'dash') {
                    return <div key={idx} className="w-8 h-6 bg-yellow-300 rounded-sm shadow-[0_0_6px_rgba(253,224,71,0.8)]" title="Dash (-)" />;
                  }
                  if (signal.type === 'char-gap') {
                    return <div key={idx} className="w-4 h-6" title="Character gap" />;
                  }
                  if (signal.type === 'word-gap') {
                    return <div key={idx} className="w-10 h-6" title="Word gap" />;
                  }
                  return null;
                })}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="inline-block w-3 h-3 bg-yellow-300 rounded-sm mr-1 align-middle" /> = dot &nbsp;
                <span className="inline-block w-6 h-3 bg-yellow-300 rounded-sm mr-1 align-middle" /> = dash &nbsp;
                Dark gaps = separators
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Morse Code Text</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{morseText}</pre>
              <CopyToClipboard text={morseText} />
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
