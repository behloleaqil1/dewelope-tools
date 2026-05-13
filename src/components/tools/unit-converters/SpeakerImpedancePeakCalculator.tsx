'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerImpedancePeakCalculator - Calculate speaker impedance peak at resonance.
 */
export default function SpeakerImpedancePeakCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [re, setRe] = useState('');
  const [qms, setQms] = useState('');
  const [qes, setQes] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const reVal = parseFloat(re);
    const qmsVal = parseFloat(qms);
    const qesVal = parseFloat(qes);

    if (isNaN(reVal) || isNaN(qmsVal) || isNaN(qesVal) || reVal <= 0 || qmsVal <= 0 || qesVal <= 0) return;

    // Impedance peak at resonance: Zmax = Re * (1 + Qms/Qes)
    // Qts = (Qms * Qes) / (Qms + Qes)
    const zMax = reVal * (1 + qmsVal / qesVal);
    const qts = (qmsVal * qesVal) / (qmsVal + qesVal);
    const peakRatio = zMax / reVal;

    const results = [
      `DC Resistance (Re): ${reVal.toFixed(2)} Ω`,
      `Mechanical Q (Qms): ${qmsVal.toFixed(2)}`,
      `Electrical Q (Qes): ${qesVal.toFixed(2)}`,
      ``,
      `Results:`,
      `  Impedance Peak (Zmax): ${zMax.toFixed(2)} Ω`,
      `  Total Q (Qts): ${qts.toFixed(4)}`,
      `  Peak-to-DC Ratio: ${peakRatio.toFixed(2)}x`,
      ``,
      `Formulas:`,
      `  Zmax = Re × (1 + Qms/Qes)`,
      `  Qts = (Qms × Qes) / (Qms + Qes)`,
      ``,
      `Notes:`,
      `  - Higher Qms/Qes ratio = sharper impedance peak`,
      `  - Typical peak ratios: 5x-20x for woofers`,
      `  - Amplifier must handle impedance variations`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-re`} className="block text-sm font-medium text-gray-700 mb-1">DC Resistance Re (Ω)</label>
            <input id={`${toolId}-re`} type="number" value={re} onChange={(e) => setRe(e.target.value)} placeholder="6.5" aria-label={`DC resistance for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qms`} className="block text-sm font-medium text-gray-700 mb-1">Mechanical Q (Qms)</label>
            <input id={`${toolId}-qms`} type="number" value={qms} onChange={(e) => setQms(e.target.value)} placeholder="5.0" aria-label="Mechanical Q factor" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qes`} className="block text-sm font-medium text-gray-700 mb-1">Electrical Q (Qes)</label>
            <input id={`${toolId}-qes`} type="number" value={qes} onChange={(e) => setQes(e.target.value)} placeholder="0.5" aria-label="Electrical Q factor" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate Impedance Peak</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Impedance Peak Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
