'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { textToBinary, binaryToText } from '@/lib/text-tools';

/**
 * TextToBinary - Convert text to binary and binary to text.
 */
export default function TextToBinary({ toolId }: ToolEngineProps) {
  const [mode, setMode] = useState<'textToBinary' | 'binaryToText'>('textToBinary');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function handleConvert() {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'textToBinary') {
      setOutput(textToBinary(input));
    } else {
      setOutput(binaryToText(input));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('textToBinary'); setOutput(''); }}
          aria-label="Text to binary mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'textToBinary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Text → Binary
        </button>
        <button
          onClick={() => { setMode('binaryToText'); setOutput(''); }}
          aria-label="Binary to text mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'binaryToText' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Binary → Text
        </button>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'textToBinary' ? 'Text Input' : 'Binary Input'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'textToBinary' ? 'Type text to convert to binary...' : 'Enter binary (space-separated bytes, e.g., 01001000 01101001)...'}
          aria-label={mode === 'textToBinary' ? 'Text input for binary conversion' : 'Binary input for text conversion'}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleConvert}
        aria-label="Convert"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-3 bg-gray-50 rounded-lg break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
