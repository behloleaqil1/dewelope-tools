'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LeadTimeCalculator - Calculate manufacturing lead time from component times.
 * Sums queue time, setup time, run time, wait time, and move time.
 */
export default function LeadTimeCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [queueTime, setQueueTime] = useState('');
  const [setupTime, setSetupTime] = useState('');
  const [runTime, setRunTime] = useState('');
  const [waitTime, setWaitTime] = useState('');
  const [moveTime, setMoveTime] = useState('');
  const [batchSize, setBatchSize] = useState('1');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setOutput('');

    const queue = parseFloat(queueTime) || 0;
    const setup = parseFloat(setupTime) || 0;
    const run = parseFloat(runTime) || 0;
    const wait = parseFloat(waitTime) || 0;
    const move = parseFloat(moveTime) || 0;
    const batch = parseInt(batchSize) || 1;

    if (queue < 0 || setup < 0 || run < 0 || wait < 0 || move < 0) {
      setError('Time values cannot be negative.');
      return;
    }
    if (batch < 1) {
      setError('Batch size must be at least 1.');
      return;
    }

    const totalRunTime = run * batch;
    const totalLeadTime = queue + setup + totalRunTime + wait + move;
    const valueAddedTime = totalRunTime;
    const nonValueAddedTime = totalLeadTime - valueAddedTime;
    const efficiency = totalLeadTime > 0 ? (valueAddedTime / totalLeadTime) * 100 : 0;

    const lines = [
      `Manufacturing Lead Time Breakdown`,
      `──────────────────────────────────`,
      `Queue Time:          ${queue.toFixed(2)} hrs`,
      `Setup Time:          ${setup.toFixed(2)} hrs`,
      `Run Time (per unit): ${run.toFixed(2)} hrs`,
      `Batch Size:          ${batch} units`,
      `Total Run Time:      ${totalRunTime.toFixed(2)} hrs`,
      `Wait Time:           ${wait.toFixed(2)} hrs`,
      `Move Time:           ${move.toFixed(2)} hrs`,
      `──────────────────────────────────`,
      `Total Lead Time:     ${totalLeadTime.toFixed(2)} hrs (${(totalLeadTime / 24).toFixed(2)} days)`,
      `Value-Added Time:    ${valueAddedTime.toFixed(2)} hrs`,
      `Non-Value-Added:     ${nonValueAddedTime.toFixed(2)} hrs`,
      `Lead Time Efficiency: ${efficiency.toFixed(1)}%`,
    ];
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-queue`} className="block text-sm font-medium text-gray-700 mb-1">Queue Time (hrs)</label>
            <input id={`${toolId}-queue`} type="number" value={queueTime} onChange={(e) => setQueueTime(e.target.value)} placeholder="0" aria-label="Queue time in hours" className="input-field" min="0" step="0.1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-setup`} className="block text-sm font-medium text-gray-700 mb-1">Setup Time (hrs)</label>
            <input id={`${toolId}-setup`} type="number" value={setupTime} onChange={(e) => setSetupTime(e.target.value)} placeholder="0" aria-label="Setup time in hours" className="input-field" min="0" step="0.1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-run`} className="block text-sm font-medium text-gray-700 mb-1">Run Time per Unit (hrs)</label>
            <input id={`${toolId}-run`} type="number" value={runTime} onChange={(e) => setRunTime(e.target.value)} placeholder="0" aria-label="Run time per unit in hours" className="input-field" min="0" step="0.01" />
          </div>
          <div>
            <label htmlFor={`${toolId}-batch`} className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
            <input id={`${toolId}-batch`} type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} placeholder="1" aria-label="Batch size" className="input-field" min="1" step="1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-wait`} className="block text-sm font-medium text-gray-700 mb-1">Wait Time (hrs)</label>
            <input id={`${toolId}-wait`} type="number" value={waitTime} onChange={(e) => setWaitTime(e.target.value)} placeholder="0" aria-label="Wait time in hours" className="input-field" min="0" step="0.1" />
          </div>
          <div>
            <label htmlFor={`${toolId}-move`} className="block text-sm font-medium text-gray-700 mb-1">Move Time (hrs)</label>
            <input id={`${toolId}-move`} type="number" value={moveTime} onChange={(e) => setMoveTime(e.target.value)} placeholder="0" aria-label="Move time in hours" className="input-field" min="0" step="0.1" />
          </div>
        </div>
        <button onClick={handleCalculate} className="btn-primary mt-3">Calculate Lead Time</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lead Time Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
