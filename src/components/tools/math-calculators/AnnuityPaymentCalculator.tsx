'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AnnuityPaymentCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pv, setPv] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pvVal = parseFloat(pv);
    const r = parseFloat(rate) / 100;
    const n = parseInt(periods);
    if (isNaN(pvVal) || isNaN(r) || isNaN(n)) { setOutput('Enter valid numbers.'); return; }
    if (pvVal <= 0 || n <= 0) { setOutput('Present value and periods must be positive.'); return; }
    if (r < 0) { setOutput('Rate cannot be negative.'); return; }

    let payment: number;
    if (r === 0) {
      payment = pvVal / n;
    } else {
      payment = pvVal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = payment * n;
    const totalInterest = totalPaid - pvVal;

    setOutput(`Payment per Period: $${payment.toFixed(2)}\nTotal Paid: $${totalPaid.toFixed(2)}\nTotal Interest: $${totalInterest.toFixed(2)}\n\nFormula: PMT = PV × [r(1+r)^n] / [(1+r)^n - 1]\nPV = $${pvVal.toFixed(2)}, r = ${(r * 100).toFixed(4)}%, n = ${n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-pv`} className="block text-sm font-medium text-gray-700 mb-1">Present Value ($)</label>
        <input id={`${toolId}-pv`} type="number" value={pv} onChange={(e) => setPv(e.target.value)} placeholder="100000" aria-label={`Present value for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Interest Rate per Period (%)</label>
        <input id={`${toolId}-rate`} type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0.5" step="0.01" aria-label={`Interest rate for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-periods`} className="block text-sm font-medium text-gray-700 mb-1">Number of Periods</label>
        <input id={`${toolId}-periods`} type="number" value={periods} onChange={(e) => setPeriods(e.target.value)} placeholder="360" aria-label={`Number of periods for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Payment</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
