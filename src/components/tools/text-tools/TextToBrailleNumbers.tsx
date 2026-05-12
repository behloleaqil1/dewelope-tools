'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBrailleNumbers - Convert numbers to Braille number indicators.
 * Uses the Braille number indicator (⠼) followed by letters a-j representing 1-0.
 */

const BRAILLE_NUMBERS: Record<string, string> = {
  '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑',
  '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚',
};

const NUMBER_INDICATOR = '⠼';

export default function TextToBrailleNumbers({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showTable, setShowTable] = useState(true);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result: string[] = [];
    let inNumber = false;

    for (const char of input) {
      if (/[0-9]/.test(char)) {
        if (!inNumber) {
          result.push(NUMBER_INDICATOR);
          inNumber = true;
        }
        result.push(BRAILLE_NUMBERS[char]);
      } else if (char === ' ') {
        result.push(' ');
        inNumber = false;
      } else if (char === '.' || char === ',') {
        result.push(char === '.' ? '⠲' : '⠂');
      } else {
        inNumber = false;
        result.push(char);
      }
    }

    setOutput(result.join(''));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter numbers (e.g., 42, 3.14, 2024)..."
          aria-label={`Number input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="flex items-center gap-4 mt-3">
          <button onClick={convert} className="btn-primary">
            Convert to Braille
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showTable}
              onChange={(e) => setShowTable(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show reference table
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output || showTable}>
        {output && (
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">Braille Output</label>
            <div className="text-3xl font-mono bg-gray-50 p-4 rounded border tracking-wider">{output}</div>
            <p className="text-xs text-gray-500">⠼ = number indicator (precedes each number group)</p>
            <CopyToClipboard text={output} />
          </div>
        )}
        {showTable && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Braille Number Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(BRAILLE_NUMBERS).map(([num, braille]) => (
                <div key={num} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border">
                  <span className="font-bold text-gray-900">{num}</span>
                  <span className="text-2xl">{NUMBER_INDICATOR}{braille}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
