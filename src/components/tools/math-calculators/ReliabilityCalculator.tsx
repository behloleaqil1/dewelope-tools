'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReliabilityCalculator - Calculate system reliability for series and parallel configurations.
 */
export default function ReliabilityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [components, setComponents] = useState<string[]>(['', '']);
  const [config, setConfig] = useState<'series' | 'parallel'>('series');
  const [result, setResult] = useState<{ systemReliability: number; failureProbability: number; mttf: string } | null>(null);
  const [error, setError] = useState('');

  const addComponent = () => {
    setComponents([...components, '']);
  };

  const removeComponent = (index: number) => {
    if (components.length > 2) {
      setComponents(components.filter((_, i) => i !== index));
    }
  };

  const updateComponent = (index: number, value: string) => {
    const updated = [...components];
    updated[index] = value;
    setComponents(updated);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const reliabilities: number[] = [];

    for (let i = 0; i < components.length; i++) {
      const val = parseFloat(components[i]);
      if (isNaN(val) || val < 0 || val > 1) {
        setError(`Component ${i + 1}: Enter a reliability value between 0 and 1`);
        return;
      }
      reliabilities.push(val);
    }

    let systemReliability: number;

    if (config === 'series') {
      systemReliability = reliabilities.reduce((acc, r) => acc * r, 1);
    } else {
      systemReliability = 1 - reliabilities.reduce((acc, r) => acc * (1 - r), 1);
    }

    const failureProbability = 1 - systemReliability;

    // MTTF approximation assuming exponential distribution
    let mttf = 'N/A';
    if (systemReliability > 0 && systemReliability < 1) {
      const lambda = -Math.log(systemReliability);
      mttf = (1 / lambda).toFixed(4) + ' time units';
    }

    setResult({ systemReliability, failureProbability, mttf });
  };

  const copyText = result
    ? `Configuration: ${config}\nSystem Reliability: ${(result.systemReliability * 100).toFixed(4)}%\nFailure Probability: ${(result.failureProbability * 100).toFixed(4)}%\nMTTF: ${result.mttf}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={config === 'series'} onChange={() => setConfig('series')} className="mr-1" />
            Series
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={config === 'parallel'} onChange={() => setConfig('parallel')} className="mr-1" />
            Parallel
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Component Reliabilities (0 to 1)</label>
        {components.map((comp, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <span className="text-xs text-gray-500 w-20">Component {i + 1}</span>
            <input
              type="text"
              inputMode="decimal"
              value={comp}
              onChange={(e) => updateComponent(i, e.target.value)}
              placeholder="e.g. 0.95"
              className="input-field flex-1"
              aria-label={`Reliability for component ${i + 1} in ${toolName}`}
            />
            {components.length > 2 && (
              <button onClick={() => removeComponent(i)} className="text-red-500 text-sm hover:text-red-700" aria-label={`Remove component ${i + 1}`}>✕</button>
            )}
          </div>
        ))}
        <button onClick={addComponent} className="text-sm text-blue-600 hover:text-blue-800">+ Add Component</button>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate reliability" className="btn-primary">
        Calculate Reliability
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
              <strong>Configuration:</strong> {config === 'series' ? 'Series (all must work)' : 'Parallel (at least one must work)'}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{(result.systemReliability * 100).toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">System Reliability</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-600">{(result.failureProbability * 100).toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">Failure Probability</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>MTTF:</strong> {result.mttf}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
