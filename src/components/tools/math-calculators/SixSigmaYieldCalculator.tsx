'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SixSigmaYieldCalculator - Calculate first-pass yield (FPY) and rolled throughput yield (RTY).
 */
export default function SixSigmaYieldCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [steps, setSteps] = useState<{ units: string; defects: string }[]>([
    { units: '', defects: '' },
  ]);
  const [result, setResult] = useState<{ fpy: number[]; rty: number; dpmo: number } | null>(null);
  const [error, setError] = useState('');

  const addStep = () => {
    setSteps([...steps, { units: '', defects: '' }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: 'units' | 'defects', value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const fpyValues: number[] = [];
    let totalUnits = 0;
    let totalDefects = 0;

    for (let i = 0; i < steps.length; i++) {
      const units = parseFloat(steps[i].units);
      const defects = parseFloat(steps[i].defects);

      if (isNaN(units) || units <= 0) {
        setError(`Step ${i + 1}: Enter a valid number of units (> 0)`);
        return;
      }
      if (isNaN(defects) || defects < 0) {
        setError(`Step ${i + 1}: Enter a valid number of defects (>= 0)`);
        return;
      }
      if (defects > units) {
        setError(`Step ${i + 1}: Defects cannot exceed units`);
        return;
      }

      const fpy = (units - defects) / units;
      fpyValues.push(fpy);
      totalUnits += units;
      totalDefects += defects;
    }

    const rty = fpyValues.reduce((acc, val) => acc * val, 1);
    const dpmo = (totalDefects / totalUnits) * 1000000;

    setResult({ fpy: fpyValues, rty, dpmo });
  };

  const copyText = result
    ? `First-Pass Yields: ${result.fpy.map((f) => (f * 100).toFixed(2) + '%').join(', ')}\nRolled Throughput Yield (RTY): ${(result.rty * 100).toFixed(4)}%\nDPMO: ${result.dpmo.toFixed(0)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Process Steps</label>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <span className="text-xs text-gray-500 w-12">Step {i + 1}</span>
            <input
              type="text"
              inputMode="numeric"
              value={step.units}
              onChange={(e) => updateStep(i, 'units', e.target.value)}
              placeholder="Units"
              className="input-field flex-1"
              aria-label={`Units for step ${i + 1} in ${toolName}`}
            />
            <input
              type="text"
              inputMode="numeric"
              value={step.defects}
              onChange={(e) => updateStep(i, 'defects', e.target.value)}
              placeholder="Defects"
              className="input-field flex-1"
              aria-label={`Defects for step ${i + 1} in ${toolName}`}
            />
            {steps.length > 1 && (
              <button onClick={() => removeStep(i)} className="text-red-500 text-sm hover:text-red-700" aria-label={`Remove step ${i + 1}`}>✕</button>
            )}
          </div>
        ))}
        <button onClick={addStep} className="text-sm text-blue-600 hover:text-blue-800">+ Add Step</button>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate yield" className="btn-primary">
        Calculate Yield
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">First-Pass Yield per Step</label>
              {result.fpy.map((fpy, i) => (
                <div key={i} className="text-sm text-gray-600">
                  Step {i + 1}: <span className="font-mono font-bold">{(fpy * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{(result.rty * 100).toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">Rolled Throughput Yield</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.dpmo.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">DPMO</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
