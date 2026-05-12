'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VectorAngleCalculator - Calculate the angle between two vectors.
 */
export default function VectorAngleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [ax, setAx] = useState('');
  const [ay, setAy] = useState('');
  const [az, setAz] = useState('');
  const [bx, setBx] = useState('');
  const [by, setBy] = useState('');
  const [bz, setBz] = useState('');
  const [result, setResult] = useState<{ degrees: number; radians: number; dotProduct: number; magA: number; magB: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const a = [parseFloat(ax), parseFloat(ay), ...(mode === '3d' ? [parseFloat(az)] : [])];
    const b = [parseFloat(bx), parseFloat(by), ...(mode === '3d' ? [parseFloat(bz)] : [])];

    if (a.some(isNaN) || b.some(isNaN)) {
      setError('All vector components must be valid numbers');
      return;
    }

    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magA === 0 || magB === 0) {
      setError('Vectors must have non-zero magnitude');
      return;
    }

    let cosAngle = dot / (magA * magB);
    cosAngle = Math.max(-1, Math.min(1, cosAngle));
    const radians = Math.acos(cosAngle);
    const degrees = radians * (180 / Math.PI);

    setResult({ degrees, radians, dotProduct: dot, magA, magB });
  };

  const copyText = result
    ? `Angle: ${result.degrees.toFixed(4)}°\nRadians: ${result.radians.toFixed(6)}\nDot Product: ${result.dotProduct}\n|A|: ${result.magA.toFixed(6)}\n|B|: ${result.magB.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as '2d' | '3d')} className="input-field w-auto" aria-label={`Dimensions for ${toolName}`}>
          <option value="2d">2D</option>
          <option value="3d">3D</option>
        </select>
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Vector A</label>
          <input type="number" value={ax} onChange={(e) => setAx(e.target.value)} placeholder="x" aria-label="Vector A x" className="input-field" />
          <input type="number" value={ay} onChange={(e) => setAy(e.target.value)} placeholder="y" aria-label="Vector A y" className="input-field" />
          {mode === '3d' && <input type="number" value={az} onChange={(e) => setAz(e.target.value)} placeholder="z" aria-label="Vector A z" className="input-field" />}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Vector B</label>
          <input type="number" value={bx} onChange={(e) => setBx(e.target.value)} placeholder="x" aria-label="Vector B x" className="input-field" />
          <input type="number" value={by} onChange={(e) => setBy(e.target.value)} placeholder="y" aria-label="Vector B y" className="input-field" />
          {mode === '3d' && <input type="number" value={bz} onChange={(e) => setBz(e.target.value)} placeholder="z" aria-label="Vector B z" className="input-field" />}
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button onClick={calculate} className="btn-primary" aria-label="Calculate angle">Calculate Angle</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.degrees.toFixed(4)}°</div>
                <div className="text-xs text-gray-500 mt-1">Degrees</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.radians.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Radians</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono space-y-1">
              <div>Dot Product: {result.dotProduct}</div>
              <div>|A| = {result.magA.toFixed(6)}</div>
              <div>|B| = {result.magB.toFixed(6)}</div>
              <div>θ = arccos(A·B / (|A|×|B|))</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
