'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TaiTimeConverter - Convert between UTC and TAI (International Atomic Time).
 * TAI is ahead of UTC by the current number of leap seconds (37 as of 2017).
 */
export default function TaiTimeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [direction, setDirection] = useState<'utc-to-tai' | 'tai-to-utc'>('utc-to-tai');
  const [output, setOutput] = useState('');

  // Leap second table: [UTC date, cumulative TAI-UTC offset]
  const leapSeconds: [string, number][] = [
    ['1972-01-01', 10], ['1972-07-01', 11], ['1973-01-01', 12],
    ['1974-01-01', 13], ['1975-01-01', 14], ['1976-01-01', 15],
    ['1977-01-01', 16], ['1978-01-01', 17], ['1979-01-01', 18],
    ['1980-01-01', 19], ['1981-07-01', 20], ['1982-07-01', 21],
    ['1983-07-01', 22], ['1985-07-01', 23], ['1988-01-01', 24],
    ['1990-01-01', 25], ['1991-01-01', 26], ['1992-07-01', 27],
    ['1993-07-01', 28], ['1994-07-01', 29], ['1996-01-01', 30],
    ['1997-07-01', 31], ['1999-01-01', 32], ['2006-01-01', 33],
    ['2009-01-01', 34], ['2012-07-01', 35], ['2015-07-01', 36],
    ['2017-01-01', 37],
  ];

  const getLeapSeconds = (dateStr: string): number => {
    let offset = 0;
    for (const [date, secs] of leapSeconds) {
      if (dateStr >= date) offset = secs;
      else break;
    }
    return offset;
  };

  const convert = () => {
    const dateStr = inputDate || new Date().toISOString().split('T')[0];
    const timeStr = inputTime || '00:00:00';

    const fullStr = `${dateStr}T${timeStr}Z`;
    const date = new Date(fullStr);

    if (isNaN(date.getTime())) {
      setOutput('Invalid date or time. Please use YYYY-MM-DD and HH:MM:SS formats.');
      return;
    }

    const offset = getLeapSeconds(dateStr);

    let resultDate: Date;
    let resultLabel: string;
    let inputLabel: string;

    if (direction === 'utc-to-tai') {
      resultDate = new Date(date.getTime() + offset * 1000);
      inputLabel = 'UTC';
      resultLabel = 'TAI';
    } else {
      resultDate = new Date(date.getTime() - offset * 1000);
      inputLabel = 'TAI';
      resultLabel = 'UTC';
    }

    const formatDate = (d: Date) => d.toISOString().replace('T', ' ').replace('.000Z', '');

    const results = [
      `═══ Conversion: ${inputLabel} → ${resultLabel} ═══`,
      ``,
      `Input (${inputLabel}):  ${formatDate(date)}`,
      `Output (${resultLabel}): ${formatDate(resultDate)}`,
      ``,
      `═══ Details ═══`,
      `Current TAI-UTC offset: ${offset} seconds`,
      `Direction: ${direction === 'utc-to-tai' ? 'TAI = UTC + leap seconds' : 'UTC = TAI - leap seconds'}`,
      ``,
      `═══ About TAI ═══`,
      `TAI (International Atomic Time) is a continuous time scale`,
      `maintained by atomic clocks worldwide. Unlike UTC, TAI does`,
      `not include leap seconds, so it runs ahead of UTC.`,
      ``,
      `As of 2017-01-01, TAI is ${offset} seconds ahead of UTC.`,
      ``,
      `═══ Leap Second History ═══`,
      `Total leap seconds inserted since 1972: ${offset - 10 + 10}`,
      `Last leap second: 2017-01-01 (offset became 37s)`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as 'utc-to-tai' | 'tai-to-utc')} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="utc-to-tai">UTC → TAI</option>
              <option value="tai-to-utc">TAI → UTC</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date (YYYY-MM-DD)</label>
            <input id={`${toolId}-date`} type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="input-field" aria-label="Input date" />
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time (HH:MM:SS)</label>
            <input id={`${toolId}-time`} type="time" step="1" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="input-field" aria-label="Input time" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
