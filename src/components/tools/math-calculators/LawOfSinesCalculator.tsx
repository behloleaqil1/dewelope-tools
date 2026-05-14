'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LawOfSinesCalculator - Solve a/sin(A) = b/sin(B) = c/sin(C).
 */
export default function LawOfSinesCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideA, setSideA] = useState('');
  const [angleA, setAngleA] = useState('');
  const [sideB, setSideB] = useState('');
  const [angleB, setAngleB] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ values: { label: string; value: string }[]; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const a = sideA ? parseFloat(sideA) : NaN;
    const A = angleA ? parseFloat(angleA) : NaN;
    const b = sideB ? parseFloat(sideB) : NaN;
    const B = angleB ? parseFloat(angleB) : NaN;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Need at least one side-angle pair plus one more value
    if (!isNaN(a) && !isNaN(A) && !isNaN(B) && isNaN(b)) {
      if (A <= 0 || A >= 180 || B <= 0 || B >= 180 || a <= 0) { setError('Values must be positive. Angles must be between 0° and 180°.'); return; }
      if (A + B >= 180) { setError('Sum of angles must be less than 180°.'); return; }
      const bVal = (a * Math.sin(toRad(B))) / Math.sin(toRad(A));
      const C = 180 - A - B;
      const cVal = (a * Math.sin(toRad(C))) / Math.sin(toRad(A));
      setResult({
        values: [
          { label: 'Side b', value: bVal.toFixed(6) },
          { label: 'Angle C', value: `${C.toFixed(6)}°` },
          { label: 'Side c', value: cVal.toFixed(6) },
        ],
        formula: `a/sin(A) = b/sin(B)\n${a}/sin(${A}°) = b/sin(${B}°)\nb = ${a} × sin(${B}°) / sin(${A}°) = ${bVal.toFixed(6)}\nC = 180° - ${A}° - ${B}° = ${C.toFixed(6)}°\nc = ${a} × sin(${C.toFixed(2)}°) / sin(${A}°) = ${cVal.toFixed(6)}`,
      });
    } else if (!isNaN(a) && !isNaN(A) && !isNaN(b) && isNaN(B)) {
      if (A <= 0 || A >= 180 || a <= 0 || b <= 0) { setError('Values must be positive. Angle must be between 0° and 180°.'); return; }
      const sinB = (b * Math.sin(toRad(A))) / a;
      if (sinB > 1) { setError('No valid triangle exists with these values.'); return; }
      const BVal = (Math.asin(sinB) * 180) / Math.PI;
      const C = 180 - A - BVal;
      const cVal = (a * Math.sin(toRad(C))) / Math.sin(toRad(A));
      setResult({
        values: [
          { label: 'Angle B', value: `${BVal.toFixed(6)}°` },
          { label: 'Angle C', value: `${C.toFixed(6)}°` },
          { label: 'Side c', value: cVal.toFixed(6) },
        ],
        formula: `sin(B)/b = sin(A)/a\nsin(B) = ${b} × sin(${A}°) / ${a} = ${sinB.toFixed(6)}\nB = ${BVal.toFixed(6)}°\nC = 180° - ${A}° - ${BVal.toFixed(2)}° = ${C.toFixed(6)}°\nc = ${cVal.toFixed(6)}`,
      });
    } else {
      setError('Enter one complete side-angle pair (a & A) plus either side b or angle B.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <p className="text-sm text-gray-500 mb-3">Enter side a with angle A, plus either side b or angle B.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-sideA`} className="block text-sm font-medium text-gray-700 mb-1">Side a</label>
            <input id={`${toolId}-sideA`} type="text" inputMode="decimal" value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="e.g. 7" aria-label={`Side a for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-angleA`} className="block text-sm font-medium text-gray-700 mb-1">Angle A (degrees)</label>
            <input id={`${toolId}-angleA`} type="text" inputMode="decimal" value={angleA} onChange={(e) => setAngleA(e.target.value)} placeholder="e.g. 45" aria-label={`Angle A for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sideB`} className="block text-sm font-medium text-gray-700 mb-1">Side b (optional)</label>
            <input id={`${toolId}-sideB`} type="text" inputMode="decimal" value={sideB} onChange={(e) => setSideB(e.target.value)} placeholder="e.g. 10" aria-label={`Side b for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-angleB`} className="block text-sm font-medium text-gray-700 mb-1">Angle B (degrees, optional)</label>
            <input id={`${toolId}-angleB`} type="text" inputMode="decimal" value={angleB} onChange={(e) => setAngleB(e.target.value)} placeholder="e.g. 60" aria-label={`Angle B for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate using law of sines">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {result.values.map((v, i) => (
              <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">{v.label}</span>
                <span className="text-sm font-mono font-bold text-blue-600">{v.value}</span>
              </div>
            ))}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={result.values.map((v) => `${v.label}: ${v.value}`).join('\n') + '\n' + result.formula} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
