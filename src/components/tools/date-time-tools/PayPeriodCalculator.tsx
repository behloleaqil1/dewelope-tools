'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PayPeriodCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState('biweekly');
  const [periods, setPeriods] = useState('6');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) { setOutput('Enter a valid start date'); return; }
    const num = Math.min(Math.max(parseInt(periods) || 6, 1), 26);
    const results: string[] = [];
    const daysMap: Record<string, number> = { weekly: 7, biweekly: 14, monthly: 0 };

    for (let i = 0; i < num; i++) {
      const periodStart = new Date(start);
      if (frequency === 'monthly') {
        periodStart.setMonth(periodStart.getMonth() + i);
      } else {
        periodStart.setDate(periodStart.getDate() + i * daysMap[frequency]);
      }
      const periodEnd = new Date(periodStart);
      if (frequency === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(periodEnd.getDate() - 1);
      } else {
        periodEnd.setDate(periodEnd.getDate() + daysMap[frequency] - 1);
      }
      results.push(`Period ${i + 1}: ${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`);
    }
    setOutput(`Frequency: ${frequency}\n\n${results.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" aria-label={`Start date for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
        <select id={`${toolId}-freq`} value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label={`Frequency for ${toolName}`}>
          <option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-periods`} className="block text-sm font-medium text-gray-700 mb-1">Number of Periods</label>
        <input id={`${toolId}-periods`} value={periods} onChange={(e) => setPeriods(e.target.value)} className="input-field" aria-label={`Periods for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Pay Periods</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
