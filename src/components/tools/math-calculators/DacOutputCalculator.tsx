'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DacOutputCalculator - Calculate DAC output voltage from digital input value.
 */
export default function DacOutputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bits, setBits] = useState('12');
  const [vRef, setVRef] = useState('3.3');
  const [digitalInput, setDigitalInput] = useState('2048');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const n = parseInt(bits);
    const ref = parseFloat(vRef);
    const input = parseInt(digitalInput);

    if (isNaN(n) || isNaN(ref) || isNaN(input) || n < 1 || n > 32 || ref <= 0) {
      setOutput('Please enter valid values.');
      return;
    }

    const maxCode = Math.pow(2, n) - 1;
    if (input < 0 || input > maxCode) {
      setOutput(`Digital input must be between 0 and ${maxCode} for ${n}-bit DAC.`);
      return;
    }

    const vOut = (input / Math.pow(2, n)) * ref;
    const lsb = ref / Math.pow(2, n);
    const percentFs = (input / maxCode) * 100;

    const results = [
      `DAC Configuration:`,
      `  Resolution: ${n} bits`,
      `  Reference voltage: ${ref} V`,
      `  Digital input: ${input} (0x${input.toString(16).toUpperCase()})`,
      `  Max code: ${maxCode}`,
      ``,
      `Output:`,
      `  Output voltage: ${vOut.toFixed(6)} V (${(vOut * 1000).toFixed(4)} mV)`,
      `  LSB step size: ${lsb.toFixed(6)} V (${(lsb * 1000).toFixed(4)} mV)`,
      `  Percent of full scale: ${percentFs.toFixed(2)}%`,
      ``,
      `Formula:`,
      `  Vout = (D / 2^N) × Vref`,
      `  Vout = (${input} / ${Math.pow(2, n)}) × ${ref}`,
      `  Vout = ${vOut.toFixed(6)} V`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-bits`} className="block text-sm font-medium text-gray-700 mb-1">
              DAC resolution (bits)
            </label>
            <input
              id={`${toolId}-bits`}
              type="number"
              value={bits}
              onChange={(e) => setBits(e.target.value)}
              min="1"
              max="32"
              aria-label={`DAC bits for ${toolName}`}
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
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              Digital input value
            </label>
            <input
              id={`${toolId}-input`}
              type="number"
              value={digitalInput}
              onChange={(e) => setDigitalInput(e.target.value)}
              min="0"
              aria-label={`Digital input for ${toolName}`}
              className="input-field w-40"
            />
          </div>
          <button onClick={calculate} className="btn-primary">
            Calculate DAC Output
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">DAC Output Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
