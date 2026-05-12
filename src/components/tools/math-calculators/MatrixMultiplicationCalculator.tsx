'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatrixMultiplicationCalculator - Multiply two matrices together.
 */
export default function MatrixMultiplicationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [matrixA, setMatrixA] = useState('1, 2\n3, 4');
  const [matrixB, setMatrixB] = useState('5, 6\n7, 8');
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState('');

  const parseMatrix = (text: string): number[][] => {
    return text.trim().split('\n').map(row =>
      row.split(/[,\s]+/).filter(Boolean).map(Number)
    );
  };

  const multiply = () => {
    setError('');
    setResult(null);

    const a = parseMatrix(matrixA);
    const b = parseMatrix(matrixB);

    if (a.some(row => row.some(isNaN)) || b.some(row => row.some(isNaN))) {
      setError('All matrix values must be valid numbers');
      return;
    }

    const colsA = a[0]?.length || 0;
    const rowsB = b.length;

    if (a.some(row => row.length !== colsA)) {
      setError('Matrix A rows must have the same number of columns');
      return;
    }
    if (b.some(row => row.length !== (b[0]?.length || 0))) {
      setError('Matrix B rows must have the same number of columns');
      return;
    }

    if (colsA !== rowsB) {
      setError(`Cannot multiply: Matrix A columns (${colsA}) must equal Matrix B rows (${rowsB})`);
      return;
    }

    const colsB = b[0].length;
    const product: number[][] = [];

    for (let i = 0; i < a.length; i++) {
      product[i] = [];
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += a[i][k] * b[k][j];
        }
        product[i][j] = Math.round(sum * 1e10) / 1e10;
      }
    }

    setResult(product);
  };

  const resultText = result ? result.map(row => row.join(', ')).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">Matrix A (one row per line, values comma-separated)</label>
          <textarea id={`${toolId}-a`} value={matrixA} onChange={(e) => setMatrixA(e.target.value)} placeholder="1, 2&#10;3, 4" aria-label={`Matrix A for ${toolName}`} className="input-field h-32 resize-y font-mono" />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Matrix B (one row per line, values comma-separated)</label>
          <textarea id={`${toolId}-b`} value={matrixB} onChange={(e) => setMatrixB(e.target.value)} placeholder="5, 6&#10;7, 8" aria-label={`Matrix B for ${toolName}`} className="input-field h-32 resize-y font-mono" />
        </InputArea>
      </div>

      <button onClick={multiply} className="btn-primary" aria-label="Multiply matrices">Multiply Matrices</button>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Result ({result.length}×{result[0]?.length})</label>
            <div className="overflow-x-auto">
              <table className="border-collapse">
                <tbody>
                  {result.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td key={j} className="border border-gray-300 px-3 py-2 text-center font-mono text-sm">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{resultText}</pre>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
