'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigpenVariant - Encode text using the Pigpen cipher with Knights Templar variant.
 * Maps letters to symbolic grid descriptions based on the Templar variant of the Pigpen cipher.
 */
export default function TextToPigpenVariant({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Knights Templar variant: uses crosses and dots instead of standard grid
  const templarMap: Record<string, string> = {
    A: '┘', B: '└', C: '┐', D: '┌',
    E: '╵', F: '╶', G: '╷', H: '╴',
    I: '┘•', J: '└•', K: '┐•', L: '┌•',
    M: '╵•', N: '╶•', O: '╷•', P: '╴•',
    Q: '△', R: '▷', S: '▽', T: '◁',
    U: '△•', V: '▷•', W: '▽•', X: '◁•',
    Y: '╳', Z: '╳•',
  };

  const encode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input
      .toUpperCase()
      .split('')
      .map((char) => {
        if (templarMap[char]) return templarMap[char];
        if (char === ' ') return '   ';
        return char;
      })
      .join(' ');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to encode
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode with Pigpen Knights Templar cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button
          onClick={encode}
          className="btn-primary mt-2"
        >
          Encode with Templar Pigpen
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Encoded Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">Knights Templar Variant Key:</p>
              <p>A-H: Grid corners/edges | I-P: Grid with dots | Q-T: Triangles | U-X: Triangles with dots | Y-Z: Cross variants</p>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
