'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FrenchRepublicanCalendar - Convert Gregorian dates to the French Republican Calendar.
 * The Republican calendar was used in France from 1793 to 1805.
 */
export default function FrenchRepublicanCalendar({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const months = [
    'Vendémiaire', 'Brumaire', 'Frimaire',
    'Nivôse', 'Pluviôse', 'Ventôse',
    'Germinal', 'Floréal', 'Prairial',
    'Messidor', 'Thermidor', 'Fructidor',
  ];

  const monthMeanings = [
    'Grape harvest', 'Fog', 'Frost',
    'Snow', 'Rain', 'Wind',
    'Germination', 'Flower', 'Meadow',
    'Harvest', 'Heat', 'Fruit',
  ];

  const dayNames = [
    'Primidi', 'Duodi', 'Tridi', 'Quartidi', 'Quintidi',
    'Sextidi', 'Septidi', 'Octidi', 'Nonidi', 'Décadi',
  ];

  function _isRepublicanLeapYear(year: number): boolean {
    // Approximate: use the same rule as Gregorian but offset
    const gregYear = year + 1791;
    return (gregYear % 4 === 0 && gregYear % 100 !== 0) || gregYear % 400 === 0;
  }

  function gregorianToRepublican(date: Date): { year: number; month: number; day: number; complementary: boolean } {
    // Republican year starts on autumnal equinox (~Sep 22)
    const year = date.getFullYear();

    // Calculate days since Sep 22 of the current or previous year
    let startYear = year;
    const equinox = new Date(year, 8, 22); // Sep 22

    if (date < equinox) {
      startYear = year - 1;
    }

    const equinoxStart = new Date(startYear, 8, 22);
    const diffMs = date.getTime() - equinoxStart.getTime();
    const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const repYear = startYear - 1791; // Year I started Sep 22, 1792

    if (dayOfYear < 0) {
      return { year: repYear - 1, month: 12, day: 1, complementary: true };
    }

    if (dayOfYear >= 360) {
      // Complementary days (Sansculottides)
      return { year: repYear, month: 13, day: dayOfYear - 359, complementary: true };
    }

    const repMonth = Math.floor(dayOfYear / 30) + 1;
    const repDay = (dayOfYear % 30) + 1;

    return { year: repYear, month: repMonth, day: repDay, complementary: false };
  }

  function toRomanNumeral(num: number): string {
    if (num <= 0) return String(num);
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    let n = num;
    for (let i = 0; i < vals.length; i++) {
      while (n >= vals[i]) {
        result += syms[i];
        n -= vals[i];
      }
    }
    return result;
  }

  function handleConvert() {
    setError('');
    setOutput('');

    if (!dateInput) {
      setError('Please select a date.');
      return;
    }

    const date = new Date(dateInput + 'T12:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date.');
      return;
    }

    if (date.getFullYear() < 1792) {
      setError('The French Republican Calendar starts from September 22, 1792.');
      return;
    }

    const rep = gregorianToRepublican(date);

    const complementaryDays = ['La Fête de la Vertu', 'La Fête du Génie', 'La Fête du Travail', 'La Fête de l\'Opinion', 'La Fête des Récompenses', 'La Fête de la Révolution'];

    let lines: string[];
    if (rep.complementary && rep.month === 13) {
      lines = [
        `French Republican Calendar`,
        `──────────────────────────────`,
        `Gregorian: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        `──────────────────────────────`,
        `Republican Year: ${toRomanNumeral(rep.year)} (${rep.year})`,
        `Complementary Day: ${complementaryDays[rep.day - 1] || `Day ${rep.day}`}`,
        `(Sansculottides - extra days at year end)`,
      ];
    } else {
      const monthName = months[rep.month - 1] || 'Unknown';
      const meaning = monthMeanings[rep.month - 1] || '';
      const dayName = dayNames[(rep.day - 1) % 10];
      const decade = Math.ceil(rep.day / 10);

      lines = [
        `French Republican Calendar`,
        `──────────────────────────────`,
        `Gregorian: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        `──────────────────────────────`,
        `Date: ${rep.day} ${monthName} An ${toRomanNumeral(rep.year)}`,
        `Year: ${toRomanNumeral(rep.year)} (${rep.year})`,
        `Month: ${monthName} (${meaning})`,
        `Day: ${rep.day} (${dayName}, Décade ${decade})`,
        `──────────────────────────────`,
        `Season: ${rep.month <= 3 ? 'Autumn' : rep.month <= 6 ? 'Winter' : rep.month <= 9 ? 'Spring' : 'Summer'}`,
      ];
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Gregorian Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
          min="1792-09-22"
        />
        <button onClick={handleConvert} className="btn-primary mt-2">Convert to Republican Calendar</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Republican Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
