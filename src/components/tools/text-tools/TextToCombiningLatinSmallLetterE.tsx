'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningLatinSmallLetterE - Add combining Latin small letter e (U+0364)
 * after each character in the input text.
 */
export default function TextToCombiningLatinSmallLetterE({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const addCombining = () => {
    if (!input) {
      setOutput('');
      return;
    }
    const result = Array.from(input).map(char => char + '\u0364').join('');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to add combining Latin small letter e
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to decorate with combining Latin small letter e (U+0364)..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
        <button onClick={addCombining} className="btn-primary w-full mt-2">Add Combining Character</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
