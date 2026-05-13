'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerEfficiencyCalculator - Calculate speaker efficiency from sensitivity rating.
 */
export default function SpeakerEfficiencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sensitivity, setSensitivity] = useState('');
  const [impedance, setImpedance] = useState('8');
  const [power, setPower] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const spl = parseFloat(sensitivity);
    const z = parseFloat(impedance);
    const watts = parseFloat(power);

    if (isNaN(spl) || isNaN(z) || isNaN(watts)) {
      setOutput('Please enter valid values for all fields.');
      return;
    }

    // Efficiency from sensitivity: η = 10^((SPL - 112)/10) * 100%
    // Reference: 1W/1m sensitivity
    const efficiency = Math.pow(10, (spl - 112) / 10) * 100;

    // Acoustic power output at rated power
    const acousticPower = (efficiency / 100) * watts;

    // Max SPL at 1m with rated power
    const maxSpl = spl + 10 * Math.log10(watts);

    // SPL at various distances
    const distances = [1, 2, 3, 5, 10];
    const splAtDistances = distances.map(d => ({
      distance: d,
      spl: maxSpl - 20 * Math.log10(d),
    }));

    // Equivalent efficiency for different impedances
    const refEfficiency = efficiency * (8 / z);

    const results = [
      '=== Speaker Efficiency Calculator ===',
      '',
      `Sensitivity: ${spl} dB SPL (1W/1m)`,
      `Impedance: ${z} Ω`,
      `Rated Power: ${watts} W`,
      '',
      '--- Efficiency ---',
      '',
      `Efficiency: ${efficiency.toFixed(4)}%`,
      `Efficiency (normalized to 8Ω): ${refEfficiency.toFixed(4)}%`,
      `Acoustic Power Output: ${(acousticPower * 1000).toFixed(2)} mW (at ${watts}W input)`,
      `Electrical-to-Acoustic Ratio: 1:${Math.round(1 / (efficiency / 100))}`,
      '',
      '--- Maximum SPL ---',
      '',
      `Max SPL at 1m: ${maxSpl.toFixed(1)} dB`,
      '',
      'SPL at Distance (max power):',
      ...splAtDistances.map(d => `  ${d.distance}m: ${d.spl.toFixed(1)} dB SPL`),
      '',
      '--- Reference ---',
      '• Typical home speaker: 84-88 dB (0.25-0.63%)',
      '• High-efficiency speaker: 92-96 dB (1.6-4%)',
      '• Pro/PA speaker: 97-103 dB (5-20%)',
      '• Horn-loaded: 105-110 dB (30-100%)',
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sensitivity (dB 1W/1m)</label>
              <input type="number" value={sensitivity} onChange={e => setSensitivity(e.target.value)} className="input-field" placeholder="e.g. 88" step="0.1" aria-label="Speaker sensitivity in dB" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impedance (Ω)</label>
              <select value={impedance} onChange={e => setImpedance(e.target.value)} className="input-field" aria-label="Speaker impedance">
                <option value="4">4 Ω</option>
                <option value="6">6 Ω</option>
                <option value="8">8 Ω</option>
                <option value="16">16 Ω</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rated Power (W)</label>
              <input type="number" value={power} onChange={e => setPower(e.target.value)} className="input-field" placeholder="e.g. 100" aria-label="Rated power in watts" />
            </div>
          </div>

          <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Calculate ${toolName}`}>
            Calculate Efficiency
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
