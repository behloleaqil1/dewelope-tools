'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnnoDominiCalculator - Convert between AD/BC and astronomical year numbering.
 * AD 1 = year 1, 1 BC = year 0, 2 BC = year -1, etc.
 */
export default function AnnoDominiCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [era, setEra] = useState<'ad' | 'bc' | 'astronomical'>('ad');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const yearVal = parseInt(year);
    if (isNaN(yearVal) || yearVal <= 0) {
      if (era !== 'astronomical' || isNaN(yearVal)) {
        setOutput('Please enter a valid year number.');
        return;
      }
    }

    let astronomicalYear: number;
    let adBcStr: string;

    if (era === 'ad') {
      astronomicalYear = yearVal;
      adBcStr = `${yearVal} AD (Anno Domini)`;
    } else if (era === 'bc') {
      astronomicalYear = -(yearVal - 1); // 1 BC = 0, 2 BC = -1
      adBcStr = `${yearVal} BC (Before Christ)`;
    } else {
      astronomicalYear = yearVal;
      if (yearVal > 0) {
        adBcStr = `${yearVal} AD (Anno Domini)`;
      } else if (yearVal === 0) {
        adBcStr = '1 BC (Before Christ)';
      } else {
        adBcStr = `${Math.abs(yearVal) + 1} BC (Before Christ)`;
      }
    }

    // Calculate century
    let century: string;
    if (astronomicalYear > 0) {
      const centuryNum = Math.ceil(astronomicalYear / 100);
      century = `${centuryNum}${getOrdinalSuffix(centuryNum)} century AD`;
    } else {
      const centuryNum = Math.ceil(Math.abs(astronomicalYear - 1) / 100);
      century = `${centuryNum}${getOrdinalSuffix(centuryNum)} century BC`;
    }

    // ISO 8601 format
    const isoYear = astronomicalYear >= 0
      ? String(astronomicalYear).padStart(4, '0')
      : '-' + String(Math.abs(astronomicalYear)).padStart(4, '0');

    const julianDayInfo = astronomicalYear <= 1582 ? 'Julian calendar era' : 'Gregorian calendar era';

    const lines = [
      '=== AD/BC ↔ Astronomical Year Conversion ===',
      '',
      `Input: ${era === 'astronomical' ? `Astronomical year ${yearVal}` : `${yearVal} ${era.toUpperCase()}`}`,
      '',
      `AD/BC notation: ${adBcStr}`,
      `Astronomical year: ${astronomicalYear}`,
      `ISO 8601 year: ${isoYear}`,
      `Century: ${century}`,
      `Calendar note: ${julianDayInfo}`,
      '',
      '--- Conversion Rules ---',
      'AD 1 = Astronomical year 1',
      '1 BC = Astronomical year 0',
      '2 BC = Astronomical year -1',
      'N BC = Astronomical year -(N-1)',
    ];

    setOutput(lines.join('\n'));
  };

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              id={`${toolId}-year`}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="input-field"
              aria-label={`Year input for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-era`} className="block text-sm font-medium text-gray-700 mb-1">Input Format</label>
            <select
              id={`${toolId}-era`}
              value={era}
              onChange={(e) => setEra(e.target.value as 'ad' | 'bc' | 'astronomical')}
              className="input-field"
              aria-label="Era format"
            >
              <option value="ad">AD (Anno Domini)</option>
              <option value="bc">BC (Before Christ)</option>
              <option value="astronomical">Astronomical Year</option>
            </select>
          </div>
        </div>

        <button onClick={calculate} className="btn-primary mt-3">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
