'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FriisTransmissionCalculator - Calculate received power using the Friis transmission equation.
 * Pr = Pt + Gt + Gr - FSPL, where FSPL = 20*log10(d) + 20*log10(f) + 20*log10(4π/c)
 */
export default function FriisTransmissionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('30');
  const [txGain, setTxGain] = useState('10');
  const [rxGain, setRxGain] = useState('10');
  const [distance, setDistance] = useState('1000');
  const [frequency, setFrequency] = useState('2400');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pt = parseFloat(txPower);
    const gt = parseFloat(txGain);
    const gr = parseFloat(rxGain);
    const d = parseFloat(distance);
    const f = parseFloat(frequency) * 1e6; // MHz to Hz

    if (isNaN(pt) || isNaN(gt) || isNaN(gr) || isNaN(d) || isNaN(f) || d <= 0 || f <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    const c = 299792458; // speed of light m/s
    const lambda = c / f;
    const fspl = 20 * Math.log10(d) + 20 * Math.log10(f) + 20 * Math.log10((4 * Math.PI) / c);
    const pr = pt + gt + gr - fspl;

    const results = [
      `=== Friis Transmission Equation Results ===`,
      ``,
      `Input Parameters:`,
      `  Transmit Power (Pt): ${pt} dBm`,
      `  Transmit Antenna Gain (Gt): ${gt} dBi`,
      `  Receive Antenna Gain (Gr): ${gr} dBi`,
      `  Distance: ${d} m`,
      `  Frequency: ${parseFloat(frequency)} MHz`,
      ``,
      `Calculated Values:`,
      `  Wavelength (λ): ${(lambda * 1000).toFixed(4)} mm`,
      `  Free Space Path Loss (FSPL): ${fspl.toFixed(2)} dB`,
      `  Received Power (Pr): ${pr.toFixed(2)} dBm`,
      `  Received Power: ${(Math.pow(10, (pr - 30) / 10) * 1000).toExponential(4)} mW`,
      ``,
      `Formula: Pr = Pt + Gt + Gr - FSPL`,
      `  Pr = ${pt} + ${gt} + ${gr} - ${fspl.toFixed(2)}`,
      `  Pr = ${pr.toFixed(2)} dBm`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-txpower`} className="block text-sm font-medium text-gray-700 mb-1">Transmit Power (dBm)</label>
            <input id={`${toolId}-txpower`} type="number" value={txPower} onChange={(e) => setTxPower(e.target.value)} placeholder="30" aria-label={`Transmit power for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-txgain`} className="block text-sm font-medium text-gray-700 mb-1">Transmit Gain (dBi)</label>
            <input id={`${toolId}-txgain`} type="number" value={txGain} onChange={(e) => setTxGain(e.target.value)} placeholder="10" aria-label="Transmit antenna gain" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rxgain`} className="block text-sm font-medium text-gray-700 mb-1">Receive Gain (dBi)</label>
            <input id={`${toolId}-rxgain`} type="number" value={rxGain} onChange={(e) => setRxGain(e.target.value)} placeholder="10" aria-label="Receive antenna gain" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Distance (meters)</label>
            <input id={`${toolId}-distance`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="1000" aria-label="Distance between antennas" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
            <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="2400" aria-label="Operating frequency" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Received Power</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
