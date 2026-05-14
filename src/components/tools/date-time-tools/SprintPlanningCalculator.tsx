'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SprintPlanningCalculator - Calculate sprint dates and velocity metrics
 */
export default function SprintPlanningCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [sprintLength, setSprintLength] = useState('14');
  const [numSprints, setNumSprints] = useState('6');
  const [velocity, setVelocity] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [result, setResult] = useState<{ sprints: Array<{ num: number; start: string; end: string }>; sprintsNeeded: number | null; completionDate: string | null } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!startDate) { setError('Please select a start date'); return; }
    const length = parseInt(sprintLength);
    const count = parseInt(numSprints);
    if (isNaN(length) || length < 1) { setError('Sprint length must be positive'); return; }
    if (isNaN(count) || count < 1 || count > 52) { setError('Number of sprints must be 1-52'); return; }

    const sprints: Array<{ num: number; start: string; end: string }> = [];
    const start = new Date(startDate);

    for (let i = 0; i < count; i++) {
      const sprintStart = new Date(start);
      sprintStart.setDate(sprintStart.getDate() + i * length);
      const sprintEnd = new Date(sprintStart);
      sprintEnd.setDate(sprintEnd.getDate() + length - 1);
      sprints.push({
        num: i + 1,
        start: sprintStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: sprintEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    }

    let sprintsNeeded: number | null = null;
    let completionDate: string | null = null;
    const vel = parseFloat(velocity);
    const total = parseFloat(totalPoints);
    if (!isNaN(vel) && vel > 0 && !isNaN(total) && total > 0) {
      sprintsNeeded = Math.ceil(total / vel);
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + sprintsNeeded * length - 1);
      completionDate = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    setResult({ sprints, sprintsNeeded, completionDate });
  }

  const copyText = result ? result.sprints.map(s => `Sprint ${s.num}: ${s.start} - ${s.end}`).join('\n') + (result.completionDate ? `\nEstimated completion: ${result.completionDate}` : '') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">First Sprint Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1"><label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Sprint Length (days)</label><input id={`${toolId}-length`} type="number" min="1" value={sprintLength} onChange={(e) => setSprintLength(e.target.value)} aria-label={`Sprint length for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Sprints</label><input id={`${toolId}-count`} type="number" min="1" max="52" value={numSprints} onChange={(e) => setNumSprints(e.target.value)} aria-label={`Number of sprints for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1"><label htmlFor={`${toolId}-vel`} className="block text-sm font-medium text-gray-700 mb-1">Velocity (pts/sprint, optional)</label><input id={`${toolId}-vel`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="e.g., 20" aria-label={`Velocity for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-total`} className="block text-sm font-medium text-gray-700 mb-1">Total Points (optional)</label><input id={`${toolId}-total`} type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)} placeholder="e.g., 120" aria-label={`Total points for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Plan Sprints</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.sprints.map(s => (
                <div key={s.num} className="flex items-center gap-3 bg-blue-50 p-2 rounded border border-blue-200 text-sm">
                  <span className="font-semibold text-blue-600">Sprint {s.num}</span>
                  <span className="text-gray-600">{s.start} → {s.end}</span>
                </div>
              ))}
            </div>
            {result.sprintsNeeded && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="font-semibold text-green-700">Sprints needed: {result.sprintsNeeded}</div>
                <div className="text-sm text-green-600">Estimated completion: {result.completionDate}</div>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
