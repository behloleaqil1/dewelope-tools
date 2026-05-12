'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMonospaceBold - Convert text to monospace Unicode characters.
 * Unicode does not have a separate bold monospace block, so this uses
 * Mathematical Monospace: A-Z (U+1D670-U+1D689), a-z (U+1D68A-U+1D6A3),
 * 0-9 (U+1D7F6-U+1D7FF).
 */
export default function TextToMonospaceBold({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput('');
      return;
    }

    const result = Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z -> Mathematical Monospace Capital
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1D670 + (code - 65));
      }
      // Lowercase a-z -> Mathematical Monospace Small
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1D68A + (code - 97));
      }
      // Digits 0-9 -> Mathematical Monospace Digit
      if (code >= 48 && code <= 57) {
        return String.fromCodePoint(0x1D7F6 + (code - 48));
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
          onChange={(e) => convert(e.target.value)}
          placeholder="Type text to convert to monospace Unicode..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Monospace Result</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-all p-4 bg-gray-50 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
            <p className="text-xs text-gray-500 mt-2">
              Note: Uses Mathematical Monospace Unicode block. A dedicated bold monospace block does not exist in Unicode.
            </p>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
