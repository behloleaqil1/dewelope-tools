'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Wifi6eChannelCalculator - Calculate WiFi 6E channel frequencies and bandwidth.
 */
export default function Wifi6eChannelCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [channel, setChannel] = useState('1');
  const [bandwidth, setBandwidth] = useState('20');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const ch = parseInt(channel);
    const bw = parseInt(bandwidth);
    if (isNaN(ch) || isNaN(bw)) return;

    // WiFi 6E operates in 6 GHz band (5925-7125 MHz)
    // Channel center frequency = 5950 + 5 * channel_number (MHz)
    const centerFreq = 5950 + 5 * ch;
    const lowerFreq = centerFreq - bw / 2;
    const upperFreq = centerFreq + bw / 2;

    const inBand = lowerFreq >= 5925 && upperFreq <= 7125;

    const results = [
      `Channel: ${ch}`,
      `Bandwidth: ${bw} MHz`,
      `Center Frequency: ${centerFreq} MHz (${(centerFreq / 1000).toFixed(3)} GHz)`,
      `Lower Edge: ${lowerFreq} MHz`,
      `Upper Edge: ${upperFreq} MHz`,
      `Frequency Range: ${lowerFreq} - ${upperFreq} MHz`,
      `In 6 GHz Band (5925-7125 MHz): ${inBand ? 'Yes' : 'No - Out of range'}`,
      ``,
      `WiFi 6E Band Info:`,
      `  Total Spectrum: 5925 - 7125 MHz (1200 MHz)`,
      `  Available 20 MHz channels: ~59`,
      `  Available 40 MHz channels: ~29`,
      `  Available 80 MHz channels: ~14`,
      `  Available 160 MHz channels: ~7`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-channel`} className="block text-sm font-medium text-gray-700 mb-1">Channel Number</label>
            <input id={`${toolId}-channel`} type="number" value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="1" aria-label={`Channel number for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">Bandwidth (MHz)</label>
            <select id={`${toolId}-bw`} value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} aria-label="Channel bandwidth" className="input-field">
              <option value="20">20 MHz</option>
              <option value="40">40 MHz</option>
              <option value="80">80 MHz</option>
              <option value="160">160 MHz</option>
              <option value="320">320 MHz</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Channel Information</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
