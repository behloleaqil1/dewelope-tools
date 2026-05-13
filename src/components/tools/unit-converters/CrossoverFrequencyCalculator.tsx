'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CrossoverFrequencyCalculator - Calculate speaker crossover frequency.
 * Formula: f = 1 / (2π × √(L × C)) for LC crossover
 */
export default function CrossoverFrequencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'lc' | 'rc'>('lc');
  const [inductance, setInductance] = useState('');
  const [capacitance, setCapacitance] = useState('');
  const [resistance, setResistance] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const C = parseFloat(capacitance);

    if (isNaN(C) || C <= 0) {
      setOutput('Please enter a valid positive capacitance.');
      return;
    }

    let frequency: number;
    let formula: string;

    if (mode === 'lc') {
      const L = parseFloat(inductance);
      if (isNaN(L) || L <= 0) {
        setOutput('Please enter a valid positive inductance.');
        return;
      }
      // Convert mH to H and µF to F
      const L_H = L / 1000;
      const C_F = C / 1e6;
      frequency = 1 / (2 * Math.PI * Math.sqrt(L_H * C_F));
      formula = `f = 1 / (2π × √(L × C))\n  = 1 / (2π × √(${L_H.toExponential(4)} × ${C_F.toExponential(4)}))\n  = ${frequency.toFixed(2)} Hz`;
    } else {
      const R = parseFloat(resistance);
      if (isNaN(R) || R <= 0) {
        setOutput('Please enter a valid positive resistance.');
        return;
      }
      const C_F = C / 1e6;
      frequency = 1 / (2 * Math.PI * R * C_F);
      formula = `f = 1 / (2π × R × C)\n  = 1 / (2π × ${R} × ${C_F.toExponential(4)})\n  = ${frequency.toFixed(2)} Hz`;
    }

    const lines = [
      `Crossover Type: ${mode === 'lc' ? 'LC (Inductor-Capacitor)' : 'RC (Resistor-Capacitor)'}`,
      ``,
      `Input:`,
      mode === 'lc' ? `  Inductance: ${inductance} mH` : `  Resistance: ${resistance} Ω`,
      `  Capacitance: ${capacitance} µF`,
      ``,
      `Crossover Frequency: ${frequency.toFixed(2)} Hz`,
      frequency >= 1000 ? `  = ${(frequency / 1000).toFixed(3)} kHz` : '',
      ``,
      `Formula:`,
      `  ${formula}`,
      ``,
      `Frequency Ranges:`,
      `  Sub-bass: 20-60 Hz`,
      `  Bass: 60-250 Hz`,
      `  Low-mid: 250-500 Hz`,
      `  Mid: 500-2000 Hz`,
      `  Upper-mid: 2000-4000 Hz`,
      `  Treble: 4000-20000 Hz`,
      ``,
      `Your crossover at ${frequency.toFixed(0)} Hz falls in the ${frequency < 60 ? 'Sub-bass' : frequency < 250 ? 'Bass' : frequency < 500 ? 'Low-mid' : frequency < 2000 ? 'Mid' : frequency < 4000 ? 'Upper-mid' : 'Treble'} range.`,
    ].filter(Boolean);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Crossover Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="crossoverMode" value="lc" checked={mode === 'lc'} onChange={() => setMode('lc')} />
              LC (Inductor-Capacitor)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="crossoverMode" value="rc" checked={mode === 'rc'} onChange={() => setMode('rc')} />
              RC (Resistor-Capacitor)
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === 'lc' ? (
            <div>
              <label htmlFor={`${toolId}-inductance`} className="block text-sm font-medium text-gray-700 mb-1">Inductance (mH)</label>
              <input id={`${toolId}-inductance`} type="number" value={inductance} onChange={(e) => setInductance(e.target.value)} placeholder="e.g. 1.5" className="input-field" aria-label={`Inductance for ${toolName}`} />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-resistance`} className="block text-sm font-medium text-gray-700 mb-1">Resistance (Ω)</label>
              <input id={`${toolId}-resistance`} type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="e.g. 8" className="input-field" aria-label={`Resistance for ${toolName}`} />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-capacitance`} className="block text-sm font-medium text-gray-700 mb-1">Capacitance (µF)</label>
            <input id={`${toolId}-capacitance`} type="number" value={capacitance} onChange={(e) => setCapacitance(e.target.value)} placeholder="e.g. 10" className="input-field" aria-label="Capacitance in microfarads" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Crossover Frequency</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Crossover Frequency Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
