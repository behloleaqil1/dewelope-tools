'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcieLinkSpeedCalculator - Calculate PCIe bandwidth from generation and lane count.
 * Supports PCIe Gen 1 through Gen 6 with configurable lane widths.
 */
export default function PcieLinkSpeedCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [generation, setGeneration] = useState('3');
  const [lanes, setLanes] = useState('16');
  const [output, setOutput] = useState('');

  const pcieSpecs: Record<string, { rateGTS: number; encoding: string; efficiencyPercent: number }> = {
    '1': { rateGTS: 2.5, encoding: '8b/10b', efficiencyPercent: 80 },
    '2': { rateGTS: 5.0, encoding: '8b/10b', efficiencyPercent: 80 },
    '3': { rateGTS: 8.0, encoding: '128b/130b', efficiencyPercent: 98.46 },
    '4': { rateGTS: 16.0, encoding: '128b/130b', efficiencyPercent: 98.46 },
    '5': { rateGTS: 32.0, encoding: '128b/130b', efficiencyPercent: 98.46 },
    '6': { rateGTS: 64.0, encoding: '1b/1b (PAM4)', efficiencyPercent: 98.46 },
  };

  const calculate = () => {
    const gen = generation;
    const laneCount = parseInt(lanes);
    const spec = pcieSpecs[gen];

    if (!spec || isNaN(laneCount) || laneCount < 1) {
      setOutput('Please select valid generation and lane count.');
      return;
    }

    const rawBandwidthGbps = spec.rateGTS * laneCount;
    const effectiveBandwidthGbps = rawBandwidthGbps * (spec.efficiencyPercent / 100);
    const effectiveBandwidthGBs = effectiveBandwidthGbps / 8;

    const result = `PCIe Gen ${gen} x${laneCount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transfer Rate:       ${spec.rateGTS} GT/s per lane
Encoding:            ${spec.encoding}
Encoding Efficiency: ${spec.efficiencyPercent}%
Lane Count:          x${laneCount}

Raw Bandwidth:       ${rawBandwidthGbps.toFixed(2)} Gb/s
Effective Bandwidth: ${effectiveBandwidthGbps.toFixed(2)} Gb/s
Throughput:          ${effectiveBandwidthGBs.toFixed(2)} GB/s`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-gen`} className="block text-sm font-medium text-gray-700 mb-1">PCIe Generation</label>
            <select id={`${toolId}-gen`} value={generation} onChange={(e) => setGeneration(e.target.value)} aria-label="PCIe generation" className="input-field">
              <option value="1">Gen 1 (2.5 GT/s)</option>
              <option value="2">Gen 2 (5.0 GT/s)</option>
              <option value="3">Gen 3 (8.0 GT/s)</option>
              <option value="4">Gen 4 (16.0 GT/s)</option>
              <option value="5">Gen 5 (32.0 GT/s)</option>
              <option value="6">Gen 6 (64.0 GT/s)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-lanes`} className="block text-sm font-medium text-gray-700 mb-1">Number of Lanes</label>
            <select id={`${toolId}-lanes`} value={lanes} onChange={(e) => setLanes(e.target.value)} aria-label="Number of PCIe lanes" className="input-field">
              <option value="1">x1</option>
              <option value="2">x2</option>
              <option value="4">x4</option>
              <option value="8">x8</option>
              <option value="16">x16</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3" aria-label="Calculate PCIe bandwidth">
          Calculate Bandwidth
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">PCIe Bandwidth Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
