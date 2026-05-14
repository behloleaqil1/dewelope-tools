'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpecificHeatCalculator - Solves Q = mcΔT for any variable
 */
export default function SpecificHeatCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [solveFor, setSolveFor] = useState<'Q' | 'm' | 'c' | 'dT'>('Q');
  const [heat, setHeat] = useState('');
  const [mass, setMass] = useState('');
  const [specificHeat, setSpecificHeat] = useState('');
  const [tempChange, setTempChange] = useState('');
  const [result, setResult] = useState<{ value: number; unit: string; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const q = parseFloat(heat);
    const m = parseFloat(mass);
    const c = parseFloat(specificHeat);
    const dt = parseFloat(tempChange);

    if (solveFor === 'Q') {
      if (isNaN(m) || isNaN(c) || isNaN(dt)) { setError('Enter valid values for m, c, and ΔT'); return; }
      if (m <= 0 || c <= 0) { setError('Mass and specific heat must be positive'); return; }
      const val = m * c * dt;
      setResult({ value: val, unit: 'J', formula: `Q = mcΔT = ${m} × ${c} × ${dt} = ${val.toFixed(2)} J` });
    } else if (solveFor === 'm') {
      if (isNaN(q) || isNaN(c) || isNaN(dt)) { setError('Enter valid values for Q, c, and ΔT'); return; }
      if (c <= 0 || dt === 0) { setError('Specific heat must be positive and ΔT non-zero'); return; }
      const val = q / (c * dt);
      setResult({ value: val, unit: 'kg', formula: `m = Q/(cΔT) = ${q} / (${c} × ${dt}) = ${val.toFixed(4)} kg` });
    } else if (solveFor === 'c') {
      if (isNaN(q) || isNaN(m) || isNaN(dt)) { setError('Enter valid values for Q, m, and ΔT'); return; }
      if (m <= 0 || dt === 0) { setError('Mass must be positive and ΔT non-zero'); return; }
      const val = q / (m * dt);
      setResult({ value: val, unit: 'J/(kg·°C)', formula: `c = Q/(mΔT) = ${q} / (${m} × ${dt}) = ${val.toFixed(2)} J/(kg·°C)` });
    } else {
      if (isNaN(q) || isNaN(m) || isNaN(c)) { setError('Enter valid values for Q, m, and c'); return; }
      if (m <= 0 || c <= 0) { setError('Mass and specific heat must be positive'); return; }
      const val = q / (m * c);
      setResult({ value: val, unit: '°C', formula: `ΔT = Q/(mc) = ${q} / (${m} × ${c}) = ${val.toFixed(4)} °C` });
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-solve`} className="block text-sm font-medium text-gray-700 mb-1">Solve for</label>
        <select id={`${toolId}-solve`} value={solveFor} onChange={(e) => setSolveFor(e.target.value as 'Q' | 'm' | 'c' | 'dT')} aria-label={`Variable to solve for in ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Q">Heat Energy (Q)</option>
          <option value="m">Mass (m)</option>
          <option value="c">Specific Heat (c)</option>
          <option value="dT">Temperature Change (ΔT)</option>
        </select>
        {solveFor !== 'Q' && (<><label htmlFor={`${toolId}-q`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Heat Energy Q (J)</label><input id={`${toolId}-q`} type="number" value={heat} onChange={(e) => setHeat(e.target.value)} placeholder="Enter heat energy" aria-label={`Heat energy input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'm' && (<><label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Mass (kg)</label><input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="Enter mass" aria-label={`Mass input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'c' && (<><label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Specific Heat Capacity (J/kg·°C)</label><input id={`${toolId}-c`} type="number" value={specificHeat} onChange={(e) => setSpecificHeat(e.target.value)} placeholder="e.g., 4186 for water" aria-label={`Specific heat input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'dT' && (<><label htmlFor={`${toolId}-dt`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Temperature Change ΔT (°C)</label><input id={`${toolId}-dt`} type="number" value={tempChange} onChange={(e) => setTempChange(e.target.value)} placeholder="Enter temperature change" aria-label={`Temperature change input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">{solveFor === 'dT' ? 'ΔT' : solveFor} = {result.value.toFixed(4)} {result.unit}</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.value.toFixed(4)} ${result.unit}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
