'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAsciiArt - Convert text to simple ASCII art using block characters.
 */

const BLOCK_FONT: Record<string, string[]> = {
  A: ['█▀█', '█▀█', '▀ ▀'],
  B: ['█▀▄', '█▀▄', '▀▀ '],
  C: ['█▀▀', '█  ', '▀▀▀'],
  D: ['█▀▄', '█ █', '▀▀ '],
  E: ['█▀▀', '█▀▀', '▀▀▀'],
  F: ['█▀▀', '█▀▀', '▀  '],
  G: ['█▀▀', '█ █', '▀▀▀'],
  H: ['█ █', '█▀█', '▀ ▀'],
  I: ['▀█▀', ' █ ', '▀█▀'],
  J: ['  █', '  █', '▀▀ '],
  K: ['█ █', '█▀▄', '▀ ▀'],
  L: ['█  ', '█  ', '▀▀▀'],
  M: ['█▄█', '█ █', '▀ ▀'],
  N: ['█▀█', '█ █', '▀ ▀'],
  O: ['█▀█', '█ █', '▀▀▀'],
  P: ['█▀█', '█▀▀', '▀  '],
  Q: ['█▀█', '█ █', '▀▀▄'],
  R: ['█▀█', '█▀▄', '▀ ▀'],
  S: ['█▀▀', '▀▀█', '▀▀▀'],
  T: ['▀█▀', ' █ ', ' ▀ '],
  U: ['█ █', '█ █', '▀▀▀'],
  V: ['█ █', '█ █', ' ▀ '],
  W: ['█ █', '█ █', '█▀█'],
  X: ['█ █', ' █ ', '█ █'],
  Y: ['█ █', ' █ ', ' ▀ '],
  Z: ['▀▀█', ' █ ', '█▀▀'],
  '0': ['█▀█', '█ █', '▀▀▀'],
  '1': [' █ ', ' █ ', ' ▀ '],
  '2': ['▀▀█', '█▀▀', '▀▀▀'],
  '3': ['▀▀█', ' ▀█', '▀▀▀'],
  '4': ['█ █', '▀▀█', '  ▀'],
  '5': ['█▀▀', '▀▀█', '▀▀▀'],
  '6': ['█▀▀', '█▀█', '▀▀▀'],
  '7': ['▀▀█', '  █', '  ▀'],
  '8': ['█▀█', '█▀█', '▀▀▀'],
  '9': ['█▀█', '▀▀█', '▀▀▀'],
  ' ': ['   ', '   ', '   '],
  '!': [' █ ', ' █ ', ' ▀ '],
  '?': ['▀▀█', ' ▀ ', ' ▀ '],
  '.': ['   ', '   ', ' ▀ '],
};

export default function TextToAsciiArt({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const text = input.toUpperCase().slice(0, 40);
    const lines = ['', '', ''];

    for (const char of text) {
      const glyph = BLOCK_FONT[char] || BLOCK_FONT['?'];
      lines[0] += glyph[0] + ' ';
      lines[1] += glyph[1] + ' ';
      lines[2] += glyph[2] + ' ';
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (max 40 characters)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to convert to ASCII art..."
          aria-label={`Text input for ${toolName}`}
          className="input-field"
          maxLength={40}
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert to ASCII art" className="btn-primary">
        Convert to ASCII Art
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ASCII Art Output</label>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
