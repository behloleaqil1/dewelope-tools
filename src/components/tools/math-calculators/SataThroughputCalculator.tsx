'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SataThroughputCalculator - Calculate SATA interface throughput
 * from SATA revision, encoding overhead, and drive type.
 */
export default function SataThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sataRev, setSataRev] = useState('3');
  const [driveType, setDriveType] = useState('ssd');
  const [queueDepth, setQueueDepth] = useState('32');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const revisions: Record<string, { rate: number; name: string }> = {
      '1': { rate: 1.5, name: 'SATA I (1.5 Gbps)' },
      '2': { rate: 3.0, name: 'SATA II (3.0 Gbps)' },
      '3': { rate: 6.0, name: 'SATA III (6.0 Gbps)' },
    };

    const rev = revisions[sataRev];
    if (!rev) {
      setOutput('Error: Please select a valid SATA revision.');
      return;
    }

    const qd = parseInt(queueDepth, 10) || 32;
    // SATA uses 8b/10b encoding
    const encodingOverhead = 10 / 8;
    const effectiveGbps = rev.rate / encodingOverhead;
    const effectiveMBps = (effectiveGbps * 1000) / 8;

    // Typical real-world performance
    const ssdTypical = Math.min(effectiveMBps * 0.92, driveType === 'ssd' ? 560 : 200);
    const hddTypical = Math.min(effectiveMBps, driveType === 'hdd' ? 200 : effectiveMBps * 0.92);
    const typicalPerf = driveType === 'ssd' ? ssdTypical : hddTypical;

    const result = `SATA Throughput Calculation
═══════════════════════════════════════
Interface: ${rev.name}
Drive Type: ${driveType.toUpperCase()}
Queue Depth: ${qd}
Encoding: 8b/10b

Raw Link Rate: ${rev.rate.toFixed(1)} Gbps
Encoding Overhead: 20% (8b/10b)
Effective Bandwidth: ${effectiveGbps.toFixed(2)} Gbps
Max Theoretical: ${effectiveMBps.toFixed(0)} MB/s

Typical Sequential Read: ~${typicalPerf.toFixed(0)} MB/s
Typical Sequential Write: ~${(typicalPerf * 0.85).toFixed(0)} MB/s

Notes:
- 8b/10b encoding reduces usable bandwidth by 20%
- ${driveType === 'ssd' ? 'SATA SSDs are typically interface-limited at ~550 MB/s' : 'HDDs are limited by mechanical seek and rotational speed'}
- Queue depth of ${qd} helps with ${driveType === 'ssd' ? 'random I/O performance' : 'NCQ optimization'}
- AHCI command protocol adds minor overhead`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-rev`} className="block text-sm font-medium text-gray-700 mb-1">SATA Revision</label>
            <select id={`${toolId}-rev`} value={sataRev} onChange={(e) => setSataRev(e.target.value)} aria-label={`SATA revision for ${toolName}`} className="input-field">
              <option value="1">SATA I (1.5 Gbps)</option>
              <option value="2">SATA II (3.0 Gbps)</option>
              <option value="3">SATA III (6.0 Gbps)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-drive`} className="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
            <select id={`${toolId}-drive`} value={driveType} onChange={(e) => setDriveType(e.target.value)} aria-label="Drive type" className="input-field">
              <option value="ssd">SSD</option>
              <option value="hdd">HDD</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-qd`} className="block text-sm font-medium text-gray-700 mb-1">Queue Depth</label>
            <input id={`${toolId}-qd`} type="number" min="1" max="256" value={queueDepth} onChange={(e) => setQueueDepth(e.target.value)} placeholder="32" aria-label="Queue depth" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Throughput</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SATA Throughput Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
