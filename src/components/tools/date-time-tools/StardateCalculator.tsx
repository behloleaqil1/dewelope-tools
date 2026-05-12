'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StardateCalculator - Convert Gregorian dates to Star Trek stardates.
 * Supports TOS, TNG, and Kelvin timeline stardate systems.
 */
export default function StardateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [system, setSystem] = useState<'tng' | 'tos' | 'kelvin'>('tng');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dateObj = new Date(`${date}T${time}:00`);
    if (isNaN(dateObj.getTime())) {
      setOutput('Please enter a valid date and time.');
      return;
    }

    const results: string[] = [];
    const year = dateObj.getFullYear();
    const dayOfYear = Math.floor((dateObj.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    const fractionOfYear = dayOfYear / daysInYear;

    results.push(`=== Stardate Conversion ===`);
    results.push(`Input: ${dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${time}`);
    results.push('');

    switch (system) {
      case 'tng': {
        // TNG system: Based on year 2323 = stardate 0
        // Each year = 1000 stardates
        // Stardate = (year - 2323) * 1000 + fractionOfYear * 1000
        const stardate = (year - 2323) * 1000 + fractionOfYear * 1000;
        results.push('--- TNG Era (The Next Generation) ---');
        results.push(`System: 1 year = 1000 stardates, epoch year 2323`);
        results.push(`Stardate: ${stardate.toFixed(1)}`);
        results.push('');
        results.push(`Note: Negative stardates indicate dates before 2323.`);
        results.push(`Captain's Log format: "Stardate ${stardate.toFixed(1)}..."`);
        break;
      }
      case 'tos': {
        // TOS system: More arbitrary, roughly year 2265-2269
        // Approximation: stardate = (year - 2265) * 2500 + fractionOfYear * 2500
        const stardate = (year - 2265) * 2500 + fractionOfYear * 2500;
        results.push('--- TOS Era (The Original Series) ---');
        results.push(`System: Approximate, based on TOS era (2265-2269)`);
        results.push(`Stardate: ${stardate.toFixed(1)}`);
        results.push('');
        results.push(`Note: TOS stardates were somewhat inconsistent in the show.`);
        results.push(`This uses a linear approximation.`);
        break;
      }
      case 'kelvin': {
        // Kelvin timeline: stardate = year + fraction as decimal
        // e.g., 2258.42 for day 153 of 2258
        const stardate = year + fractionOfYear;
        results.push('--- Kelvin Timeline (2009+ Films) ---');
        results.push(`System: Year.fraction format`);
        results.push(`Stardate: ${stardate.toFixed(2)}`);
        results.push('');
        results.push(`Note: Kelvin timeline uses year.dayFraction format.`);
        break;
      }
    }

    results.push('');
    results.push('--- All Systems ---');
    const tng = (year - 2323) * 1000 + fractionOfYear * 1000;
    const tos = (year - 2265) * 2500 + fractionOfYear * 2500;
    const kelvin = year + fractionOfYear;
    results.push(`TNG:    ${tng.toFixed(1)}`);
    results.push(`TOS:    ${tos.toFixed(1)}`);
    results.push(`Kelvin: ${kelvin.toFixed(2)}`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label={`Date input for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              id={`${toolId}-time`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Time input"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
              Stardate System
            </label>
            <select
              id={`${toolId}-system`}
              value={system}
              onChange={(e) => setSystem(e.target.value as typeof system)}
              aria-label="Stardate system"
              className="input-field"
            >
              <option value="tng">TNG (Next Generation)</option>
              <option value="tos">TOS (Original Series)</option>
              <option value="kelvin">Kelvin Timeline</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Calculate Stardate
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Stardate Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
