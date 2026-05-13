'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SatelliteLinkMarginCalculator - Calculate satellite communication link margin.
 * Computes EIRP, free-space path loss, received power, and link margin.
 */
export default function SatelliteLinkMarginCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('10');
  const [txGain, setTxGain] = useState('30');
  const [rxGain, setRxGain] = useState('40');
  const [frequency, setFrequency] = useState('12');
  const [distance, setDistance] = useState('36000');
  const [systemNoise, setSystemNoise] = useState('500');
  const [dataRate, setDataRate] = useState('10');
  const [requiredEbNo, setRequiredEbNo] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const ptx = parseFloat(txPower);
    const gtx = parseFloat(txGain);
    const grx = parseFloat(rxGain);
    const freq = parseFloat(frequency);
    const dist = parseFloat(distance);
    const tsys = parseFloat(systemNoise);
    const dr = parseFloat(dataRate);
    const reqEbNo = parseFloat(requiredEbNo);

    if ([ptx, gtx, grx, freq, dist, tsys, dr, reqEbNo].some(isNaN)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // EIRP in dBW
    const eirp = 10 * Math.log10(ptx) + gtx;

    // Free-space path loss (dB)
    const lambda = 0.3 / freq; // wavelength in meters (freq in GHz)
    const fspl = 20 * Math.log10(4 * Math.PI * dist * 1000 / lambda);

    // Received power (dBW)
    const rxPower = eirp - fspl + grx;

    // System noise (dBW/Hz)
    const k = 1.38e-23; // Boltzmann constant
    const noisePerHz = 10 * Math.log10(k * tsys);

    // Eb/No (dB)
    const ebNo = rxPower - noisePerHz - 10 * Math.log10(dr * 1e6);

    // Link margin
    const margin = ebNo - reqEbNo;

    const lines = [
      `=== Satellite Link Margin Analysis ===`,
      ``,
      `Transmitter Power: ${ptx} W (${(10 * Math.log10(ptx)).toFixed(2)} dBW)`,
      `Tx Antenna Gain: ${gtx} dBi`,
      `EIRP: ${eirp.toFixed(2)} dBW`,
      ``,
      `Frequency: ${freq} GHz (λ = ${(lambda * 1000).toFixed(2)} mm)`,
      `Distance: ${dist} km`,
      `Free-Space Path Loss: ${fspl.toFixed(2)} dB`,
      ``,
      `Rx Antenna Gain: ${grx} dBi`,
      `Received Power: ${rxPower.toFixed(2)} dBW`,
      ``,
      `System Noise Temp: ${tsys} K`,
      `Noise Spectral Density: ${noisePerHz.toFixed(2)} dBW/Hz`,
      `Data Rate: ${dr} Mbps`,
      ``,
      `Eb/No: ${ebNo.toFixed(2)} dB`,
      `Required Eb/No: ${reqEbNo.toFixed(2)} dB`,
      ``,
      `Link Margin: ${margin.toFixed(2)} dB ${margin >= 0 ? '✓ (Link closes)' : '✗ (Link does NOT close)'}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-txpower`} className="block text-sm font-medium text-gray-700 mb-1">
                Tx Power (W)
              </label>
              <input id={`${toolId}-txpower`} type="number" step="0.1" value={txPower} onChange={(e) => setTxPower(e.target.value)} aria-label={`Transmit power for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-txgain`} className="block text-sm font-medium text-gray-700 mb-1">
                Tx Gain (dBi)
              </label>
              <input id={`${toolId}-txgain`} type="number" step="0.1" value={txGain} onChange={(e) => setTxGain(e.target.value)} aria-label="Transmit antenna gain" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rxgain`} className="block text-sm font-medium text-gray-700 mb-1">
                Rx Gain (dBi)
              </label>
              <input id={`${toolId}-rxgain`} type="number" step="0.1" value={rxGain} onChange={(e) => setRxGain(e.target.value)} aria-label="Receive antenna gain" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
                Frequency (GHz)
              </label>
              <input id={`${toolId}-freq`} type="number" step="0.1" value={frequency} onChange={(e) => setFrequency(e.target.value)} aria-label="Carrier frequency" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input id={`${toolId}-dist`} type="number" step="1" value={distance} onChange={(e) => setDistance(e.target.value)} aria-label="Link distance" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-noise`} className="block text-sm font-medium text-gray-700 mb-1">
                System Noise Temp (K)
              </label>
              <input id={`${toolId}-noise`} type="number" step="1" value={systemNoise} onChange={(e) => setSystemNoise(e.target.value)} aria-label="System noise temperature" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-datarate`} className="block text-sm font-medium text-gray-700 mb-1">
                Data Rate (Mbps)
              </label>
              <input id={`${toolId}-datarate`} type="number" step="0.1" value={dataRate} onChange={(e) => setDataRate(e.target.value)} aria-label="Data rate" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ebno`} className="block text-sm font-medium text-gray-700 mb-1">
                Required Eb/No (dB)
              </label>
              <input id={`${toolId}-ebno`} type="number" step="0.1" value={requiredEbNo} onChange={(e) => setRequiredEbNo(e.target.value)} aria-label="Required Eb/No" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Link Margin
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Link Budget Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
