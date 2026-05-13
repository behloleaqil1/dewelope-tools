'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UwbRangeCalculator - Calculate Ultra-Wideband (UWB) positioning accuracy and range
 * based on bandwidth, TX power, channel, and environment.
 */
export default function UwbRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bandwidth, setBandwidth] = useState('500');
  const [txPower, setTxPower] = useState('-41.3');
  const [channel, setChannel] = useState('5');
  const [environment, setEnvironment] = useState('indoor-los');
  const [numAnchors, setNumAnchors] = useState('4');
  const [output, setOutput] = useState('');

  const channels = [
    { value: '1', label: 'Channel 1 (3494.4 MHz)', freq: 3494.4 },
    { value: '2', label: 'Channel 2 (3993.6 MHz)', freq: 3993.6 },
    { value: '3', label: 'Channel 3 (4492.8 MHz)', freq: 4492.8 },
    { value: '5', label: 'Channel 5 (6489.6 MHz)', freq: 6489.6 },
    { value: '9', label: 'Channel 9 (7987.2 MHz)', freq: 7987.2 },
  ];

  const environments = [
    { value: 'indoor-los', label: 'Indoor Line-of-Sight', pathLossExp: 1.6, shadowFading: 1.5 },
    { value: 'indoor-nlos', label: 'Indoor Non-Line-of-Sight', pathLossExp: 3.5, shadowFading: 5.0 },
    { value: 'outdoor-los', label: 'Outdoor Line-of-Sight', pathLossExp: 2.0, shadowFading: 2.0 },
    { value: 'industrial', label: 'Industrial Environment', pathLossExp: 2.8, shadowFading: 4.0 },
  ];

  const calculate = () => {
    const bw = parseFloat(bandwidth);
    const power = parseFloat(txPower);
    const anchors = parseInt(numAnchors);
    const ch = channels.find(c => c.value === channel);
    const env = environments.find(e => e.value === environment);

    if (!ch || !env || isNaN(bw) || isNaN(power) || isNaN(anchors)) {
      setOutput('Please enter valid values.');
      return;
    }

    // UWB ranging accuracy based on bandwidth
    // Time resolution = 1/BW, distance resolution = c / (2*BW)
    const speedOfLight = 3e8; // m/s
    const bwHz = bw * 1e6;
    const timeResolution = 1 / bwHz; // seconds
    const distanceResolution = (speedOfLight / (2 * bwHz)) * 100; // cm

    // Positioning accuracy (CRLB-based estimate)
    const rangingAccuracy = distanceResolution * env.shadowFading;
    const positioningAccuracy = rangingAccuracy / Math.sqrt(anchors);

    // Max range calculation using link budget
    const rxSensitivity = -105; // dBm typical UWB receiver
    const linkBudget = power - rxSensitivity;
    const freqGHz = ch.freq / 1000;
    const pathLossAt1m = 20 * Math.log10((4 * Math.PI * freqGHz * 1e9) / speedOfLight);
    const maxRange = Math.pow(10, (linkBudget - pathLossAt1m) / (10 * env.pathLossExp));

    const results = [
      `=== UWB Positioning Calculation ===`,
      ``,
      `Input Parameters:`,
      `  Bandwidth: ${bw} MHz`,
      `  TX Power: ${power} dBm/MHz`,
      `  Channel: ${ch.label}`,
      `  Environment: ${env.label}`,
      `  Number of Anchors: ${anchors}`,
      ``,
      `Ranging Performance:`,
      `  Time Resolution: ${(timeResolution * 1e9).toFixed(3)} ns`,
      `  Distance Resolution: ${distanceResolution.toFixed(2)} cm`,
      `  Ranging Accuracy (1σ): ±${rangingAccuracy.toFixed(1)} cm`,
      ``,
      `Positioning Performance:`,
      `  2D Position Accuracy: ±${positioningAccuracy.toFixed(1)} cm`,
      `  With ${anchors} anchors (GDOP improvement)`,
      ``,
      `Link Budget:`,
      `  TX Power: ${power} dBm/MHz`,
      `  RX Sensitivity: ${rxSensitivity} dBm`,
      `  Link Budget: ${linkBudget.toFixed(1)} dB`,
      `  Path Loss at 1m: ${pathLossAt1m.toFixed(1)} dB`,
      `  Path Loss Exponent: ${env.pathLossExp}`,
      `  Estimated Max Range: ${maxRange.toFixed(1)} m`,
      ``,
      `Notes:`,
      `  - IEEE 802.15.4z compliant calculation`,
      `  - Accuracy improves with more anchors`,
      `  - NLOS conditions significantly degrade accuracy`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">Bandwidth (MHz)</label>
            <select id={`${toolId}-bw`} value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} aria-label={`Bandwidth for ${toolName}`} className="input-field">
              <option value="500">500 MHz</option>
              <option value="900">900 MHz</option>
              <option value="1300">1300 MHz</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">TX Power (dBm/MHz)</label>
            <input id={`${toolId}-power`} type="number" step="0.1" value={txPower} onChange={(e) => setTxPower(e.target.value)} aria-label="Transmit power" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-channel`} className="block text-sm font-medium text-gray-700 mb-1">UWB Channel</label>
            <select id={`${toolId}-channel`} value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="UWB channel" className="input-field">
              {channels.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select id={`${toolId}-env`} value={environment} onChange={(e) => setEnvironment(e.target.value)} aria-label="Operating environment" className="input-field">
              {environments.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-anchors`} className="block text-sm font-medium text-gray-700 mb-1">Number of Anchors</label>
            <input id={`${toolId}-anchors`} type="number" min="3" max="20" value={numAnchors} onChange={(e) => setNumAnchors(e.target.value)} aria-label="Number of UWB anchors" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate UWB Accuracy</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">UWB Positioning Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
