'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Timer555Calculator - Calculate 555 timer astable and monostable frequencies.
 * Uses standard 555 timer formulas for frequency, duty cycle, and time period.
 */
export default function Timer555Calculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'astable' | 'monostable'>('astable');
  const [r1, setR1] = useState('');
  const [r2, setR2] = useState('');
  const [capacitance, setCapacitance] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const r1Val = parseFloat(r1);
    const cVal = parseFloat(capacitance);

    if (isNaN(r1Val) || r1Val <= 0 || isNaN(cVal) || cVal <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    if (mode === 'astable') {
      const r2Val = parseFloat(r2);
      if (isNaN(r2Val) || r2Val <= 0) {
        setOutput('Please enter a valid positive value for R2.');
        return;
      }

      const r1Ohms = r1Val;
      const r2Ohms = r2Val;
      const cFarads = cVal * 1e-6; // input in µF

      const tHigh = 0.693 * (r1Ohms + r2Ohms) * cFarads;
      const tLow = 0.693 * r2Ohms * cFarads;
      const period = tHigh + tLow;
      const frequency = 1 / period;
      const dutyCycle = (tHigh / period) * 100;

      const lines = [
        '=== 555 Timer - Astable Mode ===',
        '',
        `R1: ${r1Val} Ω`,
        `R2: ${r2Val} Ω`,
        `C: ${cVal} µF`,
        '',
        `Frequency: ${frequency.toFixed(4)} Hz`,
        `Period: ${(period * 1000).toFixed(4)} ms`,
        `Time High: ${(tHigh * 1000).toFixed(4)} ms`,
        `Time Low: ${(tLow * 1000).toFixed(4)} ms`,
        `Duty Cycle: ${dutyCycle.toFixed(2)}%`,
      ];
      setOutput(lines.join('\n'));
    } else {
      const r1Ohms = r1Val;
      const cFarads = cVal * 1e-6;

      const tPulse = 1.1 * r1Ohms * cFarads;

      const lines = [
        '=== 555 Timer - Monostable Mode ===',
        '',
        `R1: ${r1Val} Ω`,
        `C: ${cVal} µF`,
        '',
        `Output Pulse Width: ${(tPulse * 1000).toFixed(4)} ms`,
        `Output Pulse Width: ${tPulse.toFixed(6)} s`,
      ];
      setOutput(lines.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'astable'} onChange={() => setMode('astable')} className="mr-1" />
              Astable (oscillator)
            </label>
            <label className="flex items-center text-sm">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'monostable'} onChange={() => setMode('monostable')} className="mr-1" />
              Monostable (one-shot)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-r1`} className="block text-sm font-medium text-gray-700 mb-1">R1 (Ω)</label>
            <input id={`${toolId}-r1`} type="number" value={r1} onChange={(e) => setR1(e.target.value)} placeholder="1000" className="input-field" aria-label={`R1 resistance for ${toolName}`} />
          </div>
          {mode === 'astable' && (
            <div>
              <label htmlFor={`${toolId}-r2`} className="block text-sm font-medium text-gray-700 mb-1">R2 (Ω)</label>
              <input id={`${toolId}-r2`} type="number" value={r2} onChange={(e) => setR2(e.target.value)} placeholder="1000" className="input-field" aria-label="R2 resistance" />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1">Capacitance (µF)</label>
            <input id={`${toolId}-c`} type="number" value={capacitance} onChange={(e) => setCapacitance(e.target.value)} placeholder="1" className="input-field" aria-label="Capacitance in microfarads" />
          </div>
        </div>

        <button onClick={calculate} className="btn-primary mt-3">Calculate</button>
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
