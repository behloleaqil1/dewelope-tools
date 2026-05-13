'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ByzantineCalendarConverter - Convert Gregorian dates to Byzantine calendar (Anno Mundi variant).
 * The Byzantine era starts from September 1, 5509 BC (creation of the world).
 */
export default function ByzantineCalendarConverter({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('6');
  const [day, setDay] = useState('15');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Byzantine year starts September 1
    // Anno Mundi = Gregorian year + 5508 (if before September)
    // Anno Mundi = Gregorian year + 5509 (if September or later)
    const byzantineYear = m >= 9 ? y + 5509 : y + 5508;

    // Byzantine month (year starts in September)
    const _byzantineMonths = [
      'September', 'October', 'November', 'December',
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August'
    ];
    const gregorianMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Indiction cycle (15-year cycle used in Byzantine dating)
    const indiction = ((y - 3) % 15) || 15;

    // Solar cycle (28-year cycle)
    const solarCycle = ((y + 9) % 28) || 28;

    // Lunar/Metonic cycle (19-year cycle)
    const metonicCycle = ((y - 1) % 19) + 1;

    // Day of week
    const date = new Date(y, m - 1, d);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

    // Byzantine month position in their year
    const byzMonthIndex = (m + 3) % 12; // September=0 in Byzantine calendar

    const results = [
      `═══ Byzantine Calendar Conversion ═══`,
      ``,
      `Gregorian Date: ${gregorianMonths[m - 1]} ${d}, ${y} AD`,
      `Day of Week: ${dayOfWeek}`,
      ``,
      `── Byzantine Date ──`,
      `Anno Mundi (AM): ${byzantineYear}`,
      `Byzantine Year: ${byzantineYear} from Creation`,
      `Month: ${gregorianMonths[m - 1]} (${byzMonthIndex + 1}th month of Byzantine year)`,
      `Day: ${d}`,
      ``,
      `── Cycles ──`,
      `Indiction: ${indiction} (of 15-year cycle)`,
      `Solar Cycle: ${solarCycle} (of 28-year cycle)`,
      `Metonic Cycle: ${metonicCycle} (of 19-year cycle)`,
      ``,
      `── Notes ──`,
      `• Byzantine New Year: September 1`,
      `• Epoch: September 1, 5509 BC (Creation)`,
      `• Used by Eastern Roman Empire and Orthodox Church`,
      `• Officially replaced in Russia in 1700 by Peter the Great`,
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
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label="Year" />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" value={month} onChange={(e) => setMonth(e.target.value)} min="1" max="12" className="input-field" aria-label="Month" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" value={day} onChange={(e) => setDay(e.target.value)} min="1" max="31" className="input-field" aria-label="Day" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Convert to Byzantine Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Byzantine Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
