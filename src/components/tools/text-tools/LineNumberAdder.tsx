'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LineNumberAdder - Add line numbers to text with configurable start, padding, and separator.
 */
export default function LineNumberAdder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [startNumber, setStartNumber] = useState('1');
  const [separator, setSeparator] = useState(': ');
  const [padding, setPadding] = useState<'auto' | 'none' | '2' | '3' | '4'>('auto');
  const [output, setOutput] = useState('');

  function addLineNumbers() {
    if (!input) {
      setOutput('');
      return;
    }

    const lines = input.split('\n');
    const start = parseInt(startNumber) || 1;
    const maxNum = start + lines.length - 1;

    let padWidth: number;
    if (padding === 'none') {
      padWidth = 0;
    } else if (padding === 'auto') {
      padWidth = maxNum.toString().length;
    } else {
      padWidth = parseInt(padding);
    }

    const numbered = lines.map((line, i) => {
      const num = (start + i).toString();
      const paddedNum = padWidth > 0 ? num.padStart(padWidth, ' ') : num;
      return `${paddedNum}${separator}${line}`;
    });

    setOutput(numbered.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to add line numbers
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-xs text-gray-500 mb-1">Start Number</label>
            <input
              id={`${toolId}-start`}
              type="text"
              inputMode="numeric"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              placeholder="1"
              aria-label="Start number"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-sep`} className="block text-xs text-gray-500 mb-1">Separator</label>
            <input
              id={`${toolId}-sep`}
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder=": "
              aria-label="Separator"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-pad`} className="block text-xs text-gray-500 mb-1">Padding</label>
            <select
              id={`${toolId}-pad`}
              value={padding}
              onChange={(e) => setPadding(e.target.value as 'auto' | 'none' | '2' | '3' | '4')}
              aria-label="Number padding"
              className="input-field text-sm"
            >
              <option value="auto">Auto</option>
              <option value="none">None</option>
              <option value="2">2 digits</option>
              <option value="3">3 digits</option>
              <option value="4">4 digits</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={addLineNumbers} aria-label="Add line numbers" className="btn-primary">
        Add Line Numbers
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
