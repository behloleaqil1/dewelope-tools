'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseFlag - Convert text to Morse flag signals (left/right).
 * Dots are represented as left flag, dashes as right flag.
 */
export default function TextToMorseFlag({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };

  function convert() {
    const text = input.toUpperCase().trim();
    if (!text) {
      setOutput('');
      return;
    }

    const result = text.split('').map(char => {
      const morse = morseMap[char];
      if (!morse) return '?';
      if (morse === '/') return '  [SPACE]  ';
      return morse.split('').map(signal => {
        return signal === '.' ? '⬅ LEFT' : '➡ RIGHT';
      }).join(' | ');
    }).join('\n');

    setOutput(result);
  }

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
          placeholder="Enter text to convert to Morse flag signals..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="btn-primary mt-2">Convert to Morse Flags</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Morse Flag Signals</label>
            <div className="text-xs text-gray-500 mb-1">⬅ LEFT = dot (.) | ➡ RIGHT = dash (-)</div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
