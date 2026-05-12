'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReorderPointCalculator - Calculate inventory reorder point.
 * ROP = (Average Daily Demand × Lead Time in Days) + Safety Stock
 */
export default function ReorderPointCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dailyDemand, setDailyDemand] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [safetyStock, setSafetyStock] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setOutput('');

    const demand = parseFloat(dailyDemand);
    const lead = parseFloat(leadTime);
    const safety = parseFloat(safetyStock) || 0;

    if (isNaN(demand) || demand < 0) {
      setError('Please enter a valid average daily demand.');
      return;
    }
    if (isNaN(lead) || lead < 0) {
      setError('Please enter a valid lead time in days.');
      return;
    }

    const demandDuringLeadTime = demand * lead;
    const reorderPoint = demandDuringLeadTime + safety;

    const lines = [
      `Reorder Point (ROP): ${reorderPoint.toFixed(2)} units`,
      ``,
      `Breakdown:`,
      `  Average Daily Demand: ${demand} units/day`,
      `  Lead Time: ${lead} days`,
      `  Demand During Lead Time: ${demandDuringLeadTime.toFixed(2)} units`,
      `  Safety Stock: ${safety} units`,
      ``,
      `Formula: ROP = (Daily Demand × Lead Time) + Safety Stock`,
      `         ROP = (${demand} × ${lead}) + ${safety} = ${reorderPoint.toFixed(2)}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-demand`} className="block text-sm font-medium text-gray-700 mb-1">
          Average Daily Demand (units/day)
        </label>
        <input
          id={`${toolId}-demand`}
          type="number"
          value={dailyDemand}
          onChange={(e) => setDailyDemand(e.target.value)}
          placeholder="e.g. 50"
          aria-label={`Daily demand for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-lead`} className="block text-sm font-medium text-gray-700 mb-1">
          Lead Time (days)
        </label>
        <input
          id={`${toolId}-lead`}
          type="number"
          value={leadTime}
          onChange={(e) => setLeadTime(e.target.value)}
          placeholder="e.g. 7"
          aria-label={`Lead time for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-safety`} className="block text-sm font-medium text-gray-700 mb-1">
          Safety Stock (units, optional)
        </label>
        <input
          id={`${toolId}-safety`}
          type="number"
          value={safetyStock}
          onChange={(e) => setSafetyStock(e.target.value)}
          placeholder="e.g. 100"
          aria-label={`Safety stock for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <button
          onClick={calculate}
          className="btn-primary mt-2"
        >
          Calculate Reorder Point
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
