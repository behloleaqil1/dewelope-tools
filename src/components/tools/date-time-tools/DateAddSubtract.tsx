'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DateAddSubtract({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('7');
  const [unit, setUnit] = useState('days');
  const [op, setOp] = useState('add');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = new Date(date);
    const n = parseInt(amount) * (op === 'subtract' ? -1 : 1);
    if (isNaN(d.getTime()) || isNaN(n)) { setOutput('Please enter valid inputs.'); return; }
    switch (unit) {
      case 'days': d.setDate(d.getDate() + n); break;
      case 'weeks': d.setDate(d.getDate() + n * 7); break;
      case 'months': d.setMonth(d.getMonth() + n); break;
      case 'years': d.setFullYear(d.getFullYear() + n); break;
    }
    setOutput(`Start: ${date}\nOperation: ${op} ${Math.abs(n)} ${unit}\nResult: ${d.toISOString().split('T')[0]}\nDay: ${d.toLocaleDateString('en-US', { weekday: 'long' })}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" aria-label={`Date for ${toolName}`} />
      </InputArea>
      <div className="grid grid-cols-3 gap-2">
        <select value={op} onChange={(e) => setOp(e.target.value)} className="input-field" aria-label="Operation">
          <option value="add">Add</option><option value="subtract">Subtract</option>
        </select>
        <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" aria-label="Amount" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field" aria-label="Unit">
          <option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option>
        </select>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
