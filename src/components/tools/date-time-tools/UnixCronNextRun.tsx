'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function UnixCronNextRun({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cronExpr, setCronExpr] = useState('*/5 * * * *');
  const [numRuns, setNumRuns] = useState(10);
  const [output, setOutput] = useState('');

  const parseCronField = (field: string, min: number, max: number): number[] => {
    const values: Set<number> = new Set();
    const parts = field.split(',');
    for (const part of parts) {
      if (part === '*') {
        for (let i = min; i <= max; i++) values.add(i);
      } else if (part.includes('/')) {
        const [range, step] = part.split('/');
        const stepNum = parseInt(step);
        const start = range === '*' ? min : parseInt(range);
        for (let i = start; i <= max; i += stepNum) values.add(i);
      } else if (part.includes('-')) {
        const [s, e] = part.split('-').map(Number);
        for (let i = s; i <= e; i++) values.add(i);
      } else {
        values.add(parseInt(part));
      }
    }
    return Array.from(values).filter(v => v >= min && v <= max).sort((a, b) => a - b);
  };

  const calculate = () => {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) {
      setOutput('Invalid cron expression. Expected 5 fields: minute hour day-of-month month day-of-week');
      return;
    }

    try {
      const minutes = parseCronField(parts[0], 0, 59);
      const hours = parseCronField(parts[1], 0, 23);
      const daysOfMonth = parseCronField(parts[2], 1, 31);
      const months = parseCronField(parts[3], 1, 12);
      const daysOfWeek = parseCronField(parts[4], 0, 6);

      const now = new Date();
      const results: Date[] = [];
      const candidate = new Date(now);
      candidate.setSeconds(0);
      candidate.setMilliseconds(0);
      candidate.setMinutes(candidate.getMinutes() + 1);

      let iterations = 0;
      const maxIterations = 525600; // 1 year of minutes

      while (results.length < numRuns && iterations < maxIterations) {
        iterations++;
        const m = candidate.getMinutes();
        const h = candidate.getHours();
        const dom = candidate.getDate();
        const mon = candidate.getMonth() + 1;
        const dow = candidate.getDay();

        if (
          minutes.includes(m) &&
          hours.includes(h) &&
          daysOfMonth.includes(dom) &&
          months.includes(mon) &&
          daysOfWeek.includes(dow)
        ) {
          results.push(new Date(candidate));
        }
        candidate.setMinutes(candidate.getMinutes() + 1);
      }

      const lines = [
        `=== Cron Expression: ${cronExpr} ===`,
        ``,
        `Fields: minute(${parts[0]}) hour(${parts[1]}) dom(${parts[2]}) month(${parts[3]}) dow(${parts[4]})`,
        ``,
        `--- Next ${results.length} Run Times ---`,
      ];

      results.forEach((d, i) => {
        lines.push(`${(i + 1).toString().padStart(2)}. ${d.toLocaleString()}`);
      });

      if (results.length === 0) {
        lines.push('No matching times found within the next year.');
      }

      setOutput(lines.join('\n'));
    } catch {
      setOutput('Error parsing cron expression. Please check the format.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-cron`} className="block text-sm font-medium text-gray-700 mb-1">
          Cron Expression (5 fields)
        </label>
        <input
          id={`${toolId}-cron`}
          type="text"
          value={cronExpr}
          onChange={(e) => setCronExpr(e.target.value)}
          placeholder="*/5 * * * *"
          className="input-field font-mono"
          aria-label={`Cron expression for ${toolName}`}
        />
        <p className="text-xs text-gray-500 mt-1">Format: minute hour day-of-month month day-of-week</p>
        <div className="mt-3">
          <label htmlFor={`${toolId}-num`} className="block text-sm font-medium text-gray-700 mb-1">Number of runs to show</label>
          <input id={`${toolId}-num`} type="number" min={1} max={50} value={numRuns} onChange={(e) => setNumRuns(Number(e.target.value))} className="input-field w-24" aria-label="Number of runs" />
        </div>
        <button onClick={calculate} className="btn-primary mt-2">Calculate Next Runs</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Next Run Times</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
