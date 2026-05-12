'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EconomicOrderQuantity - Calculate EOQ using the Wilson formula.
 * EOQ = sqrt((2 * D * S) / H) where D=demand, S=ordering cost, H=holding cost.
 */
export default function EconomicOrderQuantity({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [demand, setDemand] = useState('');
  const [orderingCost, setOrderingCost] = useState('');
  const [holdingCost, setHoldingCost] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setOutput('');

    const D = parseFloat(demand);
    const S = parseFloat(orderingCost);
    const H = parseFloat(holdingCost);

    if (isNaN(D) || D <= 0) { setError('Annual demand must be a positive number.'); return; }
    if (isNaN(S) || S <= 0) { setError('Ordering cost must be a positive number.'); return; }
    if (isNaN(H) || H <= 0) { setError('Holding cost must be a positive number.'); return; }

    const eoq = Math.sqrt((2 * D * S) / H);
    const ordersPerYear = D / eoq;
    const totalOrderingCost = ordersPerYear * S;
    const totalHoldingCost = (eoq / 2) * H;
    const totalCost = totalOrderingCost + totalHoldingCost;
    const cycleTime = 365 / ordersPerYear;

    const results = [
      `Economic Order Quantity (EOQ): ${eoq.toFixed(2)} units`,
      ``,
      `Formula: EOQ = √(2DS / H)`,
      `  D (Annual Demand): ${D}`,
      `  S (Ordering Cost): $${S.toFixed(2)}`,
      `  H (Holding Cost per unit/year): $${H.toFixed(2)}`,
      ``,
      `--- Results ---`,
      `Orders per Year: ${ordersPerYear.toFixed(2)}`,
      `Cycle Time: ${cycleTime.toFixed(1)} days`,
      `Total Ordering Cost: $${totalOrderingCost.toFixed(2)}`,
      `Total Holding Cost: $${totalHoldingCost.toFixed(2)}`,
      `Total Inventory Cost: $${totalCost.toFixed(2)}`,
    ];

    setOutput(results.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-demand`} className="block text-sm font-medium text-gray-700 mb-1">Annual Demand (units)</label>
            <input id={`${toolId}-demand`} type="number" min={0} value={demand} onChange={(e) => setDemand(e.target.value)} placeholder="e.g. 10000" className="input-field" aria-label={`Annual demand for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-ordering`} className="block text-sm font-medium text-gray-700 mb-1">Ordering Cost per Order ($)</label>
            <input id={`${toolId}-ordering`} type="number" min={0} step="0.01" value={orderingCost} onChange={(e) => setOrderingCost(e.target.value)} placeholder="e.g. 50" className="input-field" aria-label="Ordering cost per order" />
          </div>
          <div>
            <label htmlFor={`${toolId}-holding`} className="block text-sm font-medium text-gray-700 mb-1">Holding Cost per Unit/Year ($)</label>
            <input id={`${toolId}-holding`} type="number" min={0} step="0.01" value={holdingCost} onChange={(e) => setHoldingCost(e.target.value)} placeholder="e.g. 2" className="input-field" aria-label="Holding cost per unit per year" />
          </div>
        </div>
        <button onClick={handleCalculate} className="btn-primary mt-3">
          Calculate EOQ
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">EOQ Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
