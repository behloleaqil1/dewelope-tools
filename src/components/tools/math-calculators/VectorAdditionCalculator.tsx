'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VectorAdditionCalculator - Add or subtract 2D and 3D vectors.
 * Shows the resulting vector with step-by-step component calculations.
 */
export default function VectorAdditionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [ax, setAx] = useState('');
  const [ay, setAy] = useState('');
  const [az, setAz] = useState('');
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bz, setBz] = useState('');
  const [result, setResult] = useState<{ x: number; y: number; z?: number; magnitude: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const aX = parseFloat(ax);
    const aY = parseFloat(ay);
    const bX = parseFloat(bx);
    const bY = parseFloat(by);

    if (isNaN(aX) || isNaN(aY) || isNaN(bX) || isNaN(bY)) {
      setError('Please enter valid numbers for all vector components');
      return;
    }

    if (mode === '3d') {
      const aZ = parseFloat(az);
      const bZ = parseFloat(bz);
      if (isNaN(aZ) || isNaN(bZ)) {
        setError('Please enter valid Z components for 3D vectors');
        return;
      }

      const rX = operation === 'add' ? aX + bX : aX - bX;
      const rY = operation === 'add' ? aY + bY : aY - bY;
      const rZ = operation === 'add' ? aZ + bZ : aZ - bZ;
      const mag = Math.sqrt(rX * rX + rY * rY + rZ * rZ);
      setResult({ x: rX, y: rY, z: rZ, magnitude: mag });
    } else {
      const rX = operation === 'add' ? aX + bX : aX - bX;
      const rY = operation === 'add' ? aY + bY : aY - bY;
      const mag = Math.sqrt(rX * rX + rY * rY);
      setResult({ x: rX, y: rY, magnitude: mag });
    }
  }

  const opSymbol = operation === 'add' ? '+' : '−';
  const copyText = result
    ? mode === '3d'
      ? `Result: (${result.x}, ${result.y}, ${result.z})\nMagnitude: ${result.magnitude.toFixed(4)}`
      : `Result: (${result.x}, ${result.y})\nMagnitude: ${result.magnitude.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dimension</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as '2d' | '3d')} aria-label="Vector dimension" className="input-field text-sm">
              <option value="2d">2D</option>
              <option value="3d">3D</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Operation</label>
            <select value={operation} onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')} aria-label="Operation" className="input-field text-sm">
              <option value="add">Add (A + B)</option>
              <option value="subtract">Subtract (A − B)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vector A</label>
            <div className="flex gap-2">
              <input type="text" inputMode="decimal" value={ax} onChange={(e) => setAx(e.target.value)} placeholder="X" aria-label={`Vector A X for ${toolName}`} className="input-field w-24" />
              <input type="text" inputMode="decimal" value={ay} onChange={(e) => setAy(e.target.value)} placeholder="Y" aria-label="Vector A Y" className="input-field w-24" />
              {mode === '3d' && <input type="text" inputMode="decimal" value={az} onChange={(e) => setAz(e.target.value)} placeholder="Z" aria-label="Vector A Z" className="input-field w-24" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vector B</label>
            <div className="flex gap-2">
              <input type="text" inputMode="decimal" value={bx} onChange={(e) => setBx(e.target.value)} placeholder="X" aria-label="Vector B X" className="input-field w-24" />
              <input type="text" inputMode="decimal" value={by} onChange={(e) => setBy(e.target.value)} placeholder="Y" aria-label="Vector B Y" className="input-field w-24" />
              {mode === '3d' && <input type="text" inputMode="decimal" value={bz} onChange={(e) => setBz(e.target.value)} placeholder="Z" aria-label="Vector B Z" className="input-field w-24" />}
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate vector result" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-blue-600 font-mono">
                ({result.x}, {result.y}{result.z !== undefined ? `, ${result.z}` : ''})
              </div>
              <div className="text-xs text-gray-500 mt-1">Resultant Vector (A {opSymbol} B)</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-green-600 font-mono">{result.magnitude.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-1">Magnitude</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              ({ax}, {ay}{mode === '3d' ? `, ${az}` : ''}) {opSymbol} ({bx}, {by}{mode === '3d' ? `, ${bz}` : ''}) = ({result.x}, {result.y}{result.z !== undefined ? `, ${result.z}` : ''})
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
