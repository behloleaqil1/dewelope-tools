'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SignalToNoiseCalculator - Calculate Signal-to-Noise Ratio (SNR) in decibels.
 * Supports power and amplitude inputs, shows SNR in dB with quality assessment.
 */
export default function SignalToNoiseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'power' | 'amplitude'>('power');
  const [signalValue, setSignalValue] = useState('');
  const [noiseValue, setNoiseValue] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const signal = parseFloat(signalValue);
    const noise = parseFloat(noiseValue);

    if (isNaN(signal) || isNaN(noise) || signal <= 0 || noise <= 0) {
      setOutput('Please enter positive values for both signal and noise.');
      return;
    }

    let snrDb: number;
    if (mode === 'power') {
      snrDb = 10 * Math.log10(signal / noise);
    } else {
      snrDb = 20 * Math.log10(signal / noise);
    }

    const ratio = signal / noise;
    let quality = '';
    if (snrDb >= 40) quality = 'Excellent';
    else if (snrDb >= 30) quality = 'Very Good';
    else if (snrDb >= 20) quality = 'Good';
    else if (snrDb >= 10) quality = 'Fair';
    else if (snrDb >= 0) quality = 'Poor';
    else quality = 'Very Poor (noise exceeds signal)';

    const results = [
      `SNR: ${snrDb.toFixed(4)} dB`,
      `Linear Ratio: ${ratio.toFixed(6)}`,
      `Signal Quality: ${quality}`,
      ``,
      `Formula (${mode}): SNR = ${mode === 'power' ? '10' : '20'} × log₁₀(signal / noise)`,
      `= ${mode === 'power' ? '10' : '20'} × log₁₀(${signal} / ${noise})`,
      `= ${snrDb.toFixed(4)} dB`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
              Input Mode
            </label>
            <select
              id={`${toolId}-mode`}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'power' | 'amplitude')}
              aria-label={`Input mode for ${toolName}`}
              className="input-field"
            >
              <option value="power">Power (10·log₁₀)</option>
              <option value="amplitude">Amplitude (20·log₁₀)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-signal`} className="block text-sm font-medium text-gray-700 mb-1">
              Signal {mode === 'power' ? 'Power' : 'Amplitude'}
            </label>
            <input
              id={`${toolId}-signal`}
              type="number"
              value={signalValue}
              onChange={(e) => setSignalValue(e.target.value)}
              placeholder="e.g. 100"
              aria-label="Signal value"
              className="input-field"
              min="0"
              step="any"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-noise`} className="block text-sm font-medium text-gray-700 mb-1">
              Noise {mode === 'power' ? 'Power' : 'Amplitude'}
            </label>
            <input
              id={`${toolId}-noise`}
              type="number"
              value={noiseValue}
              onChange={(e) => setNoiseValue(e.target.value)}
              placeholder="e.g. 1"
              aria-label="Noise value"
              className="input-field"
              min="0"
              step="any"
            />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate SNR</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
