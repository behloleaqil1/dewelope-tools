'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NetworkLatencyCalculator - Calculate network round-trip latency
 * from distance, propagation speed, processing delays, and hop count.
 */
export default function NetworkLatencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('1000');
  const [medium, setMedium] = useState('fiber');
  const [hops, setHops] = useState('5');
  const [processingDelay, setProcessingDelay] = useState('0.5');
  const [queuingDelay, setQueuingDelay] = useState('1');
  const [packetSize, setPacketSize] = useState('1500');
  const [bandwidth, setBandwidth] = useState('1000');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dist = parseFloat(distance);
    const hopCount = parseInt(hops);
    const procDelay = parseFloat(processingDelay);
    const queueDelay = parseFloat(queuingDelay);
    const pktSize = parseFloat(packetSize);
    const bw = parseFloat(bandwidth);

    if (isNaN(dist) || isNaN(hopCount) || isNaN(procDelay) || isNaN(queueDelay) || isNaN(pktSize) || isNaN(bw)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const speedOfLight = 299792.458; // km/s
    const propagationFactor = medium === 'fiber' ? 0.67 : medium === 'copper' ? 0.77 : 1.0;
    const effectiveSpeed = speedOfLight * propagationFactor;

    const propagationDelay = (dist / effectiveSpeed) * 1000; // ms one-way
    const transmissionDelay = (pktSize * 8) / (bw * 1000000) * 1000; // ms
    const totalProcessing = hopCount * procDelay; // ms
    const totalQueuing = hopCount * queueDelay; // ms

    const oneWayLatency = propagationDelay + transmissionDelay + totalProcessing + totalQueuing;
    const rtt = oneWayLatency * 2;

    const result = `Network Latency Calculation
════════════════════════════════════════

Parameters:
  Distance:          ${dist} km
  Medium:            ${medium} (${(propagationFactor * 100).toFixed(0)}% speed of light)
  Effective speed:   ${effectiveSpeed.toFixed(0)} km/s
  Hops:              ${hopCount}
  Packet size:       ${pktSize} bytes
  Bandwidth:         ${bw} Mbps

Delay Components (one-way):
────────────────────────────────────────
  Propagation:       ${propagationDelay.toFixed(3)} ms
  Transmission:      ${transmissionDelay.toFixed(3)} ms
  Processing:        ${totalProcessing.toFixed(3)} ms (${hopCount} × ${procDelay} ms)
  Queuing:           ${totalQueuing.toFixed(3)} ms (${hopCount} × ${queueDelay} ms)

Results:
────────────────────────────────────────
  One-way latency:   ${oneWayLatency.toFixed(3)} ms
  Round-trip time:   ${rtt.toFixed(3)} ms
────────────────────────────────────────

Quality Assessment:
  ${rtt < 20 ? '✅ Excellent (< 20ms RTT)' : rtt < 50 ? '✅ Good (< 50ms RTT)' : rtt < 100 ? '⚠️ Acceptable (< 100ms RTT)' : rtt < 200 ? '⚠️ Noticeable (< 200ms RTT)' : '❌ High latency (> 200ms RTT)'}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
            <input id={`${toolId}-dist`} type="number" step="1" value={distance} onChange={(e) => setDistance(e.target.value)} className="input-field" aria-label={`Distance for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-medium`} className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
            <select id={`${toolId}-medium`} value={medium} onChange={(e) => setMedium(e.target.value)} className="input-field" aria-label="Transmission medium">
              <option value="fiber">Fiber Optic (67% c)</option>
              <option value="copper">Copper (77% c)</option>
              <option value="wireless">Wireless (100% c)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-hops`} className="block text-sm font-medium text-gray-700 mb-1">Number of Hops</label>
            <input id={`${toolId}-hops`} type="number" value={hops} onChange={(e) => setHops(e.target.value)} className="input-field" aria-label="Number of hops" />
          </div>
          <div>
            <label htmlFor={`${toolId}-proc`} className="block text-sm font-medium text-gray-700 mb-1">Processing Delay per Hop (ms)</label>
            <input id={`${toolId}-proc`} type="number" step="0.1" value={processingDelay} onChange={(e) => setProcessingDelay(e.target.value)} className="input-field" aria-label="Processing delay per hop" />
          </div>
          <div>
            <label htmlFor={`${toolId}-queue`} className="block text-sm font-medium text-gray-700 mb-1">Queuing Delay per Hop (ms)</label>
            <input id={`${toolId}-queue`} type="number" step="0.1" value={queuingDelay} onChange={(e) => setQueuingDelay(e.target.value)} className="input-field" aria-label="Queuing delay per hop" />
          </div>
          <div>
            <label htmlFor={`${toolId}-pkt`} className="block text-sm font-medium text-gray-700 mb-1">Packet Size (bytes)</label>
            <input id={`${toolId}-pkt`} type="number" value={packetSize} onChange={(e) => setPacketSize(e.target.value)} className="input-field" aria-label="Packet size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">Bandwidth (Mbps)</label>
            <input id={`${toolId}-bw`} type="number" value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} className="input-field" aria-label="Bandwidth" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Latency</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Latency Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
