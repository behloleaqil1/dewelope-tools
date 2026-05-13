'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JucheCalendarConverter - Convert between Gregorian and North Korean Juche calendar.
 * The Juche calendar starts from 1912 (birth year of Kim Il-sung), where 1912 = Juche 1.
 */
export default function JucheCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState('gregorian-to-juche');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [output, setOutput] = useState('');

  const JUCHE_EPOCH = 1912; // Juche 1 = 1912 CE

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    const lines: string[] = [];
    lines.push('=== Juche Calendar Conversion ===');
    lines.push('');

    if (direction === 'gregorian-to-juche') {
      if (y < JUCHE_EPOCH) {
        setOutput('The Juche calendar only covers dates from 1912 CE onwards.');
        return;
      }
      const jucheYear = y - JUCHE_EPOCH + 1;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      lines.push('Input (Gregorian):');
      lines.push(`  ${monthNames[m - 1]} ${d}, ${y} CE`);
      lines.push('');
      lines.push('Output (Juche):');
      lines.push(`  Juche ${jucheYear} (주체 ${jucheYear}년)`);
      lines.push(`  ${monthNames[m - 1]} ${d}, Juche ${jucheYear}`);
      lines.push('');
      lines.push('Details:');
      lines.push(`  Juche Year ${jucheYear} = ${y} CE`);
      lines.push(`  Years since epoch: ${y - JUCHE_EPOCH}`);
      lines.push('');
      lines.push('About the Juche Calendar:');
      lines.push('  • Epoch: 1912 CE (birth year of Kim Il-sung)');
      lines.push('  • Juche 1 = 1912 CE');
      lines.push('  • Adopted officially in 1997');
      lines.push('  • Uses same months and days as Gregorian calendar');
    } else {
      const jucheY = y;
      if (jucheY < 1) {
        setOutput('Juche year must be 1 or greater.');
        return;
      }
      const gregorianYear = jucheY + JUCHE_EPOCH - 1;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      lines.push('Input (Juche):');
      lines.push(`  Juche ${jucheY}, ${monthNames[m - 1]} ${d}`);
      lines.push('');
      lines.push('Output (Gregorian):');
      lines.push(`  ${monthNames[m - 1]} ${d}, ${gregorianYear} CE`);
      lines.push('');
      lines.push('Details:');
      lines.push(`  Juche ${jucheY} = ${gregorianYear} CE`);
      lines.push(`  Gregorian year = Juche year + ${JUCHE_EPOCH - 1}`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="gregorian-to-juche">Gregorian → Juche</option>
              <option value="juche-to-gregorian">Juche → Gregorian</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'gregorian-to-juche' ? 'Gregorian Year' : 'Juche Year'}
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
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
