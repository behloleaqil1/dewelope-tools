'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IncenseBurnTimeCalculator - Calculate incense stick/cone burn time.
 * Estimates burn duration based on type, length/size, and material.
 */
export default function IncenseBurnTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [incenseType, setIncenseType] = useState<'stick' | 'cone' | 'coil' | 'dhoop'>('stick');
  const [length, setLength] = useState('');
  const [thickness, setThickness] = useState<'thin' | 'regular' | 'thick'>('regular');
  const [material, setMaterial] = useState<'charcoal' | 'masala' | 'wood' | 'resin'>('charcoal');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const len = parseFloat(length);

    if (incenseType === 'stick' && (isNaN(len) || len <= 0)) {
      setOutput('Please enter a valid length for the incense stick.');
      return;
    }

    // Burn rates (cm per minute) vary by thickness and material
    const thicknessMultiplier = { thin: 1.3, regular: 1.0, thick: 0.75 };
    const materialMultiplier = { charcoal: 1.0, masala: 0.85, wood: 0.9, resin: 0.7 };

    let burnTimeMin = 0;
    let details = '';

    if (incenseType === 'stick') {
      // Average burn rate: ~2.5 cm per minute for standard stick
      const baseRate = 2.5; // cm per minute
      const effectiveRate = baseRate * thicknessMultiplier[thickness] * materialMultiplier[material];
      burnTimeMin = len / effectiveRate;
      details = `Stick length: ${len} cm\nEffective burn rate: ${effectiveRate.toFixed(2)} cm/min`;
    } else if (incenseType === 'cone') {
      // Cones typically burn 15-30 minutes
      const baseConeTime = 20;
      burnTimeMin = baseConeTime / materialMultiplier[material];
      details = `Standard cone size\nMaterial factor: ${materialMultiplier[material]}`;
    } else if (incenseType === 'coil') {
      // Coils burn 2-4 hours typically
      burnTimeMin = 180 / materialMultiplier[material];
      details = `Standard coil (approx 45cm uncoiled)\nMaterial factor: ${materialMultiplier[material]}`;
    } else {
      // Dhoop sticks: 30-45 minutes
      burnTimeMin = 35 / materialMultiplier[material];
      details = `Standard dhoop stick\nMaterial factor: ${materialMultiplier[material]}`;
    }

    const hours = Math.floor(burnTimeMin / 60);
    const mins = Math.round(burnTimeMin % 60);
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;

    const result = [
      `=== Incense Burn Time Estimate ===`,
      ``,
      `Type: ${incenseType.charAt(0).toUpperCase() + incenseType.slice(1)}`,
      `Thickness: ${thickness}`,
      `Material: ${material}`,
      details,
      ``,
      `Estimated Burn Time: ${timeStr}`,
      `(approximately ${Math.round(burnTimeMin)} minutes)`,
      ``,
      `--- Tips ---`,
      `• Place on a heat-resistant surface`,
      `• Ensure good ventilation`,
      `• Never leave burning incense unattended`,
      `• Trim ash periodically for even burning`,
      `• Humidity can increase burn time by 10-15%`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Incense Type
            </label>
            <select
              id={`${toolId}-type`}
              value={incenseType}
              onChange={(e) => setIncenseType(e.target.value as 'stick' | 'cone' | 'coil' | 'dhoop')}
              className="input-field"
              aria-label={`Incense type for ${toolName}`}
            >
              <option value="stick">Stick</option>
              <option value="cone">Cone</option>
              <option value="coil">Coil</option>
              <option value="dhoop">Dhoop</option>
            </select>
          </div>
          {incenseType === 'stick' && (
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
                Stick Length (cm)
              </label>
              <input
                id={`${toolId}-length`}
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 20"
                className="input-field"
                aria-label="Stick length in cm"
              />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">
              Thickness
            </label>
            <select
              id={`${toolId}-thickness`}
              value={thickness}
              onChange={(e) => setThickness(e.target.value as 'thin' | 'regular' | 'thick')}
              className="input-field"
              aria-label="Incense thickness"
            >
              <option value="thin">Thin</option>
              <option value="regular">Regular</option>
              <option value="thick">Thick</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-material`} className="block text-sm font-medium text-gray-700 mb-1">
              Material
            </label>
            <select
              id={`${toolId}-material`}
              value={material}
              onChange={(e) => setMaterial(e.target.value as 'charcoal' | 'masala' | 'wood' | 'resin')}
              className="input-field"
              aria-label="Incense material"
            >
              <option value="charcoal">Charcoal-based</option>
              <option value="masala">Masala (hand-rolled)</option>
              <option value="wood">Wood-based</option>
              <option value="resin">Resin-based</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">
          Calculate Burn Time
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
