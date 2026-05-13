'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IntermodulationCalculator - Calculate intermodulation distortion products.
 * Computes 2nd and 3rd order IMD products from two input frequencies.
 */
export default function IntermodulationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [freq1, setFreq1] = useState('');
  const [freq2, setFreq2] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const f1 = parseFloat(freq1);
    const f2 = parseFloat(freq2);

    if (isNaN(f1) || isNaN(f2) || f1 <= 0 || f2 <= 0) {
      setOutput('Please enter valid positive frequencies.');
      return;
    }

    const lines = [
      '═══ Intermodulation Distortion Products ═══',
      '',
      `Input Frequencies: f₁ = ${f1} MHz, f₂ = ${f2} MHz`,
      '',
      '── 2nd Order Products ──',
      `  f₁ + f₂ = ${(f1 + f2).toFixed(4)} MHz`,
      `  f₂ - f₁ = ${Math.abs(f2 - f1).toFixed(4)} MHz`,
      `  2f₁     = ${(2 * f1).toFixed(4)} MHz`,
      `  2f₂     = ${(2 * f2).toFixed(4)} MHz`,
      '',
      '── 3rd Order Products ──',
      `  2f₁ + f₂ = ${(2 * f1 + f2).toFixed(4)} MHz`,
      `  2f₁ - f₂ = ${Math.abs(2 * f1 - f2).toFixed(4)} MHz`,
      `  2f₂ + f₁ = ${(2 * f2 + f1).toFixed(4)} MHz`,
      `  2f₂ - f₁ = ${Math.abs(2 * f2 - f1).toFixed(4)} MHz`,
      `  3f₁      = ${(3 * f1).toFixed(4)} MHz`,
      `  3f₂      = ${(3 * f2).toFixed(4)} MHz`,
      '',
      '── 5th Order Products ──',
      `  3f₁ - 2f₂ = ${Math.abs(3 * f1 - 2 * f2).toFixed(4)} MHz`,
      `  3f₂ - 2f₁ = ${Math.abs(3 * f2 - 2 * f1).toFixed(4)} MHz`,
      '',
      '── Notes ──',
      '• 3rd order products (2f₁-f₂, 2f₂-f₁) are closest to the',
      '  fundamental frequencies and hardest to filter.',
      '• IP3 (Third-Order Intercept Point) characterizes IMD performance.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-f1`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency 1 (MHz)
            </label>
            <input
              id={`${toolId}-f1`}
              type="number"
              step="any"
              value={freq1}
              onChange={(e) => setFreq1(e.target.value)}
              placeholder="e.g. 100"
              className="input-field"
              aria-label={`Frequency 1 for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-f2`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency 2 (MHz)
            </label>
            <input
              id={`${toolId}-f2`}
              type="number"
              step="any"
              value={freq2}
              onChange={(e) => setFreq2(e.target.value)}
              placeholder="e.g. 105"
              className="input-field"
              aria-label="Frequency 2"
            />
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate intermodulation products">
            Calculate IMD Products
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Intermodulation Products</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
