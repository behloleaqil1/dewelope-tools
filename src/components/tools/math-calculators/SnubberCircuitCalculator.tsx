'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SnubberCircuitCalculator - Calculate RC snubber circuit component values.
 * Determines resistor and capacitor values for turn-off snubbers to limit dV/dt.
 */
export default function SnubberCircuitCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [turnOffTime, setTurnOffTime] = useState('');
  const [dvdt, setDvdt] = useState('');
  const [inductance, setInductance] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const tOff = parseFloat(turnOffTime) * 1e-9; // ns to seconds
    const dvdtMax = parseFloat(dvdt) * 1e6; // V/µs to V/s
    const L = parseFloat(inductance) * 1e-6; // µH to H

    if (isNaN(V) || isNaN(I)) {
      setOutput('Please enter valid voltage and current values.');
      return;
    }

    const results: string[] = [];
    results.push('=== RC Snubber Circuit Calculator ===');
    results.push('');

    // Method 1: Based on dV/dt limit
    if (!isNaN(dvdtMax) && dvdtMax > 0) {
      const Cs = I / dvdtMax;
      const Rs = V / I;
      const powerR = 0.5 * Cs * V * V * 20000; // Assume 20kHz default

      results.push('Method 1: dV/dt Limiting');
      results.push(`  Snubber Capacitor (Cs): ${(Cs * 1e9).toFixed(2)} nF`);
      results.push(`  Snubber Resistor (Rs):  ${Rs.toFixed(2)} Ω`);
      results.push(`  Resistor Power (at 20kHz): ${powerR.toFixed(2)} W`);
      results.push('');
      results.push('  Formulas:');
      results.push('    Cs = I_load / (dV/dt_max)');
      results.push('    Rs = V_bus / I_load');
      results.push('');
    }

    // Method 2: Based on turn-off time
    if (!isNaN(tOff) && tOff > 0) {
      const Cs2 = (I * tOff) / V;
      const Rs2 = V / I;
      const tau = Rs2 * Cs2;

      results.push('Method 2: Turn-off Time Based');
      results.push(`  Snubber Capacitor (Cs): ${(Cs2 * 1e9).toFixed(2)} nF`);
      results.push(`  Snubber Resistor (Rs):  ${Rs2.toFixed(2)} Ω`);
      results.push(`  Time Constant (τ):      ${(tau * 1e9).toFixed(2)} ns`);
      results.push('');
      results.push('  Formulas:');
      results.push('    Cs = (I × t_off) / V');
      results.push('    Rs = V / I');
      results.push('');
    }

    // Method 3: Based on stray inductance
    if (!isNaN(L) && L > 0) {
      const Cs3 = L * (I / V) * (I / V);
      const Rs3 = V / I;

      results.push('Method 3: Stray Inductance Based');
      results.push(`  Snubber Capacitor (Cs): ${(Cs3 * 1e9).toFixed(2)} nF`);
      results.push(`  Snubber Resistor (Rs):  ${Rs3.toFixed(2)} Ω`);
      results.push('');
      results.push('  Formulas:');
      results.push('    Cs = L × (I/V)²');
      results.push('    Rs = V / I (critically damped)');
    }

    results.push('');
    results.push('--- Input Parameters ---');
    results.push(`  Bus Voltage: ${V} V`);
    results.push(`  Load Current: ${I} A`);
    if (!isNaN(tOff)) results.push(`  Turn-off Time: ${turnOffTime} ns`);
    if (!isNaN(dvdtMax)) results.push(`  Max dV/dt: ${dvdt} V/µs`);
    if (!isNaN(L)) results.push(`  Stray Inductance: ${inductance} µH`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Bus Voltage (V)</label>
            <input id={`${toolId}-voltage`} type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="e.g. 400" className="input-field" aria-label={`Bus voltage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (A)</label>
            <input id={`${toolId}-current`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. 20" className="input-field" aria-label="Load current" />
          </div>
          <div>
            <label htmlFor={`${toolId}-toff`} className="block text-sm font-medium text-gray-700 mb-1">Turn-off Time (ns, optional)</label>
            <input id={`${toolId}-toff`} type="number" value={turnOffTime} onChange={(e) => setTurnOffTime(e.target.value)} placeholder="e.g. 200" className="input-field" aria-label="Turn-off time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dvdt`} className="block text-sm font-medium text-gray-700 mb-1">Max dV/dt (V/µs, optional)</label>
            <input id={`${toolId}-dvdt`} type="number" value={dvdt} onChange={(e) => setDvdt(e.target.value)} placeholder="e.g. 500" className="input-field" aria-label="Maximum dV/dt" />
          </div>
          <div>
            <label htmlFor={`${toolId}-inductance`} className="block text-sm font-medium text-gray-700 mb-1">Stray Inductance (µH, optional)</label>
            <input id={`${toolId}-inductance`} type="number" value={inductance} onChange={(e) => setInductance(e.target.value)} placeholder="e.g. 0.5" className="input-field" aria-label="Stray inductance" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Calculate Snubber Values</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Snubber Circuit Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
