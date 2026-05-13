'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerCmsCalculator - Calculate speaker mechanical compliance (Cms)
 * from resonant frequency and moving mass.
 */
export default function SpeakerCmsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fs, setFs] = useState('');
  const [mms, setMms] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fsVal = parseFloat(fs);
    const mmsVal = parseFloat(mms);

    if (!fsVal || fsVal <= 0 || !mmsVal || mmsVal <= 0) {
      setOutput('Error: Please enter valid positive values for Fs and Mms.');
      return;
    }

    // Cms = 1 / ((2 * pi * Fs)^2 * Mms)
    const mmsKg = mmsVal / 1000; // convert grams to kg
    const omega = 2 * Math.PI * fsVal;
    const cms = 1 / (omega * omega * mmsKg); // in m/N
    const cmsMmN = cms * 1000; // convert to mm/N

    let category = '';
    if (cmsMmN > 2.0) category = 'Very compliant (subwoofer/woofer)';
    else if (cmsMmN > 1.0) category = 'Moderately compliant (mid-woofer)';
    else if (cmsMmN > 0.3) category = 'Stiff (midrange)';
    else category = 'Very stiff (tweeter/compression driver)';

    const result = `Speaker Mechanical Compliance (Cms)
═══════════════════════════════════════
Input Parameters:
  Resonant Frequency (Fs): ${fsVal} Hz
  Moving Mass (Mms): ${mmsVal} g (${mmsKg.toFixed(6)} kg)

Results:
  Cms: ${cms.toExponential(4)} m/N
  Cms: ${cmsMmN.toFixed(4)} mm/N
  
  ω (angular frequency): ${omega.toFixed(2)} rad/s
  
Driver Category: ${category}

Formula: Cms = 1 / ((2π × Fs)² × Mms)
Note: Higher Cms means more compliant suspension (lower Fs for given mass)`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Resonant Frequency Fs (Hz)</label>
            <input id={`${toolId}-fs`} type="number" min="1" step="0.1" value={fs} onChange={(e) => setFs(e.target.value)} placeholder="e.g. 35" aria-label={`Resonant frequency for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mms`} className="block text-sm font-medium text-gray-700 mb-1">Moving Mass Mms (grams)</label>
            <input id={`${toolId}-mms`} type="number" min="0.1" step="0.1" value={mms} onChange={(e) => setMms(e.target.value)} placeholder="e.g. 45" aria-label="Moving mass in grams" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Cms</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cms Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
