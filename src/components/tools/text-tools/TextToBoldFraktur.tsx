'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBoldFraktur - Convert text to bold Fraktur Unicode characters.
 */
export default function TextToBoldFraktur({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (text: string) => {
    // Bold Fraktur: U+1D56C - U+1D585 (A-Z), U+1D586 - U+1D59F (a-z)
    const boldFrakturUpper = 0x1D56C;
    const boldFrakturLower = 0x1D586;

    const result = Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(boldFrakturUpper + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(boldFrakturLower + (code - 97));
      }
      return char;
    }).join('');

    setOutput(result);
  };

  const handleChange = (value: string) => {
    setInput(value);
    convert(value);
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
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type text here to convert to bold Fraktur..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bold Fraktur Output</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-all text-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
