'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FuelCostCalculator - Calculates total fuel needed and cost for a trip
 * based on distance, fuel efficiency, and fuel price.
 * Supports both metric (km/L) and imperial (mpg) units.
 */
export default function FuelCostCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    fuelNeeded: number;
    totalCost: number;
    fuelUnit: string;
    distanceUnit: string;
  } | null>(null);

  function handleCalculate() {
    setError(undefined);
    setResult(null);

    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(fuelPrice);

    if (isNaN(d) || d <= 0) {
      setError('Please enter a valid distance greater than 0');
      return;
    }
    if (isNaN(e) || e <= 0) {
      setError('Please enter a valid fuel efficiency greater than 0');
      return;
    }
    if (isNaN(p) || p <= 0) {
      setError('Please enter a valid fuel price greater than 0');
      return;
    }

    let fuelNeeded: number;

    if (unit === 'metric') {
      // km / (km/L) = L
      fuelNeeded = d / e;
    } else {
      // miles / mpg = gallons
      fuelNeeded = d / e;
    }

    const totalCost = fuelNeeded * p;

    setResult({
      fuelNeeded,
      totalCost,
      fuelUnit: unit === 'metric' ? 'liters' : 'gallons',
      distanceUnit: unit === 'metric' ? 'km' : 'miles',
    });
  }

  const copyText = result
    ? `Distance: ${distance} ${result.distanceUnit}\nFuel Efficiency: ${efficiency} ${unit === 'metric' ? 'km/L' : 'mpg'}\nFuel Price: $${fuelPrice}/${unit === 'metric' ? 'L' : 'gal'}\nFuel Needed: ${result.fuelNeeded.toFixed(2)} ${result.fuelUnit}\nTotal Cost: $${result.totalCost.toFixed(2)}`
    : '';

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
          Unit System
        </label>
        <select
          id={`${toolId}-unit`}
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'metric' | 'imperial')}
          aria-label="Select unit system"
          className="input-field"
        >
          <option value="metric">Metric (km, liters)</option>
          <option value="imperial">Imperial (miles, gallons)</option>
        </select>
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">
            Distance ({unit === 'metric' ? 'km' : 'miles'})
          </label>
          <input
            id={`${toolId}-distance`}
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="500"
            aria-label={`Trip distance in ${unit === 'metric' ? 'kilometers' : 'miles'}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-efficiency`} className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Efficiency ({unit === 'metric' ? 'km/L' : 'mpg'})
          </label>
          <input
            id={`${toolId}-efficiency`}
            type="number"
            step="0.1"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder={unit === 'metric' ? '12' : '30'}
            aria-label={`Fuel efficiency in ${unit === 'metric' ? 'kilometers per liter' : 'miles per gallon'}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Price ($/{unit === 'metric' ? 'L' : 'gal'})
          </label>
          <input
            id={`${toolId}-price`}
            type="number"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder={unit === 'metric' ? '1.50' : '3.50'}
            aria-label={`Fuel price per ${unit === 'metric' ? 'liter' : 'gallon'}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button
        onClick={handleCalculate}
        aria-label="Calculate fuel cost"
        className="btn-primary"
      >
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Fuel Needed</div>
                <div className="text-xl font-bold text-gray-800">
                  {result.fuelNeeded.toFixed(2)} {result.fuelUnit}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Total Cost</div>
                <div className="text-xl font-bold text-green-600">${result.totalCost.toFixed(2)}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
