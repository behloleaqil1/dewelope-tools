'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BreakEvenUnitsCalculator - Calculate break-even point in units.
 * Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)
 */
export default function BreakEvenUnitsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fixedCosts, setFixedCosts] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setOutput('');

    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(sellingPrice);
    const variable = parseFloat(variableCost);

    if (isNaN(fixed) || fixed < 0) {
      setError('Please enter valid fixed costs.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid selling price per unit.');
      return;
    }
    if (isNaN(variable) || variable < 0) {
      setError('Please enter a valid variable cost per unit.');
      return;
    }

    const contributionMargin = price - variable;
    if (contributionMargin <= 0) {
      setError('Selling price must be greater than variable cost per unit.');
      return;
    }

    const breakEvenUnits = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;

    const lines = [
      `Break-Even Point: ${Math.ceil(breakEvenUnits)} units`,
      `Break-Even Revenue: $${breakEvenRevenue.toFixed(2)}`,
      ``,
      `Breakdown:`,
      `  Fixed Costs: $${fixed.toFixed(2)}`,
      `  Selling Price per Unit: $${price.toFixed(2)}`,
      `  Variable Cost per Unit: $${variable.toFixed(2)}`,
      `  Contribution Margin per Unit: $${contributionMargin.toFixed(2)}`,
      ``,
      `Formula: Break-Even Units = Fixed Costs / Contribution Margin`,
      `         = $${fixed.toFixed(2)} / $${contributionMargin.toFixed(2)}`,
      `         = ${breakEvenUnits.toFixed(4)} units`,
      `         ≈ ${Math.ceil(breakEvenUnits)} units (rounded up)`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-fixed`} className="block text-sm font-medium text-gray-700 mb-1">
          Total Fixed Costs ($)
        </label>
        <input
          id={`${toolId}-fixed`}
          type="number"
          value={fixedCosts}
          onChange={(e) => setFixedCosts(e.target.value)}
          placeholder="e.g. 10000"
          aria-label={`Fixed costs for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">
          Selling Price per Unit ($)
        </label>
        <input
          id={`${toolId}-price`}
          type="number"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          placeholder="e.g. 25"
          aria-label={`Selling price for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-variable`} className="block text-sm font-medium text-gray-700 mb-1">
          Variable Cost per Unit ($)
        </label>
        <input
          id={`${toolId}-variable`}
          type="number"
          value={variableCost}
          onChange={(e) => setVariableCost(e.target.value)}
          placeholder="e.g. 10"
          aria-label={`Variable cost for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <button
          onClick={calculate}
          className="btn-primary mt-2"
        >
          Calculate Break-Even Units
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
