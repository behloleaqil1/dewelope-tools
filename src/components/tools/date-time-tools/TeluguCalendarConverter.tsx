'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TeluguCalendarConverter - Convert Gregorian dates to the Telugu (Shalivahana Shaka)
 * calendar system with Telugu month names, day of week, and Samvatsara.
 */
export default function TeluguCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const teluguMonths = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashwija', 'Karthika',
    'Margashira', 'Pushya', 'Magha', 'Phalguna'
  ];

  const teluguDays = [
    'Aadivaaram (Sunday)', 'Somavaaram (Monday)', 'Mangalavaaram (Tuesday)',
    'Budhavaaram (Wednesday)', 'Guruvaaram (Thursday)', 'Shukravaaram (Friday)',
    'Shanivaaram (Saturday)'
  ];

  const samvatsaras = [
    'Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajothpatti',
    'Angirasa', 'Shrimukha', 'Bhava', 'Yuva', 'Dhaatu',
    'Eeshwara', 'Bahudhanya', 'Pramaadhi', 'Vikrama', 'Vrisha',
    'Chitrabhanu', 'Svabhanu', 'Taarana', 'Paarthiva', 'Vyaya',
    'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikruti', 'Khara',
    'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
    'Hevilambi', 'Vilambi', 'Vikari', 'Sharvari', 'Plava',
    'Shubhakrut', 'Shobhakrut', 'Krodhi', 'Vishvavasu', 'Parabhava',
    'Plavanga', 'Keelaka', 'Saumya', 'Sadharana', 'Virodhikrut',
    'Paridhavi', 'Pramaadeecha', 'Ananda', 'Rakshasa', 'Nala',
    'Pingala', 'Kalayukti', 'Siddharthi', 'Raudri', 'Durmathi',
    'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya'
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Invalid date for the given month.');
      return;
    }

    // Shalivahana Shaka era starts 78 CE
    // Telugu new year (Ugadi) falls in March/April
    let shakaYear = y - 78;
    if (m < 3 || (m === 3 && d < 22)) {
      shakaYear -= 1;
    }

    // Approximate Telugu month (solar-based approximation)
    // Chaitra starts around March 22
    let teluguMonthIndex: number;
    if (m >= 3 && d >= 22) {
      teluguMonthIndex = m - 3;
    } else if (m > 3) {
      teluguMonthIndex = m - 3;
    } else {
      teluguMonthIndex = m + 9;
    }
    teluguMonthIndex = ((teluguMonthIndex % 12) + 12) % 12;

    // Samvatsara (60-year cycle)
    const samvatsaraIndex = ((shakaYear - 1) % 60 + 60) % 60;
    const samvatsaraName = samvatsaras[samvatsaraIndex];

    // Day of week
    const dayOfWeek = date.getDay();
    const teluguDay = teluguDays[dayOfWeek];

    // Paksha (fortnight) - simplified
    const dayInMonth = d;
    const paksha = dayInMonth <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';
    const tithi = dayInMonth <= 15 ? dayInMonth : dayInMonth - 15;

    const results = [
      `=== Telugu Calendar Conversion ===`,
      ``,
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Telugu Calendar:`,
      `  Shaka Year: ${shakaYear}`,
      `  Month: ${teluguMonths[teluguMonthIndex]}`,
      `  Day: ${d}`,
      `  Day of Week: ${teluguDay}`,
      ``,
      `Samvatsara: ${samvatsaraName}`,
      `Paksha: ${paksha}`,
      `Tithi: ${tithi} (approximate)`,
      ``,
      `Era Information:`,
      `  Shalivahana Shaka Era (started 78 CE)`,
      `  Telugu New Year (Ugadi): Chaitra Shukla Padyami`,
      `  Current Shaka Year: ${shakaYear}`,
      ``,
      `Note: This is an approximation. Exact Telugu calendar`,
      `dates depend on lunar calculations and local panchangam.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" min="79" max="9999" value={year} onChange={(e) => setYear(e.target.value)} aria-label={`Year for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day" className="input-field" />
            </div>
          </div>
          <button onClick={convert} className="btn-primary w-full">Convert to Telugu Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Telugu Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
