'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YorubaCalendarConverter - Convert Gregorian dates to the Yoruba calendar system (Nigerian).
 */
export default function YorubaCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const yorubaMonths = [
    'Sẹ́rẹ́', 'Èrèlé', 'Ẹrẹ̀nà', 'Ìgbé', 'Ẹ̀bìbí', 'Òkúdu',
    'Agẹmọ', 'Ògún', 'Owewe', 'Ọ̀wàrà', 'Bélú', 'Ọ̀pẹ̀'
  ];

  const yorubaDays = ['Ọjọ́ Àìkú', 'Ọjọ́ Ajé', 'Ọjọ́ Ìṣégun', 'Ọjọ́ Rú', 'Ọjọ́bọ̀', 'Ọjọ́ Ẹtì', 'Ọjọ́ Àbámẹ́ta'];

  const yorubaMarketDays = ['Ọjọ́ Jakúta', 'Ọjọ́ Awo', 'Ọjọ́ Ògún', 'Ọjọ́ Ọ̀ṣẹ'];

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

    // Yoruba calendar year offset (traditional epoch ~8042 BCE)
    const yorubaYear = y + 10042;

    // Yoruba month (approximate mapping)
    const yorubaMonth = yorubaMonths[m - 1];

    // Day of week in Yoruba
    const dayOfWeek = date.getDay();
    const yorubaDayName = yorubaDays[dayOfWeek];

    // Market day cycle (4-day cycle)
    const daysSinceEpoch = Math.floor(date.getTime() / 86400000);
    const marketDayIndex = ((daysSinceEpoch % 4) + 4) % 4;
    const marketDay = yorubaMarketDays[marketDayIndex];

    // Yoruba week (5-day week in traditional system)
    const yorubaWeekDay = ((daysSinceEpoch % 5) + 5) % 5;
    const yoruba5DayWeek = ['Ọjọ́ Àwọ́', 'Ọjọ́ Ògún', 'Ọjọ́ Jakúta', 'Ọjọ́ Ọbàtálá', 'Ọjọ́ Ọ̀ṣẹ'];

    const results = [
      `Gregorian Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `Yoruba Calendar:`,
      `  Year: ${yorubaYear} (Ọdún ${yorubaYear})`,
      `  Month: ${yorubaMonth} (Month ${m})`,
      `  Day: ${d}`,
      ``,
      `Day Names:`,
      `  7-day week: ${yorubaDayName}`,
      `  5-day week: ${yoruba5DayWeek[yorubaWeekDay]}`,
      `  Market day: ${marketDay}`,
      ``,
      `Cultural Notes:`,
      `  The Yoruba calendar is one of the oldest in Africa.`,
      `  Traditional year begins around June (month of Sẹ́rẹ́).`,
      `  The 4-day market cycle is central to Yoruba commerce.`,
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
          <button onClick={convert} className="btn-primary">Convert to Yoruba Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Yoruba Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
