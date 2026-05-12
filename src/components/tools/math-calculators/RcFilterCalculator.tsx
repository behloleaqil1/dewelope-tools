'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RcFilterCalculator - Calculate RC low-pass/high-pass filter cutoff frequency.
 */
export default function RcFilterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resistance, setResistance] = useState('');
  const [capacitance, setCapacitance] = useState('');
  const [resistanceUnit, setResistanceUnit] = useState('ohm');
  const [capacitanceUnit, setCapacitanceUnit] = useState('uF');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rMultipliers: Record<string, number> = { ohm: 1, kohm: 1e3, mohm: 1e6 };
    const cMultipliers: Record<string, number> = { F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 };

    const r = parseFloat(resistance) * (rMultipliers[resistanceUnit] || 1);
    const c = parseFloat(capacitance) * (cMultipliers[capacitanceUnit] || 1);

    if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
      setOutput('Error: Please enter valid positive values for resistance and capacitance.');
      return;
    }

    const fc = 1 / (2 * Math.PI * r * c);
    const timeConstant = r * c;
    const omega = 2 * Math.PI * fc;

    let fcDisplay: string;
    if (fc >= 1e6) fcDisplay = `${(fc / 1e6).toFixed(4)} MHz`;
    else if (fc >= 1e3) fcDisplay = `${(fc / 1e3).toFixed(4)} kHz`;
    else fcDisplay = `${fc.toFixed(4)} Hz`;

    let tcDisplay: string;
    if (timeConstant >= 1) tcDisplay = `${timeConstant.toFixed(6)} s`;
    else if (timeConstant >= 1e-3) tcDisplay = `${(timeConstant * 1e3).toFixed(4)} ms`;
    else if (timeConstant >= 1e-6) tcDisplay = `${(timeConstant * 1e6).toFixed(4)} µs`;
    else tcDisplay = `${(timeConstant * 1e9).toFixed(4)} ns`;

    const result = `RC Filter Calculation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resistance (R): ${resistance} ${resistanceUnit === 'ohm' ? 'Ω' : resistanceUnit === 'kohm' ? 'kΩ' : 'MΩ'}
Capacitance (C): ${capacitance} ${capacitanceUnit}

Cutoff Frequency (fc): ${fcDisplay}
Angular Frequency (ω): ${omega.toFixed(4)} rad/s
Time Constant (τ = RC): ${tcDisplay}

Formula: fc = 1 / (2π × R × C)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
At cutoff frequency:
• Signal is attenuated by -3 dB (≈ 70.7%)
• Phase shift is 45° (low-pass) or -45° (high-pass)
• Rise time ≈ ${(2.2 * timeConstant * 1000).toFixed(4)} ms (10% to 90%)`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">Resistance</label>
            <div className="flex gap-2">
              <input id={`${toolId}-r`} type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="10" aria-label={`Resistance value for ${toolName}`} className="input-field flex-1" />
              <select value={resistanceUnit} onChange={(e) => setResistanceUnit(e.target.value)} aria-label="Resistance unit" className="input-field w-24">
                <option value="ohm">Ω</option>
                <option value="kohm">kΩ</option>
                <option value="mohm">MΩ</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1">Capacitance</label>
            <div className="flex gap-2">
              <input id={`${toolId}-c`} type="number" value={capacitance} onChange={(e) => setCapacitance(e.target.value)} placeholder="100" aria-label="Capacitance value" className="input-field flex-1" />
              <select value={capacitanceUnit} onChange={(e) => setCapacitanceUnit(e.target.value)} aria-label="Capacitance unit" className="input-field w-24">
                <option value="F">F</option>
                <option value="mF">mF</option>
                <option value="uF">µF</option>
                <option value="nF">nF</option>
                <option value="pF">pF</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Cutoff Frequency</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
