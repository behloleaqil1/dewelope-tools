'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CrossProductCalculator - Calculates the cross product of two 3D vectors.
 * Formula: A × B = (a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1)
 */
export default function CrossProductCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [a3, setA3] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [b3, setB3] = useState('');
  const [result, setResult] = useState<{ x: number; y: number; z: number; magnitude: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const va = [parseFloat(a1), parseFloat(a2), parseFloat(a3)];
    const vb = [parseFloat(b1), parseFloat(b2), parseFloat(b3)];

    if (va.some(isNaN) || vb.some(isNaN)) {
      setError('Please enter valid numbers for all vector components');
      return;
    }

    const x = va[1] * vb[2] - va[2] * vb[1];
    const y = va[2] * vb[0] - va[0] * vb[2];
    const z = va[0] * vb[1] - va[1] * vb[0];
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    setResult({ x, y, z, magnitude });
  }

  const copyText = result
    ? `Cross Product: (${result.x}, ${result.y}, ${result.z})\nMagnitude: ${result.magnitude.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vector A (3D)</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label htmlFor={`${toolId}-a1`} className="block text-xs text-gray-500 mb-1">x</label>
            <input id={`${toolId}-a1`} type="text" inputMode="decimal" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="0" aria-label={`Vector A x component for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-a2`} className="block text-xs text-gray-500 mb-1">y</label>
            <input id={`${toolId}-a2`} type="text" inputMode="decimal" value={a2} onChange={(e) => setA2(e.target.value)} placeholder="0" aria-label="Vector A y component" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-a3`} className="block text-xs text-gray-500 mb-1">z</label>
            <input id={`${toolId}-a3`} type="text" inputMode="decimal" value={a3} onChange={(e) => setA3(e.target.value)} placeholder="0" aria-label="Vector A z component" className="input-field" />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Vector B (3D)</label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor={`${toolId}-b1`} className="block text-xs text-gray-500 mb-1">x</label>
            <input id={`${toolId}-b1`} type="text" inputMode="decimal" value={b1} onChange={(e) => setB1(e.target.value)} placeholder="0" aria-label="Vector B x component" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b2`} className="block text-xs text-gray-500 mb-1">y</label>
            <input id={`${toolId}-b2`} type="text" inputMode="decimal" value={b2} onChange={(e) => setB2(e.target.value)} placeholder="0" aria-label="Vector B y component" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b3`} className="block text-xs text-gray-500 mb-1">z</label>
            <input id={`${toolId}-b3`} type="text" inputMode="decimal" value={b3} onChange={(e) => setB3(e.target.value)} placeholder="0" aria-label="Vector B z component" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate cross product" className="btn-primary">
        Calculate Cross Product
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <div className="text-lg font-bold text-blue-700">
                A × B = ({result.x}, {result.y}, {result.z})
              </div>
              <div className="text-sm text-gray-600 mt-1">
                |A × B| = {result.magnitude.toFixed(6)}
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              A × B = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
