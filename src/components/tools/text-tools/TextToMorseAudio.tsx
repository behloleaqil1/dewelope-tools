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
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
  '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

/**
 * TextToMorseAudio - Convert text to Morse code with visual dot/dash timing display.
 * Shows the Morse code and a visual timing representation.
 */
export default function TextToMorseAudio({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [morseOutput, setMorseOutput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setMorseOutput('');
      return;
    }
    const morse = input.toUpperCase().split('').map((char) => {
      if (char === ' ') return '/';
      return MORSE_MAP[char] || '';
    }).filter(Boolean).join(' ');
    setMorseOutput(morse);
  }, [input]);

  const playVisual = () => {
    if (!morseOutput || isPlaying) return;
    setIsPlaying(true);
    setCurrentIndex(0);

    const symbols = morseOutput.split('');
    let i = 0;

    const step = () => {
      if (i >= symbols.length) {
        setIsPlaying(false);
        setCurrentIndex(-1);
        return;
      }
      setCurrentIndex(i);
      const char = symbols[i];
      const delay = char === '.' ? 200 : char === '-' ? 500 : char === ' ' ? 300 : 600;
      i++;
      timerRef.current = setTimeout(step, delay);
    };
    step();
  };

  const stopVisual = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentIndex(-1);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const morseSymbols = morseOutput.split('');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to Morse code
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!morseOutput}>
        {morseOutput && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Morse Code</label>
              <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 tracking-wider">
                {morseOutput}
              </pre>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visual Timing</label>
              <div className="flex flex-wrap gap-1 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px] items-center">
                {morseSymbols.map((sym, i) => {
                  if (sym === '.') {
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-green-500 scale-125' : 'bg-blue-500'} transition-all`}
                        title="dot"
                      />
                    );
                  } else if (sym === '-') {
                    return (
                      <div
                        key={i}
                        className={`w-8 h-3 rounded-full ${i === currentIndex ? 'bg-green-500 scale-110' : 'bg-blue-700'} transition-all`}
                        title="dash"
                      />
                    );
                  } else if (sym === '/') {
                    return <div key={i} className="w-6" title="word gap" />;
                  } else {
                    return <div key={i} className="w-2" title="letter gap" />;
                  }
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={isPlaying ? stopVisual : playVisual}
                className="btn-primary"
                aria-label={isPlaying ? 'Stop visual playback' : 'Play visual timing'}
              >
                {isPlaying ? 'Stop' : 'Play Visual'}
              </button>
            </div>

            <CopyToClipboard text={morseOutput} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
