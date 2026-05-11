'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextSorter - Sorts lines of text alphabetically, numerically, by length, or in reverse.
 */
export default function TextSorter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortType, setSortType] = useState<'alpha' | 'alphaReverse' | 'numeric' | 'length' | 'random'>('alpha');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeBlanks, setRemoveBlanks] = useState(true);

  function handleSort() {
    if (!input.trim()) return;

    let lines = input.split('\n');
    if (removeBlanks) lines = lines.filter((l) => l.trim().length > 0);

    switch (sortType) {
      case 'alpha':
        lines.sort((a, b) => caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase()));
        break;
      case 'alphaReverse':
        lines.sort((a, b) => caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase()));
        break;
      case 'numeric':
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return numA - numB;
        });
        break;
      case 'length':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'random':
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter lines to sort for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter one item per line..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex flex-wrap gap-4 mt-3">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as typeof sortType)}
            aria-label="Sort type"
            className="input-field text-sm w-auto"
          >
            <option value="alpha">A → Z (Alphabetical)</option>
            <option value="alphaReverse">Z → A (Reverse)</option>
            <option value="numeric">Numeric (0 → 9)</option>
            <option value="length">By Length (short → long)</option>
            <option value="random">Random Shuffle</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded border-gray-300" />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={removeBlanks} onChange={(e) => setRemoveBlanks(e.target.checked)} className="rounded border-gray-300" />
            Remove blank lines
          </label>
        </div>
      </InputArea>

      <button onClick={handleSort} aria-label="Sort lines" className="btn-primary">
        Sort Lines
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Sorted Output ({output.split('\n').length} lines)</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
