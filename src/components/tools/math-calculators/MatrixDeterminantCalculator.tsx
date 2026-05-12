'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatrixDeterminantCalculator - Calculates the determinant of 2x2 and 3x3 matrices.
 * Supports both matrix sizes with step-by-step formula display.
 */
export default function MatrixDeterminantCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [result, setResult] = useState<{ determinant: number; formula: string } | null>(null);
  const [error, setError] = useState('');

  const updateCell = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const nums: number[][] = [];
    for (let i = 0; i < size; i++) {
      nums.push([]);
      for (let j = 0; j < size; j++) {
        const val = parseFloat(matrix[i][j]);
        if (isNaN(val)) {
          setError(`Invalid number at row ${i + 1}, column ${j + 1}`);
          return;
        }
        nums[i].push(val);
      }
    }

    let determinant: number;
    let formula: string;

    if (size === 2) {
      const [a, b] = nums[0];
      const [c, d] = nums[1];
      determinant = a * d - b * c;
      formula = `det = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${determinant}`;
    } else {
      const [[a, b, c], [d, e, f], [g, h, i]] = nums;
      determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      formula = `det = ${a}[(${e})(${i}) - (${f})(${h})] - ${b}[(${d})(${i}) - (${f})(${g})] + ${c}[(${d})(${h}) - (${e})(${g})]\n    = ${a}[${e * i - f * h}] - ${b}[${d * i - f * g}] + ${c}[${d * h - e * g}]\n    = ${a * (e * i - f * h)} + ${-(b * (d * i - f * g))} + ${c * (d * h - e * g)}\n    = ${determinant}`;
    }

    setResult({ determinant, formula });
  };

  const copyText = result ? `Determinant = ${result.determinant}\n\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrix Size</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSize(2)}
                className={`px-4 py-2 rounded text-sm font-medium ${size === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="2x2 matrix"
              >
                2×2
              </button>
              <button
                onClick={() => setSize(3)}
                className={`px-4 py-2 rounded text-sm font-medium ${size === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="3x3 matrix"
              >
                3×3
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matrix Values</label>
            <div className="inline-block">
              {Array.from({ length: size }).map((_, row) => (
                <div key={row} className="flex gap-2 mb-2">
                  {Array.from({ length: size }).map((_, col) => (
                    <input
                      key={col}
                      type="text"
                      inputMode="decimal"
                      value={matrix[row][col]}
                      onChange={(e) => updateCell(row, col, e.target.value)}
                      placeholder="0"
                      aria-label={`Matrix cell row ${row + 1} column ${col + 1} for ${toolName}`}
                      className="input-field w-20 text-center font-mono"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate determinant" className="btn-primary">
        Calculate Determinant
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.determinant}</div>
              <div className="text-xs text-gray-500 mt-1">Determinant</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
