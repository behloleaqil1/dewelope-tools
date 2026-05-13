'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerThieleSmallCalculator - Calculate Thiele-Small speaker parameters.
 * Computes Vas, Qts, efficiency, and recommended enclosure type from driver measurements.
 */
export default function SpeakerThieleSmallCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fs, setFs] = useState('40');
  const [qes, setQes] = useState('0.5');
  const [qms, setQms] = useState('3.0');
  const [vas, setVas] = useState('30');
  const [sd, setSd] = useState('220');
  const [xmax, setXmax] = useState('6');
  const [re, setRe] = useState('6.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fsVal = parseFloat(fs);
    const qesVal = parseFloat(qes);
    const qmsVal = parseFloat(qms);
    const vasVal = parseFloat(vas);
    const sdVal = parseFloat(sd) * 1e-4; // cm² to m²
    const xmaxVal = parseFloat(xmax) * 1e-3; // mm to m
    const reVal = parseFloat(re);

    if ([fsVal, qesVal, qmsVal, vasVal, sdVal, xmaxVal, reVal].some((v) => isNaN(v) || v <= 0)) {
      setOutput('Please enter valid positive values for all parameters.');
      return;
    }

    // Qts = (Qes * Qms) / (Qes + Qms)
    const qts = (qesVal * qmsVal) / (qesVal + qmsVal);

    // Efficiency bandwidth product (EBP) = Fs / Qes
    const ebp = fsVal / qesVal;

    // Reference efficiency (η₀)
    const eta0 = (4 * Math.PI * Math.PI * fsVal * fsVal * fsVal * vasVal * 1e-3) / (Math.pow(343, 3) * qesVal);
    const etaPercent = eta0 * 100;

    // Sensitivity (dB SPL/W/m)
    const sensitivity = 112.2 + 10 * Math.log10(eta0);

    // Vd (volume displacement)
    const vd = sdVal * xmaxVal * 1000; // liters

    // Recommended enclosure
    let enclosureType = '';
    if (ebp > 100) {
      enclosureType = 'Bass Reflex (Vented)';
    } else if (ebp < 50) {
      enclosureType = 'Sealed (Acoustic Suspension)';
    } else {
      enclosureType = 'Either Sealed or Bass Reflex';
    }

    // Sealed box volume estimate (Qtc = 0.707)
    const qtcTarget = 0.707;
    const alpha = Math.pow(qtcTarget / qts, 2) - 1;
    const vbSealed = vasVal / alpha;

    // Ported box volume estimate
    const vbPorted = vasVal * 1.5; // rough estimate

    const results = [
      '=== Thiele-Small Parameters ===',
      '',
      `Fs (resonant frequency): ${fsVal} Hz`,
      `Qes (electrical Q): ${qesVal}`,
      `Qms (mechanical Q): ${qmsVal}`,
      `Qts (total Q): ${qts.toFixed(3)}`,
      `Vas (compliance volume): ${vasVal} L`,
      `Sd (cone area): ${(sdVal * 1e4).toFixed(1)} cm²`,
      `Xmax (excursion): ${xmax} mm`,
      `Re (DC resistance): ${reVal} Ω`,
      '',
      '--- Derived Parameters ---',
      `EBP (Efficiency Bandwidth Product): ${ebp.toFixed(1)}`,
      `Reference Efficiency (η₀): ${etaPercent.toFixed(3)}%`,
      `Sensitivity: ${sensitivity.toFixed(1)} dB SPL/W/m`,
      `Volume Displacement (Vd): ${(vd * 1000).toFixed(1)} cm³`,
      '',
      '--- Enclosure Recommendation ---',
      `Suggested Type: ${enclosureType}`,
      `Sealed Box Volume (Qtc=0.707): ${vbSealed.toFixed(1)} L`,
      `Ported Box Volume (estimate): ${vbPorted.toFixed(1)} L`,
      '',
      '--- Guidelines ---',
      `Qts < 0.4: Best for bass reflex`,
      `Qts 0.4-0.7: Works in either`,
      `Qts > 0.7: Best for sealed`,
      `Your Qts: ${qts.toFixed(3)}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fs - Resonant Frequency (Hz)</label>
            <input type="number" value={fs} onChange={(e) => setFs(e.target.value)} className="input-field" aria-label={`Resonant frequency for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qes - Electrical Q</label>
            <input type="number" value={qes} onChange={(e) => setQes(e.target.value)} step="0.01" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qms - Mechanical Q</label>
            <input type="number" value={qms} onChange={(e) => setQms(e.target.value)} step="0.01" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vas - Compliance Volume (L)</label>
            <input type="number" value={vas} onChange={(e) => setVas(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sd - Cone Area (cm²)</label>
            <input type="number" value={sd} onChange={(e) => setSd(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xmax - Excursion (mm)</label>
            <input type="number" value={xmax} onChange={(e) => setXmax(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Re - DC Resistance (Ω)</label>
            <input type="number" value={re} onChange={(e) => setRe(e.target.value)} step="0.1" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thiele-Small Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
