'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBinaryCodedDecimal - Convert numbers to BCD representation.
 * Each decimal digit is represented as a 4-bit binary value.
 */
export default function TextToBinaryCodedDecimal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState(' ');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const digits = input.trim().replace(/[^0-9.+-]/g, '');
    if (!digits) {
      setOutput('Error: Please enter a valid number (digits 0-9, optional decimal point).');
      return;
    }

    const bcdDigits: string[] = [];
    for (const char of digits) {
      if (char === '.') {
        bcdDigits.push('.');
      } else if (char === '-') {
        bcdDigits.push('-');
      } else if (char === '+') {
        bcdDigits.push('+');
      } else {
        const digit = parseInt(char, 10);
        bcdDigits.push(digit.toString(2).padStart(4, '0'));
      }
    }

    const result = bcdDigits.join(separator);

    const lines: string[] = [];
    lines.push(`Input: ${digits}`);
    lines.push(`BCD:   ${result}`);
    lines.push('');
    lines.push('Digit breakdown:');
    for (const char of digits) {
      if (char === '.' || char === '-' || char === '+') {
        lines.push(`  ${char} → (separator/sign)`);
      } else {
        const digit = parseInt(char, 10);
        lines.push(`  ${char} → ${digit.toString(2).padStart(4, '0')}`);
      }
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter number to convert to BCD
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a number (e.g., 1234.56)"
          aria-label={`Number input for ${toolName}`}
          className="input-field font-mono"
        />
        <div className="mt-4">
          <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">BCD Digit Separator</label>
          <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} className="input-field w-48" aria-label="Separator">
            <option value=" ">Space</option>
            <option value=" | ">Pipe ( | )</option>
            <option value="-">Dash</option>
            <option value="">None</option>
          </select>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to BCD</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">BCD Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
