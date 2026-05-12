'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PulleySystemCalculator - Calculate mechanical advantage of pulley systems.
 * Computes ideal and actual mechanical advantage, effort force, and rope length.
 */
export default function PulleySystemCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [numPulleys, setNumPulleys] = useState('2');
  const [loadWeight, setLoadWeight] = useState('');
  const [liftDistance, setLiftDistance] = useState('');
  const [efficiency, setEfficiency] = useState('85');
  const [systemType, setSystemType] = useState('compound');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pulleys = parseInt(numPulleys);
    const load = parseFloat(loadWeight);
    const eff = parseFloat(efficiency) / 100;

    if (isNaN(pulleys) || pulleys < 1) {
      setOutput('Please enter a valid number of pulleys (at least 1).');
      return;
    }

    if (isNaN(load) || load <= 0) {
      setOutput('Please enter a valid positive load weight.');
      return;
    }

    const results: string[] = [];
    results.push('=== Pulley System Analysis ===');
    results.push('');

    let idealMA: number;
    if (systemType === 'fixed') {
      idealMA = 1;
      results.push('System Type: Fixed Pulley (direction change only)');
    } else if (systemType === 'movable') {
      idealMA = 2;
      results.push('System Type: Single Movable Pulley');
    } else {
      idealMA = pulleys;
      results.push(`System Type: Compound (${pulleys} supporting ropes)`);
    }

    results.push(`Number of Pulleys: ${pulleys}`);
    results.push('');
    results.push('--- Mechanical Advantage ---');
    results.push(`Ideal MA (IMA): ${idealMA}`);

    const actualMA = idealMA * eff;
    results.push(`Efficiency: ${(eff * 100).toFixed(1)}%`);
    results.push(`Actual MA (AMA): ${actualMA.toFixed(2)}`);
    results.push('');

    results.push('--- Force Analysis ---');
    results.push(`Load (resistance): ${load} N`);
    const idealEffort = load / idealMA;
    const actualEffort = load / actualMA;
    results.push(`Ideal Effort Force: ${idealEffort.toFixed(2)} N`);
    results.push(`Actual Effort Force: ${actualEffort.toFixed(2)} N`);
    results.push('');

    const dist = parseFloat(liftDistance);
    if (!isNaN(dist) && dist > 0) {
      results.push('--- Distance & Work ---');
      const ropeLength = dist * idealMA;
      results.push(`Lift Distance: ${dist} m`);
      results.push(`Rope Pull Length: ${ropeLength.toFixed(2)} m`);
      const workOutput = load * dist;
      const workInput = actualEffort * ropeLength;
      results.push(`Work Output: ${workOutput.toFixed(2)} J`);
      results.push(`Work Input: ${workInput.toFixed(2)} J`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              System Type
            </label>
            <select
              id={`${toolId}-type`}
              value={systemType}
              onChange={(e) => setSystemType(e.target.value)}
              className="input-field"
              aria-label={`System type for ${toolName}`}
            >
              <option value="fixed">Fixed (direction change)</option>
              <option value="movable">Single Movable</option>
              <option value="compound">Compound</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-pulleys`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Supporting Ropes/Pulleys
            </label>
            <input
              id={`${toolId}-pulleys`}
              type="number"
              min="1"
              max="20"
              value={numPulleys}
              onChange={(e) => setNumPulleys(e.target.value)}
              className="input-field"
              aria-label="Number of pulleys"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-load`} className="block text-sm font-medium text-gray-700 mb-1">
              Load Weight (N)
            </label>
            <input
              id={`${toolId}-load`}
              type="number"
              min="0"
              step="any"
              value={loadWeight}
              onChange={(e) => setLoadWeight(e.target.value)}
              placeholder="e.g. 500"
              className="input-field"
              aria-label="Load weight in Newtons"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">
              Lift Distance (m) - optional
            </label>
            <input
              id={`${toolId}-dist`}
              type="number"
              min="0"
              step="any"
              value={liftDistance}
              onChange={(e) => setLiftDistance(e.target.value)}
              placeholder="e.g. 3"
              className="input-field"
              aria-label="Lift distance in meters"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">
              Efficiency (%)
            </label>
            <input
              id={`${toolId}-eff`}
              type="number"
              min="1"
              max="100"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              className="input-field"
              aria-label="System efficiency percentage"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate
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
