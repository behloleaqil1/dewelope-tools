'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CandleBurnTimeCalculator - Calculate candle burn time from dimensions and wax type.
 * Estimates total burn time based on candle diameter, height, and wax properties.
 */
export default function CandleBurnTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [waxType, setWaxType] = useState('soy');
  const [wickCount, setWickCount] = useState('1');
  const [output, setOutput] = useState('');

  // Burn rates in hours per cubic inch (approximate)
  const waxData: Record<string, { name: string; burnRatePerCubicInch: number; density: number }> = {
    soy: { name: 'Soy Wax', burnRatePerCubicInch: 5.5, density: 0.9 },
    paraffin: { name: 'Paraffin Wax', burnRatePerCubicInch: 4.5, density: 0.91 },
    beeswax: { name: 'Beeswax', burnRatePerCubicInch: 6.0, density: 0.96 },
    coconut: { name: 'Coconut Wax', burnRatePerCubicInch: 5.0, density: 0.92 },
    palm: { name: 'Palm Wax', burnRatePerCubicInch: 5.2, density: 0.93 },
    blend: { name: 'Soy/Coconut Blend', burnRatePerCubicInch: 5.3, density: 0.91 },
  };

  const calculate = () => {
    const d = parseFloat(diameter);
    const h = parseFloat(height);
    const wicks = parseInt(wickCount) || 1;

    if (isNaN(d) || d <= 0) {
      setOutput('Error: Please enter a valid diameter > 0');
      return;
    }
    if (isNaN(h) || h <= 0) {
      setOutput('Error: Please enter a valid height > 0');
      return;
    }

    // Convert to inches if needed
    const dInches = unit === 'cm' ? d / 2.54 : d;
    const hInches = unit === 'cm' ? h / 2.54 : h;

    const wax = waxData[waxType];
    const radius = dInches / 2;
    const volumeCubicInches = Math.PI * radius * radius * hInches;
    const weightOz = volumeCubicInches * wax.density * 0.578; // approximate weight in oz

    // Burn time calculation
    const baseBurnTime = volumeCubicInches * wax.burnRatePerCubicInch;
    // Multiple wicks burn faster (not linearly, roughly 30% faster per additional wick)
    const wickFactor = 1 / (1 + (wicks - 1) * 0.3);
    const totalBurnTime = baseBurnTime * wickFactor;

    const hours = Math.floor(totalBurnTime);
    const minutes = Math.round((totalBurnTime - hours) * 60);

    const results = [
      `Candle Specifications:`,
      `  Diameter: ${d} ${unit} (${dInches.toFixed(2)} in)`,
      `  Height: ${h} ${unit} (${hInches.toFixed(2)} in)`,
      `  Wax Type: ${wax.name}`,
      `  Wick Count: ${wicks}`,
      ``,
      `Calculations:`,
      `  Volume: ${volumeCubicInches.toFixed(2)} cubic inches`,
      `  Approximate Weight: ${weightOz.toFixed(1)} oz`,
      ``,
      `Estimated Burn Time: ${hours}h ${minutes}m`,
      `  (${totalBurnTime.toFixed(1)} total hours)`,
      ``,
      `Recommended burn session: ${Math.min(4, totalBurnTime / 4).toFixed(1)} hours max`,
      `Estimated sessions: ${Math.ceil(totalBurnTime / 3)} (at ~3h per session)`,
      ``,
      `Tips:`,
      `  • First burn: let wax pool reach edges (~1h per inch diameter)`,
      `  • Trim wick to 1/4" before each use`,
      `  • Burn time varies with room temperature and drafts`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
                Diameter
              </label>
              <input
                id={`${toolId}-diameter`}
                type="number"
                step="0.1"
                min="0"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                placeholder="e.g. 3"
                aria-label={`Candle diameter for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                id={`${toolId}-height`}
                type="number"
                step="0.1"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 4"
                aria-label="Candle height"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id={`${toolId}-unit`}
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'inches' | 'cm')}
                aria-label="Measurement unit"
                className="input-field"
              >
                <option value="inches">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-wax`} className="block text-sm font-medium text-gray-700 mb-1">
                Wax Type
              </label>
              <select
                id={`${toolId}-wax`}
                value={waxType}
                onChange={(e) => setWaxType(e.target.value)}
                aria-label="Wax type"
                className="input-field"
              >
                {Object.entries(waxData).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-wicks`} className="block text-sm font-medium text-gray-700 mb-1">
                Number of Wicks
              </label>
              <select
                id={`${toolId}-wicks`}
                value={wickCount}
                onChange={(e) => setWickCount(e.target.value)}
                aria-label="Number of wicks"
                className="input-field"
              >
                <option value="1">1 wick</option>
                <option value="2">2 wicks</option>
                <option value="3">3 wicks</option>
                <option value="4">4 wicks</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Burn Time
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
