'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OscillatorFrequencyCalculator - Calculate LC oscillator resonant frequency.
 * Uses the formula f = 1 / (2π√(LC)) for LC tank circuits.
 */
export default function OscillatorFrequencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inductance, setInductance] = useState('');
  const [capacitance, setCapacitance] = useState('');
  const [inductanceUnit, setInductanceUnit] = useState('uH');
  const [capacitanceUnit, setCapacitanceUnit] = useState('pF');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const L = parseFloat(inductance);
    const C = parseFloat(capacitance);

    if (isNaN(L) || isNaN(C)) {
      setOutput('Please enter valid inductance and capacitance values.');
      return;
    }

    if (L <= 0 || C <= 0) {
      setOutput('Both inductance and capacitance must be positive.');
      return;
    }

    // Convert to base units (Henries and Farads)
    const inductanceMultipliers: Record<string, number> = {
      'H': 1, 'mH': 1e-3, 'uH': 1e-6, 'nH': 1e-9,
    };
    const capacitanceMultipliers: Record<string, number> = {
      'F': 1, 'mF': 1e-3, 'uF': 1e-6, 'nF': 1e-9, 'pF': 1e-12,
    };

    const lHenries = L * inductanceMultipliers[inductanceUnit];
    const cFarads = C * capacitanceMultipliers[capacitanceUnit];

    // f = 1 / (2π√(LC))
    const freqHz = 1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads));

    let freqDisplay = '';
    if (freqHz >= 1e9) freqDisplay = `${(freqHz / 1e9).toFixed(4)} GHz`;
    else if (freqHz >= 1e6) freqDisplay = `${(freqHz / 1e6).toFixed(4)} MHz`;
    else if (freqHz >= 1e3) freqDisplay = `${(freqHz / 1e3).toFixed(4)} kHz`;
    else freqDisplay = `${freqHz.toFixed(4)} Hz`;

    const angularFreq = 2 * Math.PI * freqHz;
    const period = 1 / freqHz;
    const wavelength = 299792458 / freqHz;
    const impedance = Math.sqrt(lHenries / cFarads);

    const lines = [
      '═══ LC Oscillator Resonant Frequency ═══',
      '',
      `Inductance (L):   ${L} ${inductanceUnit} = ${lHenries.toExponential(4)} H`,
      `Capacitance (C):  ${C} ${capacitanceUnit} = ${cFarads.toExponential(4)} F`,
      '',
      '── Results ──',
      `  Resonant Frequency:    ${freqDisplay}`,
      `  Frequency (Hz):        ${freqHz.toExponential(6)} Hz`,
      `  Angular Frequency (ω): ${angularFreq.toExponential(4)} rad/s`,
      `  Period (T):             ${period.toExponential(4)} s`,
      `  Wavelength (λ):        ${wavelength >= 1 ? wavelength.toFixed(2) + ' m' : (wavelength * 100).toFixed(2) + ' cm'}`,
      `  Characteristic Impedance: ${impedance.toFixed(2)} Ω`,
      '',
      '── Formula ──',
      '  f = 1 / (2π√(LC))',
      `  f = 1 / (2π × √(${lHenries.toExponential(3)} × ${cFarads.toExponential(3)}))`,
      `  f = ${freqDisplay}`,
      '',
      '── Notes ──',
      '• This is the natural resonant frequency of an ideal LC tank circuit.',
      '• Real circuits have losses (resistance) that lower the actual frequency slightly.',
      '• Used in Colpitts, Hartley, and Clapp oscillator designs.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-inductance`} className="block text-sm font-medium text-gray-700 mb-1">
                Inductance
              </label>
              <input
                id={`${toolId}-inductance`}
                type="number"
                step="any"
                value={inductance}
                onChange={(e) => setInductance(e.target.value)}
                placeholder="e.g. 10"
                className="input-field"
                aria-label={`Inductance value for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-l-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Inductance Unit
              </label>
              <select id={`${toolId}-l-unit`} value={inductanceUnit} onChange={(e) => setInductanceUnit(e.target.value)} className="input-field" aria-label="Inductance unit">
                <option value="H">H (Henries)</option>
                <option value="mH">mH (millihenries)</option>
                <option value="uH">µH (microhenries)</option>
                <option value="nH">nH (nanohenries)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-capacitance`} className="block text-sm font-medium text-gray-700 mb-1">
                Capacitance
              </label>
              <input
                id={`${toolId}-capacitance`}
                type="number"
                step="any"
                value={capacitance}
                onChange={(e) => setCapacitance(e.target.value)}
                placeholder="e.g. 100"
                className="input-field"
                aria-label="Capacitance value"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-c-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Capacitance Unit
              </label>
              <select id={`${toolId}-c-unit`} value={capacitanceUnit} onChange={(e) => setCapacitanceUnit(e.target.value)} className="input-field" aria-label="Capacitance unit">
                <option value="F">F (Farads)</option>
                <option value="mF">mF (millifarads)</option>
                <option value="uF">µF (microfarads)</option>
                <option value="nF">nF (nanofarads)</option>
                <option value="pF">pF (picofarads)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate resonant frequency">
            Calculate Frequency
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Oscillator Frequency Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
