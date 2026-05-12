'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseProsigns - Convert text to Morse code with all prosigns and abbreviations.
 */
export default function TextToMorseProsigns({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'toMorse' | 'fromMorse'>('toMorse');
  const [output, setOutput] = useState('');

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  };

  const prosigns: Record<string, string> = {
    '<AA>': '.-.-', '<AR>': '.-.-.', '<AS>': '.-...', '<BK>': '-...-.-',
    '<BT>': '-...-', '<CL>': '-.-..-..', '<CT>': '-.-.-', '<DO>': '-..---',
    '<KN>': '-.--.', '<SK>': '...-.-', '<SN>': '...-.', '<SOS>': '...---...',
    '<HH>': '........', '<VA>': '...-.-',
  };

  const convert = () => {
    if (direction === 'toMorse') {
      const text = input.toUpperCase();
      // Replace prosigns first
      let result = text;
      Object.entries(prosigns).forEach(([key, val]) => {
        result = result.replace(new RegExp(key.replace(/[<>]/g, '\\$&'), 'g'), ` ${val} `);
      });

      // Convert remaining characters
      const morseResult = result.split('').map(char => {
        if (char === ' ') return '/';
        return morseMap[char] || char;
      }).join(' ');

      setOutput(morseResult.replace(/\s+/g, ' ').trim());
    } else {
      const reverseMorse: Record<string, string> = {};
      Object.entries(morseMap).forEach(([k, v]) => { reverseMorse[v] = k; });

      const words = input.split(' / ');
      const decoded = words.map(word => {
        return word.trim().split(' ').map(code => {
          return reverseMorse[code] || `[${code}]`;
        }).join('');
      }).join(' ');

      setOutput(decoded);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value as 'toMorse' | 'fromMorse')} className="input-field" aria-label="Conversion direction">
              <option value="toMorse">Text → Morse Code</option>
              <option value="fromMorse">Morse Code → Text</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'toMorse' ? 'Enter text (use <SOS>, <AR>, etc. for prosigns)' : 'Enter Morse code (space between letters, / between words)'}
            </label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={direction === 'toMorse' ? 'Hello World <SOS>' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
              className="input-field h-32 resize-y font-mono"
              aria-label={`Input for ${toolName}`}
            />
          </div>
          <button onClick={convert} className="btn-primary w-full">Convert</button>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Prosigns:</strong> &lt;AA&gt; &lt;AR&gt; &lt;AS&gt; &lt;BK&gt; &lt;BT&gt; &lt;CL&gt; &lt;CT&gt; &lt;KN&gt; &lt;SK&gt; &lt;SN&gt; &lt;SOS&gt; &lt;HH&gt;
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
