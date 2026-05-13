'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DdrMemoryBandwidthCalculator - Calculate DDR memory bandwidth from clock speed, bus width, and data rate.
 */
export default function DdrMemoryBandwidthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ddrType, setDdrType] = useState('DDR5');
  const [clockSpeed, setClockSpeed] = useState('2400');
  const [busWidth, setBusWidth] = useState('64');
  const [channels, setChannels] = useState('2');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const clock = parseFloat(clockSpeed);
    const bus = parseFloat(busWidth);
    const ch = parseFloat(channels);

    if (isNaN(clock) || isNaN(bus) || isNaN(ch) || clock <= 0 || bus <= 0 || ch <= 0) {
      setOutput('Please enter valid positive numbers.');
      return;
    }

    let prefetchMultiplier = 2;
    switch (ddrType) {
      case 'DDR': prefetchMultiplier = 2; break;
      case 'DDR2': prefetchMultiplier = 4; break;
      case 'DDR3': prefetchMultiplier = 8; break;
      case 'DDR4': prefetchMultiplier = 8; break;
      case 'DDR5': prefetchMultiplier = 16; break;
    }

    const dataRate = clock * 2; // Double data rate
    const transferRateMTs = dataRate; // MT/s
    const bandwidthPerChannel = (transferRateMTs * bus) / 8; // bytes per second (MB/s)
    const totalBandwidth = bandwidthPerChannel * ch;

    const results = [
      `DDR Type: ${ddrType}`,
      `Base Clock: ${clock} MHz`,
      `Prefetch Multiplier: ${prefetchMultiplier}n`,
      `Data Rate: ${transferRateMTs.toLocaleString()} MT/s`,
      `Bus Width: ${bus} bits × ${ch} channel(s)`,
      ``,
      `Bandwidth per Channel: ${bandwidthPerChannel.toLocaleString(undefined, { maximumFractionDigits: 2 })} MB/s (${(bandwidthPerChannel / 1000).toFixed(2)} GB/s)`,
      `Total Bandwidth: ${totalBandwidth.toLocaleString(undefined, { maximumFractionDigits: 2 })} MB/s (${(totalBandwidth / 1000).toFixed(2)} GB/s)`,
      ``,
      `Module Designation: PC${ddrType.replace('DDR', '')}-${Math.round(totalBandwidth / ch)}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">DDR Type</label>
            <select id={`${toolId}-type`} value={ddrType} onChange={(e) => setDdrType(e.target.value)} className="input-field" aria-label={`DDR type for ${toolName}`}>
              <option value="DDR">DDR</option>
              <option value="DDR2">DDR2</option>
              <option value="DDR3">DDR3</option>
              <option value="DDR4">DDR4</option>
              <option value="DDR5">DDR5</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-clock`} className="block text-sm font-medium text-gray-700 mb-1">Clock Speed (MHz)</label>
            <input id={`${toolId}-clock`} type="number" value={clockSpeed} onChange={(e) => setClockSpeed(e.target.value)} className="input-field" aria-label="Clock speed in MHz" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bus`} className="block text-sm font-medium text-gray-700 mb-1">Bus Width (bits)</label>
              <input id={`${toolId}-bus`} type="number" value={busWidth} onChange={(e) => setBusWidth(e.target.value)} className="input-field" aria-label="Bus width in bits" />
            </div>
            <div>
              <label htmlFor={`${toolId}-channels`} className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
              <input id={`${toolId}-channels`} type="number" value={channels} onChange={(e) => setChannels(e.target.value)} className="input-field" aria-label="Number of channels" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Bandwidth</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">DDR Memory Bandwidth</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
