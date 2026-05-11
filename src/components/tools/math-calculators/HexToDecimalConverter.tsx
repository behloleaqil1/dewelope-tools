'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexToDecimalConverter - Bidirectional converter between hexadecimal and decimal.
 */
export default function HexToDecimalConverter({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'hexToDec' | 'decToHex'>('hexToDec');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleConvert() {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter a value');
      return;
    }

    setError(undefined);

    if (mode === 'hexToDec') {
      const cleaned = input.trim().replace(/^0x/i, '');
      if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
        setError('Invalid hexadecimal value');
        setOutput('');
        return;
      }
      setOutput(parseInt(cleaned, 16).toString(10));
    } else {
      const num = parseInt(input.trim(), 10);
      if (isNaN(num) || num < 0) {
        setError('Invalid decimal value (must be a non-negative integer)');
        setOutput('');
        return;
      }
      setOutput(num.toString(16).toUpperCase());
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('hexToDec'); setOutput(''); setError(undefined); }}
          aria-label="Hex to decimal mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'hexToDec' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          HEX → Decimal
        </button>
        <button
          onClick={() => { setMode('decToHex'); setOutput(''); setError(undefined); }}
          aria-label="Decimal to hex mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'decToHex' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Decimal → HEX
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'hexToDec' ? 'Hexadecimal Value' : 'Decimal Value'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'hexToDec' ? 'Enter hex value (e.g., FF, 0x1A3F)' : 'Enter decimal number (e.g., 255, 42)'}
          aria-label={mode === 'hexToDec' ? 'Hexadecimal value to convert' : 'Decimal value to convert'}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] font-mono"
        />
      </InputArea>

      <button
        onClick={handleConvert}
        aria-label="Convert value"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{mode === 'hexToDec' ? 'Decimal Result:' : 'Hexadecimal Result:'}</p>
            <code className="block text-lg font-mono text-gray-800 p-3 bg-gray-50 rounded-lg select-all">
              {mode === 'decToHex' ? `0x${output}` : output}
            </code>
            <p className="text-xs text-gray-500">
              {mode === 'hexToDec'
                ? `Also: 0x${input.trim().replace(/^0x/i, '').toUpperCase()} = ${output}`
                : `Also: ${input.trim()} = 0x${output}`}
            </p>
            <CopyToClipboard text={mode === 'decToHex' ? `0x${output}` : output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
