'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerEtaCalculator - Calculate speaker reference efficiency (η₀).
 * Uses Thiele-Small parameters to compute efficiency, sensitivity, and SPL.
 */
export default function SpeakerEtaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fs, setFs] = useState('40');
  const [qes, setQes] = useState('0.5');
  const [vas, setVas] = useState('50');
  const [re, setRe] = useState('6.5');
  const [sd, setSd] = useState('220');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fsVal = parseFloat(fs);
    const qesVal = parseFloat(qes);
    const vasVal = parseFloat(vas);
    const reVal = parseFloat(re);
    const sdVal = parseFloat(sd);

    if (isNaN(fsVal) || isNaN(qesVal) || isNaN(vasVal) || isNaN(reVal) || isNaN(sdVal)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    if (fsVal <= 0 || qesVal <= 0 || vasVal <= 0 || reVal <= 0 || sdVal <= 0) {
      setOutput('All values must be positive.');
      return;
    }

    // Reference efficiency: η₀ = (4π² × fs³ × Vas) / (c³ × Qes)
    const c = 343; // speed of sound m/s
    const vasM3 = vasVal / 1000; // liters to m³
    const eta0 = (4 * Math.PI * Math.PI * Math.pow(fsVal, 3) * vasM3) / (Math.pow(c, 3) * qesVal);
    const etaPercent = eta0 * 100;

    // Sensitivity (SPL at 1W/1m)
    const sensitivity = 112.2 + 10 * Math.log10(eta0);

    // Half-space sensitivity (typical mounting)
    const halfSpaceSPL = sensitivity + 3;

    // Electrical Q to Mechanical Q ratio estimate
    const qms = qesVal * 5; // typical ratio
    const qts = (qesVal * qms) / (qesVal + qms);

    // EBP (Efficiency Bandwidth Product)
    const ebp = fsVal / qesVal;

    // Recommended enclosure type based on EBP
    let enclosureRec = '';
    if (ebp < 50) enclosureRec = 'Sealed (acoustic suspension)';
    else if (ebp < 100) enclosureRec = 'Sealed or Vented';
    else enclosureRec = 'Vented (bass reflex)';

    const results = [
      `=== Speaker Reference Efficiency (η₀) ===`,
      ``,
      `Input Parameters:`,
      `  Fs (resonance): ${fsVal} Hz`,
      `  Qes (electrical Q): ${qesVal}`,
      `  Vas (compliance volume): ${vasVal} L`,
      `  Re (DC resistance): ${reVal} Ω`,
      `  Sd (cone area): ${sdVal} cm²`,
      ``,
      `Efficiency Results:`,
      `  Reference Efficiency (η₀): ${etaPercent.toFixed(4)}%`,
      `  η₀ (decimal): ${eta0.toFixed(6)}`,
      `  Sensitivity (1W/1m): ${sensitivity.toFixed(1)} dB SPL`,
      `  Half-space SPL: ${halfSpaceSPL.toFixed(1)} dB SPL`,
      ``,
      `Derived Parameters:`,
      `  Qts (estimated): ${qts.toFixed(3)}`,
      `  EBP (Fs/Qes): ${ebp.toFixed(1)}`,
      ``,
      `Recommendation:`,
      `  Enclosure Type: ${enclosureRec}`,
      ``,
      `Formula:`,
      `  η₀ = (4π² × Fs³ × Vas) / (c³ × Qes)`,
      `  Sensitivity = 112.2 + 10×log₁₀(η₀) dB/W/m`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Fs - Resonance Frequency (Hz)</label>
            <input id={`${toolId}-fs`} type="number" step="0.1" value={fs} onChange={(e) => setFs(e.target.value)} aria-label={`Resonance frequency for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qes`} className="block text-sm font-medium text-gray-700 mb-1">Qes - Electrical Q Factor</label>
            <input id={`${toolId}-qes`} type="number" step="0.01" value={qes} onChange={(e) => setQes(e.target.value)} aria-label="Electrical Q factor" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vas`} className="block text-sm font-medium text-gray-700 mb-1">Vas - Compliance Volume (Liters)</label>
            <input id={`${toolId}-vas`} type="number" step="0.1" value={vas} onChange={(e) => setVas(e.target.value)} aria-label="Compliance volume" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-re`} className="block text-sm font-medium text-gray-700 mb-1">Re - DC Resistance (Ω)</label>
            <input id={`${toolId}-re`} type="number" step="0.1" value={re} onChange={(e) => setRe(e.target.value)} aria-label="DC resistance" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sd`} className="block text-sm font-medium text-gray-700 mb-1">Sd - Cone Area (cm²)</label>
            <input id={`${toolId}-sd`} type="number" step="1" value={sd} onChange={(e) => setSd(e.target.value)} aria-label="Cone area" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Efficiency (η₀)</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Efficiency Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
