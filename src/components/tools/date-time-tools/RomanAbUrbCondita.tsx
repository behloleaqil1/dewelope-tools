'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RomanAbUrbCondita - Convert years to Roman AUC (Ab Urbe Condita, from founding of Rome 753 BC).
 */
export default function RomanAbUrbCondita({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('2024');
  const [era, setEra] = useState<'CE' | 'BCE'>('CE');
  const [output, setOutput] = useState('');

  const toRomanNumerals = (num: number): string => {
    if (num <= 0 || num > 4000) return String(num);
    const romanMap: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
    ];
    let result = '';
    let remaining = num;
    for (const [value, numeral] of romanMap) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }
    return result;
  };

  const calculate = () => {
    const y = parseInt(year);
    if (isNaN(y) || y === 0) {
      setOutput('Please enter a valid year (there is no year 0).');
      return;
    }

    // AUC = year + 753 for CE, AUC = 754 - year for BCE
    let auc: number;
    if (era === 'CE') {
      auc = y + 753;
    } else {
      auc = 754 - y;
    }

    if (auc <= 0) {
      setOutput(`This date (${y} BCE) is before the founding of Rome (753 BCE). AUC system does not apply.`);
      return;
    }

    const romanAuc = auc <= 4000 ? toRomanNumerals(auc) : `${auc} (too large for standard Roman numerals)`;

    const results = [
      `Input: ${y} ${era}`,
      ``,
      `Ab Urbe Condita (AUC): ${auc}`,
      `Roman numerals: ${romanAuc}`,
      ``,
      `Full notation: Anno ${romanAuc} Ab Urbe Condita`,
      ``,
      `Explanation:`,
      `  Rome was traditionally founded in 753 BCE.`,
      era === 'CE'
        ? `  AUC = Year CE + 753 = ${y} + 753 = ${auc}`
        : `  AUC = 754 - Year BCE = 754 - ${y} = ${auc}`,
      ``,
      `Notable AUC dates:`,
      `  1 AUC = 753 BCE (Founding of Rome)`,
      `  245 AUC = 509 BCE (Roman Republic established)`,
      `  709 AUC = 44 BCE (Assassination of Caesar)`,
      `  753 AUC = 1 BCE / 754 AUC = 1 CE`,
      `  2777 AUC = 2024 CE`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                id={`${toolId}-year`}
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1"
                aria-label={`Year for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-era`} className="block text-sm font-medium text-gray-700 mb-1">
                Era
              </label>
              <select
                id={`${toolId}-era`}
                value={era}
                onChange={(e) => setEra(e.target.value as 'CE' | 'BCE')}
                aria-label={`Era for ${toolName}`}
                className="input-field"
              >
                <option value="CE">CE (AD)</option>
                <option value="BCE">BCE (BC)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">
            Convert to AUC
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Roman AUC Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
