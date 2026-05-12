'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToDoubleStruckItalic - Convert text to double-struck italic Unicode characters.
 */
export default function TextToDoubleStruckItalic({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (text: string) => {
    // Double-struck italic: U+2145-U+2149 for D,d,e,i,j only exist
    // Use mathematical italic as base with double-struck where available
    // Double-struck capitals: U+1D538-U+1D551 (A-Z), lowercase: U+1D552-U+1D56B (a-z)
    // For italic double-struck effect, we use double-struck characters
    const dsUpper = 0x1D538;
    const dsLower = 0x1D552;

    const result = Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Special cases for double-struck that have dedicated codepoints
        if (char === 'C') return '\u2102';
        if (char === 'H') return '\u210D';
        if (char === 'N') return '\u2115';
        if (char === 'P') return '\u2119';
        if (char === 'Q') return '\u211A';
        if (char === 'R') return '\u211D';
        if (char === 'Z') return '\u2124';
        return String.fromCodePoint(dsUpper + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(dsLower + (code - 97));
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
          placeholder="Type text here to convert to double-struck..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Double-Struck Italic Output</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-all text-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
