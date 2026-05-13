'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpAmpGainCalculator - Calculate op-amp inverting and non-inverting gain.
 * Uses standard formulas: Inverting gain = -Rf/Rin, Non-inverting gain = 1 + Rf/Rin.
 */
export default function OpAmpGainCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'inverting' | 'non-inverting'>('non-inverting');
  const [rf, setRf] = useState('');
  const [rin, setRin] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rfVal = parseFloat(rf);
    const rinVal = parseFloat(rin);

    if (isNaN(rfVal) || rfVal <= 0 || isNaN(rinVal) || rinVal <= 0) {
      setOutput('Please enter valid positive resistance values.');
      return;
    }

    const ratio = rfVal / rinVal;
    let gain: number;
    let gainDb: number;

    if (mode === 'inverting') {
      gain = -ratio;
      gainDb = 20 * Math.log10(Math.abs(gain));
      const lines = [
        '=== Op-Amp Inverting Amplifier ===',
        '',
        `Rf (Feedback): ${rfVal} Ω`,
        `Rin (Input): ${rinVal} Ω`,
        '',
        `Gain (Av) = -Rf / Rin = -${rfVal} / ${rinVal}`,
        `Gain (Av) = ${gain.toFixed(6)}`,
        `Gain (dB) = ${gainDb.toFixed(2)} dB`,
        '',
        `Phase: 180° (inverted)`,
        `Input Impedance: ${rinVal} Ω`,
      ];
      setOutput(lines.join('\n'));
    } else {
      gain = 1 + ratio;
      gainDb = 20 * Math.log10(gain);
      const lines = [
        '=== Op-Amp Non-Inverting Amplifier ===',
        '',
        `Rf (Feedback): ${rfVal} Ω`,
        `Rin (Ground): ${rinVal} Ω`,
        '',
        `Gain (Av) = 1 + Rf / Rin = 1 + ${rfVal} / ${rinVal}`,
        `Gain (Av) = ${gain.toFixed(6)}`,
        `Gain (dB) = ${gainDb.toFixed(2)} dB`,
        '',
        `Phase: 0° (non-inverted)`,
        `Input Impedance: Very high (ideally infinite)`,
      ];
      setOutput(lines.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
          <div className="flex gap-4">
            <label className="flex items-center text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'non-inverting'} onChange={() => setMode('non-inverting')} className="mr-1" />
              Non-Inverting
            </label>
            <label className="flex items-center text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'inverting'} onChange={() => setMode('inverting')} className="mr-1" />
              Inverting
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-rf`} className="block text-sm font-medium text-gray-700 mb-1">Rf - Feedback Resistor (Ω)</label>
            <input id={`${toolId}-rf`} type="number" value={rf} onChange={(e) => setRf(e.target.value)} placeholder="10000" className="input-field" aria-label={`Feedback resistor for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-rin`} className="block text-sm font-medium text-gray-700 mb-1">Rin - Input Resistor (Ω)</label>
            <input id={`${toolId}-rin`} type="number" value={rin} onChange={(e) => setRin(e.target.value)} placeholder="1000" className="input-field" aria-label="Input resistor" />
          </div>
        </div>

        <button onClick={calculate} className="btn-primary mt-3">Calculate Gain</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
