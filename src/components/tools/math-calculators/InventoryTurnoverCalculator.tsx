'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function InventoryTurnoverCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cogs, setCogs] = useState('');
  const [avgInventory, setAvgInventory] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const cogsVal = parseFloat(cogs);
    const invVal = parseFloat(avgInventory);

    if (isNaN(cogsVal) || isNaN(invVal) || invVal === 0) {
      setOutput('Please enter valid COGS and average inventory values.');
      return;
    }

    const turnover = cogsVal / invVal;
    const daysInInventory = 365 / turnover;
    const weeksInInventory = 52 / turnover;

    let rating = '';
    if (turnover >= 8) rating = '🟢 Excellent - Very efficient inventory management';
    else if (turnover >= 5) rating = '🟡 Good - Healthy turnover rate';
    else if (turnover >= 2) rating = '🟠 Average - Room for improvement';
    else rating = '🔴 Low - Inventory may be overstocked';

    const lines = [
      `=== Inventory Turnover Analysis ===`,
      ``,
      `Cost of Goods Sold (COGS): $${cogsVal.toLocaleString()}`,
      `Average Inventory: $${invVal.toLocaleString()}`,
      ``,
      `--- Results ---`,
      `Inventory Turnover Ratio: ${turnover.toFixed(2)}x`,
      `Days Sales of Inventory (DSI): ${daysInInventory.toFixed(1)} days`,
      `Weeks of Supply: ${weeksInInventory.toFixed(1)} weeks`,
      ``,
      `Rating: ${rating}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-cogs`} className="block text-sm font-medium text-gray-700 mb-1">Cost of Goods Sold (COGS) - Annual</label>
            <input id={`${toolId}-cogs`} type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="input-field" placeholder="e.g. 500000" aria-label={`COGS for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-inv`} className="block text-sm font-medium text-gray-700 mb-1">Average Inventory Value</label>
            <input id={`${toolId}-inv`} type="number" value={avgInventory} onChange={(e) => setAvgInventory(e.target.value)} className="input-field" placeholder="e.g. 75000" aria-label="Average inventory value" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate Turnover</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Inventory Turnover Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
