'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FiveGNrThroughputCalculator - Calculate 5G NR theoretical throughput
 * based on bandwidth, numerology, MIMO layers, and modulation.
 */
export default function FiveGNrThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bandwidth, setBandwidth] = useState('100');
  const [numerology, setNumerology] = useState('1');
  const [mimoLayers, setMimoLayers] = useState('4');
  const [modulation, setModulation] = useState('256QAM');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const bwMHz = parseFloat(bandwidth);
    const mu = parseInt(numerology);
    const layers = parseInt(mimoLayers);

    if (isNaN(bwMHz) || isNaN(mu) || isNaN(layers) || bwMHz <= 0 || layers <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    const scs = 15 * Math.pow(2, mu); // kHz
    const symbolsPerSlot = 14;
    const slotsPerSubframe = Math.pow(2, mu);
    const subframesPerSecond = 1000;
    const slotsPerSecond = slotsPerSubframe * subframesPerSecond;

    const rbBandwidth = scs * 12 / 1000; // MHz per RB
    const numRBs = Math.floor(bwMHz / rbBandwidth);
    const subcarriersPerRB = 12;
    const totalSubcarriers = numRBs * subcarriersPerRB;

    let bitsPerSymbol = 8; // 256QAM
    if (modulation === '64QAM') bitsPerSymbol = 6;
    else if (modulation === 'QPSK') bitsPerSymbol = 2;
    else if (modulation === '16QAM') bitsPerSymbol = 4;
    else if (modulation === '1024QAM') bitsPerSymbol = 10;

    const codingRate = 0.93;
    const overhead = 0.86;

    const throughputBps = totalSubcarriers * symbolsPerSlot * slotsPerSecond * bitsPerSymbol * codingRate * overhead * layers;
    const throughputMbps = throughputBps / 1e6;
    const throughputGbps = throughputBps / 1e9;

    let result = `=== 5G NR Throughput Calculation ===\n\n`;
    result += `Bandwidth: ${bwMHz} MHz\n`;
    result += `Subcarrier Spacing (SCS): ${scs} kHz (μ=${mu})\n`;
    result += `MIMO Layers: ${layers}\n`;
    result += `Modulation: ${modulation} (${bitsPerSymbol} bits/symbol)\n\n`;
    result += `--- Parameters ---\n`;
    result += `Resource Blocks: ${numRBs}\n`;
    result += `Total Subcarriers: ${totalSubcarriers}\n`;
    result += `Symbols per Slot: ${symbolsPerSlot}\n`;
    result += `Slots per Second: ${slotsPerSecond.toLocaleString()}\n`;
    result += `Coding Rate: ${codingRate}\n`;
    result += `Overhead Factor: ${overhead}\n\n`;
    result += `--- Theoretical Peak Throughput ---\n`;
    result += `${throughputMbps.toFixed(2)} Mbps\n`;
    result += `${throughputGbps.toFixed(3)} Gbps\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-xs text-gray-600 mb-1">Bandwidth (MHz)</label>
            <input id={`${toolId}-bw`} type="number" value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} className="input-field" aria-label="Bandwidth in MHz" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mu`} className="block text-xs text-gray-600 mb-1">Numerology (μ)</label>
            <select id={`${toolId}-mu`} value={numerology} onChange={(e) => setNumerology(e.target.value)} className="input-field" aria-label="Numerology">
              <option value="0">0 (15 kHz SCS)</option>
              <option value="1">1 (30 kHz SCS)</option>
              <option value="2">2 (60 kHz SCS)</option>
              <option value="3">3 (120 kHz SCS)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-mimo`} className="block text-xs text-gray-600 mb-1">MIMO Layers</label>
            <select id={`${toolId}-mimo`} value={mimoLayers} onChange={(e) => setMimoLayers(e.target.value)} className="input-field" aria-label="MIMO layers">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-mod`} className="block text-xs text-gray-600 mb-1">Modulation</label>
            <select id={`${toolId}-mod`} value={modulation} onChange={(e) => setModulation(e.target.value)} className="input-field" aria-label="Modulation scheme">
              <option value="QPSK">QPSK</option>
              <option value="16QAM">16QAM</option>
              <option value="64QAM">64QAM</option>
              <option value="256QAM">256QAM</option>
              <option value="1024QAM">1024QAM</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Calculate 5G NR throughput">
          Calculate Throughput
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
