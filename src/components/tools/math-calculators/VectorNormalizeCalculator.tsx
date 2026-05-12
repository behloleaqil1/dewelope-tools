'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VectorNormalizeCalculator - Normalize a vector to unit length.
 * Formula: û = v / |v| where |v| = sqrt(x² + y² + z²)
 */
export default function VectorNormalizeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [z, setZ] = useState('');
  const [dimensions, setDimensions] = useState<'2d' | '3d'>('3d');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult('');

    const xv = parseFloat(x);
    const yv = parseFloat(y);
    const zv = dimensions === '3d' ? parseFloat(z) : 0;

    if (!x.trim() || isNaN(xv) || !y.trim() || isNaN(yv)) {
      setError('Please enter valid numbers for x and y components.');
      return;
    }

    if (dimensions === '3d' && (!z.trim() || isNaN(zv))) {
      setError('Please enter a valid number for the z component.');
      return;
    }

    const magnitude = Math.sqrt(xv * xv + yv * yv + zv * zv);

    if (magnitude === 0) {
      setError('Cannot normalize a zero vector (magnitude = 0).');
      return;
    }

    const nx = xv / magnitude;
    const ny = yv / magnitude;
    const nz = zv / magnitude;

    const fmt = (n: number) => n.toFixed(6);

    let output = '';
    if (dimensions === '2d') {
      output = [
        `Original Vector: (${xv}, ${yv})`,
        `Magnitude: |v| = √(${xv}² + ${yv}²) = √${(xv * xv + yv * yv).toFixed(4)} = ${fmt(magnitude)}`,
        ``,
        `Normalized Vector (Unit Vector):`,
        `û = (${fmt(nx)}, ${fmt(ny)})`,
        ``,
        `Verification: |û| = √(${fmt(nx)}² + ${fmt(ny)}²) = ${fmt(Math.sqrt(nx * nx + ny * ny))}`,
      ].join('\n');
    } else {
      output = [
        `Original Vector: (${xv}, ${yv}, ${zv})`,
        `Magnitude: |v| = √(${xv}² + ${yv}² + ${zv}²) = √${(xv * xv + yv * yv + zv * zv).toFixed(4)} = ${fmt(magnitude)}`,
        ``,
        `Normalized Vector (Unit Vector):`,
        `û = (${fmt(nx)}, ${fmt(ny)}, ${fmt(nz)})`,
        ``,
        `Verification: |û| = √(${fmt(nx)}² + ${fmt(ny)}² + ${fmt(nz)}²) = ${fmt(Math.sqrt(nx * nx + ny * ny + nz * nz))}`,
      ].join('\n');
    }

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
          <select
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value as '2d' | '3d')}
            aria-label="Vector dimensions"
            className="input-field w-32"
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
          </select>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vector Components
        </label>
        <div className="flex gap-3 items-center">
          <span className="text-lg font-mono">(</span>
          <input
            type="text"
            inputMode="decimal"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="x"
            aria-label={`X component for ${toolName}`}
            className="input-field w-24 text-center"
          />
          <span className="text-gray-400">,</span>
          <input
            type="text"
            inputMode="decimal"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="y"
            aria-label="Y component"
            className="input-field w-24 text-center"
          />
          {dimensions === '3d' && (
            <>
              <span className="text-gray-400">,</span>
              <input
                type="text"
                inputMode="decimal"
                value={z}
                onChange={(e) => setZ(e.target.value)}
                placeholder="z"
                aria-label="Z component"
                className="input-field w-24 text-center"
              />
            </>
          )}
          <span className="text-lg font-mono">)</span>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Normalize vector" className="btn-primary">
        Normalize Vector
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Normalized Vector</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
