'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IgbtSwitchingLossCalculator - Calculate IGBT switching losses (turn-on, turn-off, and total).
 * Uses standard IGBT loss equations based on voltage, current, switching times, and frequency.
 */
export default function IgbtSwitchingLossCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [turnOnTime, setTurnOnTime] = useState('');
  const [turnOffTime, setTurnOffTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [eonRef, setEonRef] = useState('');
  const [eoffRef, setEoffRef] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const tOn = parseFloat(turnOnTime) * 1e-9; // ns to seconds
    const tOff = parseFloat(turnOffTime) * 1e-9;
    const f = parseFloat(frequency);

    if (isNaN(V) || isNaN(I) || isNaN(f)) {
      setOutput('Please enter valid voltage, current, and frequency values.');
      return;
    }

    const results: string[] = [];
    results.push('=== IGBT Switching Loss Analysis ===');
    results.push('');

    // Method 1: Using switching times
    if (!isNaN(tOn) && !isNaN(tOff)) {
      const pSwitchOn = 0.5 * V * I * tOn * f;
      const pSwitchOff = 0.5 * V * I * tOff * f;
      const pSwitchTotal = pSwitchOn + pSwitchOff;

      results.push('Method: Switching Time Based');
      results.push(`  Turn-on loss (P_on):  ${(pSwitchOn).toFixed(4)} W`);
      results.push(`  Turn-off loss (P_off): ${(pSwitchOff).toFixed(4)} W`);
      results.push(`  Total switching loss:  ${(pSwitchTotal).toFixed(4)} W`);
      results.push('');
      results.push('Formulas:');
      results.push('  P_on  = 0.5 × V × I × t_on × f');
      results.push('  P_off = 0.5 × V × I × t_off × f');
    }

    // Method 2: Using energy per pulse (datasheet values)
    const eon = parseFloat(eonRef) * 1e-3; // mJ to J
    const eoff = parseFloat(eoffRef) * 1e-3;
    if (!isNaN(eon) && !isNaN(eoff)) {
      const pOn2 = eon * f;
      const pOff2 = eoff * f;
      const pTotal2 = pOn2 + pOff2;

      results.push('');
      results.push('Method: Datasheet Energy Based');
      results.push(`  Turn-on loss (P_on):  ${(pOn2).toFixed(4)} W`);
      results.push(`  Turn-off loss (P_off): ${(pOff2).toFixed(4)} W`);
      results.push(`  Total switching loss:  ${(pTotal2).toFixed(4)} W`);
      results.push('');
      results.push('Formulas:');
      results.push('  P_on  = E_on × f');
      results.push('  P_off = E_off × f');
    }

    results.push('');
    results.push('--- Input Parameters ---');
    results.push(`  Voltage: ${V} V`);
    results.push(`  Current: ${I} A`);
    results.push(`  Frequency: ${f} Hz`);
    if (!isNaN(tOn)) results.push(`  Turn-on time: ${turnOnTime} ns`);
    if (!isNaN(tOff)) results.push(`  Turn-off time: ${turnOffTime} ns`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">DC Bus Voltage (V)</label>
            <input id={`${toolId}-voltage`} type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="e.g. 600" className="input-field" aria-label={`Voltage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Collector Current (A)</label>
            <input id={`${toolId}-current`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. 50" className="input-field" aria-label="Collector current" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ton`} className="block text-sm font-medium text-gray-700 mb-1">Turn-on Time (ns)</label>
            <input id={`${toolId}-ton`} type="number" value={turnOnTime} onChange={(e) => setTurnOnTime(e.target.value)} placeholder="e.g. 200" className="input-field" aria-label="Turn-on time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-toff`} className="block text-sm font-medium text-gray-700 mb-1">Turn-off Time (ns)</label>
            <input id={`${toolId}-toff`} type="number" value={turnOffTime} onChange={(e) => setTurnOffTime(e.target.value)} placeholder="e.g. 300" className="input-field" aria-label="Turn-off time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (Hz)</label>
            <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g. 20000" className="input-field" aria-label="Switching frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-eon`} className="block text-sm font-medium text-gray-700 mb-1">E_on from Datasheet (mJ, optional)</label>
            <input id={`${toolId}-eon`} type="number" value={eonRef} onChange={(e) => setEonRef(e.target.value)} placeholder="e.g. 15" className="input-field" aria-label="Turn-on energy" />
          </div>
          <div>
            <label htmlFor={`${toolId}-eoff`} className="block text-sm font-medium text-gray-700 mb-1">E_off from Datasheet (mJ, optional)</label>
            <input id={`${toolId}-eoff`} type="number" value={eoffRef} onChange={(e) => setEoffRef(e.target.value)} placeholder="e.g. 10" className="input-field" aria-label="Turn-off energy" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Calculate Switching Losses</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">IGBT Switching Loss Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
