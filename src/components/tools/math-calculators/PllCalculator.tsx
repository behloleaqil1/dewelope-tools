'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PllCalculator - Calculate PLL (Phase-Locked Loop) output frequency.
 * Uses formula: Fout = Fref × (N / (M × P)) where N is feedback divider,
 * M is reference divider, and P is output divider.
 */
export default function PllCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [refFreq, setRefFreq] = useState('25');
  const [refUnit, setRefUnit] = useState('MHz');
  const [feedbackDiv, setFeedbackDiv] = useState('40');
  const [refDiv, setRefDiv] = useState('1');
  const [outputDiv, setOutputDiv] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fRef = parseFloat(refFreq);
    const n = parseInt(feedbackDiv);
    const m = parseInt(refDiv);
    const p = parseInt(outputDiv);

    if (isNaN(fRef) || isNaN(n) || isNaN(m) || isNaN(p) || m === 0 || p === 0) {
      setOutput('Please enter valid values. Dividers cannot be zero.');
      return;
    }

    const multipliers: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
    const refHz = fRef * (multipliers[refUnit] || 1e6);
    const vcoHz = refHz * (n / m);
    const outHz = vcoHz / p;

    const formatFreq = (hz: number) => {
      if (hz >= 1e9) return `${(hz / 1e9).toFixed(6)} GHz`;
      if (hz >= 1e6) return `${(hz / 1e6).toFixed(6)} MHz`;
      if (hz >= 1e3) return `${(hz / 1e3).toFixed(6)} kHz`;
      return `${hz.toFixed(2)} Hz`;
    };

    const phaseDetFreq = refHz / m;

    const lines = [
      `=== PLL Output Frequency Calculator ===`,
      ``,
      `Reference Frequency: ${fRef} ${refUnit} (${formatFreq(refHz)})`,
      `Feedback Divider (N): ${n}`,
      `Reference Divider (M): ${m}`,
      `Output Divider (P): ${p}`,
      ``,
      `--- Results ---`,
      `Phase Detector Frequency: ${formatFreq(phaseDetFreq)}`,
      `VCO Frequency: ${formatFreq(vcoHz)}`,
      `Output Frequency: ${formatFreq(outHz)}`,
      ``,
      `--- Formula ---`,
      `Fout = (Fref / M) × N / P`,
      `Fout = (${fRef} ${refUnit} / ${m}) × ${n} / ${p}`,
      `Fout = ${formatFreq(outHz)}`,
      ``,
      `Multiplication Factor: ${(n / (m * p)).toFixed(4)}x`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-ref`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference Frequency
            </label>
            <input
              id={`${toolId}-ref`}
              type="number"
              value={refFreq}
              onChange={(e) => setRefFreq(e.target.value)}
              className="input-field"
              aria-label={`Reference frequency for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id={`${toolId}-unit`}
              value={refUnit}
              onChange={(e) => setRefUnit(e.target.value)}
              className="input-field"
              aria-label="Frequency unit"
            >
              <option value="Hz">Hz</option>
              <option value="kHz">kHz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Divider (N)
            </label>
            <input
              id={`${toolId}-n`}
              type="number"
              value={feedbackDiv}
              onChange={(e) => setFeedbackDiv(e.target.value)}
              className="input-field"
              aria-label="Feedback divider N"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-m`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference Divider (M)
            </label>
            <input
              id={`${toolId}-m`}
              type="number"
              value={refDiv}
              onChange={(e) => setRefDiv(e.target.value)}
              className="input-field"
              aria-label="Reference divider M"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-p`} className="block text-sm font-medium text-gray-700 mb-1">
              Output Divider (P)
            </label>
            <input
              id={`${toolId}-p`}
              type="number"
              value={outputDiv}
              onChange={(e) => setOutputDiv(e.target.value)}
              className="input-field"
              aria-label="Output divider P"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">
          Calculate PLL Output
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">PLL Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
