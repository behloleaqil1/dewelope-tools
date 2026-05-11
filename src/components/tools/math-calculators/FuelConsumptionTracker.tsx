'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FuelConsumptionTracker - Track fuel consumption over multiple fill-ups.
 * Calculates average consumption, cost per km/mile, and total spending.
 */
export default function FuelConsumptionTracker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entries, setEntries] = useState<{ distance: string; fuel: string; cost: string }[]>([
    { distance: '', fuel: '', cost: '' },
  ]);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    totalDistance: number;
    totalFuel: number;
    totalCost: number;
    avgConsumption: number;
    costPerUnit: number;
  } | null>(null);

  const addEntry = () => {
    setEntries([...entries, { distance: '', fuel: '', cost: '' }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: 'distance' | 'fuel' | 'cost', value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const calculate = () => {
    const parsed = entries.map((e) => ({
      distance: parseFloat(e.distance),
      fuel: parseFloat(e.fuel),
      cost: parseFloat(e.cost),
    }));

    const valid = parsed.filter((e) => !isNaN(e.distance) && !isNaN(e.fuel) && e.distance > 0 && e.fuel > 0);

    if (valid.length === 0) {
      setError('Please enter at least one valid fill-up with distance and fuel amount.');
      setResult(null);
      return;
    }

    setError('');
    const totalDistance = valid.reduce((sum, e) => sum + e.distance, 0);
    const totalFuel = valid.reduce((sum, e) => sum + e.fuel, 0);
    const totalCost = valid.reduce((sum, e) => sum + (isNaN(e.cost) ? 0 : e.cost), 0);
    const avgConsumption = unit === 'km'
      ? (totalFuel / totalDistance) * 100 // L/100km
      : totalDistance / totalFuel; // MPG
    const costPerUnit = totalCost > 0 ? totalCost / totalDistance : 0;

    setResult({ totalDistance, totalFuel, totalCost, avgConsumption, costPerUnit });
  };

  const consumptionLabel = unit === 'km' ? 'L/100km' : 'MPG';
  const distanceLabel = unit === 'km' ? 'km' : 'mi';

  const copyText = result
    ? `Total Distance: ${result.totalDistance.toFixed(1)} ${distanceLabel}\nTotal Fuel: ${result.totalFuel.toFixed(2)} ${unit === 'km' ? 'L' : 'gal'}\nAvg Consumption: ${result.avgConsumption.toFixed(2)} ${consumptionLabel}\nTotal Cost: $${result.totalCost.toFixed(2)}\nCost per ${distanceLabel}: $${result.costPerUnit.toFixed(3)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { setUnit('km'); setResult(null); }}
          className={`px-4 py-2 rounded text-sm font-medium ${unit === 'km' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Use kilometers and liters"
        >
          Metric (km/L)
        </button>
        <button
          onClick={() => { setUnit('miles'); setResult(null); }}
          className={`px-4 py-2 rounded text-sm font-medium ${unit === 'miles' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Use miles and gallons"
        >
          Imperial (mi/gal)
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Distance ({distanceLabel})</label>
              <input
                type="text"
                inputMode="decimal"
                value={entry.distance}
                onChange={(e) => updateEntry(i, 'distance', e.target.value)}
                placeholder="e.g. 450"
                aria-label={`Distance for fill-up ${i + 1} in ${toolName}`}
                className="input-field text-sm"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Fuel ({unit === 'km' ? 'L' : 'gal'})</label>
              <input
                type="text"
                inputMode="decimal"
                value={entry.fuel}
                onChange={(e) => updateEntry(i, 'fuel', e.target.value)}
                placeholder="e.g. 35"
                aria-label={`Fuel amount for fill-up ${i + 1} in ${toolName}`}
                className="input-field text-sm"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost ($)</label>
              <input
                type="text"
                inputMode="decimal"
                value={entry.cost}
                onChange={(e) => updateEntry(i, 'cost', e.target.value)}
                placeholder="e.g. 55"
                aria-label={`Cost for fill-up ${i + 1} in ${toolName}`}
                className="input-field text-sm"
              />
            </div>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(i)} className="text-red-500 hover:text-red-700 text-sm px-2 py-1" aria-label={`Remove fill-up ${i + 1}`}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addEntry} className="px-4 py-2 rounded text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300" aria-label="Add another fill-up">
          + Add Fill-up
        </button>
        <button onClick={calculate} className="btn-primary" aria-label="Calculate fuel consumption">
          Calculate
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.avgConsumption.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">{consumptionLabel}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.totalDistance.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Total {distanceLabel}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.totalFuel.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total {unit === 'km' ? 'L' : 'gal'}</div>
              </div>
              {result.totalCost > 0 && (
                <>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    <div className="text-xl font-bold text-green-600">${result.totalCost.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">Total Cost</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    <div className="text-xl font-bold text-green-600">${result.costPerUnit.toFixed(3)}</div>
                    <div className="text-xs text-gray-500 mt-1">Cost/{distanceLabel}</div>
                  </div>
                </>
              )}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
