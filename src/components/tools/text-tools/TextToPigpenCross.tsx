'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigpenCross - Encode/decode text using the Pigpen cipher cross/X variant.
 * The cross variant uses the X-shaped grids for the second half of the alphabet.
 */
export default function TextToPigpenCross({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Pigpen cross/X variant mapping using Unicode box-drawing and symbols
  const pigpenMap: Record<string, string> = {
    'a': '┘', 'b': '─', 'c': '└',
    'd': '┐', 'e': '┼', 'f': '┌',
    'g': '┤', 'h': '┬', 'i': '├',
    'j': '╝', 'k': '═', 'l': '╚',
    'm': '╗', 'n': '╬', 'o': '╔',
    'p': '╣', 'q': '╦', 'r': '╠',
    's': '╳', 't': '╱', 'u': '╲',
    'v': '△', 'w': '▽', 'x': '◁',
    'y': '▷', 'z': '◇',
  };

  const reversePigpenMap: Record<string, string> = {};
  Object.entries(pigpenMap).forEach(([k, v]) => {
    reversePigpenMap[v] = k;
  });

  const encode = (text: string): string => {
    return text
      .toLowerCase()
      .split('')
      .map((ch) => {
        if (pigpenMap[ch]) return pigpenMap[ch];
        if (ch === ' ') return ' ';
        return ch;
      })
      .join('');
  };

  const decode = (text: string): string => {
    return text
      .split('')
      .map((ch) => {
        if (reversePigpenMap[ch]) return reversePigpenMap[ch];
        if (ch === ' ') return ' ';
        return ch;
      })
      .join('');
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
            />
            Encode
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
            />
            Decode
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Enter text to encode' : 'Enter Pigpen symbols to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text...' : 'Enter Pigpen symbols...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button onClick={handleConvert} className="btn-primary mt-2">
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
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
