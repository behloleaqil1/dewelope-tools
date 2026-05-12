'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TibetanCalendarConverter - Convert Gregorian dates to the Tibetan calendar.
 * Uses an approximation of the Tibetan Phugpa calendar system with 12 months
 * and a 60-year cycle (Rabjung).
 */
export default function TibetanCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const tibetanMonths = [
    'Mchu', 'Dbo', 'Nag-pa', 'Sa-ga', 'Snron', 'Chu-stod',
    'Gro-bzhin', 'Khrums', 'Tha-skar', 'Smin-drug', 'Mgo', 'Rgyal',
  ];

  const elements = ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];
  const animals = ['Mouse', 'Ox', 'Tiger', 'Hare', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
  const genders = ['Male', 'Female'];

  const convert = () => {
    setError('');
    setOutput('');

    if (!dateInput) {
      setError('Please select a date.');
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError('Invalid date.');
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based
    const day = date.getDate();

    // Tibetan New Year (Losar) typically falls in Feb/March
    // Approximate: Tibetan year starts ~Feb
    let tibYear = year;
    if (month < 1) { // Before February
      tibYear = year - 1;
    }

    // Rabjung cycle: 1st cycle started 1027 CE
    const rabjungStart = 1027;
    const yearsSinceStart = tibYear - rabjungStart;
    const rabjungCycle = Math.floor(yearsSinceStart / 60) + 1;
    const yearInCycle = ((yearsSinceStart % 60) + 60) % 60;

    // Element-Animal year naming
    const elementIdx = Math.floor((yearInCycle % 10) / 2);
    const animalIdx = yearInCycle % 12;
    const genderIdx = yearInCycle % 2;

    // Approximate Tibetan month (shifted by ~1 month from Gregorian)
    const tibMonthIdx = (month + 11) % 12; // Shift: Tibetan month 1 ≈ Feb
    const tibMonth = tibetanMonths[tibMonthIdx];

    // Royal year (from 127 BCE)
    const royalYear = tibYear + 127;

    const lines = [
      `Tibetan Calendar Date (Approximate):`,
      ``,
      `  Tibetan Year: ${tibYear} CE`,
      `  Royal Year: ${royalYear}`,
      `  Rabjung Cycle: ${rabjungCycle} (year ${yearInCycle + 1} of 60)`,
      `  Year Name: ${genders[genderIdx]} ${elements[elementIdx]}-${animals[animalIdx]}`,
      `  Month: ${tibMonth} (month ${tibMonthIdx + 1})`,
      `  Day: ${day}`,
      ``,
      `Input: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `Note: This is an approximation. The actual Tibetan calendar`,
      `uses complex astronomical calculations (Phugpa system) and`,
      `may differ by 1-2 days from this simplified conversion.`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Gregorian Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date input for ${toolName}`}
          className="input-field mb-3"
        />
        <button
          onClick={convert}
          className="btn-primary mt-2"
        >
          Convert to Tibetan Calendar
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tibetan Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
