'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerRmsCalculator - Calculate speaker mechanical resistance (Rms)
 * from resonant frequency (Fs), moving mass (Mms), and Qms.
 */
export default function SpeakerRmsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fs, setFs] = useState('40');
  const [mms, setMms] = useState('20');
  const [qms, setQms] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fsVal = parseFloat(fs) || 40;
    const mmsVal = parseFloat(mms) || 20;
    const qmsVal = parseFloat(qms) || 5;

    if (fsVal <= 0 || mmsVal <= 0 || qmsVal <= 0) {
      setOutput('Error: All values must be greater than 0.');
      return;
    }

    // Rms = (2 * π * Fs * Mms) / Qms
    const mmsKg = mmsVal / 1000; // convert grams to kg
    const omega = 2 * Math.PI * fsVal;
    const rms = (omega * mmsKg) / qmsVal;

    // Classification
    let category = '';
    if (rms < 0.5) category = 'Very Low Damping (underdamped)';
    else if (rms < 1.5) category = 'Low Damping (typical woofer)';
    else if (rms < 3.0) category = 'Moderate Damping (midrange)';
    else if (rms < 6.0) category = 'High Damping (sealed enclosure)';
    else category = 'Very High Damping (heavily damped)';

    const result = `Speaker Mechanical Resistance (Rms) Calculation
═══════════════════════════════════════
Input Parameters:
  Resonant Frequency (Fs): ${fsVal} Hz
  Moving Mass (Mms): ${mmsVal} g (${mmsKg.toFixed(6)} kg)
  Mechanical Q (Qms): ${qmsVal}

Formula: Rms = (2π × Fs × Mms) / Qms

Calculation:
  ω = 2π × ${fsVal} = ${omega.toFixed(4)} rad/s
  Rms = (${omega.toFixed(4)} × ${mmsKg.toFixed(6)}) / ${qmsVal}

Results:
  Rms = ${rms.toFixed(4)} kg/s (N·s/m)
  Rms = ${(rms * 1000).toFixed(4)} g/s

Classification: ${category}

Notes:
- Rms represents energy lost to mechanical friction in the suspension
- Lower Rms means less damping (more resonant behavior)
- Higher Qms means lower mechanical losses
- Typical woofer Rms: 0.5 - 3.0 kg/s`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Resonant Frequency Fs (Hz)</label>
            <input id={`${toolId}-fs`} type="number" step="0.1" min="1" value={fs} onChange={(e) => setFs(e.target.value)} placeholder="40" aria-label={`Resonant frequency for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mms`} className="block text-sm font-medium text-gray-700 mb-1">Moving Mass Mms (grams)</label>
            <input id={`${toolId}-mms`} type="number" step="0.1" min="0.1" value={mms} onChange={(e) => setMms(e.target.value)} placeholder="20" aria-label="Moving mass in grams" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qms`} className="block text-sm font-medium text-gray-700 mb-1">Mechanical Q (Qms)</label>
            <input id={`${toolId}-qms`} type="number" step="0.1" min="0.1" value={qms} onChange={(e) => setQms(e.target.value)} placeholder="5" aria-label="Mechanical Q factor" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Rms</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Speaker Rms Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
