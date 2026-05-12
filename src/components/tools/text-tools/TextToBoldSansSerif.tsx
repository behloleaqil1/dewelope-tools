'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBoldSansSerif - Convert regular text to bold sans-serif Unicode characters.
 * Maps A-Z to 𝗔-𝗭 (U+1D5D4-U+1D5ED) and a-z to 𝗮-𝘇 (U+1D5EE-U+1D607).
 * Digits 0-9 map to 𝟬-𝟵 (U+1D7EC-U+1D7F5).
 */
export default function TextToBoldSansSerif({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      // Uppercase A-Z -> Mathematical Sans-Serif Bold Capital
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1D5D4 + (code - 65));
      }
      // Lowercase a-z -> Mathematical Sans-Serif Bold Small
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1D5EE + (code - 97));
      }
      // Digits 0-9 -> Mathematical Sans-Serif Bold Digit
      if (code >= 48 && code <= 57) {
        return String.fromCodePoint(0x1D7EC + (code - 48));
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
          placeholder="Type text to convert to bold sans-serif Unicode..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bold Sans-Serif Result</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-all p-4 bg-gray-50 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
