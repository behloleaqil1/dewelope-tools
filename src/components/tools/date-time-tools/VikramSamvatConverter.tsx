'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VikramSamvatConverter - Convert Gregorian to Vikram Samvat (Hindu calendar).
 * Calculates the Vikram Samvat year, month, and tithi information.
 */
export default function VikramSamvatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const vikramMonths = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika',
    'Margashirsha', 'Pausha', 'Magha', 'Phalguna',
  ];

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Vikram Samvat is approximately 56-57 years ahead of Gregorian
    // The new year starts around March/April (Chaitra Shukla Pratipada)
    let vsYear: number;
    if (m >= 4) {
      // After April: current Gregorian year + 57
      vsYear = y + 57;
    } else if (m === 3 && d >= 22) {
      // Late March (approximate new year)
      vsYear = y + 57;
    } else {
      // Before new year: current Gregorian year + 56
      vsYear = y + 56;
    }

    // Approximate Vikram Samvat month mapping
    // Chaitra starts ~March/April
    const monthOffset = (m + 8) % 12; // rough mapping
    const vsMonth = vikramMonths[monthOffset];

    // Approximate paksha (fortnight)
    const paksha = d <= 15 ? 'Shukla Paksha (Bright Half)' : 'Krishna Paksha (Dark Half)';

    // Approximate tithi (lunar day)
    const tithi = d <= 15 ? d : d - 15;
    const tithiNames = [
      '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya',
    ];

    // Determine era name
    const eraName = 'Vikram Samvat (विक्रम संवत्)';

    // Determine season (Ritu)
    const ritus: Record<string, string> = {
      'Chaitra': 'Vasanta (Spring)',
      'Vaishakha': 'Vasanta (Spring)',
      'Jyeshtha': 'Grishma (Summer)',
      'Ashadha': 'Grishma (Summer)',
      'Shravana': 'Varsha (Monsoon)',
      'Bhadrapada': 'Varsha (Monsoon)',
      'Ashvina': 'Sharad (Autumn)',
      'Kartika': 'Sharad (Autumn)',
      'Margashirsha': 'Hemanta (Pre-winter)',
      'Pausha': 'Hemanta (Pre-winter)',
      'Magha': 'Shishira (Winter)',
      'Phalguna': 'Shishira (Winter)',
    };

    const results = [
      '=== Vikram Samvat Conversion ===',
      '',
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      '',
      '--- Vikram Samvat ---',
      `Era: ${eraName}`,
      `Year: ${vsYear} VS`,
      `Month: ${vsMonth}`,
      `Paksha: ${paksha}`,
      `Tithi (approx): ${tithiNames[tithi] || 'Unknown'} (${tithi})`,
      `Season (Ritu): ${ritus[vsMonth] || 'Unknown'}`,
      '',
      '--- Additional Info ---',
      `Vikram Samvat epoch: 57 BCE`,
      `Calendar type: Lunisolar`,
      `New Year: Chaitra Shukla Pratipada (March/April)`,
      `Current VS Year: ${vsYear}`,
      '',
      '--- Note ---',
      'This is an approximate conversion. Exact Vikram Samvat dates',
      'depend on lunar calculations and regional variations',
      '(Purnimant vs Amant systems).',
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} min="1" max="12" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
            <input type="number" value={day} onChange={(e) => setDay(e.target.value)} min="1" max="31" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Convert to Vikram Samvat</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Vikram Samvat Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
