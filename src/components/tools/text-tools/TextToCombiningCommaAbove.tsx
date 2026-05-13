'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToCombiningCommaAbove({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [lettersOnly, setLettersOnly] = useState(true);
  const [output, setOutput] = useState('');

  const transform = () => {
    if (!input) {
      setOutput('');
      return;
    }

    const combiningCommaAbove = '\u0313';
    const result = input
      .split('')
      .map((char) => {
        if (lettersOnly && !/[a-zA-Z]/.test(char)) return char;
        return char + combiningCommaAbove;
      })
      .join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to add combining comma above..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />

        <label className="flex items-center gap-2 mt-2 mb-3">
          <input type="checkbox" checked={lettersOnly} onChange={(e) => setLettersOnly(e.target.checked)} />
          <span className="text-sm text-gray-700">Apply to letters only</span>
        </label>

        <button onClick={transform} className="btn-primary">Transform Text</button>
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
