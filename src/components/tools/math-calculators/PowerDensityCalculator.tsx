'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerDensityCalculator - Calculate RF power density at distance.
 * Uses the formula S = P·G / (4πr²) for isotropic and directional antennas.
 */
export default function PowerDensityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [power, setPower] = useState('');
  const [gain, setGain] = useState('');
  const [distance, setDistance] = useState('');
  const [powerUnit, setPowerUnit] = useState('W');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const P = parseFloat(power);
    const G_dBi = parseFloat(gain);
    const d = parseFloat(distance);

    if (isNaN(P) || isNaN(G_dBi) || isNaN(d)) {
      setOutput('Please enter valid values for power, gain, and distance.');
      return;
    }

    if (P <= 0 || d <= 0) {
      setOutput('Power and distance must be positive values.');
      return;
    }

    // Convert power to Watts
    const powerMultipliers: Record<string, number> = {
      'W': 1, 'kW': 1000, 'mW': 0.001, 'dBm': 0,
    };
    let pWatts = P;
    if (powerUnit === 'dBm') {
      pWatts = Math.pow(10, (P - 30) / 10);
    } else {
      pWatts = P * powerMultipliers[powerUnit];
    }

    // Convert distance to meters
    const distMultipliers: Record<string, number> = {
      'm': 1, 'km': 1000, 'ft': 0.3048, 'mi': 1609.344,
    };
    const dMeters = d * distMultipliers[distanceUnit];

    // Convert gain from dBi to linear
    const gainLinear = Math.pow(10, G_dBi / 10);

    // Power density S = P·G / (4πr²)
    const S = (pWatts * gainLinear) / (4 * Math.PI * dMeters * dMeters);

    // EIRP
    const eirp = pWatts * gainLinear;

    // Electric field strength E = √(S × 377)
    const E = Math.sqrt(S * 377);

    let sDisplay = '';
    if (S >= 1) sDisplay = `${S.toFixed(4)} W/m²`;
    else if (S >= 0.001) sDisplay = `${(S * 1000).toFixed(4)} mW/m²`;
    else sDisplay = `${(S * 1e6).toFixed(4)} µW/m²`;

    const lines = [
      '═══ RF Power Density Calculator ═══',
      '',
      `Transmit Power:  ${P} ${powerUnit} = ${pWatts.toFixed(4)} W`,
      `Antenna Gain:    ${G_dBi} dBi (linear: ${gainLinear.toFixed(4)})`,
      `Distance:        ${d} ${distanceUnit} = ${dMeters.toFixed(2)} m`,
      '',
      '── Results ──',
      `  Power Density (S):     ${sDisplay}`,
      `  Power Density:         ${S.toExponential(4)} W/m²`,
      `  Power Density:         ${(S * 10).toExponential(4)} mW/cm²`,
      `  Electric Field (E):    ${E.toFixed(4)} V/m`,
      `  EIRP:                  ${eirp.toFixed(2)} W (${(10 * Math.log10(eirp)).toFixed(2)} dBW)`,
      '',
      '── Safety Limits (FCC) ──',
      `  General Public:  1 mW/cm² (at this distance: ${S * 10 <= 1 ? '✓ SAFE' : '✗ EXCEEDS'})`,
      `  Occupational:    5 mW/cm² (at this distance: ${S * 10 <= 5 ? '✓ SAFE' : '✗ EXCEEDS'})`,
      '',
      '── Formula ──',
      '  S = P × G / (4πr²)',
      `  S = ${pWatts.toFixed(4)} × ${gainLinear.toFixed(4)} / (4π × ${dMeters.toFixed(2)}²)`,
      `  S = ${S.toExponential(4)} W/m²`,
      '',
      '── Notes ──',
      '• Assumes free-space propagation (no reflections or absorption).',
      '• Power density decreases with the square of distance.',
      '• E-field: E = √(S × 377 Ω) where 377 Ω is free-space impedance.',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">
                Transmit Power
              </label>
              <input
                id={`${toolId}-power`}
                type="number"
                step="any"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g. 100"
                className="input-field"
                aria-label={`Transmit power for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-p-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Power Unit
              </label>
              <select id={`${toolId}-p-unit`} value={powerUnit} onChange={(e) => setPowerUnit(e.target.value)} className="input-field" aria-label="Power unit">
                <option value="W">W (Watts)</option>
                <option value="kW">kW (kilowatts)</option>
                <option value="mW">mW (milliwatts)</option>
                <option value="dBm">dBm</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">
              Antenna Gain (dBi)
            </label>
            <input
              id={`${toolId}-gain`}
              type="number"
              step="any"
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              placeholder="e.g. 6"
              className="input-field"
              aria-label="Antenna gain in dBi"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <input
                id={`${toolId}-distance`}
                type="number"
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 10"
                className="input-field"
                aria-label="Distance from antenna"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-d-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Distance Unit
              </label>
              <select id={`${toolId}-d-unit`} value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} className="input-field" aria-label="Distance unit">
                <option value="m">m (meters)</option>
                <option value="km">km (kilometers)</option>
                <option value="ft">ft (feet)</option>
                <option value="mi">mi (miles)</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary" aria-label="Calculate power density">
            Calculate Power Density
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Power Density Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
