'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LawOfCosinesCalculator - Solve c² = a² + b² - 2ab·cos(C) for a missing side or angle.
 */
export default function LawOfCosinesCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'side' | 'angle'>('side');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [angleC, setAngleC] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ value: number; label: string; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (mode === 'side') {
      const aVal = parseFloat(a);
      const bVal = parseFloat(b);
      const cAngle = parseFloat(angleC);
      if (isNaN(aVal) || isNaN(bVal) || isNaN(cAngle) || aVal <= 0 || bVal <= 0 || cAngle <= 0 || cAngle >= 180) {
        setError('Enter positive sides and an angle between 0° and 180°.');
        return;
      }
      const rad = (cAngle * Math.PI) / 180;
      const cVal = Math.sqrt(aVal * aVal + bVal * bVal - 2 * aVal * bVal * Math.cos(rad));
      setResult({
        value: cVal,
        label: 'Side c',
        formula: `c = √(a² + b² - 2ab·cos(C))\nc = √(${aVal}² + ${bVal}² - 2·${aVal}·${bVal}·cos(${cAngle}°))\nc = ${cVal.toFixed(6)}`,
      });
    } else {
      const aVal = parseFloat(a);
      const bVal = parseFloat(b);
      const cVal = parseFloat(c);
      if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || aVal <= 0 || bVal <= 0 || cVal <= 0) {
        setError('Enter positive values for all three sides.');
        return;
      }
      if (aVal + bVal <= cVal || aVal + cVal <= bVal || bVal + cVal <= aVal) {
        setError('These sides cannot form a valid triangle.');
        return;
      }
      const cosC = (aVal * aVal + bVal * bVal - cVal * cVal) / (2 * aVal * bVal);
      const angleDeg = (Math.acos(cosC) * 180) / Math.PI;
      setResult({
        value: angleDeg,
        label: 'Angle C (degrees)',
        formula: `cos(C) = (a² + b² - c²) / (2ab)\ncos(C) = (${aVal}² + ${bVal}² - ${cVal}²) / (2·${aVal}·${bVal}) = ${cosC.toFixed(6)}\nC = ${angleDeg.toFixed(6)}°`,
      });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setMode('side'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'side' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Find side mode">
          Find Side
        </button>
        <button onClick={() => { setMode('angle'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'angle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Find angle mode">
          Find Angle
        </button>
      </div>

      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">Side a</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 5" aria-label={`Side a for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Side b</label>
            <input id={`${toolId}-b`} type="text" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 7" aria-label={`Side b for ${toolName}`} className="input-field" />
          </div>
        </div>
        {mode === 'side' ? (
          <div className="mt-4">
            <label htmlFor={`${toolId}-angleC`} className="block text-sm font-medium text-gray-700 mb-1">Angle C (degrees)</label>
            <input id={`${toolId}-angleC`} type="text" inputMode="decimal" value={angleC} onChange={(e) => setAngleC(e.target.value)} placeholder="e.g. 60" aria-label={`Angle C for ${toolName}`} className="input-field" />
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1">Side c</label>
            <input id={`${toolId}-c`} type="text" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="e.g. 8" aria-label={`Side c for ${toolName}`} className="input-field" />
          </div>
        )}
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate using law of cosines">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500">{result.label}</div>
              <div className="text-2xl font-bold text-blue-600">{result.value.toFixed(6)}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={`${result.label}: ${result.value.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
