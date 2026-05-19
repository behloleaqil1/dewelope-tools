'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextLineSorterAdvanced - Sort text lines with advanced options.
 */
export default function TextLineSorterAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'numeric' | 'length' | 'random'>('alpha');
  const [reverse, setReverse] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const sort = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter text.'); return; }

    let lines = input.split('\n');
    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    switch (sortBy) {
      case 'alpha':
        lines.sort((a, b) => {
          const aa = caseInsensitive ? a.toLowerCase() : a;
          const bb = caseInsensitive ? b.toLowerCase() : b;
          return aa.localeCompare(bb);
        });
        break;
      case 'numeric':
        lines.sort((a, b) => {
          const na = parseFloat(a.replace(/[^\d.-]/g, '')) || 0;
          const nb = parseFloat(b.replace(/[^\d.-]/g, '')) || 0;
          return na - nb;
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

    if (reverse && sortBy !== 'random') lines.reverse();
    setResult(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"banana\napple\ncherry\ndate"} rows={6} aria-label={`Input text for ${toolName}`} className="input-field" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-sort`} className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select id={`${toolId}-sort`} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} aria-label="Sort method" className="input-field">
              <option value="alpha">Alphabetical</option>
              <option value="numeric">Numerical</option>
              <option value="length">Line Length</option>
              <option value="random">Random Shuffle</option>
            </select>
          </div>
          <div className="space-y-2 pt-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} aria-label="Reverse order" className="rounded" />
              Reverse
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} aria-label="Case insensitive" className="rounded" />
              Case insensitive
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={removeDuplicates} onChange={(e) => setRemoveDuplicates(e.target.checked)} aria-label="Remove duplicates" className="rounded" />
              Remove duplicates
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={sort} className="btn-primary" aria-label="Sort lines">Sort</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
