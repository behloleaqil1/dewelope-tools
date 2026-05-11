'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BreakEvenCalculator - Calculates break-even point in units and revenue.
 * Formula: Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit)
 */
export default function BreakEvenCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ units: number; revenue: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);

    if (!fixedCosts.trim() || isNaN(fc) || fc < 0) {
      newErrors.fixedCosts = 'Please enter a valid positive number';
    }
    if (!variableCost.trim() || isNaN(vc) || vc < 0) {
      newErrors.variableCost = 'Please enter a valid positive number';
    }
    if (!sellingPrice.trim() || isNaN(sp) || sp <= 0) {
      newErrors.sellingPrice = 'Please enter a valid positive number greater than zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    if (sp <= vc) {
      newErrors.sellingPrice = 'Selling price must be greater than variable cost per unit';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const contributionMargin = sp - vc;
    const breakEvenUnits = fc / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * sp;

    setResult({ units: breakEvenUnits, revenue: breakEvenRevenue });
  };

  const copyText = result
    ? `Break-Even Units: ${Math.ceil(result.units).toLocaleString()}\nBreak-Even Revenue: $${result.revenue.toFixed(2)}\nFormula: Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.fixedCosts}>
          <label htmlFor={`${toolId}-fixed`} className="block text-sm font-medium text-gray-700 mb-1">
            Fixed Costs ($)
          </label>
          <input
            id={`${toolId}-fixed`}
            type="text"
            inputMode="decimal"
            value={fixedCosts}
            onChange={(e) => {
              setFixedCosts(e.target.value);
              if (errors.fixedCosts) setErrors((prev) => ({ ...prev, fixedCosts: '' }));
            }}
            placeholder="e.g. 50000"
            aria-label={`Fixed costs for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.variableCost}>
          <label htmlFor={`${toolId}-variable`} className="block text-sm font-medium text-gray-700 mb-1">
            Variable Cost per Unit ($)
          </label>
          <input
            id={`${toolId}-variable`}
            type="text"
            inputMode="decimal"
            value={variableCost}
            onChange={(e) => {
              setVariableCost(e.target.value);
              if (errors.variableCost) setErrors((prev) => ({ ...prev, variableCost: '' }));
            }}
            placeholder="e.g. 20"
            aria-label={`Variable cost per unit for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.sellingPrice}>
          <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price per Unit ($)
          </label>
          <input
            id={`${toolId}-price`}
            type="text"
            inputMode="decimal"
            value={sellingPrice}
            onChange={(e) => {
              setSellingPrice(e.target.value);
              if (errors.sellingPrice) setErrors((prev) => ({ ...prev, sellingPrice: '' }));
            }}
            placeholder="e.g. 50"
            aria-label={`Selling price per unit for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate break-even point" className="btn-primary">
        Calculate Break-Even
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.ceil(result.units).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Break-Even Units</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  ${result.revenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Break-Even Revenue</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Break-Even Units = Fixed Costs / (Selling Price - Variable Cost) = {parseFloat(fixedCosts).toFixed(2)} / ({parseFloat(sellingPrice).toFixed(2)} - {parseFloat(variableCost).toFixed(2)}) = {result.units.toFixed(2)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
