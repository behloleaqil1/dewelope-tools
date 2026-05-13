'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DecouplingCapacitorCalculator - Calculate decoupling capacitor values for ICs.
 * Estimates required capacitance based on IC current draw, frequency, and voltage ripple.
 */
export default function DecouplingCapacitorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [currentDraw, setCurrentDraw] = useState('100');
  const [switchingFreq, setSwitchingFreq] = useState('100');
  const [voltageRipple, setVoltageRipple] = useState('50');
  const [supplyVoltage, setSupplyVoltage] = useState('3.3');
  const [riseTime, setRiseTime] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const I = parseFloat(currentDraw) / 1000; // mA to A
    const f = parseFloat(switchingFreq) * 1e6; // MHz to Hz
    const dV = parseFloat(voltageRipple) / 1000; // mV to V
    const Vcc = parseFloat(supplyVoltage);
    const tr = parseFloat(riseTime) * 1e-9; // ns to s

    if (isNaN(I) || isNaN(f) || isNaN(dV) || isNaN(Vcc) || isNaN(tr) || dV <= 0 || f <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Basic decoupling: C = I / (f * dV)
    const C_basic = I / (f * dV);
    
    // Transient decoupling: C = I * tr / dV
    const C_transient = I * tr / dV;
    
    // Recommended (larger of the two)
    const C_recommended = Math.max(C_basic, C_transient);
    
    // Resonant frequency of recommended cap
    const ESL_typical = 1e-9; // 1nH typical ESL
    const f_resonant = 1 / (2 * Math.PI * Math.sqrt(C_recommended * ESL_typical));
    
    // Impedance at switching frequency
    const Z_cap = 1 / (2 * Math.PI * f * C_recommended);
    
    // Target impedance
    const Z_target = dV / I;

    const formatCap = (c: number): string => {
      if (c >= 1e-6) return `${(c * 1e6).toFixed(2)} µF`;
      if (c >= 1e-9) return `${(c * 1e9).toFixed(2)} nF`;
      return `${(c * 1e12).toFixed(2)} pF`;
    };

    const formatFreq = (freq: number): string => {
      if (freq >= 1e9) return `${(freq / 1e9).toFixed(2)} GHz`;
      if (freq >= 1e6) return `${(freq / 1e6).toFixed(2)} MHz`;
      if (freq >= 1e3) return `${(freq / 1e3).toFixed(2)} kHz`;
      return `${freq.toFixed(2)} Hz`;
    };

    let result = `=== Decoupling Capacitor Analysis ===\n\n`;
    result += `--- Input Parameters ---\n`;
    result += `IC Current Draw: ${currentDraw} mA\n`;
    result += `Switching Frequency: ${switchingFreq} MHz\n`;
    result += `Allowable Voltage Ripple: ${voltageRipple} mV\n`;
    result += `Supply Voltage: ${Vcc} V\n`;
    result += `Signal Rise Time: ${riseTime} ns\n\n`;
    result += `--- Calculated Capacitance ---\n`;
    result += `Frequency-based (C = I/f·ΔV): ${formatCap(C_basic)}\n`;
    result += `Transient-based (C = I·tr/ΔV): ${formatCap(C_transient)}\n`;
    result += `Recommended Minimum: ${formatCap(C_recommended)}\n\n`;
    result += `--- Impedance Analysis ---\n`;
    result += `Target Impedance (Z = ΔV/I): ${(Z_target * 1000).toFixed(2)} mΩ\n`;
    result += `Cap Impedance at ${switchingFreq} MHz: ${(Z_cap * 1000).toFixed(2)} mΩ\n`;
    result += `Self-Resonant Frequency (1nH ESL): ${formatFreq(f_resonant)}\n\n`;
    result += `--- Recommendations ---\n`;
    result += `• Place capacitor as close to IC power pins as possible\n`;
    result += `• Use short, wide traces to minimize inductance\n`;
    result += `• Consider multiple smaller caps in parallel for lower ESL\n`;
    if (f > f_resonant) {
      result += `⚠ Switching freq exceeds SRF: Add a smaller cap for high-freq decoupling\n`;
    }
    result += `• Standard values: 100nF (general), 10µF (bulk), 10pF-100pF (high-freq)\n`;
    result += `• Ripple as % of Vcc: ${((dV / Vcc) * 100).toFixed(2)}%\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">IC Current Draw (mA)</label>
            <input id={`${toolId}-current`} type="number" step="1" value={currentDraw} onChange={(e) => setCurrentDraw(e.target.value)} className="input-field" aria-label={`Current draw for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (MHz)</label>
            <input id={`${toolId}-freq`} type="number" step="1" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} className="input-field" aria-label="Switching frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ripple`} className="block text-sm font-medium text-gray-700 mb-1">Allowable Voltage Ripple (mV)</label>
            <input id={`${toolId}-ripple`} type="number" step="1" value={voltageRipple} onChange={(e) => setVoltageRipple(e.target.value)} className="input-field" aria-label="Voltage ripple" />
          </div>
          <div>
            <label htmlFor={`${toolId}-supply`} className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage (V)</label>
            <input id={`${toolId}-supply`} type="number" step="0.1" value={supplyVoltage} onChange={(e) => setSupplyVoltage(e.target.value)} className="input-field" aria-label="Supply voltage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rise`} className="block text-sm font-medium text-gray-700 mb-1">Signal Rise Time (ns)</label>
            <input id={`${toolId}-rise`} type="number" step="0.1" value={riseTime} onChange={(e) => setRiseTime(e.target.value)} className="input-field" aria-label="Signal rise time" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Capacitance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Decoupling Capacitor Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
