'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningAsteriskBelow - Add combining asterisk below (U+0359) to each character.
 */
export default function TextToCombiningAsteriskBelow({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (text: string) => {
    setInput(text);
    if (!text) {
      setOutput('');
      return;
    }
    const result = text.split('').map((char) => {
      if (char === ' ' || char === '\n' || char === '\t') return char;
      return char + '\u0359';
    }).join('');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to add combining asterisk below
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
            <label className="block text-sm font-medium text-gray-700">Result with Combining Asterisk Below (U+0359)</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
