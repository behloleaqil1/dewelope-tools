'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MixerCalculator - Calculate RF mixer output frequencies.
 * Computes sum and difference frequencies from RF and LO inputs.
 */
export default function MixerCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rfFreq, setRfFreq] = useState('');
  const [loFreq, setLoFreq] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rf = parseFloat(rfFreq);
    const lo = parseFloat(loFreq);

    if (isNaN(rf) || isNaN(lo) || rf <= 0 || lo <= 0) {
      setOutput('Please enter valid positive frequencies.');
      return;
    }

    const sum = rf + lo;
    const diff = Math.abs(rf - lo);
    const ifHigh = Math.max(rf, lo) - Math.min(rf, lo);

    const lines = [
      '═══ RF Mixer Output Frequencies ═══',
      '',
      `RF Input:  ${rf} MHz`,
      `LO Input:  ${lo} MHz`,
      '',
      '── Primary Outputs ──',
      `  Sum (RF + LO):        ${sum.toFixed(4)} MHz`,
      `  Difference |RF - LO|: ${diff.toFixed(4)} MHz`,
      '',
      '── Upconversion ──',
      `  IF = RF + LO = ${sum.toFixed(4)} MHz`,
      '',
      '── Downconversion ──',
      `  IF = |RF - LO| = ${ifHigh.toFixed(4)} MHz`,
      '',
      '── Harmonics (2nd Order) ──',
      `  2×RF + LO = ${(2 * rf + lo).toFixed(4)} MHz`,
      `  2×RF - LO = ${Math.abs(2 * rf - lo).toFixed(4)} MHz`,
      `  RF + 2×LO = ${(rf + 2 * lo).toFixed(4)} MHz`,
      `  RF - 2×LO = ${Math.abs(rf - 2 * lo).toFixed(4)} MHz`,
      '',
      '── Image Frequency ──',
      `  Image (LO + IF): ${(lo + diff).toFixed(4)} MHz`,
      `  Image (LO - IF): ${Math.abs(lo - diff).toFixed(4)} MHz`,
      '',
      '── Notes ──',
      '• A mixer produces sum and difference of input frequencies.',
      '• Unwanted products must be filtered at the output.',
      '• Image rejection is critical in receiver design.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-rf`} className="block text-sm font-medium text-gray-700 mb-1">
              RF Frequency (MHz)
            </label>
            <input
              id={`${toolId}-rf`}
              type="number"
              step="any"
              value={rfFreq}
              onChange={(e) => setRfFreq(e.target.value)}
              placeholder="e.g. 915"
              className="input-field"
              aria-label={`RF frequency for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-lo`} className="block text-sm font-medium text-gray-700 mb-1">
              LO Frequency (MHz)
            </label>
            <input
              id={`${toolId}-lo`}
              type="number"
              step="any"
              value={loFreq}
              onChange={(e) => setLoFreq(e.target.value)}
              placeholder="e.g. 900"
              className="input-field"
              aria-label="LO frequency"
            />
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate mixer outputs">
            Calculate Mixer Outputs
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mixer Output Frequencies</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
