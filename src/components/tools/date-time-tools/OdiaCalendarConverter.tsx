'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OdiaCalendarConverter - Convert Gregorian dates to Odia/Oriya calendar system.
 * Shows Odia month name, year, and day of week in Odia.
 */
export default function OdiaCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const odiaMonths = ['ବୈଶାଖ', 'ଜ୍ୟେଷ୍ଠ', 'ଆଷାଢ଼', 'ଶ୍ରାବଣ', 'ଭାଦ୍ରବ', 'ଆଶ୍ୱିନ', 'କାର୍ତ୍ତିକ', 'ମାର୍ଗଶିର', 'ପୌଷ', 'ମାଘ', 'ଫାଲ୍ଗୁନ', 'ଚୈତ୍ର'];
  const odiaMonthsRoman = ['Baisakha', 'Jyeshtha', 'Ashadha', 'Shrabana', 'Bhadrava', 'Ashwina', 'Kartika', 'Margashira', 'Pausha', 'Magha', 'Phalguna', 'Chaitra'];
  const odiaDays = ['ରବିବାର', 'ସୋମବାର', 'ମଙ୍ଗଳବାର', 'ବୁଧବାର', 'ଗୁରୁବାର', 'ଶୁକ୍ରବାର', 'ଶନିବାର'];
  const odiaDaysRoman = ['Rabibar', 'Somabar', 'Mangalabar', 'Budhabar', 'Gurubar', 'Shukrabar', 'Shanibar'];

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

    // Odia calendar (Amli era) starts ~593 CE
    // Solar calendar: new year around April 14
    // Approximate conversion
    let odiaYear: number;
    let odiaMonthIndex: number;

    if (m >= 4 && m <= 12) {
      // April onwards: same Odia year offset
      if (m === 4 && d < 14) {
        odiaYear = y - 594 + 1;
        odiaMonthIndex = 11; // Chaitra
      } else {
        odiaYear = y - 594 + 1;
        // Map Gregorian months to Odia months (approximate)
        const monthMap: Record<number, number> = { 4: 0, 5: 1, 6: 2, 7: 3, 8: 4, 9: 5, 10: 6, 11: 7, 12: 8 };
        odiaMonthIndex = monthMap[m] ?? 0;
      }
    } else {
      // Jan-March: previous Odia year
      odiaYear = y - 594;
      const monthMap: Record<number, number> = { 1: 9, 2: 10, 3: 11 };
      odiaMonthIndex = monthMap[m] ?? 9;
    }

    const dayOfWeek = date.getDay();

    let result = `=== Odia Calendar Conversion ===\n\n`;
    result += `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}\n\n`;
    result += `--- Odia Calendar ---\n`;
    result += `Odia Year (Amli): ${odiaYear}\n`;
    result += `Month: ${odiaMonths[odiaMonthIndex]} (${odiaMonthsRoman[odiaMonthIndex]})\n`;
    result += `Day of Week: ${odiaDays[dayOfWeek]} (${odiaDaysRoman[dayOfWeek]})\n\n`;
    result += `--- Additional Info ---\n`;
    result += `Era: Amli (ଅମଳୀ)\n`;
    result += `Region: Odisha, India\n`;
    result += `Calendar Type: Solar\n`;
    result += `New Year (Pana Sankranti): ~April 14\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-xs text-gray-600 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label="Year" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-xs text-gray-600 mb-1">Month</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-xs text-gray-600 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={convert} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Convert to Odia calendar">
          Convert to Odia Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Odia Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
