'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PresentValueCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fv, setFv] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [compounding, setCompounding] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fvVal = parseFloat(fv);
    const annualRate = parseFloat(rate) / 100;
    const n = parseFloat(periods);
    const comp = parseInt(compounding);
    if (isNaN(fvVal) || isNaN(annualRate) || isNaN(n) || isNaN(comp)) { setOutput('Enter valid numbers.'); return; }
    if (fvVal <= 0 || n <= 0) { setOutput('Future value and periods must be positive.'); return; }

    const ratePerPeriod = annualRate / comp;
    const totalPeriods = n * comp;
    const pvVal = fvVal / Math.pow(1 + ratePerPeriod, totalPeriods);
    const discount = fvVal - pvVal;

    setOutput(`Present Value: $${pvVal.toFixed(2)}\nFuture Value: $${fvVal.toFixed(2)}\nTotal Discount: $${discount.toFixed(2)}\n\nFormula: PV = FV / (1 + r/m)^(n×m)\nRate: ${(annualRate * 100).toFixed(4)}% annually\nCompounding: ${comp}x per year\nTotal periods: ${totalPeriods}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-fv`} className="block text-sm font-medium text-gray-700 mb-1">Future Value ($)</label>
        <input id={`${toolId}-fv`} type="number" value={fv} onChange={(e) => setFv(e.target.value)} placeholder="10000" aria-label={`Future value for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
        <input id={`${toolId}-rate`} type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" step="0.01" aria-label={`Annual rate for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-periods`} className="block text-sm font-medium text-gray-700 mb-1">Number of Years</label>
        <input id={`${toolId}-periods`} type="number" value={periods} onChange={(e) => setPeriods(e.target.value)} placeholder="10" aria-label={`Years for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-comp`} className="block text-sm font-medium text-gray-700 mb-1">Compounding Frequency</label>
        <select id={`${toolId}-comp`} value={compounding} onChange={(e) => setCompounding(e.target.value)} aria-label={`Compounding frequency for ${toolName}`} className="input-field">
          <option value="1">Annually</option>
          <option value="2">Semi-annually</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
          <option value="365">Daily</option>
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Present Value</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
