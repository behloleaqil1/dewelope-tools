'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumber: number;
}

/**
 * TextDiffChecker - Compares two texts line by line and highlights differences.
 * Shows added lines in green, removed lines in red, and a summary of changes.
 */
export default function TextDiffChecker({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [summary, setSummary] = useState<{ added: number; removed: number; unchanged: number } | null>(null);

  function handleCompare() {
    const originalLines = original.split(/\r?\n/);
    const modifiedLines = modified.split(/\r?\n/);

    const result: DiffLine[] = [];
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    let lineNum = 0;

    // LCS-based approach for better diff
    const lcs = computeLCS(originalLines, modifiedLines);

    let origIdx = 0;
    let modIdx = 0;

    for (const match of lcs) {
      // Lines removed from original before this match
      while (origIdx < match.origIndex) {
        lineNum++;
        result.push({ type: 'removed', text: originalLines[origIdx], lineNumber: lineNum });
        removed++;
        origIdx++;
      }
      // Lines added in modified before this match
      while (modIdx < match.modIndex) {
        lineNum++;
        result.push({ type: 'added', text: modifiedLines[modIdx], lineNumber: lineNum });
        added++;
        modIdx++;
      }
      // Matching line
      lineNum++;
      result.push({ type: 'unchanged', text: originalLines[origIdx], lineNumber: lineNum });
      unchanged++;
      origIdx++;
      modIdx++;
    }

    // Remaining lines after last match
    while (origIdx < originalLines.length) {
      lineNum++;
      result.push({ type: 'removed', text: originalLines[origIdx], lineNumber: lineNum });
      removed++;
      origIdx++;
    }
    while (modIdx < modifiedLines.length) {
      lineNum++;
      result.push({ type: 'added', text: modifiedLines[modIdx], lineNumber: lineNum });
      added++;
      modIdx++;
    }

    setDiff(result);
    setSummary({ added, removed, unchanged });
  }

  function computeLCS(a: string[], b: string[]): { origIndex: number; modIndex: number }[] {
    const m = a.length;
    const n = b.length;

    // Build DP table
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find LCS
    const result: { origIndex: number; modIndex: number }[] = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        result.unshift({ origIndex: i - 1, modIndex: j - 1 });
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return result;
  }

  const copyText = diff.map((line) => {
    const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
    return prefix + line.text;
  }).join('\n');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-original`} className="block text-sm font-medium text-gray-700 mb-1">
            Original Text
          </label>
          <textarea
            id={`${toolId}-original`}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            aria-label="Original text for diff comparison"
            className="input-field h-48 resize-y font-mono text-sm"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-modified`} className="block text-sm font-medium text-gray-700 mb-1">
            Modified Text
          </label>
          <textarea
            id={`${toolId}-modified`}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            aria-label="Modified text for diff comparison"
            className="input-field h-48 resize-y font-mono text-sm"
          />
        </InputArea>
      </div>

      <button
        onClick={handleCompare}
        aria-label="Compare texts"
        className="btn-primary"
      >
        Compare
      </button>

      <OutputArea hasContent={diff.length > 0}>
        {diff.length > 0 && summary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-medium">+{summary.added} added</span>
                <span className="text-red-600 font-medium">-{summary.removed} removed</span>
                <span className="text-gray-500">{summary.unchanged} unchanged</span>
              </div>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="font-mono text-sm border border-gray-200 rounded-lg overflow-hidden">
              {diff.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-0.5 border-b border-gray-100 last:border-b-0 ${
                    line.type === 'added'
                      ? 'bg-green-50 text-green-800'
                      : line.type === 'removed'
                      ? 'bg-red-50 text-red-800'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <span className="inline-block w-6 text-gray-400 text-xs select-none">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  {line.text || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
