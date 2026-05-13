'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CrystalOscillatorCalculator - Calculate crystal oscillator load capacitance.
 * Computes required external capacitors for proper oscillation frequency.
 */
export default function CrystalOscillatorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('16');
  const [loadCapacitance, setLoadCapacitance] = useState('18');
  const [strayCapacitance, setStrayCapacitance] = useState('5');
  const [esr, setEsr] = useState('40');
  const [driveLevel, setDriveLevel] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const freq = parseFloat(frequency);
    const cLoad = parseFloat(loadCapacitance);
    const cStray = parseFloat(strayCapacitance);
    const esrVal = parseFloat(esr);
    const drive = parseFloat(driveLevel);

    if (isNaN(freq) || isNaN(cLoad) || isNaN(cStray) || isNaN(esrVal) || isNaN(drive)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    // Calculate external capacitors: CL = (C1 * C2) / (C1 + C2) + Cstray
    // For symmetric loading (C1 = C2 = Cext): CL = Cext/2 + Cstray
    // Therefore: Cext = 2 * (CL - Cstray)
    const cExt = 2 * (cLoad - cStray);

    // Frequency pulling (ppm) based on load capacitance mismatch
    // Δf/f ≈ (C_motional) / (2 * (CL + C_motional)^2) * ΔCL
    // Simplified: ~1 ppm per pF mismatch for typical crystals
    const pullSensitivity = 1 / (2 * cLoad);

    // Negative resistance required for oscillation
    // |Rneg| > ESR for reliable startup
    const negResistanceMin = esrVal * 5; // 5x safety margin recommended

    // Transconductance requirement: gm > 4 * ESR * (2π * f)^2 * CL^2
    const omega = 2 * Math.PI * freq * 1e6;
    const gmMin = 4 * esrVal * omega * omega * (cLoad * 1e-12) * (cLoad * 1e-12) * 1000; // in mA/V

    // Drive level power: P = ESR * I^2 / 2
    const maxCurrent = Math.sqrt((2 * drive * 1e-6) / esrVal) * 1000; // in mA

    // Startup time estimate (rough): ~1000 / f cycles
    const startupTime = (1000 / (freq * 1e6)) * 1000; // in ms

    const lines: string[] = [];
    lines.push('=== Crystal Oscillator Load Capacitance Calculator ===');
    lines.push('');
    lines.push('--- Input Parameters ---');
    lines.push(`Crystal Frequency: ${freq} MHz`);
    lines.push(`Specified Load Capacitance (CL): ${cLoad} pF`);
    lines.push(`Stray/Parasitic Capacitance: ${cStray} pF`);
    lines.push(`Crystal ESR: ${esrVal} Ω`);
    lines.push(`Max Drive Level: ${drive} µW`);
    lines.push('');
    lines.push('--- Calculated Results ---');
    lines.push(`Required External Capacitors (C1 = C2): ${cExt.toFixed(1)} pF`);
    lines.push(`Nearest Standard Value: ${getNearestStandard(cExt)} pF`);
    lines.push(`Frequency Pull Sensitivity: ${(pullSensitivity * 1e6).toFixed(1)} ppm/pF`);
    lines.push('');
    lines.push('--- Oscillator Requirements ---');
    lines.push(`Min Negative Resistance: ${negResistanceMin.toFixed(0)} Ω (5× ESR margin)`);
    lines.push(`Min Transconductance (gm): ${gmMin.toFixed(3)} mA/V`);
    lines.push(`Max Crystal Current: ${maxCurrent.toFixed(3)} mA`);
    lines.push(`Estimated Startup Time: ${startupTime.toFixed(2)} ms`);
    lines.push('');
    lines.push('--- Design Notes ---');
    if (cExt < 6) {
      lines.push('⚠ Very small Cext - stray capacitance dominates. Consider crystal with higher CL spec.');
    } else if (cExt > 47) {
      lines.push('⚠ Large Cext values may limit high-frequency performance.');
    } else {
      lines.push('✓ External capacitor values are in a practical range.');
    }
    lines.push(`✓ Use ${getNearestStandard(cExt)} pF capacitors (C0G/NP0 type recommended)`);
    lines.push('✓ Place capacitors as close to crystal pins as possible');
    lines.push('✓ Keep traces short to minimize stray capacitance');

    setOutput(lines.join('\n'));
  };

  const getNearestStandard = (value: number): number => {
    const standards = [1, 1.5, 2.2, 3.3, 4.7, 5.6, 6.8, 8.2, 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100];
    let nearest = standards[0];
    let minDiff = Math.abs(value - standards[0]);
    for (const s of standards) {
      const diff = Math.abs(value - s);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = s;
      }
    }
    return nearest;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Crystal Frequency (MHz)</label>
              <input id={`${toolId}-freq`} type="number" step="0.001" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label={`Crystal frequency for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-cl`} className="block text-sm font-medium text-gray-700 mb-1">Load Capacitance (pF)</label>
              <input id={`${toolId}-cl`} type="number" value={loadCapacitance} onChange={(e) => setLoadCapacitance(e.target.value)} className="input-field" aria-label="Load capacitance" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-stray`} className="block text-sm font-medium text-gray-700 mb-1">Stray Capacitance (pF)</label>
              <input id={`${toolId}-stray`} type="number" value={strayCapacitance} onChange={(e) => setStrayCapacitance(e.target.value)} className="input-field" aria-label="Stray capacitance" />
            </div>
            <div>
              <label htmlFor={`${toolId}-esr`} className="block text-sm font-medium text-gray-700 mb-1">Crystal ESR (Ω)</label>
              <input id={`${toolId}-esr`} type="number" value={esr} onChange={(e) => setEsr(e.target.value)} className="input-field" aria-label="Crystal ESR" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-drive`} className="block text-sm font-medium text-gray-700 mb-1">Max Drive Level (µW)</label>
            <input id={`${toolId}-drive`} type="number" value={driveLevel} onChange={(e) => setDriveLevel(e.target.value)} className="input-field" aria-label="Max drive level" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Load Capacitance</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Crystal Oscillator Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
