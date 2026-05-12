'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToFullwidthNumbers({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const result = input.replace(/[0-9]/g, (ch) => {
      return String.fromCharCode(ch.charCodeAt(0) + 0xFEE0);
    });
    setOutput(result);
  };

  const reverse = () => {
    const result = input.replace(/[０-９]/g, (ch) => {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text with numbers</label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text like: Hello 12345 World 67890"
              className="input-field h-32 resize-y font-mono"
              aria-label={`Text input for ${toolName}`}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={convert} className="btn-primary">To Fullwidth (０１２３)</button>
            <button onClick={reverse} className="btn-secondary">To Normal (0123)</button>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
