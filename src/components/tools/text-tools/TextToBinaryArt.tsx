'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBinaryArt - Convert text to binary representation displayed as art.
 * Each character is converted to its 8-bit binary form and displayed in a visual grid.
 */
export default function TextToBinaryArt({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [blockChar, setBlockChar] = useState('█');
  const [spaceChar, setSpaceChar] = useState(' ');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines: string[] = [];

    for (const char of input) {
      const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
      const artLine = binary
        .split('')
        .map((bit) => (bit === '1' ? blockChar : spaceChar))
        .join('');
      lines.push(`${artLine}  ${char} (${binary})`);
    }

    // Also create a visual block representation
    const artBlock = input
      .split('')
      .map((char) => {
        const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
        return binary.split('').map((bit) => (bit === '1' ? blockChar : spaceChar)).join('');
      })
      .join('\n');

    const result = `=== Binary Art ===\n${artBlock}\n\n=== Character Breakdown ===\n${lines.join('\n')}`;
    setOutput(result);
  };

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
          placeholder="Enter text to convert to binary art..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-block`} className="block text-xs font-medium text-gray-600 mb-1">
              1-bit character
            </label>
            <input
              id={`${toolId}-block`}
              type="text"
              value={blockChar}
              onChange={(e) => setBlockChar(e.target.value || '█')}
              maxLength={2}
              aria-label="Character for 1 bits"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-space`} className="block text-xs font-medium text-gray-600 mb-1">
              0-bit character
            </label>
            <input
              id={`${toolId}-space`}
              type="text"
              value={spaceChar}
              onChange={(e) => setSpaceChar(e.target.value || ' ')}
              maxLength={2}
              aria-label="Character for 0 bits"
              className="input-field text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Convert to binary art" className="btn-primary">
        Generate Binary Art
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Binary Art Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
