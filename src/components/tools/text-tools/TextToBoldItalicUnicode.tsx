'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBoldItalicUnicode - Convert text to bold italic Unicode characters.
 */
export default function TextToBoldItalicUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');

  const convertToBoldItalic = (text: string): string => {
    const boldItalicUpper = 0x1D468; // 𝑨
    const boldItalicLower = 0x1D482; // 𝒂

    return Array.from(text)
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCodePoint(boldItalicUpper + (code - 65));
        }
        if (code >= 97 && code <= 122) {
          return String.fromCodePoint(boldItalicLower + (code - 97));
        }
        return char;
      })
      .join('');
  };

  const output = convertToBoldItalic(input);

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
          placeholder="Type text to convert to bold italic Unicode..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bold Italic Unicode</label>
            <div className="text-lg p-4 bg-gray-50 rounded-lg break-all">{output}</div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
