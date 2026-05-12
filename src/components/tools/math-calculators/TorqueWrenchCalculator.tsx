'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TorqueWrenchCalculator - Calculate required torque for bolt tightening.
 * Uses the simplified torque formula: T = K × D × F where K is the nut factor,
 * D is the bolt diameter, and F is the desired clamp force.
 */
export default function TorqueWrenchCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [boltDiameter, setBoltDiameter] = useState('');
  const [diameterUnit, setDiameterUnit] = useState<'mm' | 'in'>('mm');
  const [clampForce, setClampForce] = useState('');
  const [forceUnit, setForceUnit] = useState<'N' | 'lbf'>('N');
  const [nutFactor, setNutFactor] = useState('0.2');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = parseFloat(boltDiameter);
    const f = parseFloat(clampForce);
    const k = parseFloat(nutFactor);

    if (isNaN(d) || isNaN(f) || isNaN(k) || d <= 0 || f <= 0 || k <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Convert to consistent units (meters and Newtons)
    const dMeters = diameterUnit === 'mm' ? d / 1000 : d * 0.0254;
    const fNewtons = forceUnit === 'lbf' ? f * 4.44822 : f;

    // T = K × D × F (in N·m)
    const torqueNm = k * dMeters * fNewtons;
    const torqueFtLb = torqueNm * 0.737562;
    const torqueInLb = torqueNm * 8.85075;

    const results: string[] = [];
    results.push('=== Torque Calculation Results ===');
    results.push('');
    results.push(`Formula: T = K × D × F`);
    results.push(`Nut Factor (K): ${k}`);
    results.push(`Bolt Diameter (D): ${d} ${diameterUnit} (${dMeters.toFixed(6)} m)`);
    results.push(`Clamp Force (F): ${f} ${forceUnit} (${fNewtons.toFixed(2)} N)`);
    results.push('');
    results.push('--- Required Torque ---');
    results.push(`${torqueNm.toFixed(4)} N·m`);
    results.push(`${torqueFtLb.toFixed(4)} ft·lb`);
    results.push(`${torqueInLb.toFixed(4)} in·lb`);
    results.push('');
    results.push('--- Common Nut Factors ---');
    results.push('0.20 - Standard dry steel');
    results.push('0.15 - Lubricated steel');
    results.push('0.12 - Cadmium plated');
    results.push('0.10 - Waxed / anti-seize');
    results.push('0.25 - Rusty / corroded');

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
              Bolt Diameter
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-diameter`}
                type="number"
                step="any"
                min="0"
                value={boltDiameter}
                onChange={(e) => setBoltDiameter(e.target.value)}
                placeholder="e.g. 10"
                className="input-field flex-1"
                aria-label={`Bolt diameter for ${toolName}`}
              />
              <select
                value={diameterUnit}
                onChange={(e) => setDiameterUnit(e.target.value as 'mm' | 'in')}
                className="input-field w-20"
                aria-label="Diameter unit"
              >
                <option value="mm">mm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">
              Desired Clamp Force
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-force`}
                type="number"
                step="any"
                min="0"
                value={clampForce}
                onChange={(e) => setClampForce(e.target.value)}
                placeholder="e.g. 50000"
                className="input-field flex-1"
                aria-label="Clamp force"
              />
              <select
                value={forceUnit}
                onChange={(e) => setForceUnit(e.target.value as 'N' | 'lbf')}
                className="input-field w-20"
                aria-label="Force unit"
              >
                <option value="N">N</option>
                <option value="lbf">lbf</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${toolId}-nutfactor`} className="block text-sm font-medium text-gray-700 mb-1">
              Nut Factor (K)
            </label>
            <input
              id={`${toolId}-nutfactor`}
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={nutFactor}
              onChange={(e) => setNutFactor(e.target.value)}
              placeholder="0.2"
              className="input-field"
              aria-label="Nut factor K"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate Torque
        </button>
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
