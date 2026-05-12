'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ConversionResult {
  ingredient: string;
  fromAmount: number;
  fromUnit: string;
  toAmount: number;
  toUnit: string;
}

// Grams per cup for common baking ingredients
const INGREDIENTS: Record<string, number> = {
  'All-Purpose Flour': 120,
  'Bread Flour': 127,
  'Cake Flour': 114,
  'Whole Wheat Flour': 128,
  'Granulated Sugar': 200,
  'Brown Sugar (packed)': 220,
  'Powdered Sugar': 120,
  'Butter': 227,
  'Milk': 240,
  'Water': 240,
  'Honey': 340,
  'Cocoa Powder': 86,
  'Rolled Oats': 90,
  'Rice': 185,
  'Cornstarch': 128,
  'Salt (table)': 288,
  'Baking Powder': 230,
  'Vegetable Oil': 218,
};

/**
 * BakingConversionCalculator - Converts baking ingredients between volume and weight.
 * Uses standard density values for common baking ingredients.
 */
export default function BakingConversionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ingredient, setIngredient] = useState('All-Purpose Flour');
  const [amount, setAmount] = useState('');
  const [fromUnit, setFromUnit] = useState('cups');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  const volumeUnits = ['cups', 'tablespoons', 'teaspoons'];
  const weightUnits = ['grams', 'ounces', 'pounds'];

  function convert() {
    setError(undefined);
    setResult(null);

    const value = parseFloat(amount);
    if (!amount.trim() || isNaN(value) || value <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    const gramsPerCup = INGREDIENTS[ingredient];

    let grams: number;

    // Convert input to grams first
    switch (fromUnit) {
      case 'cups':
        grams = value * gramsPerCup;
        break;
      case 'tablespoons':
        grams = value * (gramsPerCup / 16);
        break;
      case 'teaspoons':
        grams = value * (gramsPerCup / 48);
        break;
      case 'grams':
        grams = value;
        break;
      case 'ounces':
        grams = value * 28.3495;
        break;
      case 'pounds':
        grams = value * 453.592;
        break;
      default:
        grams = value;
    }

    // Determine target unit and convert
    let toUnit: string;
    let toAmount: number;

    if (volumeUnits.includes(fromUnit)) {
      // Volume to weight
      toUnit = 'grams';
      toAmount = grams;
    } else {
      // Weight to volume
      toUnit = 'cups';
      toAmount = grams / gramsPerCup;
    }

    setResult({ ingredient, fromAmount: value, fromUnit, toAmount, toUnit });
  }

  const copyText = result
    ? `${result.fromAmount} ${result.fromUnit} of ${result.ingredient} = ${result.toAmount.toFixed(2)} ${result.toUnit}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-ingredient`} className="block text-sm font-medium text-gray-700 mb-1">
          Ingredient
        </label>
        <select
          id={`${toolId}-ingredient`}
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          aria-label={`Ingredient for ${toolName}`}
          className="input-field mb-3"
        >
          {Object.keys(INGREDIENTS).map((ing) => (
            <option key={ing} value={ing}>{ing}</option>
          ))}
        </select>

        <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-amount`}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            aria-label="Amount to convert"
            className="input-field flex-1"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label="Unit to convert from"
            className="input-field w-36"
          >
            <optgroup label="Volume">
              {volumeUnits.map((u) => <option key={u} value={u}>{u}</option>)}
            </optgroup>
            <optgroup label="Weight">
              {weightUnits.map((u) => <option key={u} value={u}>{u}</option>)}
            </optgroup>
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert baking measurement" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
              <div className="text-lg font-bold text-amber-700">
                {result.fromAmount} {result.fromUnit} of {result.ingredient}
              </div>
              <div className="text-2xl font-bold text-amber-900 mt-1">
                = {result.toAmount.toFixed(2)} {result.toUnit}
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <strong>Reference:</strong> 1 cup of {result.ingredient} ≈ {INGREDIENTS[result.ingredient]}g
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
