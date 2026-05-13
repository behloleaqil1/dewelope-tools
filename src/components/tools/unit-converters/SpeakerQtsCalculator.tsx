'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerQtsCalculator - Calculate speaker total Q factor (Qts).
 * Computes Qts from Qes and Qms using the parallel combination formula.
 */
export default function SpeakerQtsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [qes, setQes] = useState('0.45');
  const [qms, setQms] = useState('3.5');
  const [fs, setFs] = useState('35');
  const [vas, setVas] = useState('25');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const qesVal = parseFloat(qes);
    const qmsVal = parseFloat(qms);
    const fsVal = parseFloat(fs);
    const vasVal = parseFloat(vas);

    if ([qesVal, qmsVal].some(isNaN) || qesVal <= 0 || qmsVal <= 0) {
      setOutput('Error: Qes and Qms must be positive numbers.');
      return;
    }

    // Qts = (Qes * Qms) / (Qes + Qms)
    const qts = (qesVal * qmsVal) / (qesVal + qmsVal);

    // Efficiency bandwidth product (EBP) = Fs / Qes
    const ebp = !isNaN(fsVal) && fsVal > 0 ? fsVal / qesVal : null;

    // Determine enclosure recommendation
    let recommendation = '';
    if (qts < 0.3) {
      recommendation = 'Very low Qts - best suited for horn-loaded enclosures';
    } else if (qts < 0.4) {
      recommendation = 'Low Qts - well suited for vented/ported enclosures';
    } else if (qts < 0.5) {
      recommendation = 'Moderate Qts - versatile, works in sealed or vented enclosures';
    } else if (qts < 0.7) {
      recommendation = 'Higher Qts - best suited for sealed enclosures';
    } else {
      recommendation = 'High Qts - sealed enclosure or free-air/infinite baffle recommended';
    }

    const results = [
      `=== Speaker Qts Calculation ===`,
      ``,
      `--- Input Parameters ---`,
      `Qes (Electrical Q): ${qesVal}`,
      `Qms (Mechanical Q): ${qmsVal}`,
      ...(fsVal > 0 ? [`Fs (Resonant Frequency): ${fsVal} Hz`] : []),
      ...(vasVal > 0 ? [`Vas (Equivalent Volume): ${vasVal} L`] : []),
      ``,
      `--- Results ---`,
      `Qts (Total Q): ${qts.toFixed(4)}`,
      `Formula: Qts = (Qes × Qms) / (Qes + Qms)`,
      `Qts = (${qesVal} × ${qmsVal}) / (${qesVal} + ${qmsVal}) = ${qts.toFixed(4)}`,
      ``,
      ...(ebp !== null ? [`EBP (Efficiency Bandwidth Product): ${ebp.toFixed(1)} Hz`] : []),
      ...(ebp !== null ? [ebp > 100 ? `EBP > 100: Suggests vented enclosure` : `EBP < 100: Suggests sealed enclosure`] : []),
      ``,
      `--- Enclosure Recommendation ---`,
      recommendation,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-qes`} className="block text-sm font-medium text-gray-700 mb-1">Qes (Electrical Q)</label>
              <input id={`${toolId}-qes`} type="number" step="0.01" value={qes} onChange={e => setQes(e.target.value)} className="input-field" aria-label={`Qes for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-qms`} className="block text-sm font-medium text-gray-700 mb-1">Qms (Mechanical Q)</label>
              <input id={`${toolId}-qms`} type="number" step="0.01" value={qms} onChange={e => setQms(e.target.value)} className="input-field" aria-label="Qms value" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Fs - Resonant Frequency (Hz, optional)</label>
              <input id={`${toolId}-fs`} type="number" step="0.1" value={fs} onChange={e => setFs(e.target.value)} className="input-field" aria-label="Resonant frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vas`} className="block text-sm font-medium text-gray-700 mb-1">Vas - Equivalent Volume (L, optional)</label>
              <input id={`${toolId}-vas`} type="number" step="0.1" value={vas} onChange={e => setVas(e.target.value)} className="input-field" aria-label="Equivalent volume" />
            </div>
          </div>
          <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Calculate Qts</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Qts Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
