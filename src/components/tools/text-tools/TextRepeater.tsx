'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextRepeater - Repeats input text a specified number of times with a configurable separator.
 * Supports newline, space, comma, or custom separator options.
 */
export default function TextRepeater({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [count, setCount] = useState('3');
  const [separatorType, setSeparatorType] = useState<'newline' | 'space' | 'comma' | 'custom'>('newline');
  const [customSeparator, setCustomSeparator] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const generate = () => {
    if (!text.trim()) {
      setError('Please enter text to repeat');
      setOutput('');
      return;
    }

    const num = parseInt(count, 10);
    if (isNaN(num) || num < 1 || num > 1000) {
      setError('Repeat count must be between 1 and 1000');
      setOutput('');
      return;
    }

    setError(undefined);

    let separator: string;
    switch (separatorType) {
      case 'newline':
        separator = '\n';
        break;
      case 'space':
        separator = ' ';
        break;
      case 'comma':
        separator = ', ';
        break;
      case 'custom':
        separator = customSeparator;
        break;
    }

    const repeated = Array(num).fill(text).join(separator);
    setOutput(repeated);
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700">
            Text to Repeat
          </label>
          <textarea
            id={`${toolId}-text`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to repeat..."
            aria-label={`Text to repeat for ${toolName}`}
            className="input-field h-24 resize-y"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700">
            Number of Times (1-1000)
          </label>
          <input
            id={`${toolId}-count`}
            type="text"
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="3"
            aria-label={`Repeat count for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-separator`} className="block text-sm font-medium text-gray-700">
            Separator
          </label>
          <select
            id={`${toolId}-separator`}
            value={separatorType}
            onChange={(e) => setSeparatorType(e.target.value as 'newline' | 'space' | 'comma' | 'custom')}
            aria-label={`Separator type for ${toolName}`}
            className="input-field"
          >
            <option value="newline">New Line</option>
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="custom">Custom</option>
          </select>
        </InputArea>

        {separatorType === 'custom' && (
          <InputArea>
            <label htmlFor={`${toolId}-custom-sep`} className="block text-sm font-medium text-gray-700">
              Custom Separator
            </label>
            <input
              id={`${toolId}-custom-sep`}
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder=" | "
              aria-label={`Custom separator for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        )}

        <button onClick={generate} className="btn-primary" aria-label="Repeat text">
          Repeat Text
        </button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Repeated Text</h3>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
