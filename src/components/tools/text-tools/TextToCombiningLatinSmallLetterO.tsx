'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningLatinSmallLetterO - Add combining Latin small letter o (U+0366)
 * after each character in the input text.
 */
export default function TextToCombiningLatinSmallLetterO({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput('');
      return;
    }
    const combining = '\u0366';
    const result = Array.from(text).map(char => {
      if (char === ' ' || char === '\n' || char === '\t') return char;
      return char + combining;
    }).join('');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to add combining Latin small letter o
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => convert(e.target.value)}
          placeholder="Type or paste text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result (with U+0366)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
