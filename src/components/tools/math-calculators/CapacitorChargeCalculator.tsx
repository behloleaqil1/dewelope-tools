'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CapacitorChargeCalculator - Calculate RC circuit charge and discharge time.
 */
export default function CapacitorChargeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resistance, setResistance] = useState('');
  const [resistanceUnit, setResistanceUnit] = useState<'ohm' | 'kohm' | 'mohm'>('kohm');
  const [capacitance, setCapacitance] = useState('');
  const [capacitanceUnit, setCapacitanceUnit] = useState<'f' | 'mf' | 'uf' | 'nf' | 'pf'>('uf');
  const [supplyVoltage, setSupplyVoltage] = useState('');
  const [targetPercent, setTargetPercent] = useState('63.2');
  const [mode, setMode] = useState<'charge' | 'discharge'>('charge');
  const [results, setResults] = useState<{ tau: string; time: string; voltage: string; timeConstants: string[] } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResults(null);

    const rMultiplier: Record<string, number> = { ohm: 1, kohm: 1e3, mohm: 1e6 };
    const cMultiplier: Record<string, number> = { f: 1, mf: 1e-3, uf: 1e-6, nf: 1e-9, pf: 1e-12 };

    const R = parseFloat(resistance) * rMultiplier[resistanceUnit];
    const C = parseFloat(capacitance) * cMultiplier[capacitanceUnit];
    const Vs = parseFloat(supplyVoltage);
    const pct = parseFloat(targetPercent) / 100;

    if (isNaN(R) || isNaN(C) || isNaN(Vs) || isNaN(pct) || R <= 0 || C <= 0 || Vs <= 0) {
      setError('Please enter valid positive values for all fields.');
      return;
    }

    if (pct <= 0 || pct >= 1) {
      setError('Target percentage must be between 0 and 100 (exclusive).');
      return;
    }

    const tau = R * C;
    let time: number;
    let voltageAtTarget: number;

    if (mode === 'charge') {
      time = -tau * Math.log(1 - pct);
      voltageAtTarget = Vs * pct;
    } else {
      time = -tau * Math.log(pct);
      voltageAtTarget = Vs * pct;
    }

    const timeConstants = [1, 2, 3, 4, 5].map(n => {
      const t = n * tau;
      const vCharge = Vs * (1 - Math.exp(-n));
      const vDischarge = Vs * Math.exp(-n);
      const pctCharge = ((1 - Math.exp(-n)) * 100).toFixed(1);
      const pctDischarge = (Math.exp(-n) * 100).toFixed(1);
      return mode === 'charge'
        ? `${n}τ = ${formatTime(t)} → ${vCharge.toFixed(3)} V (${pctCharge}%)`
        : `${n}τ = ${formatTime(t)} → ${vDischarge.toFixed(3)} V (${pctDischarge}%)`;
    });

    setResults({
      tau: formatTime(tau),
      time: formatTime(time),
      voltage: voltageAtTarget.toFixed(4) + ' V',
      timeConstants,
    });
  };

  const formatTime = (seconds: number): string => {
    if (seconds >= 1) return seconds.toFixed(4) + ' s';
    if (seconds >= 1e-3) return (seconds * 1e3).toFixed(4) + ' ms';
    if (seconds >= 1e-6) return (seconds * 1e6).toFixed(4) + ' μs';
    return (seconds * 1e9).toFixed(4) + ' ns';
  };

  const resultText = results ? `Time Constant (τ): ${results.tau}\nTime to ${targetPercent}%: ${results.time}\nVoltage: ${results.voltage}\n\n${results.timeConstants.join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">Resistance</label>
              <div className="flex gap-2">
                <input id={`${toolId}-r`} type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="Value" className="input-field flex-1" aria-label={`Resistance for ${toolName}`} />
                <select value={resistanceUnit} onChange={(e) => setResistanceUnit(e.target.value as 'ohm' | 'kohm' | 'mohm')} className="input-field w-20" aria-label="Resistance unit">
                  <option value="ohm">Ω</option>
                  <option value="kohm">kΩ</option>
                  <option value="mohm">MΩ</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1">Capacitance</label>
              <div className="flex gap-2">
                <input id={`${toolId}-c`} type="number" value={capacitance} onChange={(e) => setCapacitance(e.target.value)} placeholder="Value" className="input-field flex-1" aria-label="Capacitance value" />
                <select value={capacitanceUnit} onChange={(e) => setCapacitanceUnit(e.target.value as 'f' | 'mf' | 'uf' | 'nf' | 'pf')} className="input-field w-20" aria-label="Capacitance unit">
                  <option value="f">F</option>
                  <option value="mf">mF</option>
                  <option value="uf">μF</option>
                  <option value="nf">nF</option>
                  <option value="pf">pF</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-vs`} className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage (V)</label>
              <input id={`${toolId}-vs`} type="number" value={supplyVoltage} onChange={(e) => setSupplyVoltage(e.target.value)} placeholder="e.g. 5" className="input-field" aria-label="Supply voltage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-pct`} className="block text-sm font-medium text-gray-700 mb-1">Target %</label>
              <input id={`${toolId}-pct`} type="number" value={targetPercent} onChange={(e) => setTargetPercent(e.target.value)} placeholder="63.2" className="input-field" aria-label="Target percentage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'charge' | 'discharge')} className="input-field" aria-label="Charge or discharge mode">
                <option value="charge">Charge</option>
                <option value="discharge">Discharge</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </InputArea>

      <OutputArea hasContent={!!results}>
        {results && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">RC Circuit Results</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Time Constant (τ)</div>
                <div className="text-sm font-semibold text-blue-700">{results.tau}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Time to {targetPercent}%</div>
                <div className="text-sm font-semibold text-green-700">{results.time}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Voltage at Target</div>
                <div className="text-sm font-semibold text-purple-700">{results.voltage}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs font-medium text-gray-600 mb-2">Time Constants Table ({mode})</div>
              {results.timeConstants.map((tc, i) => (
                <div key={i} className="text-sm font-mono text-gray-700">{tc}</div>
              ))}
            </div>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
