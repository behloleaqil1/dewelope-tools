'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DotProductCalculator - Calculates the dot product of two vectors.
 * Supports 2D and 3D vectors. Formula: A · B = a1*b1 + a2*b2 + a3*b3
 */
export default function DotProductCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dimension, setDimension] = useState<'2d' | '3d'>('3d');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [a3, setA3] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [b3, setB3] = useState('');
  const [result, setResult] = useState<{ dotProduct: number; magnitudeA: number; magnitudeB: number; angle: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const va = dimension === '3d' ? [parseFloat(a1), parseFloat(a2), parseFloat(a3)] : [parseFloat(a1), parseFloat(a2)];
    const vb = dimension === '3d' ? [parseFloat(b1), parseFloat(b2), parseFloat(b3)] : [parseFloat(b1), parseFloat(b2)];

    if (va.some(isNaN) || vb.some(isNaN)) {
      setError('Please enter valid numbers for all vector components');
      return;
    }

    let dotProduct = 0;
    for (let i = 0; i < va.length; i++) {
      dotProduct += va[i] * vb[i];
    }

    const magnitudeA = Math.sqrt(va.reduce((sum, v) => sum + v * v, 0));
    const magnitudeB = Math.sqrt(vb.reduce((sum, v) => sum + v * v, 0));

    let angle = 0;
    if (magnitudeA > 0 && magnitudeB > 0) {
      const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magnitudeA * magnitudeB)));
      angle = Math.acos(cosTheta) * (180 / Math.PI);
    }

    setResult({ dotProduct, magnitudeA, magnitudeB, angle });
  }

  const copyText = result
    ? `Dot Product: ${result.dotProduct}\n|A|: ${result.magnitudeA.toFixed(6)}\n|B|: ${result.magnitudeB.toFixed(6)}\nAngle: ${result.angle.toFixed(4)}°`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-3 mb-3">
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={dimension === '2d'} onChange={() => setDimension('2d')} name="dim" /> 2D
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={dimension === '3d'} onChange={() => setDimension('3d')} name="dim" /> 3D
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Vector A</label>
        <div className={`grid gap-2 mb-4 ${dimension === '3d' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <label htmlFor={`${toolId}-a1`} className="block text-xs text-gray-500 mb-1">x</label>
            <input id={`${toolId}-a1`} type="text" inputMode="decimal" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="0" aria-label={`Vector A x for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-a2`} className="block text-xs text-gray-500 mb-1">y</label>
            <input id={`${toolId}-a2`} type="text" inputMode="decimal" value={a2} onChange={(e) => setA2(e.target.value)} placeholder="0" aria-label="Vector A y" className="input-field" />
          </div>
          {dimension === '3d' && (
            <div>
              <label htmlFor={`${toolId}-a3`} className="block text-xs text-gray-500 mb-1">z</label>
              <input id={`${toolId}-a3`} type="text" inputMode="decimal" value={a3} onChange={(e) => setA3(e.target.value)} placeholder="0" aria-label="Vector A z" className="input-field" />
            </div>
          )}
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Vector B</label>
        <div className={`grid gap-2 ${dimension === '3d' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <label htmlFor={`${toolId}-b1`} className="block text-xs text-gray-500 mb-1">x</label>
            <input id={`${toolId}-b1`} type="text" inputMode="decimal" value={b1} onChange={(e) => setB1(e.target.value)} placeholder="0" aria-label="Vector B x" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b2`} className="block text-xs text-gray-500 mb-1">y</label>
            <input id={`${toolId}-b2`} type="text" inputMode="decimal" value={b2} onChange={(e) => setB2(e.target.value)} placeholder="0" aria-label="Vector B y" className="input-field" />
          </div>
          {dimension === '3d' && (
            <div>
              <label htmlFor={`${toolId}-b3`} className="block text-xs text-gray-500 mb-1">z</label>
              <input id={`${toolId}-b3`} type="text" inputMode="decimal" value={b3} onChange={(e) => setB3(e.target.value)} placeholder="0" aria-label="Vector B z" className="input-field" />
            </div>
          )}
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate dot product" className="btn-primary">
        Calculate Dot Product
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.dotProduct}</div>
                <div className="text-xs text-gray-500">Dot Product</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.angle.toFixed(2)}°</div>
                <div className="text-xs text-gray-500">Angle Between</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.magnitudeA.toFixed(4)}</div>
                <div className="text-xs text-gray-500">|A|</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.magnitudeB.toFixed(4)}</div>
                <div className="text-xs text-gray-500">|B|</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              A · B = Σ(aᵢ × bᵢ) = {result.dotProduct}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
