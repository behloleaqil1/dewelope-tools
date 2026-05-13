'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MARATHI_MONTHS = [
  { name: 'Chaitra', marathi: 'चैत्र' },
  { name: 'Vaishakha', marathi: 'वैशाख' },
  { name: 'Jyeshtha', marathi: 'ज्येष्ठ' },
  { name: 'Ashadha', marathi: 'आषाढ' },
  { name: 'Shravana', marathi: 'श्रावण' },
  { name: 'Bhadrapada', marathi: 'भाद्रपद' },
  { name: 'Ashwin', marathi: 'आश्विन' },
  { name: 'Kartik', marathi: 'कार्तिक' },
  { name: 'Margashirsha', marathi: 'मार्गशीर्ष' },
  { name: 'Pausha', marathi: 'पौष' },
  { name: 'Magha', marathi: 'माघ' },
  { name: 'Phalguna', marathi: 'फाल्गुन' },
];

/**
 * MarathiCalendarConverter - Convert Gregorian to Marathi/Shalivahana calendar.
 */
export default function MarathiCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return;

    // Shalivahana Shaka era starts 78 CE
    // The Marathi new year (Gudi Padwa) falls around March/April
    // Approximate: Shaka year = Gregorian year - 78 (after March), or year - 79 (before March)
    let shakaYear: number;
    let monthIndex: number;

    if (m >= 3 && m <= 12) {
      shakaYear = y - 78;
      // Map Gregorian months to approximate Marathi months
      // March-April: Chaitra, April-May: Vaishakha, etc.
      monthIndex = m - 3;
    } else {
      shakaYear = y - 79;
      monthIndex = m + 9; // Jan = Pausha(9), Feb = Magha(10)
    }

    if (monthIndex >= 12) monthIndex = monthIndex - 12;
    const marathiMonth = MARATHI_MONTHS[monthIndex];

    // Approximate paksha (fortnight)
    const paksha = d <= 15 ? 'Shukla (शुक्ल) - Bright half' : 'Krishna (कृष्ण) - Dark half';
    const tithi = d <= 15 ? d : d - 15;

    const results = [
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Marathi (Shalivahana Shaka) Calendar:`,
      `  Shaka Year: ${shakaYear}`,
      `  Month: ${marathiMonth.marathi} (${marathiMonth.name})`,
      `  Paksha: ${paksha}`,
      `  Tithi (approx): ${tithi}`,
      ``,
      `Era Information:`,
      `  Shalivahana Shaka Era began: 78 CE`,
      `  New Year (Gudi Padwa): Chaitra Shukla Pratipada`,
      `  Calendar Type: Lunisolar`,
      ``,
      `Note: This is an approximation. Exact tithi requires`,
      `astronomical calculations based on lunar position.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" aria-label={`Year for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" aria-label="Month" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" aria-label="Day" className="input-field" />
          </div>
        </div>
        <button onClick={convert} className="mt-4 btn-primary">Convert to Marathi Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Marathi Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
