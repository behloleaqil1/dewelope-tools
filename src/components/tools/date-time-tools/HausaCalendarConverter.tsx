'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HausaCalendarConverter - Convert Gregorian dates to the Hausa calendar system
 * used in Nigeria. Shows Hausa month names and day names.
 */
export default function HausaCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const hausaMonths = [
    'Janairu', 'Fabrairu', 'Maris', 'Afrilu', 'Mayu', 'Yuni',
    'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'
  ];

  const hausaDays = [
    'Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Jumma\'a', 'Asabar'
  ];

  const hausaTraditionalMonths = [
    'Watan Azumi', 'Watan Sallah', 'Watan Biki', 'Watan Takutar Sallah',
    'Watan Jima', 'Watan Dare', 'Watan Damina', 'Watan Rani',
    'Watan Hunturu', 'Watan Bazara', 'Watan Shuka', 'Watan Girbi'
  ];

  const convert = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Error: Invalid date for the given month.');
      return;
    }

    const dayOfWeek = date.getDay();
    const hausaDay = hausaDays[dayOfWeek];
    const hausaMonth = hausaMonths[m - 1];
    const traditionalMonth = hausaTraditionalMonths[m - 1];

    // Hausa calendar year approximation (based on Islamic Hijri calendar influence)
    const hijriOffset = Math.floor((y - 622) * (33 / 32));

    const result = `Hausa Calendar Conversion
═══════════════════════════════════════
Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}

Hausa Day Name: ${hausaDay}
Hausa Month (Modern): ${hausaMonth}
Hausa Month (Traditional): ${traditionalMonth}
Day of Month: ${d}
Year: ${y}

Approximate Hijri Year: ${hijriOffset}

Day Names Reference:
  Sunday = Lahadi
  Monday = Litinin
  Tuesday = Talata
  Wednesday = Laraba
  Thursday = Alhamis
  Friday = Jumma'a
  Saturday = Asabar

Note: The Hausa calendar system is influenced by both
Islamic and traditional Nigerian timekeeping.`;

    setOutput(result);
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
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" aria-label="Day" className="input-field" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to Hausa Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hausa Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
