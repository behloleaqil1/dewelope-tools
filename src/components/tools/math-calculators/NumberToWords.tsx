'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NumberToWords - Converts numbers to their English word representation.
 * Supports integers and decimals up to trillions.
 */
export default function NumberToWords({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

  const convertHundreds = (num: number): string => {
    let result = '';
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' hundred';
      num %= 100;
      if (num > 0) result += ' ';
    }
    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      if (num % 10 > 0) result += '-' + ones[num % 10];
    } else if (num > 0) {
      result += ones[num];
    }
    return result;
  };

  const convert = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a number');
      setOutput('');
      return;
    }

    const num = parseFloat(trimmed);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setOutput('');
      return;
    }

    if (Math.abs(num) > 999999999999999) {
      setError('Number is too large (max: 999 trillion)');
      setOutput('');
      return;
    }

    setError('');

    if (num === 0) {
      setOutput('zero');
      return;
    }

    let result = '';
    let n = Math.abs(Math.floor(num));

    if (num < 0) result = 'negative ';

    if (n === 0) {
      result += 'zero';
    } else {
      const groups: number[] = [];
      while (n > 0) {
        groups.push(n % 1000);
        n = Math.floor(n / 1000);
      }

      const parts: string[] = [];
      for (let i = groups.length - 1; i >= 0; i--) {
        if (groups[i] !== 0) {
          parts.push(convertHundreds(groups[i]) + (scales[i] ? ' ' + scales[i] : ''));
        }
      }
      result += parts.join(' ');
    }

    // Handle decimal part
    const decimalPart = trimmed.includes('.') ? trimmed.split('.')[1] : '';
    if (decimalPart) {
      result += ' point';
      for (const digit of decimalPart) {
        result += ' ' + (digit === '0' ? 'zero' : ones[parseInt(digit)]);
      }
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a number
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 123456"
          aria-label={`Number input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert number to words" className="btn-primary">
        Convert to Words
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <p className="text-lg text-gray-800 capitalize">{output}</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
