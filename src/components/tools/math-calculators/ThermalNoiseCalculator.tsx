'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThermalNoiseCalculator - Calculate Johnson-Nyquist thermal noise power.
 * Formula: P = kTB, V = sqrt(4kTRB)
 */
export default function ThermalNoiseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temperature, setTemperature] = useState('290');
  const [bandwidth, setBandwidth] = useState('1000000');
  const [resistance, setResistance] = useState('50');
  const [output, setOutput] = useState('');

  const BOLTZMANN = 1.380649e-23; // J/K

  const calculate = () => {
    const T = parseFloat(temperature);
    const B = parseFloat(bandwidth);
    const R = parseFloat(resistance);

    if (isNaN(T) || T < 0) {
      setOutput('Please enter a valid temperature (≥ 0 K).');
      return;
    }
    if (isNaN(B) || B <= 0) {
      setOutput('Please enter a valid positive bandwidth.');
      return;
    }
    if (isNaN(R) || R <= 0) {
      setOutput('Please enter a valid positive resistance.');
      return;
    }

    const noisePower = BOLTZMANN * T * B;
    const noisePowerDbm = 10 * Math.log10(noisePower / 0.001);
    const noiseVoltage = Math.sqrt(4 * BOLTZMANN * T * R * B);
    const noiseCurrent = Math.sqrt(4 * BOLTZMANN * T * B / R);

    const lines = [
      `Input Parameters:`,
      `  Temperature: ${T} K (${(T - 273.15).toFixed(2)} °C)`,
      `  Bandwidth: ${B.toLocaleString()} Hz`,
      `  Resistance: ${R} Ω`,
      ``,
      `Results:`,
      `  Noise Power (P = kTB):`,
      `    ${noisePower.toExponential(4)} W`,
      `    ${(noisePower * 1e12).toFixed(4)} pW`,
      `    ${noisePowerDbm.toFixed(2)} dBm`,
      ``,
      `  Noise Voltage (Vrms = √4kTRB):`,
      `    ${noiseVoltage.toExponential(4)} V`,
      `    ${(noiseVoltage * 1e9).toFixed(4)} nV`,
      ``,
      `  Noise Current (Irms = √4kTB/R):`,
      `    ${noiseCurrent.toExponential(4)} A`,
      `    ${(noiseCurrent * 1e12).toFixed(4)} pA`,
      ``,
      `Constants:`,
      `  Boltzmann constant (k): 1.380649 × 10⁻²³ J/K`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Temperature (K)</label>
            <input id={`${toolId}-temp`} type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="290" className="input-field" aria-label={`Temperature for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">Bandwidth (Hz)</label>
            <input id={`${toolId}-bw`} type="number" value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} placeholder="1000000" className="input-field" aria-label="Bandwidth in Hz" />
          </div>
          <div>
            <label htmlFor={`${toolId}-res`} className="block text-sm font-medium text-gray-700 mb-1">Resistance (Ω)</label>
            <input id={`${toolId}-res`} type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="50" className="input-field" aria-label="Resistance in ohms" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Thermal Noise</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thermal Noise Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
