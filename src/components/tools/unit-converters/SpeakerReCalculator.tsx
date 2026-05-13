'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerReCalculator - Calculate speaker DC resistance (Re) from
 * impedance measurements using the minimum impedance method.
 */
export default function SpeakerReCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [nominalImpedance, setNominalImpedance] = useState('8');
  const [measuredVoltage, setMeasuredVoltage] = useState('1.0');
  const [measuredCurrent, setMeasuredCurrent] = useState('0.125');
  const [wireResistance, setWireResistance] = useState('0.1');
  const [temperature, setTemperature] = useState('25');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const nomImp = parseFloat(nominalImpedance);
    const voltage = parseFloat(measuredVoltage);
    const current = parseFloat(measuredCurrent);
    const wireR = parseFloat(wireResistance);
    const temp = parseFloat(temperature);

    if (isNaN(voltage) || isNaN(current) || isNaN(wireR) || isNaN(temp) || isNaN(nomImp)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    if (current === 0) {
      setOutput('Current cannot be zero.');
      return;
    }

    // Calculate Re from V/I minus wire resistance
    const totalResistance = voltage / current;
    const re = totalResistance - wireR;

    // Temperature correction to 25°C reference
    const tempCoeff = 0.00393; // copper temperature coefficient
    const reCorrected = re / (1 + tempCoeff * (temp - 25));

    // Re as percentage of nominal impedance
    const rePercent = (reCorrected / nomImp) * 100;

    // Quality assessment
    let assessment = '';
    if (rePercent >= 70 && rePercent <= 85) {
      assessment = 'Normal - Re is within typical range (70-85% of nominal impedance)';
    } else if (rePercent < 70) {
      assessment = 'Low - Re is below typical range, possible short or damaged coil';
    } else {
      assessment = 'High - Re is above typical range, possible corroded connections';
    }

    const results = [
      `=== Speaker DC Resistance (Re) Calculation ===`,
      ``,
      `Measurements:`,
      `  Applied Voltage: ${voltage.toFixed(3)} V`,
      `  Measured Current: ${current.toFixed(4)} A`,
      `  Wire Resistance: ${wireR.toFixed(2)} Ω`,
      `  Ambient Temperature: ${temp.toFixed(1)} °C`,
      ``,
      `Results:`,
      `  Total Measured Resistance: ${totalResistance.toFixed(3)} Ω`,
      `  DC Resistance (Re): ${re.toFixed(3)} Ω`,
      `  Re Corrected to 25°C: ${reCorrected.toFixed(3)} Ω`,
      `  Re as % of Nominal (${nomImp}Ω): ${rePercent.toFixed(1)}%`,
      ``,
      `Assessment: ${assessment}`,
      ``,
      `Notes:`,
      `  - Typical Re is 70-85% of nominal impedance`,
      `  - Measure with low DC current to avoid heating`,
      `  - 4Ω speaker: Re ≈ 3.0-3.4Ω`,
      `  - 8Ω speaker: Re ≈ 5.6-6.8Ω`,
      `  - 16Ω speaker: Re ≈ 11.2-13.6Ω`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-nominal`} className="block text-sm font-medium text-gray-700 mb-1">
              Nominal Impedance (Ω)
            </label>
            <select
              id={`${toolId}-nominal`}
              value={nominalImpedance}
              onChange={(e) => setNominalImpedance(e.target.value)}
              className="input-field"
              aria-label={`Nominal impedance for ${toolName}`}
            >
              <option value="4">4 Ω</option>
              <option value="8">8 Ω</option>
              <option value="16">16 Ω</option>
              <option value="32">32 Ω</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">
              Measured Voltage (V)
            </label>
            <input
              id={`${toolId}-voltage`}
              type="number"
              step="0.001"
              value={measuredVoltage}
              onChange={(e) => setMeasuredVoltage(e.target.value)}
              className="input-field"
              aria-label="Measured voltage"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">
              Measured Current (A)
            </label>
            <input
              id={`${toolId}-current`}
              type="number"
              step="0.0001"
              value={measuredCurrent}
              onChange={(e) => setMeasuredCurrent(e.target.value)}
              className="input-field"
              aria-label="Measured current"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-wire`} className="block text-sm font-medium text-gray-700 mb-1">
              Wire/Lead Resistance (Ω)
            </label>
            <input
              id={`${toolId}-wire`}
              type="number"
              step="0.01"
              value={wireResistance}
              onChange={(e) => setWireResistance(e.target.value)}
              className="input-field"
              aria-label="Wire resistance"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              id={`${toolId}-temp`}
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="input-field"
              aria-label="Ambient temperature"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Re
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
