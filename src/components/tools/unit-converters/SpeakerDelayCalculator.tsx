'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerDelayCalculator - Calculate speaker time alignment delay based on distance offset.
 * Computes delay in milliseconds and samples for digital audio systems.
 */
export default function SpeakerDelayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [temperature, setTemperature] = useState('20');
  const [sampleRate, setSampleRate] = useState('48000');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dist = parseFloat(distance);
    const temp = parseFloat(temperature);
    const sr = parseInt(sampleRate);

    if (isNaN(dist) || dist <= 0) {
      setOutput('Please enter a valid positive distance.');
      return;
    }

    // Speed of sound: v = 331.3 + 0.606 * T (m/s)
    const speedOfSound = 331.3 + 0.606 * (isNaN(temp) ? 20 : temp);

    // Convert to meters if needed
    const distMeters = unit === 'feet' ? dist * 0.3048 : dist;
    const distFeet = unit === 'meters' ? dist / 0.3048 : dist;

    // Delay in seconds
    const delaySeconds = distMeters / speedOfSound;
    const delayMs = delaySeconds * 1000;
    const delaySamples = Math.round(delaySeconds * (isNaN(sr) ? 48000 : sr));

    const results = [
      `=== Speaker Delay Calculator ===`,
      ``,
      `Input:`,
      `  Distance = ${dist} ${unit} (${unit === 'meters' ? distFeet.toFixed(3) + ' ft' : distMeters.toFixed(3) + ' m'})`,
      `  Temperature = ${isNaN(temp) ? 20 : temp}°C`,
      `  Speed of Sound = ${speedOfSound.toFixed(2)} m/s`,
      ``,
      `Results:`,
      `  Delay = ${delayMs.toFixed(4)} ms`,
      `  Delay = ${(delayMs * 1000).toFixed(2)} µs`,
      `  Delay = ${delaySamples} samples @ ${isNaN(sr) ? 48000 : sr} Hz`,
      ``,
      `Common Sample Rates:`,
      `  @ 44100 Hz = ${Math.round(delaySeconds * 44100)} samples`,
      `  @ 48000 Hz = ${Math.round(delaySeconds * 48000)} samples`,
      `  @ 96000 Hz = ${Math.round(delaySeconds * 96000)} samples`,
      ``,
      `Formula: delay = distance / speed_of_sound`,
      `Speed of sound ≈ 331.3 + 0.606 × T(°C) m/s`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Distance Offset</label>
              <input id={`${toolId}-distance`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="3.5" className="input-field" aria-label={`Distance for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'meters' | 'feet')} className="input-field" aria-label="Distance unit">
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input id={`${toolId}-temp`} type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="20" className="input-field" aria-label="Air temperature" />
            </div>
            <div>
              <label htmlFor={`${toolId}-sr`} className="block text-sm font-medium text-gray-700 mb-1">Sample Rate (Hz)</label>
              <select id={`${toolId}-sr`} value={sampleRate} onChange={(e) => setSampleRate(e.target.value)} className="input-field" aria-label="Sample rate">
                <option value="44100">44100 Hz</option>
                <option value="48000">48000 Hz</option>
                <option value="96000">96000 Hz</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Delay</button>
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
