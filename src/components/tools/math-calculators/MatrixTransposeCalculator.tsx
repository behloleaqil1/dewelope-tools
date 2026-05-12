'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatrixTransposeCalculator - Transposes a matrix (swaps rows and columns).
 * Supports any size matrix entered as comma-separated rows.
 */
export default function MatrixTransposeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState<string | undefined>();

  function transpose() {
    setError(undefined);
    setResult(null);

    if (!input.trim()) {
      setError('Please enter a matrix');
      return;
    }

    const rows = input.trim().split('\n').filter((line) => line.trim());
    const matrix: number[][] = [];

    for (const row of rows) {
      const values = row.split(/[,\s]+/).filter(Boolean).map(Number);
      if (values.some(isNaN)) {
        setError('All values must be valid numbers');
        return;
      }
      matrix.push(values);
    }

    if (matrix.length === 0) {
      setError('Please enter at least one row');
      return;
    }

    const colCount = matrix[0].length;
    if (matrix.some((row) => row.length !== colCount)) {
      setError('All rows must have the same number of columns');
      return;
    }

    // Transpose
    const transposed: number[][] = [];
    for (let c = 0; c < colCount; c++) {
      const newRow: number[] = [];
      for (let r = 0; r < matrix.length; r++) {
        newRow.push(matrix[r][c]);
      }
      transposed.push(newRow);
    }

    setResult(transposed);
  }

  const formatMatrix = (m: number[][]) => m.map((row) => row.join('\t')).join('\n');
  const copyText = result ? formatMatrix(result) : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Matrix (one row per line, values separated by commas or spaces)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"1, 2, 3\n4, 5, 6\n7, 8, 9"}
          aria-label={`Matrix input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Example: Enter a 2×3 matrix and get a 3×2 transposed result</p>
      </InputArea>

      <button onClick={transpose} aria-label="Transpose matrix" className="btn-primary">
        Transpose Matrix
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Transposed Matrix ({result.length}×{result[0]?.length || 0})
              </label>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <table className="mx-auto">
                <tbody>
                  {result.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="px-3 py-1 text-center font-mono text-sm text-gray-800 border border-gray-300">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
