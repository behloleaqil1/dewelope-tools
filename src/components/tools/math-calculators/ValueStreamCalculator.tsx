'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ValueStreamCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [processTime, setProcessTime] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [changeover, setChangeover] = useState('');
  const [uptime, setUptime] = useState('100');
  const [demand, setDemand] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pt = parseFloat(processTime);
    const lt = parseFloat(leadTime);
    const co = parseFloat(changeover) || 0;
    const up = parseFloat(uptime) || 100;
    const dem = parseFloat(demand);

    if (isNaN(pt) || isNaN(lt) || lt === 0) {
      setOutput('Please enter valid process time and lead time values.');
      return;
    }

    const pceRatio = (pt / lt) * 100;
    const availableTime = 8 * 60 * (up / 100); // minutes per shift
    const taktTime = dem > 0 ? availableTime / dem : 0;
    const valueAdded = pt;
    const nonValueAdded = lt - pt;
    const totalCycleTime = pt + co;

    const lines = [
      `=== Value Stream Mapping Metrics ===`,
      ``,
      `Process Time (Value-Added): ${pt.toFixed(2)} min`,
      `Total Lead Time: ${lt.toFixed(2)} min`,
      `Changeover Time: ${co.toFixed(2)} min`,
      `Uptime: ${up.toFixed(1)}%`,
      ``,
      `--- Key Metrics ---`,
      `Process Cycle Efficiency (PCE): ${pceRatio.toFixed(2)}%`,
      `Value-Added Time: ${valueAdded.toFixed(2)} min`,
      `Non-Value-Added Time: ${nonValueAdded.toFixed(2)} min`,
      `Total Cycle Time (incl. changeover): ${totalCycleTime.toFixed(2)} min`,
    ];

    if (taktTime > 0) {
      lines.push(`Takt Time: ${taktTime.toFixed(2)} min/unit`);
      lines.push(`Capacity vs Demand: ${totalCycleTime <= taktTime ? '✅ Meeting demand' : '⚠️ Bottleneck - cycle time exceeds takt time'}`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-pt`} className="block text-sm font-medium text-gray-700 mb-1">Process Time (min)</label>
            <input id={`${toolId}-pt`} type="number" value={processTime} onChange={(e) => setProcessTime(e.target.value)} className="input-field" placeholder="e.g. 15" aria-label="Process time in minutes" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lt`} className="block text-sm font-medium text-gray-700 mb-1">Lead Time (min)</label>
            <input id={`${toolId}-lt`} type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} className="input-field" placeholder="e.g. 480" aria-label="Lead time in minutes" />
          </div>
          <div>
            <label htmlFor={`${toolId}-co`} className="block text-sm font-medium text-gray-700 mb-1">Changeover Time (min)</label>
            <input id={`${toolId}-co`} type="number" value={changeover} onChange={(e) => setChangeover(e.target.value)} className="input-field" placeholder="e.g. 5" aria-label="Changeover time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-up`} className="block text-sm font-medium text-gray-700 mb-1">Uptime (%)</label>
            <input id={`${toolId}-up`} type="number" value={uptime} onChange={(e) => setUptime(e.target.value)} className="input-field" placeholder="100" aria-label="Uptime percentage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dem`} className="block text-sm font-medium text-gray-700 mb-1">Daily Demand (units)</label>
            <input id={`${toolId}-dem`} type="number" value={demand} onChange={(e) => setDemand(e.target.value)} className="input-field" placeholder="e.g. 100" aria-label={`Daily demand for ${toolName}`} />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate VSM Metrics</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Value Stream Metrics</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
