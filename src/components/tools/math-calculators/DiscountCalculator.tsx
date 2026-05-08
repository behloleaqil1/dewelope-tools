'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { validateNumeric, validateRange } from '@/lib/validation';
import { calculateDiscount } from '@/lib/calculators';

/**
 * DiscountCalculator - Calculates discount amount and final price.
 * Displays the formula alongside results.
 * Validates numeric inputs with range checking and shows field-specific errors.
 */
export default function DiscountCalculator({ toolId, toolName }: ToolEngineProps) {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    formula: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const priceValidation = validateNumeric(originalPrice, 'originalPrice');
    if (!priceValidation.valid) {
      newErrors.originalPrice = priceValidation.error!;
    }

    const discountValidation = validateNumeric(discountPercent, 'discountPercent');
    if (!discountValidation.valid) {
      newErrors.discountPercent = discountValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numPrice = Number(originalPrice.trim());
    const numDiscount = Number(discountPercent.trim());

    const rangePrice = validateRange(numPrice, 0, 999999999, 'originalPrice');
    if (!rangePrice.valid) {
      newErrors.originalPrice = rangePrice.error!;
    }

    const rangeDiscount = validateRange(numDiscount, 0, 100, 'discountPercent');
    if (!rangeDiscount.valid) {
      newErrors.discountPercent = rangeDiscount.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculateDiscount(numPrice, numDiscount));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOriginalPrice(e.target.value);
    if (errors.originalPrice) {
      setErrors((prev) => ({ ...prev, originalPrice: '' }));
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountPercent(e.target.value);
    if (errors.discountPercent) {
      setErrors((prev) => ({ ...prev, discountPercent: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.originalPrice}>
          <label htmlFor="discount-price" className="block text-sm font-medium text-gray-700">
            Original Price ($)
          </label>
          <input
            id="discount-price"
            type="text"
            inputMode="decimal"
            value={originalPrice}
            onChange={handlePriceChange}
            placeholder="Enter original price"
            aria-label={`Original price for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.discountPercent}>
          <label htmlFor="discount-percent" className="block text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            id="discount-percent"
            type="text"
            inputMode="decimal"
            value={discountPercent}
            onChange={handleDiscountChange}
            placeholder="Enter discount percentage"
            aria-label={`Discount percentage for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate Discount
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">You Save</div>
                <div className="text-lg font-semibold text-green-600">${result.discountAmount.toFixed(2)}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Final Price</div>
                <div className="text-lg font-semibold text-gray-800">${result.finalPrice.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono break-all">
              {result.formula}
            </div>
            <CopyToClipboard
              text={`Discount: $${result.discountAmount.toFixed(2)} | Final price: $${result.finalPrice.toFixed(2)}`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
