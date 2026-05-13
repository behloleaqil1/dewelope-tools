'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CableAttenuationCalculator - Calculate coaxial cable signal attenuation.
 * Computes total loss based on cable type, frequency, and length.
 */
export default function CableAttenuationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cableType, setCableType] = useState('rg6');
  const [frequency, setFrequency] = useState('');
  const [length, setLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState<'feet' | 'meters'>('feet');
  const [output, setOutput] = useState('');

  // Attenuation data: dB per 100 feet at 1 GHz (approximate)
  const cableData: Record<string, { name: string; lossPerHundredFt: number; velocityFactor: number; impedance: number }> = {
    rg6: { name: 'RG-6', lossPerHundredFt: 5.65, velocityFactor: 0.82, impedance: 75 },
    rg8: { name: 'RG-8/U', lossPerHundredFt: 3.3, velocityFactor: 0.78, impedance: 50 },
    rg11: { name: 'RG-11', lossPerHundredFt: 3.6, velocityFactor: 0.84, impedance: 75 },
    rg58: { name: 'RG-58', lossPerHundredFt: 10.5, velocityFactor: 0.66, impedance: 50 },
    rg59: { name: 'RG-59', lossPerHundredFt: 7.0, velocityFactor: 0.78, impedance: 75 },
    rg174: { name: 'RG-174', lossPerHundredFt: 21.0, velocityFactor: 0.66, impedance: 50 },
    rg213: { name: 'RG-213', lossPerHundredFt: 3.3, velocityFactor: 0.66, impedance: 50 },
    lmr400: { name: 'LMR-400', lossPerHundredFt: 1.5, velocityFactor: 0.85, impedance: 50 },
    lmr600: { name: 'LMR-600', lossPerHundredFt: 1.0, velocityFactor: 0.87, impedance: 50 },
  };

  const calculate = () => {
    const freq = parseFloat(frequency);
    const len = parseFloat(length);

    if (isNaN(freq) || freq <= 0) {
      setOutput('Error: Please enter a valid frequency > 0');
      return;
    }
    if (isNaN(len) || len <= 0) {
      setOutput('Error: Please enter a valid cable length > 0');
      return;
    }

    const cable = cableData[cableType];
    const lengthInFeet = lengthUnit === 'meters' ? len * 3.28084 : len;

    // Attenuation scales approximately with sqrt(frequency) relative to 1 GHz reference
    const freqFactor = Math.sqrt(freq / 1000); // freq in MHz, reference 1000 MHz
    const attenuationPer100ft = cable.lossPerHundredFt * freqFactor;
    const totalAttenuation = (attenuationPer100ft * lengthInFeet) / 100;
    const powerRetained = Math.pow(10, -totalAttenuation / 10) * 100;
    const signalVoltageRetained = Math.pow(10, -totalAttenuation / 20) * 100;

    const results = [
      `Cable: ${cable.name}`,
      `Impedance: ${cable.impedance} Ω`,
      `Velocity Factor: ${(cable.velocityFactor * 100).toFixed(0)}%`,
      `Frequency: ${freq} MHz`,
      `Length: ${len} ${lengthUnit} (${lengthInFeet.toFixed(1)} ft)`,
      ``,
      `Attenuation per 100 ft at ${freq} MHz: ${attenuationPer100ft.toFixed(3)} dB`,
      `Total Attenuation: ${totalAttenuation.toFixed(3)} dB`,
      `Power Retained: ${powerRetained.toFixed(2)}%`,
      `Signal Voltage Retained: ${signalVoltageRetained.toFixed(2)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-cable`} className="block text-sm font-medium text-gray-700 mb-1">
              Cable Type
            </label>
            <select
              id={`${toolId}-cable`}
              value={cableType}
              onChange={(e) => setCableType(e.target.value)}
              aria-label={`Cable type for ${toolName}`}
              className="input-field"
            >
              {Object.entries(cableData).map(([key, val]) => (
                <option key={key} value={key}>{val.name} ({val.impedance}Ω)</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (MHz)
            </label>
            <input
              id={`${toolId}-freq`}
              type="number"
              step="0.1"
              min="0"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. 900"
              aria-label="Frequency in MHz"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
                Cable Length
              </label>
              <input
                id={`${toolId}-length`}
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 100"
                aria-label="Cable length"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id={`${toolId}-unit`}
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value as 'feet' | 'meters')}
                aria-label="Length unit"
                className="input-field"
              >
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Attenuation
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
