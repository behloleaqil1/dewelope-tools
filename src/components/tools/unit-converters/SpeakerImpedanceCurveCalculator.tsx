'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerImpedanceCurveCalculator - Calculate speaker impedance at a given frequency.
 * Uses the electrical model with Re, Le, Fs, Qes, and Qms parameters.
 */
export default function SpeakerImpedanceCurveCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [re, setRe] = useState('');
  const [le, setLe] = useState('');
  const [fs, setFs] = useState('');
  const [qes, setQes] = useState('');
  const [qms, setQms] = useState('');
  const [frequency, setFrequency] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const reVal = parseFloat(re);
    const leVal = parseFloat(le) / 1000; // mH to H
    const fsVal = parseFloat(fs);
    const qesVal = parseFloat(qes);
    const qmsVal = parseFloat(qms);
    const freq = parseFloat(frequency);

    if (isNaN(reVal) || isNaN(fsVal) || isNaN(qesVal) || isNaN(qmsVal)) {
      setOutput('Please enter valid Re, Fs, Qes, and Qms values.');
      return;
    }

    const qts = (qesVal * qmsVal) / (qesVal + qmsVal);

    // Calculate impedance at multiple frequencies
    const frequencies = freq ? [freq] : [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    let result = '=== Speaker Impedance Analysis ===\n\n';
    result += `DC Resistance (Re):      ${reVal.toFixed(2)} Ω\n`;
    result += `Voice Coil Inductance:   ${(leVal * 1000).toFixed(2)} mH\n`;
    result += `Resonant Frequency (Fs): ${fsVal.toFixed(1)} Hz\n`;
    result += `Electrical Q (Qes):      ${qesVal.toFixed(2)}\n`;
    result += `Mechanical Q (Qms):      ${qmsVal.toFixed(2)}\n`;
    result += `Total Q (Qts):           ${qts.toFixed(3)}\n\n`;

    if (freq) {
      const s = freq / fsVal;
      const xL = 2 * Math.PI * freq * leVal;
      const motionalR = zMotionalReal(s, reVal, qesVal, qmsVal);
      const motionalX = zMotionalImag(s, reVal, qesVal, qmsVal);
      const zMag = Math.sqrt(Math.pow(reVal + motionalR, 2) + Math.pow(xL + motionalX, 2));

      result += `--- Impedance at ${freq} Hz ---\n`;
      result += `|Z| = ${zMag.toFixed(2)} Ω\n`;
      result += `Phase angle ≈ ${(Math.atan2(xL + motionalX, reVal + motionalR) * 180 / Math.PI).toFixed(1)}°\n`;
    } else {
      result += `--- Impedance vs Frequency ---\n`;
      result += `${'Freq (Hz)'.padEnd(12)}${'|Z| (Ω)'.padEnd(12)}Notes\n`;
      result += `${'─'.repeat(40)}\n`;

      frequencies.forEach(f => {
        const s = f / fsVal;
        const xL = 2 * Math.PI * f * leVal;
        const motionalR = zMotionalReal(s, reVal, qesVal, qmsVal);
        const motionalX = zMotionalImag(s, reVal, qesVal, qmsVal);
        const zMag = Math.sqrt(Math.pow(reVal + motionalR, 2) + Math.pow(xL + motionalX, 2));

        let note = '';
        if (Math.abs(f - fsVal) < fsVal * 0.05) note = '← Resonance peak';
        if (f === 1000) note = '← Nominal impedance ref';

        result += `${f.toString().padEnd(12)}${zMag.toFixed(2).padEnd(12)}${note}\n`;
      });
    }

    result += `\n--- Design Notes ---\n`;
    result += `• Impedance peaks at Fs (${fsVal} Hz)\n`;
    result += `• Minimum impedance ≈ Re = ${reVal} Ω\n`;
    result += `• Nominal impedance typically rated at minimum\n`;
    result += `• Impedance rises at high frequencies due to Le\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-re`} className="block text-sm font-medium text-gray-700 mb-1">DC Resistance Re (Ω)</label>
              <input id={`${toolId}-re`} type="number" step="0.1" value={re} onChange={(e) => setRe(e.target.value)} placeholder="6.5" className="input-field" aria-label={`DC resistance for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-le`} className="block text-sm font-medium text-gray-700 mb-1">Inductance Le (mH)</label>
              <input id={`${toolId}-le`} type="number" step="0.01" value={le} onChange={(e) => setLe(e.target.value)} placeholder="0.5" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Fs (Hz)</label>
              <input id={`${toolId}-fs`} type="number" step="1" value={fs} onChange={(e) => setFs(e.target.value)} placeholder="45" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-qes`} className="block text-sm font-medium text-gray-700 mb-1">Qes</label>
              <input id={`${toolId}-qes`} type="number" step="0.01" value={qes} onChange={(e) => setQes(e.target.value)} placeholder="0.5" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-qms`} className="block text-sm font-medium text-gray-700 mb-1">Qms</label>
              <input id={`${toolId}-qms`} type="number" step="0.1" value={qms} onChange={(e) => setQms(e.target.value)} placeholder="5.0" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (Hz, leave empty for table)</label>
            <input id={`${toolId}-freq`} type="number" step="1" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="1000" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Impedance</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Impedance Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}

function zMotionalReal(s: number, re: number, qes: number, qms: number): number {
  const num = re * (s * s) / qes;
  const denom = Math.pow(s - 1 / s, 2) + Math.pow(s / qms, 2);
  return denom === 0 ? 0 : num * (1 / qms) / Math.sqrt(denom);
}

function zMotionalImag(s: number, re: number, qes: number, qms: number): number {
  const num = re * s * (s * s - 1) / (qes * s);
  const denom = Math.pow(s - 1 / s, 2) + Math.pow(1 / qms, 2);
  return denom === 0 ? 0 : num / (s * s / qms + qms);
}
