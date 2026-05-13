'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningDoubleGrave - Add combining double grave accent (U+030F) to text characters.
 * Creates characters like ȁ, ȅ, ȉ, ȍ, ȕ.
 */
export default function TextToCombiningDoubleGrave({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'letters' | 'all'>('letters');
  const [output, setOutput] = useState('');

  const transform = () => {
    if (!input) {
      setOutput('');
      return;
    }

    const combiningDoubleGrave = '\u030F';
    const result = input
      .split('')
      .map((char) => {
        if (mode === 'letters') {
          if (/[a-zA-Z]/.test(char)) {
            return char + combiningDoubleGrave;
          }
          return char;
        }
        if (char === ' ' || char === '\n' || char === '\t') return char;
        return char + combiningDoubleGrave;
      })
      .join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
            Enter text to transform
          </label>
          <textarea
            id={`${toolId}-input`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            aria-label={`Text input for ${toolName}`}
            className="input-field h-32 resize-y font-mono"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'letters'} onChange={() => setMode('letters')} />
              Letters only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'all'} onChange={() => setMode('all')} />
              All characters
            </label>
          </div>
          <button onClick={transform} className="btn-primary">Transform Text</button>
        </div>
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
