'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerLeCalculator - Calculate speaker voice coil inductance (Le).
 */
export default function SpeakerLeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [impedanceAt1k, setImpedanceAt1k] = useState('6.5');
  const [impedanceAt10k, setImpedanceAt10k] = useState('12');
  const [dcResistance, setDcResistance] = useState('5.5');
  const [frequency, setFrequency] = useState('1000');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const z1k = parseFloat(impedanceAt1k);
    const z10k = parseFloat(impedanceAt10k);
    const re = parseFloat(dcResistance);
    const f = parseFloat(frequency);

    if (isNaN(z1k) || isNaN(z10k) || isNaN(re) || isNaN(f)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Le estimation from impedance rise: Z = sqrt(Re² + (2πfLe)²)
    // Le = sqrt(Z² - Re²) / (2πf)
    const reactance1k = Math.sqrt(Math.max(0, z1k * z1k - re * re));
    const le1k = reactance1k / (2 * Math.PI * 1000) * 1000; // in mH

    const reactance10k = Math.sqrt(Math.max(0, z10k * z10k - re * re));
    const le10k = reactance10k / (2 * Math.PI * 10000) * 1000; // in mH

    const reactanceF = Math.sqrt(Math.max(0, z1k * z1k - re * re));
    const leAtF = reactanceF / (2 * Math.PI * f) * 1000; // in mH

    const result = `Speaker Voice Coil Inductance (Le)
═══════════════════════════════════
DC Resistance (Re):    ${re} Ω
Impedance at 1 kHz:    ${z1k} Ω
Impedance at 10 kHz:   ${z10k} Ω

Results
───────────────────────────────────
Le at 1 kHz:           ${le1k.toFixed(3)} mH
Le at 10 kHz:          ${le10k.toFixed(3)} mH
Le at ${f} Hz:         ${leAtF.toFixed(3)} mH

Reactance at 1 kHz:    ${reactance1k.toFixed(3)} Ω
Reactance at 10 kHz:   ${reactance10k.toFixed(3)} Ω

Assessment:
${le1k < 0.5 ? '✓ Low inductance - good high-frequency response' : le1k < 1.5 ? '○ Moderate inductance - typical for mid-range drivers' : '△ High inductance - may limit high-frequency output'}

Note: Lower Le values indicate better high-frequency
performance and reduced intermodulation distortion.`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-re`} className="block text-sm font-medium text-gray-700 mb-1">DC Resistance Re (Ω)</label>
              <input id={`${toolId}-re`} type="number" step="0.1" value={dcResistance} onChange={(e) => setDcResistance(e.target.value)} className="input-field" aria-label={`DC resistance for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Test Frequency (Hz)</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Test frequency" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-z1k`} className="block text-sm font-medium text-gray-700 mb-1">Impedance at 1 kHz (Ω)</label>
              <input id={`${toolId}-z1k`} type="number" step="0.1" value={impedanceAt1k} onChange={(e) => setImpedanceAt1k(e.target.value)} className="input-field" aria-label="Impedance at 1kHz" />
            </div>
            <div>
              <label htmlFor={`${toolId}-z10k`} className="block text-sm font-medium text-gray-700 mb-1">Impedance at 10 kHz (Ω)</label>
              <input id={`${toolId}-z10k`} type="number" step="0.1" value={impedanceAt10k} onChange={(e) => setImpedanceAt10k(e.target.value)} className="input-field" aria-label="Impedance at 10kHz" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Le</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Inductance Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
