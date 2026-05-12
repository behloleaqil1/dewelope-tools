'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VectorMagnitudeCalculator - Calculates the magnitude/length of 2D and 3D vectors.
 * Uses the Euclidean norm formula with step-by-step display.
 */
export default function VectorMagnitudeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dimension, setDimension] = useState<2 | 3>(2);
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [z, setZ] = useState('');
  const [result, setResult] = useState<{ magnitude: number; formula: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const xVal = parseFloat(x);
    const yVal = parseFloat(y);
    const zVal = parseFloat(z);

    if (isNaN(xVal) || isNaN(yVal)) {
      setError('Please enter valid numbers for X and Y components.');
      return;
    }

    if (dimension === 3 && isNaN(zVal)) {
      setError('Please enter a valid number for the Z component.');
      return;
    }

    let magnitude: number;
    let formula: string;

    if (dimension === 2) {
      magnitude = Math.sqrt(xVal * xVal + yVal * yVal);
      formula = `|v| = √(x² + y²) = √(${xVal}² + ${yVal}²) = √(${xVal * xVal} + ${yVal * yVal}) = √${xVal * xVal + yVal * yVal} = ${magnitude.toFixed(6)}`;
    } else {
      magnitude = Math.sqrt(xVal * xVal + yVal * yVal + zVal * zVal);
      formula = `|v| = √(x² + y² + z²) = √(${xVal}² + ${yVal}² + ${zVal}²) = √(${xVal * xVal} + ${yVal * yVal} + ${zVal * zVal}) = √${xVal * xVal + yVal * yVal + zVal * zVal} = ${magnitude.toFixed(6)}`;
    }

    setResult({ magnitude, formula });
  };

  const copyText = result
    ? `Vector: (${x}, ${y}${dimension === 3 ? `, ${z}` : ''})\nMagnitude: ${result.magnitude.toFixed(6)}\n${result.formula}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimension</label>
            <div className="flex gap-3">
              <button
                onClick={() => setDimension(2)}
                className={`px-4 py-2 rounded text-sm font-medium ${dimension === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="2D vector"
              >
                2D
              </button>
              <button
                onClick={() => setDimension(3)}
                className={`px-4 py-2 rounded text-sm font-medium ${dimension === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                aria-label="3D vector"
              >
                3D
              </button>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div>
              <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X</label>
              <input
                id={`${toolId}-x`}
                type="text"
                inputMode="decimal"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="0"
                aria-label={`X component for ${toolName}`}
                className="input-field w-24 text-center font-mono"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">Y</label>
              <input
                id={`${toolId}-y`}
                type="text"
                inputMode="decimal"
                value={y}
                onChange={(e) => setY(e.target.value)}
                placeholder="0"
                aria-label={`Y component for ${toolName}`}
                className="input-field w-24 text-center font-mono"
              />
            </div>
            {dimension === 3 && (
              <div>
                <label htmlFor={`${toolId}-z`} className="block text-sm font-medium text-gray-700 mb-1">Z</label>
                <input
                  id={`${toolId}-z`}
                  type="text"
                  inputMode="decimal"
                  value={z}
                  onChange={(e) => setZ(e.target.value)}
                  placeholder="0"
                  aria-label={`Z component for ${toolName}`}
                  className="input-field w-24 text-center font-mono"
                />
              </div>
            )}
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate vector magnitude" className="btn-primary">
        Calculate Magnitude
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.magnitude.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">Magnitude (Length)</div>
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
