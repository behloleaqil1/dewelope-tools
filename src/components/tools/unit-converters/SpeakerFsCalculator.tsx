'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SpeakerFsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [method, setMethod] = useState('mass-compliance');
  const [mms, setMms] = useState('20');
  const [cms, setCms] = useState('1.2');
  const [addedMass, setAddedMass] = useState('5');
  const [f1, setF1] = useState('35');
  const [f2, setF2] = useState('28');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let fs: number;
    let details = '';

    if (method === 'mass-compliance') {
      const mmsVal = parseFloat(mms) / 1000; // convert g to kg
      const cmsVal = parseFloat(cms) / 1000; // convert mm/N to m/N

      if (isNaN(mmsVal) || isNaN(cmsVal) || mmsVal <= 0 || cmsVal <= 0) {
        setOutput('Please enter valid positive values for Mms and Cms.');
        return;
      }

      fs = 1 / (2 * Math.PI * Math.sqrt(mmsVal * cmsVal));

      const kms = 1 / cmsVal; // mechanical stiffness
      const omega = 2 * Math.PI * fs;

      details = `Calculation Method: Mass & Compliance
═══════════════════════════════════════

Input Parameters:
  Moving Mass (Mms):          ${mms} g (${(mmsVal * 1000).toFixed(3)} g)
  Mechanical Compliance (Cms): ${cms} mm/N (${(cmsVal * 1000).toFixed(4)} mm/N)

Derived Parameters:
  Mechanical Stiffness (Kms): ${kms.toFixed(2)} N/m
  Angular Frequency (ω₀):    ${omega.toFixed(2)} rad/s

Result:
  ┌─────────────────────────────────────┐
  │ Free-Air Resonance (Fs): ${fs.toFixed(2).padStart(8)} Hz │
  └─────────────────────────────────────┘

Formula: Fs = 1 / (2π × √(Mms × Cms))
       = 1 / (2π × √(${(mmsVal * 1000).toFixed(3)}e-3 × ${(cmsVal * 1000).toFixed(4)}e-3))
       = ${fs.toFixed(4)} Hz`;
    } else {
      const massAdded = parseFloat(addedMass) / 1000; // g to kg
      const freq1 = parseFloat(f1);
      const freq2 = parseFloat(f2);

      if (isNaN(massAdded) || isNaN(freq1) || isNaN(freq2) || massAdded <= 0 || freq1 <= 0 || freq2 <= 0) {
        setOutput('Please enter valid positive values.');
        return;
      }

      // Added mass method: Mms = Madded / ((f1/f2)² - 1)
      const mmsCalc = massAdded / ((freq1 / freq2) ** 2 - 1);
      fs = freq1; // f1 is the original Fs

      // Calculate Cms from Fs and Mms
      const cmsCalc = 1 / ((2 * Math.PI * fs) ** 2 * mmsCalc);

      details = `Calculation Method: Added Mass
═══════════════════════════════════════

Input Parameters:
  Original Resonance (f1):  ${f1} Hz
  Loaded Resonance (f2):    ${f2} Hz
  Added Mass:               ${addedMass} g

Derived Parameters:
  Moving Mass (Mms):        ${(mmsCalc * 1000).toFixed(3)} g
  Compliance (Cms):         ${(cmsCalc * 1000).toFixed(4)} mm/N
  Mass Ratio (f1/f2)²:      ${((freq1 / freq2) ** 2).toFixed(4)}

Result:
  ┌─────────────────────────────────────┐
  │ Free-Air Resonance (Fs): ${fs.toFixed(2).padStart(8)} Hz │
  │ Calculated Mms:          ${(mmsCalc * 1000).toFixed(2).padStart(8)} g  │
  └─────────────────────────────────────┘

Formula: Mms = M_added / ((f1/f2)² - 1)
       = ${addedMass}e-3 / ((${f1}/${f2})² - 1)
       = ${(mmsCalc * 1000).toFixed(4)} g`;
    }

    details += `\n\nDesign Guidance:
  Typical Qts (assumed):    0.4
  Suggested Enclosure:      ${fs < 40 ? 'Vented/Bass Reflex' : fs < 80 ? 'Sealed or Vented' : 'Sealed (compact)'}
  Low Fs (< 40 Hz):         Better for deep bass extension
  High Fs (> 80 Hz):        Better for midrange/compact designs`;

    setOutput(details);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
            <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value)} className="input-field" aria-label={`Calculation method for ${toolName}`}>
              <option value="mass-compliance">From Mass & Compliance (Mms, Cms)</option>
              <option value="added-mass">Added Mass Method (f1, f2, M_added)</option>
            </select>
          </div>

          {method === 'mass-compliance' ? (
            <>
              <div>
                <label htmlFor={`${toolId}-mms`} className="block text-sm font-medium text-gray-700 mb-1">Moving Mass Mms (g)</label>
                <input id={`${toolId}-mms`} type="number" value={mms} onChange={(e) => setMms(e.target.value)} className="input-field" aria-label="Moving mass" />
              </div>
              <div>
                <label htmlFor={`${toolId}-cms`} className="block text-sm font-medium text-gray-700 mb-1">Compliance Cms (mm/N)</label>
                <input id={`${toolId}-cms`} type="number" value={cms} onChange={(e) => setCms(e.target.value)} className="input-field" aria-label="Mechanical compliance" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor={`${toolId}-f1`} className="block text-sm font-medium text-gray-700 mb-1">Original Resonance f1 (Hz)</label>
                <input id={`${toolId}-f1`} type="number" value={f1} onChange={(e) => setF1(e.target.value)} className="input-field" aria-label="Original resonance frequency" />
              </div>
              <div>
                <label htmlFor={`${toolId}-f2`} className="block text-sm font-medium text-gray-700 mb-1">Loaded Resonance f2 (Hz)</label>
                <input id={`${toolId}-f2`} type="number" value={f2} onChange={(e) => setF2(e.target.value)} className="input-field" aria-label="Loaded resonance frequency" />
              </div>
              <div>
                <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Added Mass (g)</label>
                <input id={`${toolId}-mass`} type="number" value={addedMass} onChange={(e) => setAddedMass(e.target.value)} className="input-field" aria-label="Added mass" />
              </div>
            </>
          )}
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Fs</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Speaker Fs Calculation</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
