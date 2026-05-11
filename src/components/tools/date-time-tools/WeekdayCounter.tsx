'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function WeekdayCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [weekday, setWeekday] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setOutput('Please enter valid dates.'); return; }
    const target = parseInt(weekday);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let count = 0;
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;
    const current = new Date(start);
    while (current <= end) {
      if (current.getDay() === target) count++;
      current.setDate(current.getDate() + 1);
    }
    setOutput(`${dayNames[target]}s between ${date1} and ${date2}:\n\nCount: ${count}\nTotal days in range: ${Math.round((end.getTime() - start.getTime()) / 86400000) + 1}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="input-field" aria-label={`Start date for ${toolName}`} />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="input-field" aria-label={`End date for ${toolName}`} />
        </InputArea>
      </div>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weekday</label>
        <select value={weekday} onChange={(e) => setWeekday(e.target.value)} className="input-field" aria-label="Weekday">
          <option value="0">Sunday</option><option value="1">Monday</option><option value="2">Tuesday</option>
          <option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option>
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Count</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
