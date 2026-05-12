'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KanbanWipCalculator - Calculate optimal WIP limits using Little's Law.
 * WIP = Throughput × Lead Time. Helps teams set Kanban board limits.
 */
export default function KanbanWipCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [throughput, setThroughput] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setOutput('');

    const tp = parseFloat(throughput);
    const lt = parseFloat(leadTime);
    const team = parseInt(teamSize) || 0;

    if (!tp || tp <= 0) {
      setError('Throughput must be a positive number.');
      return;
    }
    if (!lt || lt <= 0) {
      setError('Lead time must be a positive number.');
      return;
    }

    // Little's Law: WIP = Throughput × Lead Time
    const wip = tp * lt;
    const wipRounded = Math.ceil(wip);

    // Recommended range
    const wipMin = Math.max(1, Math.floor(wip * 0.8));
    const wipMax = Math.ceil(wip * 1.2);

    // Per-person WIP if team size provided
    const perPerson = team > 0 ? (wip / team).toFixed(2) : 'N/A';
    const perPersonRecommended = team > 0 ? `${Math.max(1, Math.floor(wip / team))} - ${Math.ceil((wip * 1.2) / team)}` : 'N/A';

    const lines = [
      `Kanban WIP Limit Analysis (Little's Law)`,
      `──────────────────────────────────────────`,
      `Throughput:        ${tp} items/day`,
      `Avg Lead Time:     ${lt} days`,
      `──────────────────────────────────────────`,
      `Optimal WIP (L = λ × W):  ${wip.toFixed(2)} items`,
      `Recommended WIP Limit:    ${wipRounded} items`,
      `Suggested Range:          ${wipMin} - ${wipMax} items`,
      `──────────────────────────────────────────`,
      `Team Size:                ${team > 0 ? team + ' people' : 'Not specified'}`,
      `WIP per Person:           ${perPerson}`,
      `Per-Person Range:         ${perPersonRecommended}`,
      `──────────────────────────────────────────`,
      `Tips:`,
      `• Start with the calculated WIP limit`,
      `• If items queue up, reduce WIP limit`,
      `• If team is idle, slightly increase WIP`,
      `• Review and adjust every 2-4 weeks`,
    ];
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-throughput`} className="block text-sm font-medium text-gray-700 mb-1">Throughput (items/day)</label>
            <input id={`${toolId}-throughput`} type="number" value={throughput} onChange={(e) => setThroughput(e.target.value)} placeholder="e.g. 5" aria-label="Throughput in items per day" className="input-field" min="0.1" step="0.1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-leadtime`} className="block text-sm font-medium text-gray-700 mb-1">Avg Lead Time (days)</label>
            <input id={`${toolId}-leadtime`} type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="e.g. 3" aria-label="Average lead time in days" className="input-field" min="0.1" step="0.1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-team`} className="block text-sm font-medium text-gray-700 mb-1">Team Size (optional)</label>
            <input id={`${toolId}-team`} type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 4" aria-label="Team size" className="input-field" min="1" step="1" />
          </div>
        </div>
        <button onClick={handleCalculate} className="btn-primary mt-3">Calculate WIP Limits</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">WIP Limit Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
