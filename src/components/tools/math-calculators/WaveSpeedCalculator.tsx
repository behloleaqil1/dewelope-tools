'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WaveSpeedCalculator - Calculate wave speed using v = fλ.
 */
export default function WaveSpeedCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [solveFor, setSolveFor] = useState('speed');
  const [frequency, setFrequency] = useState('');
  const [wavelength, setWavelength] = useState('');
  const [speed, setSpeed] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const f = parseFloat(frequency);
    const lambda = parseFloat(wavelength);
    const v = parseFloat(speed);

    let result = '';

    if (solveFor === 'speed') {
      if (isNaN(f) || f <= 0 || isNaN(lambda) || lambda <= 0) {
        setOutput('Please enter valid positive values for frequency and wavelength.');
        return;
      }
      const calcSpeed = f * lambda;
      result = [
        `Frequency (f): ${f} Hz`,
        `Wavelength (λ): ${lambda} m`,
        ``,
        `Wave Speed (v): ${calcSpeed.toFixed(6)} m/s`,
        ``,
        `Formula: v = f × λ`,
        `v = ${f} × ${lambda} = ${calcSpeed.toFixed(6)} m/s`,
      ].join('\n');
    } else if (solveFor === 'frequency') {
      if (isNaN(v) || v <= 0 || isNaN(lambda) || lambda <= 0) {
        setOutput('Please enter valid positive values for speed and wavelength.');
        return;
      }
      const calcFreq = v / lambda;
      result = [
        `Wave Speed (v): ${v} m/s`,
        `Wavelength (λ): ${lambda} m`,
        ``,
        `Frequency (f): ${calcFreq.toFixed(6)} Hz`,
        ``,
        `Formula: f = v / λ`,
        `f = ${v} / ${lambda} = ${calcFreq.toFixed(6)} Hz`,
      ].join('\n');
    } else {
      if (isNaN(v) || v <= 0 || isNaN(f) || f <= 0) {
        setOutput('Please enter valid positive values for speed and frequency.');
        return;
      }
      const calcLambda = v / f;
      result = [
        `Wave Speed (v): ${v} m/s`,
        `Frequency (f): ${f} Hz`,
        ``,
        `Wavelength (λ): ${calcLambda.toFixed(6)} m`,
        ``,
        `Formula: λ = v / f`,
        `λ = ${v} / ${f} = ${calcLambda.toFixed(6)} m`,
      ].join('\n');
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-solve`} className="block text-sm font-medium text-gray-700 mb-1">Solve For</label>
            <select id={`${toolId}-solve`} value={solveFor} onChange={e => setSolveFor(e.target.value)} aria-label={`Solve for variable in ${toolName}`} className="input-field">
              <option value="speed">Wave Speed (v)</option>
              <option value="frequency">Frequency (f)</option>
              <option value="wavelength">Wavelength (λ)</option>
            </select>
          </div>
          {solveFor !== 'frequency' && (
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (Hz)</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="440" step="any" min="0" aria-label="Frequency in Hz" className="input-field" />
            </div>
          )}
          {solveFor !== 'wavelength' && (
            <div>
              <label htmlFor={`${toolId}-wave`} className="block text-sm font-medium text-gray-700 mb-1">Wavelength (m)</label>
              <input id={`${toolId}-wave`} type="number" value={wavelength} onChange={e => setWavelength(e.target.value)} placeholder="0.78" step="any" min="0" aria-label="Wavelength in meters" className="input-field" />
            </div>
          )}
          {solveFor !== 'speed' && (
            <div>
              <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Wave Speed (m/s)</label>
              <input id={`${toolId}-speed`} type="number" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="343" step="any" min="0" aria-label="Wave speed in m/s" className="input-field" />
            </div>
          )}
          <button onClick={calculate} className="btn-primary w-full">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
