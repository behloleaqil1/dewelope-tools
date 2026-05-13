'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StorageIopsCalculator - Calculate storage IOPS from latency and queue depth.
 * Uses Little's Law: IOPS = Queue Depth / Latency.
 */
export default function StorageIopsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [latency, setLatency] = useState('0.1');
  const [queueDepth, setQueueDepth] = useState('32');
  const [blockSize, setBlockSize] = useState('4');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const lat = parseFloat(latency) || 0.1;
    const qd = parseInt(queueDepth, 10) || 32;
    const bs = parseInt(blockSize, 10) || 4;

    if (lat <= 0) {
      setOutput('Error: Latency must be greater than 0.');
      return;
    }

    // Little's Law: IOPS = QD / (latency in seconds)
    const latencySeconds = lat / 1000; // convert ms to seconds
    const iops = qd / latencySeconds;
    const throughputMBps = (iops * bs) / 1024; // KB to MB

    const result = `Storage IOPS Calculation (Little's Law)
═══════════════════════════════════════
Average Latency: ${lat} ms (${latencySeconds.toFixed(6)} s)
Queue Depth: ${qd}
Block Size: ${bs} KB

Formula: IOPS = Queue Depth / Latency
IOPS = ${qd} / ${latencySeconds.toFixed(6)}

Results:
  IOPS: ${iops.toLocaleString(undefined, { maximumFractionDigits: 0 })}
  Throughput: ${throughputMBps.toFixed(2)} MB/s
  Throughput: ${(throughputMBps / 1024).toFixed(4)} GB/s

Latency Breakdown Estimates:
  At QD 1: ${(1 / latencySeconds).toLocaleString(undefined, { maximumFractionDigits: 0 })} IOPS
  At QD ${qd}: ${iops.toLocaleString(undefined, { maximumFractionDigits: 0 })} IOPS
  At QD 64: ${(64 / latencySeconds).toLocaleString(undefined, { maximumFractionDigits: 0 })} IOPS
  At QD 128: ${(128 / latencySeconds).toLocaleString(undefined, { maximumFractionDigits: 0 })} IOPS

Notes:
- Based on Little's Law (L = λW)
- Real IOPS may be lower due to controller saturation
- Higher queue depths improve parallelism but may increase latency
- ${bs}KB block size is typical for random I/O workloads`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">Average Latency (ms)</label>
            <input id={`${toolId}-lat`} type="number" step="0.01" min="0.001" value={latency} onChange={(e) => setLatency(e.target.value)} placeholder="0.1" aria-label={`Latency for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qd`} className="block text-sm font-medium text-gray-700 mb-1">Queue Depth</label>
            <input id={`${toolId}-qd`} type="number" min="1" max="1024" value={queueDepth} onChange={(e) => setQueueDepth(e.target.value)} placeholder="32" aria-label="Queue depth" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bs`} className="block text-sm font-medium text-gray-700 mb-1">Block Size (KB)</label>
            <select id={`${toolId}-bs`} value={blockSize} onChange={(e) => setBlockSize(e.target.value)} aria-label="Block size" className="input-field">
              <option value="4">4 KB</option>
              <option value="8">8 KB</option>
              <option value="16">16 KB</option>
              <option value="32">32 KB</option>
              <option value="64">64 KB</option>
              <option value="128">128 KB</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate IOPS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Storage IOPS Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
