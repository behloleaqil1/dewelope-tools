'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HourglassCalculator - Calculate sand flow rate for hourglass timing.
 */
export default function HourglassCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [desiredTime, setDesiredTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours'>('minutes');
  const [sandVolume, setSandVolume] = useState('');
  const [neckDiameter, setNeckDiameter] = useState('');
  const [sandGrainSize, setSandGrainSize] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const time = parseFloat(desiredTime);
    const volume = parseFloat(sandVolume);
    const neck = parseFloat(neckDiameter);
    const grain = parseFloat(sandGrainSize);

    if (isNaN(time) || time <= 0) {
      setOutput('Error: Please enter a valid desired time.');
      return;
    }

    // Convert time to seconds
    let timeSec = time;
    if (timeUnit === 'minutes') timeSec = time * 60;
    if (timeUnit === 'hours') timeSec = time * 3600;

    const results: string[] = [`=== Hourglass Calculator ===`, ``];

    if (!isNaN(volume) && volume > 0) {
      // Calculate required flow rate from volume and time
      const flowRate = volume / timeSec; // mL/s
      const flowRateMin = flowRate * 60; // mL/min
      results.push(`Desired Duration: ${time} ${timeUnit} (${timeSec.toFixed(1)} seconds)`);
      results.push(`Sand Volume: ${volume} mL`);
      results.push(``);
      results.push(`Required Flow Rate: ${flowRate.toFixed(4)} mL/s`);
      results.push(`Required Flow Rate: ${flowRateMin.toFixed(4)} mL/min`);
      results.push(`Required Flow Rate: ${(flowRate * 3600).toFixed(2)} mL/hr`);
    }

    if (!isNaN(neck) && neck > 0) {
      // Beverloo equation approximation for granular flow
      // Q = C * ρ * √g * (D - k*d)^(5/2)
      // Simplified: estimate flow rate based on neck diameter
      const g = 9.81; // m/s²
      const grainMm = isNaN(grain) ? 0.5 : grain;
      const neckM = neck / 1000; // convert mm to m
      const grainM = grainMm / 1000;
      const C = 0.58; // Beverloo constant
      const k = 1.4; // shape factor
      const rho = 1500; // sand bulk density kg/m³

      const effectiveDiameter = neckM - k * grainM;
      if (effectiveDiameter <= 0) {
        results.push(``);
        results.push(`Error: Neck diameter too small for given grain size.`);
        results.push(`Minimum neck diameter: ${(k * grainMm + 0.1).toFixed(1)} mm`);
      } else {
        const massFlowRate = C * rho * Math.sqrt(g) * Math.pow(effectiveDiameter, 2.5); // kg/s
        const volumeFlowRate = (massFlowRate / rho) * 1e6; // mL/s

        results.push(``);
        results.push(`--- Beverloo Equation Estimate ---`);
        results.push(`Neck Diameter: ${neck} mm`);
        results.push(`Sand Grain Size: ${grainMm} mm`);
        results.push(`Effective Opening: ${(effectiveDiameter * 1000).toFixed(2)} mm`);
        results.push(``);
        results.push(`Estimated Mass Flow: ${(massFlowRate * 1000).toFixed(4)} g/s`);
        results.push(`Estimated Volume Flow: ${volumeFlowRate.toFixed(4)} mL/s`);
        results.push(``);

        // How much sand needed for desired time
        const sandNeeded = volumeFlowRate * timeSec;
        results.push(`Sand Needed for ${time} ${timeUnit}: ${sandNeeded.toFixed(1)} mL (${(sandNeeded * 1.5).toFixed(1)} g approx)`);

        // If volume given, how long it will actually take
        if (!isNaN(volume) && volume > 0) {
          const actualTime = volume / volumeFlowRate;
          results.push(`Actual Duration with ${volume} mL: ${actualTime.toFixed(1)} seconds (${(actualTime / 60).toFixed(2)} minutes)`);
        }
      }
    }

    if (results.length <= 2) {
      results.push(`Please enter sand volume and/or neck diameter to calculate.`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Desired Time</label>
              <input id={`${toolId}-time`} type="number" value={desiredTime} onChange={(e) => setDesiredTime(e.target.value)} placeholder="3" aria-label={`Desired time for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Time Unit</label>
              <select id={`${toolId}-unit`} value={timeUnit} onChange={(e) => setTimeUnit(e.target.value as typeof timeUnit)} aria-label="Time unit" className="input-field">
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1">Sand Volume (mL)</label>
            <input id={`${toolId}-volume`} type="number" value={sandVolume} onChange={(e) => setSandVolume(e.target.value)} placeholder="50" aria-label="Sand volume in milliliters" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-neck`} className="block text-sm font-medium text-gray-700 mb-1">Neck Diameter (mm)</label>
              <input id={`${toolId}-neck`} type="number" value={neckDiameter} onChange={(e) => setNeckDiameter(e.target.value)} placeholder="3" aria-label="Neck diameter in millimeters" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-grain`} className="block text-sm font-medium text-gray-700 mb-1">Grain Size (mm)</label>
              <input id={`${toolId}-grain`} type="number" step="0.1" value={sandGrainSize} onChange={(e) => setSandGrainSize(e.target.value)} placeholder="0.5" aria-label="Sand grain size" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hourglass Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
