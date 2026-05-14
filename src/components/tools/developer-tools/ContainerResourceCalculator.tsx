'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ContainerResourceCalculator - Calculate container CPU/memory limits.
 */
export default function ContainerResourceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [avgCpu, setAvgCpu] = useState('200');
  const [peakCpu, setPeakCpu] = useState('500');
  const [avgMem, setAvgMem] = useState('128');
  const [peakMem, setPeakMem] = useState('256');
  const [replicas, setReplicas] = useState('3');
  const [result, setResult] = useState<{ cpuRequest: string; cpuLimit: string; memRequest: string; memLimit: string; totalCpu: string; totalMem: string; yaml: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);

    const avg = parseFloat(avgCpu);
    const peak = parseFloat(peakCpu);
    const avgM = parseFloat(avgMem);
    const peakM = parseFloat(peakMem);
    const reps = parseInt(replicas);

    if ([avg, peak, avgM, peakM, reps].some(isNaN)) {
      setError('Please enter valid numbers');
      return;
    }

    // Requests = average usage + 20% buffer
    const cpuRequest = Math.ceil(avg * 1.2);
    const memRequest = Math.ceil(avgM * 1.2);
    // Limits = peak usage + 25% headroom
    const cpuLimit = Math.ceil(peak * 1.25);
    const memLimit = Math.ceil(peakM * 1.25);

    const totalCpu = cpuLimit * reps;
    const totalMem = memLimit * reps;

    const yaml = `resources:
  requests:
    cpu: "${cpuRequest}m"
    memory: "${memRequest}Mi"
  limits:
    cpu: "${cpuLimit}m"
    memory: "${memLimit}Mi"`;

    setResult({
      cpuRequest: `${cpuRequest}m`,
      cpuLimit: `${cpuLimit}m`,
      memRequest: `${memRequest}Mi`,
      memLimit: `${memLimit}Mi`,
      totalCpu: `${totalCpu}m (${(totalCpu / 1000).toFixed(2)} cores)`,
      totalMem: `${totalMem}Mi (${(totalMem / 1024).toFixed(2)} Gi)`,
      yaml,
    });
  }

  const copyText = result ? result.yaml : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-avg-cpu`} className="block text-sm font-medium text-gray-700 mb-1">Avg CPU (millicores)</label>
            <input id={`${toolId}-avg-cpu`} type="number" value={avgCpu} onChange={(e) => setAvgCpu(e.target.value)} aria-label={`Average CPU for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-peak-cpu`} className="block text-sm font-medium text-gray-700 mb-1">Peak CPU (millicores)</label>
            <input id={`${toolId}-peak-cpu`} type="number" value={peakCpu} onChange={(e) => setPeakCpu(e.target.value)} aria-label="Peak CPU usage" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-avg-mem`} className="block text-sm font-medium text-gray-700 mb-1">Avg Memory (Mi)</label>
            <input id={`${toolId}-avg-mem`} type="number" value={avgMem} onChange={(e) => setAvgMem(e.target.value)} aria-label="Average memory usage" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-peak-mem`} className="block text-sm font-medium text-gray-700 mb-1">Peak Memory (Mi)</label>
            <input id={`${toolId}-peak-mem`} type="number" value={peakMem} onChange={(e) => setPeakMem(e.target.value)} aria-label="Peak memory usage" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-replicas`} className="block text-sm font-medium text-gray-700 mb-1">Replicas</label>
            <input id={`${toolId}-replicas`} type="number" min="1" value={replicas} onChange={(e) => setReplicas(e.target.value)} aria-label="Number of replicas" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate container resources" className="btn-primary">
        Calculate Resources
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">CPU Request</div>
                <div className="font-mono font-bold text-blue-600">{result.cpuRequest}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">CPU Limit</div>
                <div className="font-mono font-bold text-blue-600">{result.cpuLimit}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">Memory Request</div>
                <div className="font-mono font-bold text-blue-600">{result.memRequest}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">Memory Limit</div>
                <div className="font-mono font-bold text-blue-600">{result.memLimit}</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
              <div className="font-medium text-yellow-800">Total cluster resources ({replicas} replicas):</div>
              <div className="text-yellow-700">CPU: {result.totalCpu} | Memory: {result.totalMem}</div>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{result.yaml}</pre>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
