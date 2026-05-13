'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LteThroughputCalculator - Calculate LTE/4G theoretical throughput.
 * Based on bandwidth, MIMO layers, modulation, and coding rate.
 */
export default function LteThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bandwidth, setBandwidth] = useState('20');
  const [mimoLayers, setMimoLayers] = useState('2');
  const [modulation, setModulation] = useState('64QAM');
  const [codingRate, setCodingRate] = useState('0.93');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const bwMHz = parseFloat(bandwidth);
    const layers = parseInt(mimoLayers);
    const rate = parseFloat(codingRate);

    if (isNaN(bwMHz) || isNaN(layers) || isNaN(rate)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Resource blocks per bandwidth
    const rbMap: Record<number, number> = { 1.4: 6, 3: 15, 5: 25, 10: 50, 15: 75, 20: 100 };
    const resourceBlocks = rbMap[bwMHz] || Math.floor(bwMHz * 5);

    // Bits per symbol based on modulation
    const modBits: Record<string, number> = { 'QPSK': 2, '16QAM': 4, '64QAM': 6, '256QAM': 8 };
    const bitsPerSymbol = modBits[modulation] || 6;

    // LTE: 12 subcarriers per RB, 7 OFDM symbols per slot, 2 slots per subframe (1ms)
    const subcarriersPerRB = 12;
    const symbolsPerSubframe = 14; // 2 slots × 7 symbols
    const subframesPerSecond = 1000;

    // ~25% overhead for control channels, reference signals
    const overheadFactor = 0.75;

    const totalRE = resourceBlocks * subcarriersPerRB * symbolsPerSubframe * subframesPerSecond;
    const throughputBps = totalRE * bitsPerSymbol * rate * layers * overheadFactor;
    const throughputMbps = throughputBps / 1e6;

    const lines = [
      `=== LTE Throughput Calculation ===`,
      ``,
      `Bandwidth: ${bwMHz} MHz (${resourceBlocks} RBs)`,
      `Modulation: ${modulation} (${bitsPerSymbol} bits/symbol)`,
      `MIMO Layers: ${layers}`,
      `Coding Rate: ${rate}`,
      ``,
      `Resource Elements/sec: ${totalRE.toLocaleString()}`,
      `Overhead Factor: ${(overheadFactor * 100).toFixed(0)}% usable`,
      ``,
      `Peak Throughput: ${throughputMbps.toFixed(2)} Mbps`,
      `  = ${(throughputMbps / 1000).toFixed(3)} Gbps`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">
                Bandwidth (MHz)
              </label>
              <select
                id={`${toolId}-bw`}
                value={bandwidth}
                onChange={(e) => setBandwidth(e.target.value)}
                aria-label={`Bandwidth for ${toolName}`}
                className="input-field"
              >
                <option value="1.4">1.4 MHz</option>
                <option value="3">3 MHz</option>
                <option value="5">5 MHz</option>
                <option value="10">10 MHz</option>
                <option value="15">15 MHz</option>
                <option value="20">20 MHz</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-mimo`} className="block text-sm font-medium text-gray-700 mb-1">
                MIMO Layers
              </label>
              <select
                id={`${toolId}-mimo`}
                value={mimoLayers}
                onChange={(e) => setMimoLayers(e.target.value)}
                aria-label="MIMO layers"
                className="input-field"
              >
                <option value="1">1 (SISO)</option>
                <option value="2">2x2 MIMO</option>
                <option value="4">4x4 MIMO</option>
                <option value="8">8x8 MIMO</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-mod`} className="block text-sm font-medium text-gray-700 mb-1">
                Modulation
              </label>
              <select
                id={`${toolId}-mod`}
                value={modulation}
                onChange={(e) => setModulation(e.target.value)}
                aria-label="Modulation scheme"
                className="input-field"
              >
                <option value="QPSK">QPSK</option>
                <option value="16QAM">16QAM</option>
                <option value="64QAM">64QAM</option>
                <option value="256QAM">256QAM</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-coding`} className="block text-sm font-medium text-gray-700 mb-1">
                Coding Rate
              </label>
              <input
                id={`${toolId}-coding`}
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={codingRate}
                onChange={(e) => setCodingRate(e.target.value)}
                aria-label="Coding rate"
                className="input-field"
              />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Throughput
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
