'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IdealGasLawCalculator - Calculates using PV = nRT (solve for any variable)
 */
export default function IdealGasLawCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [solveFor, setSolveFor] = useState<'P' | 'V' | 'n' | 'T'>('P');
  const [pressure, setPressure] = useState('');
  const [volume, setVolume] = useState('');
  const [moles, setMoles] = useState('');
  const [temperature, setTemperature] = useState('');
  const [result, setResult] = useState<{ value: number; unit: string; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const R = 8.314; // J/(mol·K)

  function calculate() {
    setError(undefined);
    setResult(null);

    const p = parseFloat(pressure);
    const v = parseFloat(volume);
    const n = parseFloat(moles);
    const t = parseFloat(temperature);

    if (solveFor === 'P') {
      if (isNaN(v) || isNaN(n) || isNaN(t)) { setError('Please enter valid values for V, n, and T'); return; }
      if (v <= 0) { setError('Volume must be positive'); return; }
      const val = (n * R * t) / v;
      setResult({ value: val, unit: 'Pa', formula: `P = nRT/V = (${n} × ${R} × ${t}) / ${v} = ${val.toFixed(2)} Pa` });
    } else if (solveFor === 'V') {
      if (isNaN(p) || isNaN(n) || isNaN(t)) { setError('Please enter valid values for P, n, and T'); return; }
      if (p <= 0) { setError('Pressure must be positive'); return; }
      const val = (n * R * t) / p;
      setResult({ value: val, unit: 'm³', formula: `V = nRT/P = (${n} × ${R} × ${t}) / ${p} = ${val.toFixed(6)} m³` });
    } else if (solveFor === 'n') {
      if (isNaN(p) || isNaN(v) || isNaN(t)) { setError('Please enter valid values for P, V, and T'); return; }
      if (t <= 0) { setError('Temperature must be positive (Kelvin)'); return; }
      const val = (p * v) / (R * t);
      setResult({ value: val, unit: 'mol', formula: `n = PV/RT = (${p} × ${v}) / (${R} × ${t}) = ${val.toFixed(6)} mol` });
    } else {
      if (isNaN(p) || isNaN(v) || isNaN(n)) { setError('Please enter valid values for P, V, and n'); return; }
      if (n <= 0) { setError('Moles must be positive'); return; }
      const val = (p * v) / (n * R);
      setResult({ value: val, unit: 'K', formula: `T = PV/nR = (${p} × ${v}) / (${n} × ${R}) = ${val.toFixed(2)} K` });
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-solve`} className="block text-sm font-medium text-gray-700 mb-1">Solve for</label>
        <select id={`${toolId}-solve`} value={solveFor} onChange={(e) => setSolveFor(e.target.value as 'P' | 'V' | 'n' | 'T')} aria-label={`Variable to solve for in ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="P">Pressure (P)</option>
          <option value="V">Volume (V)</option>
          <option value="n">Moles (n)</option>
          <option value="T">Temperature (T)</option>
        </select>
        {solveFor !== 'P' && (<><label htmlFor={`${toolId}-pressure`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Pressure (Pa)</label><input id={`${toolId}-pressure`} type="number" value={pressure} onChange={(e) => setPressure(e.target.value)} placeholder="Enter pressure" aria-label={`Pressure input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'V' && (<><label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Volume (m³)</label><input id={`${toolId}-volume`} type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Enter volume" aria-label={`Volume input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'n' && (<><label htmlFor={`${toolId}-moles`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Moles (mol)</label><input id={`${toolId}-moles`} type="number" value={moles} onChange={(e) => setMoles(e.target.value)} placeholder="Enter moles" aria-label={`Moles input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
        {solveFor !== 'T' && (<><label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Temperature (K)</label><input id={`${toolId}-temp`} type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Enter temperature in Kelvin" aria-label={`Temperature input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>)}
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">{solveFor} = {result.value.toFixed(4)} {result.unit}</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <div className="text-xs text-gray-500">R = {R} J/(mol·K)</div>
            <CopyToClipboard text={`${solveFor} = ${result.value.toFixed(4)} ${result.unit}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
