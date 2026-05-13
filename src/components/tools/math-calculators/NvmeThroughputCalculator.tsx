'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NvmeThroughputCalculator - Calculate NVMe SSD throughput from PCIe generation,
 * lane count, and encoding overhead.
 */
export default function NvmeThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pcieGen, setPcieGen] = useState('4');
  const [lanes, setLanes] = useState('4');
  const [queueDepth, setQueueDepth] = useState('32');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const genRates: Record<string, { rate: number; encoding: string; overhead: number }> = {
      '3': { rate: 8.0, encoding: '128b/130b', overhead: 130 / 128 },
      '4': { rate: 16.0, encoding: '128b/130b', overhead: 130 / 128 },
      '5': { rate: 32.0, encoding: '128b/130b', overhead: 130 / 128 },
    };

    const gen = genRates[pcieGen];
    if (!gen) {
      setOutput('Error: Please select a valid PCIe generation.');
      return;
    }

    const laneCount = parseInt(lanes, 10) || 4;
    const qd = parseInt(queueDepth, 10) || 32;

    const rawBandwidthGTs = gen.rate * laneCount;
    const effectiveBandwidthGbps = (gen.rate * laneCount) / gen.overhead;
    const effectiveMBps = (effectiveBandwidthGbps * 1000) / 8;

    const result = `NVMe Throughput Calculation
═══════════════════════════════════════
PCIe Generation: Gen ${pcieGen}
Lane Configuration: x${laneCount}
Queue Depth: ${qd}
Encoding: ${gen.encoding}

Raw Bandwidth: ${rawBandwidthGTs.toFixed(1)} GT/s
Effective Bandwidth: ${effectiveBandwidthGbps.toFixed(2)} Gbps
Max Sequential Read: ~${effectiveMBps.toFixed(0)} MB/s
Max Sequential Write: ~${(effectiveMBps * 0.85).toFixed(0)} MB/s (estimated ~85%)

Notes:
- Actual throughput depends on controller, NAND, and firmware
- Queue depth of ${qd} helps saturate NVMe bandwidth
- Real-world performance may be 80-95% of theoretical max`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-gen`} className="block text-sm font-medium text-gray-700 mb-1">PCIe Generation</label>
            <select id={`${toolId}-gen`} value={pcieGen} onChange={(e) => setPcieGen(e.target.value)} aria-label={`PCIe generation for ${toolName}`} className="input-field">
              <option value="3">Gen 3</option>
              <option value="4">Gen 4</option>
              <option value="5">Gen 5</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-lanes`} className="block text-sm font-medium text-gray-700 mb-1">Lanes</label>
            <select id={`${toolId}-lanes`} value={lanes} onChange={(e) => setLanes(e.target.value)} aria-label="Lane count" className="input-field">
              <option value="1">x1</option>
              <option value="2">x2</option>
              <option value="4">x4</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-qd`} className="block text-sm font-medium text-gray-700 mb-1">Queue Depth</label>
            <input id={`${toolId}-qd`} type="number" value={queueDepth} onChange={(e) => setQueueDepth(e.target.value)} placeholder="32" aria-label="Queue depth" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Throughput</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NVMe Throughput Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
