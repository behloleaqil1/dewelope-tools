'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaperGsmToLbConverter - Convert paper weight between GSM and lb (bond/cover/text).
 * Different paper types use different base sheet sizes for lb calculations.
 */
export default function PaperGsmToLbConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('gsm');
  const [paperType, setPaperType] = useState('bond');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Conversion factors: 1 lb of each type = X gsm
  const factors: Record<string, { factor: number; label: string }> = {
    bond: { factor: 3.76, label: 'Bond / Writing (17×22")' },
    text: { factor: 1.48, label: 'Text / Book (25×38")' },
    cover: { factor: 2.708, label: 'Cover (20×26")' },
    bristol: { factor: 2.19, label: 'Bristol (22.5×28.5")' },
    index: { factor: 2.58, label: 'Index (25.5×30.5")' },
  };

  const calculate = () => {
    setError('');
    setOutput('');

    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number.');
      return;
    }

    const { factor, label } = factors[paperType];
    const lines: string[] = [];

    if (fromUnit === 'gsm') {
      const lb = num / factor;
      lines.push(`${num} GSM = ${lb.toFixed(2)} lb (${label})`);
      lines.push('');
      lines.push('All paper type equivalents:');
      for (const [key, { factor: f, label: l }] of Object.entries(factors)) {
        const lbVal = num / f;
        const marker = key === paperType ? ' ←' : '';
        lines.push(`  ${l}: ${lbVal.toFixed(2)} lb${marker}`);
      }
    } else {
      const gsm = num * factor;
      lines.push(`${num} lb (${label}) = ${gsm.toFixed(2)} GSM`);
      lines.push('');
      lines.push('Common equivalents:');
      lines.push(`  ${gsm.toFixed(0)} GSM in other types:`);
      for (const [key, { factor: f, label: l }] of Object.entries(factors)) {
        const lbVal = gsm / f;
        const marker = key === paperType ? ' ←' : '';
        lines.push(`  ${l}: ${lbVal.toFixed(2)} lb${marker}`);
      }
    }

    lines.push('');
    lines.push('Note: Paper weight in lb depends on the base sheet size,');
    lines.push('which varies by paper type (bond, text, cover, etc.).');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Paper Weight Value
        </label>
        <input
          id={`${toolId}-value`}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 80"
          aria-label={`Paper weight value for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
          Convert From
        </label>
        <select
          id={`${toolId}-from`}
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          aria-label={`Source unit for ${toolName}`}
          className="input-field mb-3"
        >
          <option value="gsm">GSM (g/m²)</option>
          <option value="lb">Pounds (lb)</option>
        </select>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Paper Type
        </label>
        <select
          id={`${toolId}-type`}
          value={paperType}
          onChange={(e) => setPaperType(e.target.value)}
          aria-label={`Paper type for ${toolName}`}
          className="input-field mb-3"
        >
          {Object.entries(factors).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          onClick={calculate}
          className="btn-primary mt-2"
        >
          Convert
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
