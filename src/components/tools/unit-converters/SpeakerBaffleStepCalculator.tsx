'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerBaffleStepCalculator - Calculate baffle step compensation frequency
 * and design a compensation circuit for speaker enclosures.
 */
export default function SpeakerBaffleStepCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baffleWidth, setBaffleWidth] = useState('30');
  const [speakerImpedance, setSpeakerImpedance] = useState('8');
  const [compensationType, setCompensationType] = useState('series');
  const [attenuationDb, setAttenuationDb] = useState('6');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const width = parseFloat(baffleWidth);
    const impedance = parseFloat(speakerImpedance);
    const attenuation = parseFloat(attenuationDb);

    if (!width || !impedance) {
      setOutput('Error: Please enter valid baffle width and speaker impedance.');
      return;
    }

    // Baffle step frequency: f = 343 / (π × width_in_meters)
    const widthMeters = width / 100;
    const baffleStepFreq = 343 / (Math.PI * widthMeters);

    // Compensation circuit values
    const ratio = Math.pow(10, attenuation / 20);
    let resistor = 0;
    let capacitor = 0;
    let inductor = 0;

    if (compensationType === 'series') {
      // Series R-C network across the driver
      resistor = impedance * (ratio - 1);
      capacitor = 1 / (2 * Math.PI * baffleStepFreq * resistor);
      inductor = 0;
    } else {
      // Parallel R-L network in series with driver
      resistor = impedance / (ratio - 1);
      inductor = resistor / (2 * Math.PI * baffleStepFreq);
      capacitor = 0;
    }

    const halfSpaceFreq = baffleStepFreq;
    const fullSpaceFreq = baffleStepFreq * 2;

    const results = [
      `=== Baffle Step Analysis ===`,
      ``,
      `Baffle Width: ${width} cm (${(widthMeters * 1000).toFixed(0)} mm)`,
      `Baffle Step Frequency: ${baffleStepFreq.toFixed(1)} Hz`,
      ``,
      `Half-space (2π) transition: ~${halfSpaceFreq.toFixed(0)} Hz`,
      `Full-space (4π) below: ~${(halfSpaceFreq / 2).toFixed(0)} Hz`,
      `Baffle-controlled above: ~${fullSpaceFreq.toFixed(0)} Hz`,
      ``,
      `Expected level difference: ~${attenuation} dB`,
      ``,
      `=== Compensation Circuit (${compensationType === 'series' ? 'Series R-C' : 'Parallel R-L'}) ===`,
      ``,
      `Resistor: ${resistor.toFixed(2)} Ω`,
      compensationType === 'series'
        ? `Capacitor: ${(capacitor * 1e6).toFixed(2)} µF`
        : `Inductor: ${(inductor * 1000).toFixed(3)} mH`,
      ``,
      `Speaker Impedance: ${impedance} Ω`,
      `Compensation Type: ${compensationType === 'series' ? 'Series R-C across driver' : 'Parallel R-L in series with driver'}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Baffle Width (cm)</label>
              <input id={`${toolId}-width`} type="number" value={baffleWidth} onChange={(e) => setBaffleWidth(e.target.value)} className="input-field" aria-label={`Baffle width for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-impedance`} className="block text-sm font-medium text-gray-700 mb-1">Speaker Impedance (Ω)</label>
              <input id={`${toolId}-impedance`} type="number" value={speakerImpedance} onChange={(e) => setSpeakerImpedance(e.target.value)} className="input-field" aria-label="Speaker impedance" />
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Compensation Type</label>
              <select id={`${toolId}-type`} value={compensationType} onChange={(e) => setCompensationType(e.target.value)} className="input-field" aria-label="Compensation type">
                <option value="series">Series R-C (across driver)</option>
                <option value="parallel">Parallel R-L (in series)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-atten`} className="block text-sm font-medium text-gray-700 mb-1">Attenuation (dB)</label>
              <input id={`${toolId}-atten`} type="number" value={attenuationDb} onChange={(e) => setAttenuationDb(e.target.value)} className="input-field" aria-label="Attenuation in dB" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
