'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerWireGaugeCalculator - Calculate recommended speaker wire gauge
 * based on distance and amplifier power/speaker impedance.
 */
export default function SpeakerWireGaugeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('25');
  const [distUnit, setDistUnit] = useState('feet');
  const [impedance, setImpedance] = useState('8');
  const [power, setPower] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dist = parseFloat(distance);
    const imp = parseFloat(impedance);
    const pwr = parseFloat(power);

    if (isNaN(dist) || isNaN(imp) || isNaN(pwr) || dist <= 0 || imp <= 0 || pwr <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    const distFeet = distUnit === 'meters' ? dist * 3.28084 : dist;
    const totalLength = distFeet * 2; // round trip

    // Wire gauge data: AWG, diameter (mm), resistance (ohms/1000ft)
    const gauges = [
      { awg: 18, diameter: 1.024, resistance: 6.385 },
      { awg: 16, diameter: 1.291, resistance: 4.016 },
      { awg: 14, diameter: 1.628, resistance: 2.525 },
      { awg: 12, diameter: 2.053, resistance: 1.588 },
      { awg: 10, diameter: 2.588, resistance: 0.9989 },
      { awg: 8, diameter: 3.264, resistance: 0.6282 },
    ];

    // Calculate resistance for each gauge at this distance
    const results = gauges.map(g => {
      const wireResistance = (g.resistance / 1000) * totalLength;
      const powerLossPercent = (wireResistance / (wireResistance + imp)) * 100;
      const dampingFactor = imp / wireResistance;
      return { ...g, wireResistance, powerLossPercent, dampingFactor };
    });

    // Recommend: power loss < 5% for standard, < 2% for audiophile
    const standard = results.find(r => r.powerLossPercent < 5);
    const audiophile = results.find(r => r.powerLossPercent < 2);

    const lines = [
      `=== Speaker Wire Gauge Calculator ===`,
      ``,
      `Distance: ${dist} ${distUnit} (${distFeet.toFixed(1)} ft one-way, ${totalLength.toFixed(1)} ft total)`,
      `Speaker Impedance: ${imp} Ω`,
      `Amplifier Power: ${pwr} W`,
      ``,
      `--- Recommendations ---`,
      `Standard (< 5% loss): ${standard ? `${standard.awg} AWG` : 'Use thicker than 8 AWG'}`,
      `Audiophile (< 2% loss): ${audiophile ? `${audiophile.awg} AWG` : 'Use thicker than 8 AWG'}`,
      ``,
      `--- All Gauges Comparison ---`,
      `AWG | Ø (mm) | Wire Ω  | Power Loss | Damping Factor`,
      `----+--------+---------+------------+---------------`,
      ...results.map(r =>
        ` ${r.awg.toString().padStart(2)}  | ${r.diameter.toFixed(3)}  | ${r.wireResistance.toFixed(4)} Ω | ${r.powerLossPercent.toFixed(2)}%      | ${r.dampingFactor.toFixed(1)}`
      ),
      ``,
      `--- Guidelines ---`,
      `• < 25 ft, 8Ω: 16 AWG is usually sufficient`,
      `• 25-50 ft, 8Ω: 14 AWG recommended`,
      `• > 50 ft or 4Ω: 12 AWG or thicker`,
      `• Subwoofers: go one gauge thicker than calculated`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">
              Distance (one-way)
            </label>
            <input
              id={`${toolId}-dist`}
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="input-field"
              aria-label={`Wire distance for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-dunit`} className="block text-sm font-medium text-gray-700 mb-1">
              Distance Unit
            </label>
            <select
              id={`${toolId}-dunit`}
              value={distUnit}
              onChange={(e) => setDistUnit(e.target.value)}
              className="input-field"
              aria-label="Distance unit"
            >
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-imp`} className="block text-sm font-medium text-gray-700 mb-1">
              Speaker Impedance (Ω)
            </label>
            <select
              id={`${toolId}-imp`}
              value={impedance}
              onChange={(e) => setImpedance(e.target.value)}
              className="input-field"
              aria-label="Speaker impedance"
            >
              <option value="2">2 Ω</option>
              <option value="4">4 Ω</option>
              <option value="6">6 Ω</option>
              <option value="8">8 Ω</option>
              <option value="16">16 Ω</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-pwr`} className="block text-sm font-medium text-gray-700 mb-1">
              Amplifier Power (W)
            </label>
            <input
              id={`${toolId}-pwr`}
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="input-field"
              aria-label="Amplifier power"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">
          Calculate Wire Gauge
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wire Gauge Recommendation</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
