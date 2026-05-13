'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EsdProtectionCalculator - Calculate ESD protection component values.
 * Determines TVS diode ratings, clamping voltages, and series resistor values.
 */
export default function EsdProtectionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [signalVoltage, setSignalVoltage] = useState('3.3');
  const [maxCurrent, setMaxCurrent] = useState('100');
  const [esdLevel, setEsdLevel] = useState('2');
  const [protectionType, setProtectionType] = useState('tvs');
  const [lineCapacitance, setLineCapacitance] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vSignal = parseFloat(signalVoltage);
    const iMax = parseFloat(maxCurrent);
    const level = parseInt(esdLevel);
    const capPf = parseFloat(lineCapacitance);

    if (isNaN(vSignal) || isNaN(iMax) || isNaN(level) || isNaN(capPf)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // IEC 61000-4-2 ESD levels
    const esdVoltages: Record<number, { contact: number; air: number }> = {
      1: { contact: 2000, air: 2000 },
      2: { contact: 4000, air: 4000 },
      3: { contact: 6000, air: 8000 },
      4: { contact: 8000, air: 15000 },
    };

    const esdSpec = esdVoltages[level] || esdVoltages[2];
    const peakCurrent = esdSpec.contact / 330; // IEC model: V/330 ohms

    // TVS diode calculations
    const vBreakdown = vSignal * 1.1; // 10% above signal
    const vClamping = vSignal * 1.4; // Clamping at ~40% above signal
    const vWorking = vSignal * 0.9; // Working voltage below signal

    // Series resistor for current limiting
    const rSeries = (vClamping - vSignal) / (iMax / 1000);

    // Power dissipation during ESD event (8/20μs pulse)
    const peakPower = vClamping * peakCurrent;
    const _avgPower = peakPower * 0.00002; // 20μs pulse approximation

    // Bandwidth impact
    const bandwidth = 1 / (2 * Math.PI * (rSeries) * (capPf * 1e-12));

    const lines = [
      '=== ESD Protection Calculation ===',
      '',
      '--- ESD Threat Level ---',
      `IEC 61000-4-2 Level: ${level}`,
      `Contact Discharge: ${esdSpec.contact} V`,
      `Air Discharge: ${esdSpec.air} V`,
      `Peak Current (contact): ${peakCurrent.toFixed(1)} A`,
      '',
      '--- Protection Component Values ---',
      `Protection Type: ${protectionType === 'tvs' ? 'TVS Diode' : 'Varistor'}`,
      `Working Voltage (Vrwm): ≥ ${vWorking.toFixed(2)} V`,
      `Breakdown Voltage (Vbr): ~${vBreakdown.toFixed(2)} V`,
      `Clamping Voltage (Vc): ~${vClamping.toFixed(2)} V`,
      `Peak Pulse Power: ${peakPower.toFixed(1)} W`,
      '',
      '--- Series Resistor ---',
      `Recommended Rs: ${rSeries.toFixed(1)} Ω`,
      `Purpose: Limit current to ${iMax} mA at clamping voltage`,
      '',
      '--- Signal Integrity Impact ---',
      `Added Capacitance: ${capPf} pF`,
      `Bandwidth Limit: ${(bandwidth / 1e6).toFixed(1)} MHz (with Rs)`,
      '',
      '--- Design Recommendations ---',
      `• Place TVS as close to connector as possible`,
      `• Use short, wide traces to ground plane`,
      `• Series resistor between TVS and IC for extra protection`,
      `• Ensure PCB ground plane is solid under ESD path`,
      `• Consider ${capPf <= 1 ? 'low-capacitance array' : 'standard'} TVS for ${bandwidth > 1e9 ? 'high-speed' : 'general'} signals`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Signal Voltage (V)</label>
            <input id={`${toolId}-voltage`} type="number" step="0.1" value={signalVoltage} onChange={(e) => setSignalVoltage(e.target.value)} className="input-field" aria-label={`Signal voltage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">Max Signal Current (mA)</label>
            <input id={`${toolId}-current`} type="number" value={maxCurrent} onChange={(e) => setMaxCurrent(e.target.value)} className="input-field" aria-label="Max signal current" />
          </div>
          <div>
            <label htmlFor={`${toolId}-level`} className="block text-sm font-medium text-gray-700 mb-1">ESD Level (IEC 61000-4-2)</label>
            <select id={`${toolId}-level`} value={esdLevel} onChange={(e) => setEsdLevel(e.target.value)} className="input-field" aria-label="ESD protection level">
              <option value="1">Level 1 (2 kV contact)</option>
              <option value="2">Level 2 (4 kV contact)</option>
              <option value="3">Level 3 (6 kV contact)</option>
              <option value="4">Level 4 (8 kV contact)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Protection Type</label>
            <select id={`${toolId}-type`} value={protectionType} onChange={(e) => setProtectionType(e.target.value)} className="input-field" aria-label="Protection type">
              <option value="tvs">TVS Diode</option>
              <option value="varistor">Varistor (MOV)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-cap`} className="block text-sm font-medium text-gray-700 mb-1">Line Capacitance (pF)</label>
            <input id={`${toolId}-cap`} type="number" step="0.5" value={lineCapacitance} onChange={(e) => setLineCapacitance(e.target.value)} className="input-field" aria-label="Line capacitance" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate ESD Protection</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ESD Protection Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
