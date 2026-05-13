'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PropagationDelayCalculator - Calculate signal propagation delay based on distance and medium.
 */
export default function PropagationDelayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [medium, setMedium] = useState('vacuum');
  const [customSpeed, setCustomSpeed] = useState('');
  const [output, setOutput] = useState('');

  const SPEED_OF_LIGHT = 299792458; // m/s

  const mediumSpeeds: Record<string, { speed: number; label: string }> = {
    vacuum: { speed: SPEED_OF_LIGHT, label: 'Vacuum / Air (c)' },
    fiber: { speed: SPEED_OF_LIGHT * 0.67, label: 'Fiber Optic (~0.67c)' },
    copper: { speed: SPEED_OF_LIGHT * 0.77, label: 'Copper Cable (~0.77c)' },
    coax: { speed: SPEED_OF_LIGHT * 0.66, label: 'Coaxial Cable (~0.66c)' },
    water: { speed: 1500, label: 'Water (sound, ~1500 m/s)' },
    custom: { speed: 0, label: 'Custom Speed' },
  };

  const calculate = () => {
    const dist = parseFloat(distance);
    if (isNaN(dist) || dist <= 0) {
      setOutput('Please enter a valid positive distance.');
      return;
    }

    let speed: number;
    if (medium === 'custom') {
      speed = parseFloat(customSpeed);
      if (isNaN(speed) || speed <= 0) {
        setOutput('Please enter a valid custom propagation speed.');
        return;
      }
    } else {
      speed = mediumSpeeds[medium].speed;
    }

    const delaySeconds = dist / speed;
    const delayMs = delaySeconds * 1000;
    const delayUs = delaySeconds * 1e6;
    const delayNs = delaySeconds * 1e9;

    const lines = [
      `Distance: ${dist.toLocaleString()} m`,
      `Medium: ${mediumSpeeds[medium].label}`,
      `Propagation Speed: ${speed.toLocaleString()} m/s`,
      ``,
      `Propagation Delay:`,
      `  ${delaySeconds.toExponential(6)} seconds`,
      `  ${delayMs.toFixed(6)} ms`,
      `  ${delayUs.toFixed(3)} µs`,
      `  ${delayNs.toFixed(2)} ns`,
      ``,
      `Formula: delay = distance / speed`,
      `  = ${dist} / ${speed.toLocaleString()}`,
      `  = ${delaySeconds.toExponential(6)} s`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Distance (meters)</label>
            <input id={`${toolId}-distance`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 1000" className="input-field" aria-label={`Distance for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-medium`} className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
            <select id={`${toolId}-medium`} value={medium} onChange={(e) => setMedium(e.target.value)} className="input-field" aria-label="Propagation medium">
              {Object.entries(mediumSpeeds).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          {medium === 'custom' && (
            <div>
              <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Custom Speed (m/s)</label>
              <input id={`${toolId}-speed`} type="number" value={customSpeed} onChange={(e) => setCustomSpeed(e.target.value)} placeholder="e.g. 200000000" className="input-field" aria-label="Custom propagation speed" />
            </div>
          )}
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Delay</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Propagation Delay</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
