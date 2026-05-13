'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerThermalModelCalculator - Calculate speaker thermal time constant.
 * Models voice coil temperature rise over time based on power and thermal parameters.
 */
export default function SpeakerThermalModelCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [power, setPower] = useState('100');
  const [thermalResistance, setThermalResistance] = useState('3.5');
  const [thermalCapacitance, setThermalCapacitance] = useState('10');
  const [ambientTemp, setAmbientTemp] = useState('25');
  const [maxTemp, setMaxTemp] = useState('180');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const p = parseFloat(power);
    const rth = parseFloat(thermalResistance);
    const cth = parseFloat(thermalCapacitance);
    const tamb = parseFloat(ambientTemp);
    const tmax = parseFloat(maxTemp);

    if ([p, rth, cth, tamb, tmax].some(isNaN)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Thermal time constant (seconds)
    const tau = rth * cth;

    // Steady-state temperature rise
    const deltaT = p * rth;
    const steadyStateTemp = tamb + deltaT;

    // Time to reach various percentages of steady state
    const t63 = tau;
    const t90 = tau * 2.3;
    const t95 = tau * 3.0;
    const t99 = tau * 4.6;

    // Max safe power
    const maxSafePower = (tmax - tamb) / rth;

    // Temperature at various time points
    const timePoints = [1, 5, 10, 30, 60, 120, 300];
    const tempAtTime = timePoints.map(t => {
      const temp = tamb + deltaT * (1 - Math.exp(-t / tau));
      return { time: t, temp };
    });

    const lines = [
      `=== Speaker Thermal Model ===`,
      ``,
      `Input Parameters:`,
      `  Power: ${p} W`,
      `  Thermal Resistance (Rth): ${rth} °C/W`,
      `  Thermal Capacitance (Cth): ${cth} J/°C`,
      `  Ambient Temperature: ${tamb} °C`,
      `  Max Voice Coil Temp: ${tmax} °C`,
      ``,
      `Thermal Time Constant (τ): ${tau.toFixed(2)} seconds`,
      ``,
      `Steady-State Temperature Rise: ${deltaT.toFixed(1)} °C`,
      `Steady-State Voice Coil Temp: ${steadyStateTemp.toFixed(1)} °C`,
      `Status: ${steadyStateTemp > tmax ? '⚠️ EXCEEDS MAX TEMP' : '✓ Within safe range'}`,
      ``,
      `Max Safe Continuous Power: ${maxSafePower.toFixed(1)} W`,
      ``,
      `Time to Reach:`,
      `  63% of ΔT: ${t63.toFixed(1)} s`,
      `  90% of ΔT: ${t90.toFixed(1)} s`,
      `  95% of ΔT: ${t95.toFixed(1)} s`,
      `  99% of ΔT: ${t99.toFixed(1)} s`,
      ``,
      `Temperature vs Time:`,
      ...tempAtTime.map(({ time, temp }) => `  t=${time}s: ${temp.toFixed(1)} °C`),
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">
                Input Power (W)
              </label>
              <input id={`${toolId}-power`} type="number" step="1" value={power} onChange={(e) => setPower(e.target.value)} aria-label={`Input power for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-rth`} className="block text-sm font-medium text-gray-700 mb-1">
                Thermal Resistance (°C/W)
              </label>
              <input id={`${toolId}-rth`} type="number" step="0.1" value={thermalResistance} onChange={(e) => setThermalResistance(e.target.value)} aria-label="Thermal resistance" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-cth`} className="block text-sm font-medium text-gray-700 mb-1">
                Thermal Capacitance (J/°C)
              </label>
              <input id={`${toolId}-cth`} type="number" step="0.1" value={thermalCapacitance} onChange={(e) => setThermalCapacitance(e.target.value)} aria-label="Thermal capacitance" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ambient`} className="block text-sm font-medium text-gray-700 mb-1">
                Ambient Temp (°C)
              </label>
              <input id={`${toolId}-ambient`} type="number" step="1" value={ambientTemp} onChange={(e) => setAmbientTemp(e.target.value)} aria-label="Ambient temperature" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-maxtemp`} className="block text-sm font-medium text-gray-700 mb-1">
              Max Voice Coil Temp (°C)
            </label>
            <input id={`${toolId}-maxtemp`} type="number" step="1" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} aria-label="Maximum voice coil temperature" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate Thermal Model
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thermal Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
