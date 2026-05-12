'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NumberToBinaryVisual - Visualize a number in binary with bit positions.
 */
export default function NumberToBinaryVisual({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ binary: string; bits: { position: number; value: string; weight: number }[]; decimal: number; hex: string; octal: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const num = parseInt(input);
    if (isNaN(num) || num < 0 || num > 4294967295) {
      setError('Please enter a valid integer between 0 and 4,294,967,295 (32-bit unsigned).');
      return;
    }

    const binary = (num >>> 0).toString(2);
    const paddedBinary = binary.padStart(Math.max(8, Math.ceil(binary.length / 8) * 8), '0');

    const bits = paddedBinary.split('').map((bit, i) => ({
      position: paddedBinary.length - 1 - i,
      value: bit,
      weight: Math.pow(2, paddedBinary.length - 1 - i),
    }));

    setResult({
      binary: paddedBinary,
      bits,
      decimal: num,
      hex: '0x' + num.toString(16).toUpperCase(),
      octal: '0o' + num.toString(8),
    });
  };

  const copyText = result
    ? `Decimal: ${result.decimal}\nBinary: ${result.binary}\nHex: ${result.hex}\nOctal: ${result.octal}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter a Number (0 - 4,294,967,295)</label>
        <input id={`${toolId}-input`} type="text" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 255" aria-label={`Number input for ${toolName}`} className="input-field" />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Visualize binary">Visualize Binary</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.binary}</div>
                <div className="text-xs text-gray-500 mt-1">Binary</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600 font-mono">{result.hex}</div>
                <div className="text-xs text-gray-500 mt-1">Hexadecimal</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600 font-mono">{result.octal}</div>
                <div className="text-xs text-gray-500 mt-1">Octal</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <div className="text-sm font-medium text-gray-700 mb-2">Bit Positions:</div>
              <div className="flex flex-wrap gap-1">
                {result.bits.map((bit, i) => (
                  <div key={i} className={`flex flex-col items-center px-1.5 py-1 rounded text-xs ${bit.value === '1' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="font-mono font-bold">{bit.value}</span>
                    <span className="text-[10px]">2^{bit.position}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.decimal} = {result.bits.filter(b => b.value === '1').map(b => `2^${b.position}`).join(' + ') || '0'}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
