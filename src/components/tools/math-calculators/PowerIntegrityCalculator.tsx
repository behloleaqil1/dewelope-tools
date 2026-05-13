'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerIntegrityCalculator - Calculate power distribution network impedance.
 */
export default function PowerIntegrityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [supplyVoltage, setSupplyVoltage] = useState('1.0');
  const [maxCurrent, setMaxCurrent] = useState('5.0');
  const [ripplePercent, setRipplePercent] = useState('5');
  const [frequency, setFrequency] = useState('100');
  const [decapValue, setDecapValue] = useState('100');
  const [decapEsr, setDecapEsr] = useState('0.01');
  const [numDecaps, setNumDecaps] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vdd = parseFloat(supplyVoltage);
    const iMax = parseFloat(maxCurrent);
    const ripple = parseFloat(ripplePercent);
    const freq = parseFloat(frequency) * 1e6;
    const capValue = parseFloat(decapValue) * 1e-6;
    const esr = parseFloat(decapEsr);
    const nCaps = parseInt(numDecaps);

    if (isNaN(vdd) || isNaN(iMax) || isNaN(ripple) || isNaN(freq) || vdd <= 0 || iMax <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Target impedance calculation
    const zTarget = (vdd * (ripple / 100)) / iMax;

    // Single decap impedance at frequency
    const xc = 1 / (2 * Math.PI * freq * capValue);
    const singleCapZ = Math.sqrt(esr * esr + xc * xc);

    // Parallel decap impedance
    const parallelZ = singleCapZ / nCaps;
    const parallelEsr = esr / nCaps;
    const parallelCap = capValue * nCaps;

    // Self-resonant frequency
    const esl = 0.5e-9; // typical 0.5nH ESL
    const srf = 1 / (2 * Math.PI * Math.sqrt(esl * capValue));

    // PDN impedance at target frequency
    const pdnZ = parallelZ;
    const meetsTarget = pdnZ <= zTarget;

    // Minimum capacitance needed
    const minCap = 1 / (2 * Math.PI * freq * zTarget);
    const minCapsNeeded = Math.ceil(singleCapZ / zTarget);

    const result = `Power Distribution Network (PDN) Analysis
=============================================

Target Impedance:
  Supply Voltage (Vdd): ${vdd} V
  Maximum Current (Imax): ${iMax} A
  Allowed Ripple: ${ripple}%
  Target Impedance (Ztarget): ${zTarget.toFixed(4)} Ω
  Analysis Frequency: ${(freq / 1e6).toFixed(1)} MHz

Decoupling Capacitor Analysis:
  Capacitor Value: ${(capValue * 1e6).toFixed(1)} µF
  ESR per Cap: ${esr} Ω
  ESL (assumed): ${(esl * 1e9).toFixed(1)} nH
  Number of Caps: ${nCaps}
  Self-Resonant Frequency: ${(srf / 1e6).toFixed(2)} MHz

PDN Impedance Results:
  Single Cap Impedance at ${(freq / 1e6).toFixed(1)} MHz: ${singleCapZ.toFixed(4)} Ω
  Parallel Impedance (${nCaps} caps): ${parallelZ.toFixed(4)} Ω
  Parallel ESR: ${parallelEsr.toFixed(4)} Ω
  Total Capacitance: ${(parallelCap * 1e6).toFixed(1)} µF

Assessment:
  Target Impedance: ${zTarget.toFixed(4)} Ω
  Achieved Impedance: ${pdnZ.toFixed(4)} Ω
  Status: ${meetsTarget ? '✅ MEETS TARGET' : '❌ EXCEEDS TARGET'}
  Minimum Caps Needed: ${minCapsNeeded}
  Minimum Capacitance Needed: ${(minCap * 1e6).toFixed(2)} µF

Recommendations:
${meetsTarget ? '  • Current design meets PDN impedance target' : `  • Add more decoupling capacitors (need at least ${minCapsNeeded})`}
  • Place capacitors as close to IC power pins as possible
  • Use multiple cap values for broadband decoupling
  • Consider plane capacitance for high-frequency decoupling`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage (V)</label>
            <input id={`${toolId}-voltage`} type="number" step="0.1" value={supplyVoltage} onChange={(e) => setSupplyVoltage(e.target.value)} className="input-field" aria-label={`Supply voltage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Max Current (A)</label>
            <input id={`${toolId}-current`} type="number" step="0.1" value={maxCurrent} onChange={(e) => setMaxCurrent(e.target.value)} className="input-field" aria-label="Maximum current" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ripple`} className="block text-sm font-medium text-gray-700 mb-1">Allowed Ripple (%)</label>
            <input id={`${toolId}-ripple`} type="number" step="0.5" value={ripplePercent} onChange={(e) => setRipplePercent(e.target.value)} className="input-field" aria-label="Allowed ripple percentage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
            <input id={`${toolId}-freq`} type="number" step="1" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Analysis frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cap`} className="block text-sm font-medium text-gray-700 mb-1">Decap Value (µF)</label>
            <input id={`${toolId}-cap`} type="number" step="0.1" value={decapValue} onChange={(e) => setDecapValue(e.target.value)} className="input-field" aria-label="Decoupling capacitor value" />
          </div>
          <div>
            <label htmlFor={`${toolId}-esr`} className="block text-sm font-medium text-gray-700 mb-1">Decap ESR (Ω)</label>
            <input id={`${toolId}-esr`} type="number" step="0.001" value={decapEsr} onChange={(e) => setDecapEsr(e.target.value)} className="input-field" aria-label="Decap ESR" />
          </div>
          <div>
            <label htmlFor={`${toolId}-num`} className="block text-sm font-medium text-gray-700 mb-1">Number of Decaps</label>
            <input id={`${toolId}-num`} type="number" step="1" value={numDecaps} onChange={(e) => setNumDecaps(e.target.value)} className="input-field" aria-label="Number of decoupling capacitors" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate PDN Impedance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">PDN Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
