'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BirthdayParadoxCalculator - Calculate probability of shared birthdays in a group.
 * Uses the complement method: P(shared) = 1 - P(all different)
 */
export default function BirthdayParadoxCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [groupSize, setGroupSize] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ probability: number; percentage: number; groupSize: number; milestones: { size: number; prob: number }[] } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const n = parseInt(groupSize);
    if (!groupSize.trim() || isNaN(n) || n < 2) {
      setError('Enter a group size of at least 2');
      return;
    }
    if (n > 365) {
      // With more than 365 people, probability is 100%
      setResult({
        probability: 1,
        percentage: 100,
        groupSize: n,
        milestones: [{ size: 23, prob: 50.73 }, { size: 50, prob: 97.04 }, { size: 70, prob: 99.92 }],
      });
      return;
    }

    // P(all different) = 365/365 × 364/365 × 363/365 × ... × (365-n+1)/365
    let pAllDifferent = 1;
    for (let i = 0; i < n; i++) {
      pAllDifferent *= (365 - i) / 365;
    }
    const probability = 1 - pAllDifferent;
    const percentage = probability * 100;

    // Calculate milestones
    const milestones: { size: number; prob: number }[] = [];
    const targets = [10, 23, 30, 40, 50, 57, 70, 100];
    for (const t of targets) {
      let p = 1;
      for (let i = 0; i < t; i++) {
        p *= (365 - i) / 365;
      }
      milestones.push({ size: t, prob: (1 - p) * 100 });
    }

    setResult({ probability, percentage, groupSize: n, milestones });
  };

  const copyText = result
    ? `Birthday Paradox - Group of ${result.groupSize}\nProbability of shared birthday: ${result.percentage.toFixed(2)}%\nP(at least 2 share a birthday) = ${result.probability.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Group Size (number of people)
        </label>
        <input
          id={`${toolId}-size`}
          type="text"
          inputMode="numeric"
          value={groupSize}
          onChange={(e) => { setGroupSize(e.target.value); setError(''); }}
          placeholder="e.g. 23"
          aria-label={`Group size for ${toolName}`}
          className="input-field w-48"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate birthday paradox probability" className="btn-primary">
        Calculate Probability
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.percentage.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Probability of Shared Birthday</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.groupSize}</div>
                <div className="text-xs text-gray-500 mt-1">People in Group</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Probability Milestones</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.milestones.map((m) => (
                  <div key={m.size} className="text-center p-2 bg-white rounded border border-gray-100">
                    <div className="text-sm font-bold text-gray-700">{m.size} people</div>
                    <div className="text-xs text-gray-500">{m.prob.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              P(shared) = 1 - P(all different) = 1 - (365/365 × 364/365 × ... × {365 - result.groupSize + 1}/365)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
