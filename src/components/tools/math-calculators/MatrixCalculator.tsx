'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatrixCalculator - Add, subtract, and multiply 2x2 and 3x3 matrices.
 */
export default function MatrixCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState<2 | 3>(2);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [matrixA, setMatrixA] = useState<number[][]>(createEmpty(2));
  const [matrixB, setMatrixB] = useState<number[][]>(createEmpty(2));
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState<string | undefined>();

  function createEmpty(n: number): number[][] {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  function handleSizeChange(newSize: 2 | 3) {
    setSize(newSize);
    setMatrixA(createEmpty(newSize));
    setMatrixB(createEmpty(newSize));
    setResult(null);
  }

  function updateCell(matrix: 'A' | 'B', row: number, col: number, value: string) {
    const num = value === '' || value === '-' ? 0 : parseFloat(value);
    if (matrix === 'A') {
      const copy = matrixA.map((r) => [...r]);
      copy[row][col] = isNaN(num) ? 0 : num;
      setMatrixA(copy);
    } else {
      const copy = matrixB.map((r) => [...r]);
      copy[row][col] = isNaN(num) ? 0 : num;
      setMatrixB(copy);
    }
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    if (operation === 'add') {
      const res = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
      setResult(res);
    } else if (operation === 'subtract') {
      const res = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
      setResult(res);
    } else {
      // Multiply
      const res = createEmpty(size);
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          let sum = 0;
          for (let k = 0; k < size; k++) {
            sum += matrixA[i][k] * matrixB[k][j];
          }
          res[i][j] = sum;
        }
      }
      setResult(res);
    }
  }

  function renderMatrixInput(label: string, matrix: number[][], matrixId: 'A' | 'B') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {matrix.map((row, i) =>
            row.map((val, j) => (
              <input
                key={`${matrixId}-${i}-${j}`}
                type="number"
                value={val || ''}
                onChange={(e) => updateCell(matrixId, i, j, e.target.value)}
                aria-label={`Matrix ${matrixId} row ${i + 1} column ${j + 1}`}
                className="w-16 h-10 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))
          )}
        </div>
      </div>
    );
  }

  const copyText = result
    ? result.map((row) => row.map((v) => v.toString()).join('\t')).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleSizeChange(2)}
          aria-label="2x2 matrix"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${size === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          2×2
        </button>
        <button
          onClick={() => handleSizeChange(3)}
          aria-label="3x3 matrix"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${size === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          3×3
        </button>
        <div className="border-l border-gray-300 mx-2" />
        <button
          onClick={() => setOperation('add')}
          aria-label="Add matrices"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${operation === 'add' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          A + B
        </button>
        <button
          onClick={() => setOperation('subtract')}
          aria-label="Subtract matrices"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${operation === 'subtract' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          A − B
        </button>
        <button
          onClick={() => setOperation('multiply')}
          aria-label="Multiply matrices"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${operation === 'multiply' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          A × B
        </button>
      </div>

      <InputArea error={error}>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Enter matrix values for {toolName}</label>
        </div>
        <div className="flex flex-wrap gap-6">
          {renderMatrixInput('Matrix A', matrixA, 'A')}
          {renderMatrixInput('Matrix B', matrixB, 'B')}
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate matrix result" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block">
              <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {result.map((row, i) =>
                  row.map((val, j) => (
                    <div
                      key={`r-${i}-${j}`}
                      className="w-16 h-10 flex items-center justify-center text-sm font-mono font-bold text-blue-600 bg-white border border-gray-200 rounded"
                    >
                      {Number.isInteger(val) ? val : val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
