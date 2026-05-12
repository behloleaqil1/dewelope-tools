'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMorseInternational - Convert text to International Morse code with prosigns support.
 */
export default function TextToMorseInternational({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
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
  };

  const reverseMorse: Record<string, string> = {};
  Object.entries(morseMap).forEach(([char, code]) => { reverseMorse[code] = char; });
  Object.entries(prosigns).forEach(([sign, code]) => { reverseMorse[code] = sign; });

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (direction === 'text-to-morse') {
      let result = '';
      let text = input.toUpperCase();

      // Check for prosigns first
      for (const [sign, code] of Object.entries(prosigns)) {
        text = text.replace(new RegExp(sign.replace(/[<>]/g, '\\$&'), 'g'), `\x00${code}\x00`);
      }

      const parts = text.split('\x00');
      const morseWords: string[] = [];

      for (const part of parts) {
        if (Object.values(prosigns).includes(part)) {
          morseWords.push(part);
        } else {
          const words = part.split(' ');
          for (const word of words) {
            if (!word) continue;
            const morseChars = word.split('').map(ch => morseMap[ch] || '').filter(Boolean);
            if (morseChars.length) morseWords.push(morseChars.join(' '));
          }
        }
      }

      result = morseWords.join(' / ');
      setOutput(result);
    } else {
      const words = input.trim().split(/\s*\/\s*/);
      const textWords: string[] = [];

      for (const word of words) {
        const codes = word.trim().split(/\s+/);
        let textWord = '';
        for (const code of codes) {
          textWord += reverseMorse[code] || '?';
        }
        textWords.push(textWord);
      }

      setOutput(textWords.join(' '));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">
          Conversion Direction
        </label>
        <select
          id={`${toolId}-direction`}
          value={direction}
          onChange={(e) => setDirection(e.target.value as 'text-to-morse' | 'morse-to-text')}
          aria-label={`Direction for ${toolName}`}
          className="input-field"
        >
          <option value="text-to-morse">Text → Morse Code</option>
          <option value="morse-to-text">Morse Code → Text</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {direction === 'text-to-morse' ? 'Enter Text (use <SOS>, <AR>, etc. for prosigns)' : 'Enter Morse Code (use / for word separator)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={direction === 'text-to-morse' ? 'Hello World <SOS>' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
            <div className="mt-3 text-xs text-gray-500">
              <p className="font-medium mb-1">Supported Prosigns:</p>
              <p>&lt;SOS&gt; &lt;AR&gt; (End of message) &lt;SK&gt; (End of contact) &lt;BT&gt; (Break) &lt;KN&gt; (Go ahead) &lt;AA&gt; (New line)</p>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
