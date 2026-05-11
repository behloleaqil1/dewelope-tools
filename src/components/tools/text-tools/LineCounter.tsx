'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface LineStats {
  totalLines: number;
  nonEmptyLines: number;
  emptyLines: number;
  longestLineLength: number;
}

/**
 * LineCounter - Counts total lines, non-empty lines, empty lines, and longest line length.
 * Provides real-time statistics as the user types.
 */
export default function LineCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<LineStats | null>(null);

  const analyze = () => {
    if (!text) {
      setStats(null);
      return;
    }

    const lines = text.split('\n');
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length;
    const emptyLines = totalLines - nonEmptyLines;
    const longestLineLength = Math.max(...lines.map((line) => line.length));

    setStats({
      totalLines,
      nonEmptyLines,
      emptyLines,
      longestLineLength,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const copyText = stats
    ? `Total Lines: ${stats.totalLines}\nNon-Empty Lines: ${stats.nonEmptyLines}\nEmpty Lines: ${stats.emptyLines}\nLongest Line: ${stats.longestLineLength} characters`
    : '';

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700">
            Enter Text
          </label>
          <textarea
            id={`${toolId}-input`}
            value={text}
            onChange={handleChange}
            placeholder="Paste or type your text here..."
            aria-label={`Text input for ${toolName}`}
            className="input-field h-48 resize-y font-mono"
          />
        </InputArea>

        <button onClick={analyze} className="btn-primary" aria-label="Count lines">
          Count Lines
        </button>
      </div>

      <OutputArea hasContent={stats !== null}>
        {stats && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Line Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Total Lines</div>
                <div className="text-lg font-semibold text-gray-800">{stats.totalLines}</div>
              </div>
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Non-Empty Lines</div>
                <div className="text-lg font-semibold text-gray-800">{stats.nonEmptyLines}</div>
              </div>
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Empty Lines</div>
                <div className="text-lg font-semibold text-gray-800">{stats.emptyLines}</div>
              </div>
              <div className="py-3 px-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Longest Line</div>
                <div className="text-lg font-semibold text-gray-800">{stats.longestLineLength} chars</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
