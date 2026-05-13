'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MinguoCalendarConverter - Convert Gregorian dates to Republic of China (Minguo) calendar.
 * The Minguo calendar starts from 1912 (Year 1 = 1912 CE).
 */
export default function MinguoCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [direction, setDirection] = useState<'to-minguo' | 'to-gregorian'>('to-minguo');
  const [output, setOutput] = useState('');

  const MINGUO_EPOCH = 1911; // Minguo Year 1 = 1912 CE, so offset is 1911

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    let result = '';

    if (direction === 'to-minguo') {
      const minguoYear = y - MINGUO_EPOCH;
      
      if (minguoYear < 1) {
        const beforeROC = Math.abs(minguoYear) + 1;
        result += `=== Gregorian to Minguo Calendar ===\n\n`;
        result += `Gregorian Date: ${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}\n\n`;
        result += `Minguo Date: 民國前 ${beforeROC} 年 ${m} 月 ${d} 日\n`;
        result += `(${beforeROC} years before the Republic)\n\n`;
        result += `Note: The Republic of China was established in 1912.\n`;
        result += `This date is before the founding of the ROC.\n`;
      } else {
        result += `=== Gregorian to Minguo Calendar ===\n\n`;
        result += `Gregorian Date: ${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}\n\n`;
        result += `Minguo Date: 民國 ${minguoYear} 年 ${m} 月 ${d} 日\n`;
        result += `Numeric: ${minguoYear}/${m.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}\n\n`;
        result += `--- Details ---\n`;
        result += `Minguo Year: ${minguoYear} (民國${minguoYear}年)\n`;
        result += `Gregorian Year: ${y} CE\n`;
        result += `Month: ${m} 月\n`;
        result += `Day: ${d} 日\n\n`;
        result += `--- About the Minguo Calendar ---\n`;
        result += `• Year 1 = 1912 CE (founding of the Republic of China)\n`;
        result += `• Formula: Minguo Year = Gregorian Year − 1911\n`;
        result += `• Used officially in Taiwan (ROC)\n`;
        result += `• Same months and days as the Gregorian calendar\n`;
      }
    } else {
      // Minguo to Gregorian
      const gregorianYear = y + MINGUO_EPOCH;
      result += `=== Minguo to Gregorian Calendar ===\n\n`;
      result += `Minguo Date: 民國 ${y} 年 ${m} 月 ${d} 日\n\n`;
      result += `Gregorian Date: ${gregorianYear}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}\n\n`;
      result += `--- Details ---\n`;
      result += `Minguo Year: ${y} (民國${y}年)\n`;
      result += `Gregorian Year: ${gregorianYear} CE\n`;
      result += `Month: ${m} 月\n`;
      result += `Day: ${d} 日\n\n`;
      result += `--- Formula ---\n`;
      result += `Gregorian Year = Minguo Year + 1911\n`;
      result += `${y} + 1911 = ${gregorianYear}\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="to-minguo">Gregorian → Minguo (民國)</option>
              <option value="to-gregorian">Minguo (民國) → Gregorian</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'to-minguo' ? 'Gregorian Year' : 'Minguo Year (民國)'}
            </label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label="Year" />
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
        <button onClick={convert} className="btn-primary mt-4">Convert Date</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
