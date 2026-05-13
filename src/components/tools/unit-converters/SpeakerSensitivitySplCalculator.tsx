'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerSensitivitySplCalculator - Calculate SPL at distance from speaker sensitivity,
 * power input, and listening distance using the inverse square law.
 */
export default function SpeakerSensitivitySplCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sensitivity, setSensitivity] = useState('87');
  const [power, setPower] = useState('100');
  const [distance, setDistance] = useState('3');
  const [numSpeakers, setNumSpeakers] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const sens = parseFloat(sensitivity);
    const pwr = parseFloat(power);
    const dist = parseFloat(distance);
    const speakers = parseInt(numSpeakers);

    if (isNaN(sens) || isNaN(pwr) || isNaN(dist) || isNaN(speakers) || pwr <= 0 || dist <= 0 || speakers < 1) {
      setOutput('Please enter valid positive values.');
      return;
    }

    // SPL = Sensitivity + 10*log10(Power) - 20*log10(Distance)
    // Sensitivity is measured at 1W/1m
    const splAtDistance = sens + 10 * Math.log10(pwr) - 20 * Math.log10(dist);

    // Multiple speakers add ~3dB per doubling
    const multiSpeakerGain = 10 * Math.log10(speakers);
    const totalSpl = splAtDistance + multiSpeakerGain;

    // Max SPL (at 1m with rated power)
    const maxSpl1m = sens + 10 * Math.log10(pwr);

    // Distance for various SPL targets
    const distFor85dB = Math.pow(10, (maxSpl1m - 85) / 20);
    const distFor75dB = Math.pow(10, (maxSpl1m - 75) / 20);
    const distFor65dB = Math.pow(10, (maxSpl1m - 65) / 20);

    // Power needed for 85dB at given distance
    const powerFor85dB = Math.pow(10, (85 - sens + 20 * Math.log10(dist)) / 10);

    const results = [
      `=== Speaker SPL Calculator ===`,
      ``,
      `Input Parameters:`,
      `  Sensitivity: ${sens} dB (1W/1m)`,
      `  Amplifier Power: ${pwr} W`,
      `  Listening Distance: ${dist} m`,
      `  Number of Speakers: ${speakers}`,
      ``,
      `SPL Results:`,
      `  SPL at ${dist}m: ${splAtDistance.toFixed(1)} dB`,
      `  Multi-speaker Gain: +${multiSpeakerGain.toFixed(1)} dB`,
      `  Total SPL at ${dist}m: ${totalSpl.toFixed(1)} dB`,
      `  Max SPL at 1m: ${maxSpl1m.toFixed(1)} dB`,
      ``,
      `Distance for Target SPL:`,
      `  85 dB: ${distFor85dB.toFixed(2)} m`,
      `  75 dB: ${distFor75dB.toFixed(2)} m`,
      `  65 dB: ${distFor65dB.toFixed(2)} m`,
      ``,
      `Power Requirements:`,
      `  Power for 85 dB at ${dist}m: ${powerFor85dB.toFixed(2)} W`,
      ``,
      `Reference Levels:`,
      `  60 dB - Normal conversation`,
      `  70 dB - Vacuum cleaner`,
      `  80 dB - Busy traffic`,
      `  85 dB - Recommended max sustained`,
      `  90 dB - Lawn mower`,
      `  100 dB - Concert front row`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-sens`} className="block text-sm font-medium text-gray-700 mb-1">Sensitivity (dB 1W/1m)</label>
              <input id={`${toolId}-sens`} type="number" min="60" max="120" step="0.1" value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} aria-label={`Speaker sensitivity for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Power (Watts)</label>
              <input id={`${toolId}-power`} type="number" min="1" max="10000" value={power} onChange={(e) => setPower(e.target.value)} aria-label="Amplifier power" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance (meters)</label>
              <input id={`${toolId}-dist`} type="number" min="0.1" max="1000" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} aria-label="Listening distance" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-speakers`} className="block text-sm font-medium text-gray-700 mb-1">Number of Speakers</label>
              <input id={`${toolId}-speakers`} type="number" min="1" max="100" value={numSpeakers} onChange={(e) => setNumSpeakers(e.target.value)} aria-label="Number of speakers" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate SPL</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SPL Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
