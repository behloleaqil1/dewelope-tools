'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBinaryCodedDecimal - Convert numbers to BCD (Binary-Coded Decimal) representation.
 * Each decimal digit is represented as a 4-bit binary value.
 */
export default function TextToBinaryCodedDecimal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function convert() {
    setError('');
    setOutput('');
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a number.');
      return;
    }

    const digits = trimmed.replace(/[^0-9]/g, '');
    if (digits.length === 0) {
      setError('Input must contain at least one digit (0-9).');
      return;
    }

    const bcdDigits = digits.split('').map(d => {
      const num = parseInt(d, 10);
      return num.toString(2).padStart(4, '0');
    });

    const lines: string[] = [];
    lines.push(`Input: ${trimmed}`);
    lines.push(`Digits: ${digits}`);
    lines.push('');
    lines.push('BCD Representation:');
    lines.push(bcdDigits.join(' '));
    lines.push('');
    lines.push('Digit Breakdown:');
    digits.split('').forEach((d, i) => {
      lines.push(`  ${d} → ${bcdDigits[i]}`);
    });
    lines.push('');
    lines.push(`Full BCD (no spaces): ${bcdDigits.join('')}`);

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a number
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12345"
          aria-label={`Number input for ${toolName}`}
          className="input-field font-mono"
        />
        <button onClick={convert} className="btn-primary mt-2">Convert to BCD</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">BCD Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
