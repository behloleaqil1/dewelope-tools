'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RadarRangeCalculator - Calculate radar detection range using the radar equation.
 * R_max = ((Pt * G^2 * λ^2 * σ) / ((4π)^3 * Smin))^(1/4)
 */
export default function RadarRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('');
  const [gain, setGain] = useState('');
  const [frequency, setFrequency] = useState('');
  const [rcs, setRcs] = useState('');
  const [sensitivity, setSensitivity] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const Pt = parseFloat(txPower);
    const G_dBi = parseFloat(gain);
    const freq = parseFloat(frequency);
    const sigma = parseFloat(rcs);
    const Smin_dBm = parseFloat(sensitivity);

    if (isNaN(Pt) || isNaN(G_dBi) || isNaN(freq) || isNaN(sigma) || isNaN(Smin_dBm)) {
      setOutput('Error: Please fill in all fields with valid numbers.');
      return;
    }

    if (Pt <= 0 || freq <= 0 || sigma <= 0) {
      setOutput('Error: Power, frequency, and RCS must be positive values.');
      return;
    }

    // Convert units
    const G = Math.pow(10, G_dBi / 10); // linear gain
    const Smin = Math.pow(10, (Smin_dBm - 30) / 10); // dBm to Watts
    const c = 3e8; // speed of light m/s
    const lambda = c / (freq * 1e9); // wavelength in meters (freq in GHz)

    // Radar equation: R_max = ((Pt * G^2 * λ^2 * σ) / ((4π)^3 * Smin))^(1/4)
    const numerator = Pt * Math.pow(G, 2) * Math.pow(lambda, 2) * sigma;
    const denominator = Math.pow(4 * Math.PI, 3) * Smin;
    const R_max = Math.pow(numerator / denominator, 0.25);

    const R_km = R_max / 1000;
    const R_nmi = R_max / 1852;

    let result = `=== Radar Range Calculation ===\n\n`;
    result += `Input Parameters:\n`;
    result += `  Transmit Power (Pt): ${Pt} W\n`;
    result += `  Antenna Gain (G): ${G_dBi} dBi (${G.toFixed(2)} linear)\n`;
    result += `  Frequency: ${freq} GHz\n`;
    result += `  Wavelength (λ): ${(lambda * 100).toFixed(4)} cm (${lambda.toFixed(6)} m)\n`;
    result += `  Radar Cross Section (σ): ${sigma} m²\n`;
    result += `  Receiver Sensitivity (Smin): ${Smin_dBm} dBm (${Smin.toExponential(3)} W)\n\n`;
    result += `Results:\n`;
    result += `  Maximum Detection Range: ${R_max.toFixed(2)} m\n`;
    result += `  Maximum Detection Range: ${R_km.toFixed(3)} km\n`;
    result += `  Maximum Detection Range: ${R_nmi.toFixed(3)} nmi\n\n`;
    result += `Formula:\n`;
    result += `  R_max = ((Pt × G² × λ² × σ) / ((4π)³ × Smin))^(1/4)\n`;
    result += `  R_max = ((${Pt} × ${G.toFixed(2)}² × ${lambda.toFixed(6)}² × ${sigma}) / ((4π)³ × ${Smin.toExponential(3)}))^(1/4)\n`;
    result += `  R_max = ${R_max.toFixed(2)} m\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">
              Transmit Power (Watts)
            </label>
            <input
              id={`${toolId}-power`}
              type="number"
              value={txPower}
              onChange={(e) => setTxPower(e.target.value)}
              placeholder="1000"
              aria-label={`Transmit power for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">
              Antenna Gain (dBi)
            </label>
            <input
              id={`${toolId}-gain`}
              type="number"
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              placeholder="30"
              aria-label="Antenna gain in dBi"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (GHz)
            </label>
            <input
              id={`${toolId}-freq`}
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="10"
              aria-label="Frequency in GHz"
              className="input-field"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-rcs`} className="block text-sm font-medium text-gray-700 mb-1">
              Radar Cross Section (m²)
            </label>
            <input
              id={`${toolId}-rcs`}
              type="number"
              value={rcs}
              onChange={(e) => setRcs(e.target.value)}
              placeholder="1"
              aria-label="Radar cross section in square meters"
              className="input-field"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-sens`} className="block text-sm font-medium text-gray-700 mb-1">
              Receiver Sensitivity (dBm)
            </label>
            <input
              id={`${toolId}-sens`}
              type="number"
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value)}
              placeholder="-110"
              aria-label="Receiver sensitivity in dBm"
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Radar Range
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
