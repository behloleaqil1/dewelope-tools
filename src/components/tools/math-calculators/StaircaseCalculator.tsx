'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StaircaseCalculator - Calculate staircase dimensions (rise, run, number of steps).
 * Uses standard building code recommendations for comfortable stairs.
 */
export default function StaircaseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [totalRise, setTotalRise] = useState('');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [preferredRise, setPreferredRise] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    numSteps: number;
    riserHeight: number;
    treadDepth: number;
    totalRun: number;
    stairAngle: number;
    comfortable: boolean;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const rise = parseFloat(totalRise);

    if (!totalRise.trim() || isNaN(rise) || rise <= 0) {
      newErrors.totalRise = 'Enter a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Standard ideal riser height: 7 inches / 17.78 cm
    const idealRiser = unit === 'inches' ? 7 : 17.78;
    const targetRiser = preferredRise && !isNaN(parseFloat(preferredRise)) ? parseFloat(preferredRise) : idealRiser;

    const numSteps = Math.round(rise / targetRiser);
    const actualRiser = rise / numSteps;

    // Rule of thumb: riser + tread = 17-18 inches (43-46 cm)
    const comfortSum = unit === 'inches' ? 17.5 : 44.5;
    const treadDepth = comfortSum - actualRiser;

    const totalRun = treadDepth * (numSteps - 1);
    const stairAngle = Math.atan(rise / totalRun) * (180 / Math.PI);

    // Comfortable range: 30-37 degrees
    const comfortable = stairAngle >= 30 && stairAngle <= 37;

    setResult({ numSteps, riserHeight: actualRiser, treadDepth, totalRun, stairAngle, comfortable });
  };

  const unitLabel = unit === 'inches' ? 'in' : 'cm';
  const copyText = result
    ? `Staircase Calculation:\nSteps: ${result.numSteps}\nRiser Height: ${result.riserHeight.toFixed(2)} ${unitLabel}\nTread Depth: ${result.treadDepth.toFixed(2)} ${unitLabel}\nTotal Run: ${result.totalRun.toFixed(2)} ${unitLabel}\nAngle: ${result.stairAngle.toFixed(1)}°\nComfortable: ${result.comfortable ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.totalRise}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'inches' | 'cm')} aria-label={`Unit for ${toolName}`} className="input-field">
              <option value="inches">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-rise`} className="block text-sm font-medium text-gray-700 mb-1">
              Total Rise (floor to floor) ({unitLabel})
            </label>
            <input
              id={`${toolId}-rise`}
              type="text"
              inputMode="decimal"
              value={totalRise}
              onChange={(e) => { setTotalRise(e.target.value); if (errors.totalRise) setErrors({}); }}
              placeholder={unit === 'inches' ? 'e.g. 108' : 'e.g. 274'}
              aria-label={`Total rise for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-pref`} className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Riser Height ({unitLabel}) — optional
          </label>
          <input
            id={`${toolId}-pref`}
            type="text"
            inputMode="decimal"
            value={preferredRise}
            onChange={(e) => setPreferredRise(e.target.value)}
            placeholder={unit === 'inches' ? '7' : '17.78'}
            aria-label={`Preferred riser height for ${toolName}`}
            className="input-field"
          />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate Staircase" className="btn-primary">
        Calculate Staircase
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.numSteps}</div>
                <div className="text-xs text-gray-500 mt-1">Steps</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.riserHeight.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Riser ({unitLabel})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.treadDepth.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Tread ({unitLabel})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalRun.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Run ({unitLabel})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.stairAngle.toFixed(1)}°</div>
                <div className="text-xs text-gray-500 mt-1">Angle</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.comfortable ? 'text-green-600' : 'text-orange-600'}`}>
                  {result.comfortable ? '✓' : '⚠'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{result.comfortable ? 'Comfortable' : 'Steep/Shallow'}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
