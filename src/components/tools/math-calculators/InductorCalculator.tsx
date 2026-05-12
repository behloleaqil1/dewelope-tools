'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InductorCalculator - Calculate inductance, reactance, and energy stored.
 * Computes inductive reactance (XL = 2πfL) and energy (E = ½LI²).
 */
export default function InductorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inductance, setInductance] = useState('');
  const [frequency, setFrequency] = useState('');
  const [current, setCurrent] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const L = parseFloat(inductance);
    const f = parseFloat(frequency);
    const I = parseFloat(current);

    if (isNaN(L) || L <= 0) {
      setOutput('Please enter a valid inductance value.');
      return;
    }

    const results: string[] = [];
    results.push(`Inductance: ${L} mH (${(L / 1000).toExponential(4)} H)`);

    if (!isNaN(f) && f > 0) {
      const L_henries = L / 1000;
      const XL = 2 * Math.PI * f * L_henries;
      results.push(`\nInductive Reactance (XL):`);
      results.push(`  XL = 2π × f × L`);
      results.push(`  XL = 2π × ${f} Hz × ${L_henries} H`);
      results.push(`  XL = ${XL.toFixed(4)} Ω`);

      if (XL > 0) {
        const maxCurrent = 1 / XL;
        results.push(`  Max current at 1V: ${(maxCurrent * 1000).toFixed(4)} mA`);
      }
    }

    if (!isNaN(I) && I > 0) {
      const L_henries = L / 1000;
      const energy = 0.5 * L_henries * I * I;
      results.push(`\nEnergy Stored:`);
      results.push(`  E = ½ × L × I²`);
      results.push(`  E = ½ × ${L_henries} H × (${I} A)²`);
      results.push(`  E = ${energy.toExponential(4)} J`);
      results.push(`  E = ${(energy * 1000).toFixed(6)} mJ`);
    }

    if (!isNaN(f) && f > 0 && !isNaN(I) && I > 0) {
      const L_henries = L / 1000;
      const XL = 2 * Math.PI * f * L_henries;
      const voltage = XL * I;
      results.push(`\nVoltage across inductor:`);
      results.push(`  V = XL × I = ${voltage.toFixed(4)} V`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-inductance`} className="block text-sm font-medium text-gray-700 mb-1">Inductance (mH) *</label>
            <input id={`${toolId}-inductance`} type="number" value={inductance} onChange={(e) => setInductance(e.target.value)} placeholder="e.g. 10" aria-label={`Inductance for ${toolName}`} className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-frequency`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (Hz)</label>
            <input id={`${toolId}-frequency`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g. 1000" aria-label="Frequency in Hz" className="input-field" step="any" min="0" />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Current (A)</label>
            <input id={`${toolId}-current`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. 0.5" aria-label="Current in amps" className="input-field" step="any" min="0" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
