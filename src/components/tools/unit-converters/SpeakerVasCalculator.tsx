'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerVasCalculator - Calculate speaker equivalent compliance volume (Vas).
 */
export default function SpeakerVasCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sd, setSd] = useState('220');
  const [cms, setCms] = useState('0.5');
  const [fs, setFs] = useState('35');
  const [mms, setMms] = useState('30');
  const [method, setMethod] = useState('compliance');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const sdVal = parseFloat(sd) * 1e-4; // cm² to m²
    const cmsVal = parseFloat(cms) * 1e-3; // mm/N to m/N
    const fsVal = parseFloat(fs);
    const mmsVal = parseFloat(mms) * 1e-3; // g to kg

    if (isNaN(sdVal) || isNaN(cmsVal) || isNaN(fsVal) || isNaN(mmsVal)) {
      setOutput('Please enter valid values for all fields.');
      return;
    }

    // Air density and speed of sound
    const rho = 1.184; // kg/m³ at 25°C
    const c = 346.1; // m/s at 25°C

    let vas: number;

    if (method === 'compliance') {
      // Vas = ρ * c² * Sd² * Cms
      vas = rho * c * c * sdVal * sdVal * cmsVal;
    } else {
      // Vas from Fs and Mms: Cms = 1/(4π²Fs²Mms), then Vas = ρc²Sd²Cms
      const cmsCalc = 1 / (4 * Math.PI * Math.PI * fsVal * fsVal * mmsVal);
      vas = rho * c * c * sdVal * sdVal * cmsCalc;
    }

    const vasLiters = vas * 1000;
    const vasCubicFeet = vas * 35.3147;

    // Calculate Qts approximation (simplified)
    const cmsCalc = method === 'compliance' ? cmsVal : 1 / (4 * Math.PI * Math.PI * fsVal * fsVal * mmsVal);
    const fsCalc = 1 / (2 * Math.PI * Math.sqrt(mmsVal * cmsCalc));

    // Enclosure volume recommendations
    const sealedVol = vasLiters * 0.7;
    const ventedVol = vasLiters * 1.5;

    const result = `Speaker Vas (Equivalent Compliance Volume) Analysis
====================================================

Input Parameters:
  Effective Cone Area (Sd): ${sd} cm²
  Mechanical Compliance (Cms): ${cms} mm/N
  Resonant Frequency (Fs): ${fsVal.toFixed(1)} Hz
  Moving Mass (Mms): ${mms} g
  Calculation Method: ${method === 'compliance' ? 'From Compliance' : 'From Fs & Mms'}

Results:
  Vas: ${vasLiters.toFixed(2)} liters
  Vas: ${vasCubicFeet.toFixed(3)} ft³
  Vas: ${(vas * 1e6).toFixed(1)} cm³
  Calculated Fs: ${fsCalc.toFixed(1)} Hz

Enclosure Recommendations:
  Sealed Box (Qtc=0.707): ~${sealedVol.toFixed(1)} liters
  Vented Box (typical): ~${ventedVol.toFixed(1)} liters

Notes:
  • Larger Vas = more compliant suspension
  • Drivers with large Vas need larger enclosures
  • Vas is temperature-dependent (measured at 25°C)
  • For sealed boxes, Vb ≈ 0.7 × Vas gives Qtc ≈ 0.707`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-sd`} className="block text-sm font-medium text-gray-700 mb-1">Cone Area Sd (cm²)</label>
            <input id={`${toolId}-sd`} type="number" step="1" value={sd} onChange={(e) => setSd(e.target.value)} className="input-field" aria-label={`Cone area for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-cms`} className="block text-sm font-medium text-gray-700 mb-1">Compliance Cms (mm/N)</label>
            <input id={`${toolId}-cms`} type="number" step="0.01" value={cms} onChange={(e) => setCms(e.target.value)} className="input-field" aria-label="Mechanical compliance" />
          </div>
          <div>
            <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Resonant Frequency Fs (Hz)</label>
            <input id={`${toolId}-fs`} type="number" step="0.1" value={fs} onChange={(e) => setFs(e.target.value)} className="input-field" aria-label="Resonant frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mms`} className="block text-sm font-medium text-gray-700 mb-1">Moving Mass Mms (g)</label>
            <input id={`${toolId}-mms`} type="number" step="0.1" value={mms} onChange={(e) => setMms(e.target.value)} className="input-field" aria-label="Moving mass" />
          </div>
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
            <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value)} className="input-field" aria-label="Calculation method">
              <option value="compliance">From Compliance (Cms)</option>
              <option value="resonance">From Fs & Mms</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Vas</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Vas Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
