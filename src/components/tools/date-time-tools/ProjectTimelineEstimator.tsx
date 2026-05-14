'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProjectTimelineEstimator - Estimate project end date from tasks and durations
 */
export default function ProjectTimelineEstimator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [tasks, setTasks] = useState('');
  const [result, setResult] = useState<Array<{ task: string; start: string; end: string }>>([]);
  const [error, setError] = useState<string | undefined>();

  function estimate() {
    setError(undefined);
    setResult([]);

    if (!startDate) { setError('Please select a start date'); return; }
    if (!tasks.trim()) { setError('Enter tasks (one per line: task name, days)'); return; }

    const lines = tasks.trim().split('\n').filter(l => l.trim());
    const timeline: Array<{ task: string; start: string; end: string }> = [];
    let current = new Date(startDate);

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length < 2) { setError(`Invalid format: "${line}". Use: task name, days`); return; }
      const name = parts[0].trim();
      const days = parseInt(parts[1].trim());
      if (isNaN(days) || days <= 0) { setError(`Invalid days for "${name}"`); return; }

      const taskStart = new Date(current);
      const taskEnd = new Date(current);
      taskEnd.setDate(taskEnd.getDate() + days - 1);

      timeline.push({
        task: name,
        start: taskStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: taskEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });

      current = new Date(taskEnd);
      current.setDate(current.getDate() + 1);
    }

    setResult(timeline);
  }

  const copyText = result.map(r => `${r.task}: ${r.start} - ${r.end}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Project Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-tasks`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Tasks (one per line: name, days)</label>
        <textarea id={`${toolId}-tasks`} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder="Design, 5&#10;Development, 15&#10;Testing, 7&#10;Deployment, 3" aria-label={`Tasks input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
      </InputArea>

      <button onClick={estimate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Estimate Timeline</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            {result.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{r.task}</div>
                  <div className="text-sm text-gray-600">{r.start} → {r.end}</div>
                </div>
              </div>
            ))}
            <div className="text-sm font-semibold text-gray-700 mt-2">Project End: {result[result.length - 1].end}</div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
