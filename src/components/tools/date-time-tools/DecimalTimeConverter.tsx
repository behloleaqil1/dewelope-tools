'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DecimalTimeConverter - Convert standard time to decimal/metric time.
 * Metric time divides the day into 10 hours, each with 100 minutes of 100 seconds.
 */
export default function DecimalTimeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [mode, setMode] = useState<'toDecimal' | 'toStandard'>('toDecimal');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (mode === 'toDecimal') {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;

      if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
        setOutput('Error: Please enter valid time (0-23 hours, 0-59 minutes, 0-59 seconds).');
        return;
      }

      const totalStandardSeconds = h * 3600 + m * 60 + s;
      const fractionOfDay = totalStandardSeconds / 86400;

      // Metric time: 10 hours per day, 100 minutes per hour, 100 seconds per minute
      const decimalTime = fractionOfDay * 10;
      const decHours = Math.floor(decimalTime);
      const decMinutesTotal = (decimalTime - decHours) * 100;
      const decMinutes = Math.floor(decMinutesTotal);
      const decSeconds = Math.floor((decMinutesTotal - decMinutes) * 100);

      // Also show as decimal hours (standard)
      const decimalHours = h + m / 60 + s / 3600;

      const lines: string[] = [];
      lines.push('═══ Decimal Time Conversion ═══');
      lines.push('');
      lines.push(`Standard time: ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      lines.push('');
      lines.push('─── Metric/French Revolutionary Time ───');
      lines.push(`Decimal time: ${decHours}:${decMinutes.toString().padStart(2, '0')}:${decSeconds.toString().padStart(2, '0')}`);
      lines.push(`(10 hours/day, 100 min/hour, 100 sec/min)`);
      lines.push('');
      lines.push('─── Decimal Hours (Standard) ───');
      lines.push(`${decimalHours.toFixed(4)} hours`);
      lines.push(`${(decimalHours * 60).toFixed(2)} minutes`);
      lines.push('');
      lines.push('─── Fraction of Day ───');
      lines.push(`${(fractionOfDay * 100).toFixed(4)}% of day elapsed`);
      lines.push(`${fractionOfDay.toFixed(6)} (fraction)`);

      setOutput(lines.join('\n'));
    } else {
      const decH = parseInt(hours) || 0;
      const decM = parseInt(minutes) || 0;
      const decS = parseInt(seconds) || 0;

      if (decH < 0 || decH > 9 || decM < 0 || decM > 99 || decS < 0 || decS > 99) {
        setOutput('Error: Decimal time: 0-9 hours, 0-99 minutes, 0-99 seconds.');
        return;
      }

      const fractionOfDay = (decH * 10000 + decM * 100 + decS) / 100000;
      const totalStandardSeconds = Math.round(fractionOfDay * 86400);

      const stdH = Math.floor(totalStandardSeconds / 3600);
      const stdM = Math.floor((totalStandardSeconds % 3600) / 60);
      const stdS = totalStandardSeconds % 60;

      const lines: string[] = [];
      lines.push('═══ Standard Time Conversion ═══');
      lines.push('');
      lines.push(`Decimal time: ${decH}:${decM.toString().padStart(2, '0')}:${decS.toString().padStart(2, '0')}`);
      lines.push('');
      lines.push('─── Standard Time ───');
      lines.push(`${stdH.toString().padStart(2, '0')}:${stdM.toString().padStart(2, '0')}:${stdS.toString().padStart(2, '0')}`);
      lines.push('');
      lines.push('─── Fraction of Day ───');
      lines.push(`${(fractionOfDay * 100).toFixed(4)}% of day elapsed`);

      setOutput(lines.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
          <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'toDecimal' | 'toStandard')} className="input-field w-64" aria-label={`Mode for ${toolName}`}>
            <option value="toDecimal">Standard → Decimal/Metric</option>
            <option value="toStandard">Decimal/Metric → Standard</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-hours`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'toDecimal' ? 'Hours (0-23)' : 'Decimal Hours (0-9)'}</label>
            <input id={`${toolId}-hours`} type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="12" className="input-field" aria-label="Hours" />
          </div>
          <div>
            <label htmlFor={`${toolId}-minutes`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'toDecimal' ? 'Minutes (0-59)' : 'Decimal Minutes (0-99)'}</label>
            <input id={`${toolId}-minutes`} type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="30" className="input-field" aria-label="Minutes" />
          </div>
          <div>
            <label htmlFor={`${toolId}-seconds`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'toDecimal' ? 'Seconds (0-59)' : 'Decimal Seconds (0-99)'}</label>
            <input id={`${toolId}-seconds`} type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="0" className="input-field" aria-label="Seconds" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert Time</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
