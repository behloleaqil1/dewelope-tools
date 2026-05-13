'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AdcResolutionCalculator - Calculate ADC resolution, LSB voltage, and dynamic range.
 */
export default function AdcResolutionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bits, setBits] = useState('12');
  const [vRef, setVRef] = useState('3.3');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const n = parseInt(bits);
    const ref = parseFloat(vRef);

    if (isNaN(n) || isNaN(ref) || n < 1 || n > 32 || ref <= 0) {
      setOutput('Please enter valid values (bits: 1-32, Vref > 0).');
      return;
    }

    const levels = Math.pow(2, n);
    const lsb = ref / levels;
    const dynamicRange = 20 * Math.log10(levels);
    const snr = 6.02 * n + 1.76;

    const results = [
      `ADC Resolution: ${n} bits`,
      `Number of levels: ${levels.toLocaleString()}`,
      `Reference voltage: ${ref} V`,
      `LSB voltage: ${lsb.toFixed(6)} V (${(lsb * 1000).toFixed(4)} mV)`,
      `Full-scale range: 0 V to ${ref} V`,
      `Dynamic range: ${dynamicRange.toFixed(2)} dB`,
      `Ideal SNR: ${snr.toFixed(2)} dB`,
      ``,
      `Formula:`,
      `  LSB = Vref / 2^N = ${ref} / ${levels} = ${lsb.toFixed(6)} V`,
      `  Dynamic Range = 20 × log₁₀(2^N) = ${dynamicRange.toFixed(2)} dB`,
      `  SNR = 6.02N + 1.76 = ${snr.toFixed(2)} dB`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-bits`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of bits (N)
            </label>
            <input
              id={`${toolId}-bits`}
              type="number"
              value={bits}
              onChange={(e) => setBits(e.target.value)}
              min="1"
              max="32"
              aria-label={`ADC bits for ${toolName}`}
              className="input-field w-32"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-vref`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference voltage (V)
            </label>
            <input
              id={`${toolId}-vref`}
              type="number"
              value={vRef}
              onChange={(e) => setVRef(e.target.value)}
              step="0.1"
              min="0.01"
              aria-label={`Reference voltage for ${toolName}`}
              className="input-field w-32"
            />
          </div>
          <button onClick={calculate} className="btn-primary">
            Calculate ADC Resolution
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ADC Resolution Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
