'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LinkBudgetCalculator - Calculate RF link budget.
 * Computes received power from transmit power, antenna gains, free-space path loss, and other losses.
 */
export default function LinkBudgetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('30');
  const [txGain, setTxGain] = useState('10');
  const [rxGain, setRxGain] = useState('10');
  const [frequency, setFrequency] = useState('2400');
  const [distance, setDistance] = useState('1000');
  const [distanceUnit, setDistanceUnit] = useState<'m' | 'km'>('m');
  const [miscLoss, setMiscLoss] = useState('2');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const ptx = parseFloat(txPower);
    const gtx = parseFloat(txGain);
    const grx = parseFloat(rxGain);
    const freq = parseFloat(frequency);
    const dist = parseFloat(distance);
    const losses = parseFloat(miscLoss);

    if ([ptx, gtx, grx, freq, dist, losses].some(isNaN) || freq <= 0 || dist <= 0) {
      setOutput('Please enter valid positive numbers for frequency and distance.');
      return;
    }

    const distMeters = distanceUnit === 'km' ? dist * 1000 : dist;
    const freqHz = freq * 1e6; // MHz to Hz
    const c = 299792458; // speed of light m/s
    const wavelength = c / freqHz;

    // Free-space path loss (dB): FSPL = 20*log10(4*pi*d/lambda)
    const fspl = 20 * Math.log10((4 * Math.PI * distMeters) / wavelength);

    // Received power: Prx = Ptx + Gtx + Grx - FSPL - Losses
    const rxPower = ptx + gtx + grx - fspl - losses;

    // EIRP
    const eirp = ptx + gtx;

    const lines = [
      `=== Link Budget Analysis ===`,
      ``,
      `Transmit Power (Ptx): ${ptx.toFixed(2)} dBm`,
      `Tx Antenna Gain (Gtx): ${gtx.toFixed(2)} dBi`,
      `Rx Antenna Gain (Grx): ${grx.toFixed(2)} dBi`,
      `Frequency: ${freq} MHz (λ = ${(wavelength * 100).toFixed(4)} cm)`,
      `Distance: ${dist} ${distanceUnit} (${distMeters} m)`,
      `Misc. Losses: ${losses.toFixed(2)} dB`,
      ``,
      `--- Results ---`,
      `EIRP: ${eirp.toFixed(2)} dBm`,
      `Free-Space Path Loss (FSPL): ${fspl.toFixed(2)} dB`,
      `Received Power (Prx): ${rxPower.toFixed(2)} dBm`,
      `Received Power: ${(Math.pow(10, rxPower / 10) / 1000).toExponential(4)} W`,
      ``,
      `--- Formula ---`,
      `FSPL = 20·log₁₀(4πd/λ)`,
      `Prx = Ptx + Gtx + Grx - FSPL - Losses`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-txpower`} className="block text-sm font-medium text-gray-700 mb-1">Transmit Power (dBm)</label>
            <input id={`${toolId}-txpower`} type="number" value={txPower} onChange={(e) => setTxPower(e.target.value)} className="input-field" aria-label={`Transmit power for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-txgain`} className="block text-sm font-medium text-gray-700 mb-1">Tx Antenna Gain (dBi)</label>
            <input id={`${toolId}-txgain`} type="number" value={txGain} onChange={(e) => setTxGain(e.target.value)} className="input-field" aria-label="Transmit antenna gain" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rxgain`} className="block text-sm font-medium text-gray-700 mb-1">Rx Antenna Gain (dBi)</label>
            <input id={`${toolId}-rxgain`} type="number" value={rxGain} onChange={(e) => setRxGain(e.target.value)} className="input-field" aria-label="Receive antenna gain" />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
            <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Signal frequency in MHz" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <div className="flex gap-2">
              <input id={`${toolId}-dist`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="input-field flex-1" aria-label="Distance between antennas" />
              <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as 'm' | 'km')} className="input-field w-20" aria-label="Distance unit">
                <option value="m">m</option>
                <option value="km">km</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-loss`} className="block text-sm font-medium text-gray-700 mb-1">Misc. Losses (dB)</label>
            <input id={`${toolId}-loss`} type="number" value={miscLoss} onChange={(e) => setMiscLoss(e.target.value)} className="input-field" aria-label="Miscellaneous losses in dB" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Link Budget</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Link Budget Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
