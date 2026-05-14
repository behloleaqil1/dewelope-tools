'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HydraulicPressCalculator - Calculates hydraulic press using Pascal's principle: F₁/A₁ = F₂/A₂
 */
export default function HydraulicPressCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [solveFor, setSolveFor] = useState<'F2' | 'F1' | 'A1' | 'A2'>('F2');
  const [f1, setF1] = useState('');
  const [a1, setA1] = useState('');
  const [f2, setF2] = useState('');
  const [a2, setA2] = useState('');
  const [result, setResult] = useState<{ value: number; unit: string; formula: string; mechanicalAdvantage: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const F1 = parseFloat(f1);
    const A1 = parseFloat(a1);
    const F2 = parseFloat(f2);
    const A2 = parseFloat(a2);

    if (solveFor === 'F2') {
      if (isNaN(F1) || isNaN(A1) || isNaN(A2)) { setError('Enter valid values for F₁, A₁, and A₂'); return; }
      if (A1 <= 0) { setError('Area must be positive'); return; }
      const val = (F1 * A2) / A1;
      const ma = A2 / A1;
      setResult({ value: val, unit: 'N', formula: `F₂ = F₁ × A₂/A₁ = ${F1} × ${A2}/${A1} = ${val.toFixed(4)} N`, mechanicalAdvantage: ma });
    } else if (solveFor === 'F1') {
      if (isNaN(F2) || isNaN(A1) || isNaN(A2)) { setError('Enter valid values for F₂, A₁, and A₂'); return; }
      if (A2 <= 0) { setError('Area must be positive'); return; }
      const val = (F2 * A1) / A2;
      const ma = A2 / A1;
      setResult({ value: val, unit: 'N', formula: `F₁ = F₂ × A₁/A₂ = ${F2} × ${A1}/${A2} = ${val.toFixed(4)} N`, mechanicalAdvantage: ma });
    } else if (solveFor === 'A1') {
      if (isNaN(F1) || isNaN(F2) || isNaN(A2)) { setError('Enter valid values for F₁, F₂, and A₂'); return; }
      if (F2 === 0) { setError('F₂ cannot be zero'); return; }
      const val = (F1 * A2) / F2;
      const ma = A2 / val;
      setResult({ value: val, unit: 'm²', formula: `A₁ = F₁ × A₂/F₂ = ${F1} × ${A2}/${F2} = ${val.toFixed(6)} m²`, mechanicalAdvantage: ma });
    } else {
      if (isNaN(F1) || isNaN(F2) || isNaN(A1)) { setError('Enter valid values for F₁, F₂, and A₁'); return; }
      if (F1 === 0) { setError('F₁ cannot be zero'); return; }
      const val = (F2 * A1) / F1;
      const ma = val / A1;
      setResult({ value: val, unit: 'm²', formula: `A₂ = F₂ × A₁/F₁ = ${F2} × ${A1}/${F1} = ${val.toFixed(6)} m²`, mechanicalAdvantage: ma });
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-solve`} className="block text-sm font-medium text-gray-700 mb-1">Solve for</label>
        <select id={`${toolId}-solve`} value={solveFor} onChange={(e) => setSolveFor(e.target.value as 'F2' | 'F1' | 'A1' | 'A2')} aria-label={`Variable to solve for in ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="F2">Output Force (F₂)</option>
          <option value="F1">Input Force (F₁)</option>
          <option value="A1">Input Area (A₁)</option>
          <option value="A2">Output Area (A₂)</option>
        </select>
        {solveFor !== 'F1' && (<><label htmlFor={`${toolId}-f1`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Input Force F₁ (N)</label><input id={`${toolId}-f1`} type="number" value={f1} onChange={(e) => setF1(e.target.value)} placeholder="Enter input force" aria-label={`Input force for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'A1' && (<><label htmlFor={`${toolId}-a1`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Input Area A₁ (m²)</label><input id={`${toolId}-a1`} type="number" step="any" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="Enter input piston area" aria-label={`Input area for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'F2' && (<><label htmlFor={`${toolId}-f2`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Output Force F₂ (N)</label><input id={`${toolId}-f2`} type="number" value={f2} onChange={(e) => setF2(e.target.value)} placeholder="Enter output force" aria-label={`Output force for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'A2' && (<><label htmlFor={`${toolId}-a2`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Output Area A₂ (m²)</label><input id={`${toolId}-a2`} type="number" step="any" value={a2} onChange={(e) => setA2(e.target.value)} placeholder="Enter output piston area" aria-label={`Output area for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Result: {result.value.toFixed(4)} {result.unit}</div>
            <div className="text-md text-gray-700">Mechanical Advantage: {result.mechanicalAdvantage.toFixed(2)}×</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.value.toFixed(4)} ${result.unit}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
