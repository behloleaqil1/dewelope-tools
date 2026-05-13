'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EthernetThroughputCalculator - Calculate effective Ethernet throughput accounting for overhead.
 */
export default function EthernetThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [linkSpeed, setLinkSpeed] = useState('1000');
  const [frameSize, setFrameSize] = useState('1518');
  const [overhead, setOverhead] = useState('preamble');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const speed = parseFloat(linkSpeed);
    const frame = parseFloat(frameSize);

    if (isNaN(speed) || isNaN(frame) || speed <= 0 || frame <= 0) {
      setOutput('Please enter valid positive numbers.');
      return;
    }

    // Ethernet frame overhead
    const preamble = 8; // 7 bytes preamble + 1 byte SFD
    const ifg = 12; // Inter-frame gap
    const crc = 4; // FCS
    const headerOverhead = 14; // Dest MAC (6) + Src MAC (6) + EtherType (2)

    let totalOverheadPerFrame = 0;
    if (overhead === 'preamble') {
      totalOverheadPerFrame = preamble + ifg + headerOverhead + crc;
    } else if (overhead === 'all') {
      totalOverheadPerFrame = preamble + ifg + headerOverhead + crc;
    } else {
      totalOverheadPerFrame = headerOverhead + crc;
    }

    const payloadSize = frame - headerOverhead - crc;
    const totalFrameOnWire = frame + preamble + ifg;
    const efficiency = (payloadSize / totalFrameOnWire) * 100;
    const effectiveThroughput = (speed * efficiency) / 100;
    const framesPerSecond = (speed * 1000000) / (totalFrameOnWire * 8);
    const packetsPerSecond = framesPerSecond;

    const results = [
      `Link Speed: ${speed} Mbps (${speed / 1000} Gbps)`,
      `Frame Size: ${frame} bytes`,
      `Payload Size: ${payloadSize} bytes`,
      `Total Frame on Wire: ${totalFrameOnWire} bytes`,
      ``,
      `Overhead per Frame: ${totalOverheadPerFrame} bytes`,
      `Efficiency: ${efficiency.toFixed(2)}%`,
      `Effective Throughput: ${effectiveThroughput.toFixed(2)} Mbps (${(effectiveThroughput / 1000).toFixed(4)} Gbps)`,
      ``,
      `Max Frames/sec: ${Math.floor(framesPerSecond).toLocaleString()}`,
      `Max Packets/sec: ${Math.floor(packetsPerSecond).toLocaleString()}`,
      ``,
      `Wasted Bandwidth: ${(speed - effectiveThroughput).toFixed(2)} Mbps`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Link Speed (Mbps)</label>
            <select id={`${toolId}-speed`} value={linkSpeed} onChange={(e) => setLinkSpeed(e.target.value)} className="input-field" aria-label={`Link speed for ${toolName}`}>
              <option value="10">10 Mbps</option>
              <option value="100">100 Mbps</option>
              <option value="1000">1 Gbps</option>
              <option value="10000">10 Gbps</option>
              <option value="25000">25 Gbps</option>
              <option value="40000">40 Gbps</option>
              <option value="100000">100 Gbps</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-frame`} className="block text-sm font-medium text-gray-700 mb-1">Frame Size (bytes)</label>
            <input id={`${toolId}-frame`} type="number" value={frameSize} onChange={(e) => setFrameSize(e.target.value)} className="input-field" aria-label="Ethernet frame size in bytes" />
            <p className="text-xs text-gray-500 mt-1">Min: 64, Max: 9000 (jumbo), Standard: 1518</p>
          </div>
          <div>
            <label htmlFor={`${toolId}-overhead`} className="block text-sm font-medium text-gray-700 mb-1">Overhead Calculation</label>
            <select id={`${toolId}-overhead`} value={overhead} onChange={(e) => setOverhead(e.target.value)} className="input-field" aria-label="Overhead calculation mode">
              <option value="preamble">Include Preamble + IFG</option>
              <option value="header">Header + CRC only</option>
              <option value="all">All overhead</option>
            </select>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Throughput</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ethernet Throughput Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
