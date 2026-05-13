'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TamilCalendarConverter - Convert Gregorian dates to Tamil calendar.
 */
export default function TamilCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const tamilMonths = [
    'Chithirai', 'Vaigasi', 'Aani', 'Aadi', 'Aavani', 'Purattasi',
    'Aippasi', 'Karthigai', 'Margazhi', 'Thai', 'Maasi', 'Panguni'
  ];

  const tamilDays = ['Nyayiru', 'Thingal', 'Chevvai', 'Budhan', 'Viyazhan', 'Velli', 'Sani'];

  const tamilYearNames = [
    'Prabhava', 'Vibhava', 'Shukla', 'Pramoduta', 'Prajothpatti',
    'Angirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhatu',
    'Eeshvara', 'Vehumathi', 'Pramathi', 'Vikrama', 'Vishu',
    'Chitrabhanu', 'Subhanu', 'Dharana', 'Parthiva', 'Vyaya',
    'Sarvajittu', 'Sarvadhari', 'Virodhi', 'Vikruthi', 'Khara',
    'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
    'Hevilambi', 'Vilambi', 'Vikari', 'Sarvari', 'Plava',
    'Subhakrithu', 'Sobhakrithu', 'Krodhi', 'Vishvavasu', 'Parabhava',
    'Plavanga', 'Keelaka', 'Saumya', 'Sadharana', 'Virodhikrithu',
    'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
    'Pingala', 'Kalayukthi', 'Siddharthi', 'Raudri', 'Durmathi',
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

    // Tamil calendar approximation
    // Tamil New Year starts around April 14
    // The Tamil year is approximately Gregorian year - 57 (Thiruvalluvar year)
    const tamilYear = y + 31; // Thiruvalluvar year offset
    
    // Approximate Tamil month calculation
    // Tamil months start around the 14th-15th of each Gregorian month
    let tamilMonthIndex: number;
    let tamilDay: number;

    if (d >= 14) {
      tamilMonthIndex = (m - 4 + 12) % 12;
      tamilDay = d - 13;
    } else {
      tamilMonthIndex = (m - 5 + 12) % 12;
      tamilDay = d + 17;
    }

    const dayOfWeek = date.getDay();
    const yearNameIndex = (y - 1987) % 60;
    const tamilYearName = tamilYearNames[yearNameIndex >= 0 ? yearNameIndex : yearNameIndex + 60];

    const result = `Tamil Calendar Conversion
═══════════════════════════════════
Gregorian Date:        ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}

Tamil Date
───────────────────────────────────
Tamil Year:            ${tamilYear} (Thiruvalluvar)
Year Name:             ${tamilYearName}
Tamil Month:           ${tamilMonths[tamilMonthIndex]}
Tamil Day:             ${tamilDay}
Day of Week:           ${tamilDays[dayOfWeek]}

Full Tamil Date:       ${tamilDay} ${tamilMonths[tamilMonthIndex]} ${tamilYear}

Note: This is an approximation. The exact Tamil
calendar depends on astronomical calculations
(solar transit into zodiac signs).`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
            </div>
          </div>
          <button onClick={convert} className="btn-primary w-full">Convert to Tamil Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tamil Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
