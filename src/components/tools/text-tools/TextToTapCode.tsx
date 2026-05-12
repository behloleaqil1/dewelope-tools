'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTapCode - Convert text to tap code (Polybius square prison cipher).
 * Uses a 5x5 grid where K is replaced by C. Each letter is encoded as
 * (row taps) (pause) (column taps).
 */

// Polybius square (5x5, K=C)
const GRID = [
  ['A', 'B', 'C', 'D', 'E'],
  ['F', 'G', 'H', 'I', 'J'],
  ['K', 'L', 'M', 'N', 'O'],
  ['P', 'Q', 'R', 'S', 'T'],
  ['U', 'V', 'W', 'X', 'Y'],
];

// Note: K is encoded as C (row 1, col 3)
// Z is sometimes added as row 5 col 5 or omitted; we'll map Z to position after Y
function getPosition(char: string): { row: number; col: number } | null {
  const c = char.toUpperCase();
  if (c === 'K') return { row: 1, col: 3 }; // K -> C position
  for (let r = 0; r < 5; r++) {
    for (let col = 0; col < 5; col++) {
      if (GRID[r][col] === c) return { row: r + 1, col: col + 1 };
    }
  }
  return null;
}

export default function TextToTapCode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const chars = input.toUpperCase().replace(/[^A-Z]/g, '').split('');
      const encoded = chars.map(char => {
        const pos = getPosition(char);
        if (!pos) return '?';
        const rowTaps = '.'.repeat(pos.row);
        const colTaps = '.'.repeat(pos.col);
        return `${rowTaps} ${colTaps}`;
      });
      setOutput(encoded.join('   '));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to encode
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to tap code..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Only letters A-Z are encoded. K is replaced by C. Non-letter characters are ignored.</p>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tap Code Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <p className="text-xs text-gray-500">Format: (row taps) (space) (column taps) — letters separated by triple space</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <button onClick={() => setShowGrid(!showGrid)} className="btn-primary text-sm">
        {showGrid ? 'Hide' : 'Show'} Polybius Grid
      </button>

      {showGrid && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Polybius Square (5×5, K=C)</h3>
          <div className="overflow-x-auto">
            <table className="text-xs font-mono border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-gray-300 bg-gray-100"></th>
                  {[1, 2, 3, 4, 5].map(c => (
                    <th key={c} className="p-2 border border-gray-300 bg-gray-100">Col {c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRID.map((row, r) => (
                  <tr key={r}>
                    <td className="p-2 border border-gray-300 bg-gray-100 font-bold">Row {r + 1}</td>
                    {row.map((cell, c) => (
                      <td key={c} className="p-2 border border-gray-300 text-center font-bold text-blue-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
