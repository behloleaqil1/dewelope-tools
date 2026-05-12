'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToNegativeSquared - Convert text to negative squared Unicode characters (🅰🅱🅲).
 * Maps A-Z to their negative squared Latin capital letter equivalents.
 */
export default function TextToNegativeSquared({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input.split('').map(char => {
      const upper = char.toUpperCase();
      const code = upper.charCodeAt(0);
      // Negative squared Latin capital letters: U+1F170 (🅰) to U+1F189 (but only A-Z mapped)
      // A=U+1F170, B=U+1F171, ..., Z=U+1F189
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1F170 + (code - 65));
      }
      return char;
    }).join('');

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
          placeholder="Enter text to convert to negative squared Unicode..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="btn-primary mt-3">Convert to Negative Squared</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-2xl break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
