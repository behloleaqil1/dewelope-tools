'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToNumberList - Extract all numbers from text into a list.
 */
export default function TextToNumberList({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(0);

  function handleExtract() {
    if (!input.trim()) {
      setOutput('');
      setCount(0);
      return;
    }

    const numbers = input.match(/-?\d+\.?\d*/g) || [];
    setCount(numbers.length);

    if (numbers.length === 0) {
      setOutput('No numbers found in the text.');
    } else {
      setOutput(numbers.join('\n'));
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text containing numbers
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text here to extract numbers... e.g. 'The price is $42.50 and there are 3 items'"
          aria-label={`Text input for ${toolName}`}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </InputArea>

      <button
        onClick={handleExtract}
        aria-label="Extract numbers"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Extract Numbers
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Extracted Numbers</label>
              {count > 0 && (
                <span className="text-xs text-gray-500">{count} number{count !== 1 ? 's' : ''} found</span>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg">{output}</pre>
            {count > 0 && <CopyToClipboard text={output} />}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
