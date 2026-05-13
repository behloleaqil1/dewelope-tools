'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CukConverterCalculator - Calculate Ćuk converter parameters.
 * Computes duty cycle, inductor values, capacitor values, and output voltage.
 */
export default function CukConverterCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('12');
  const [outputVoltage, setOutputVoltage] = useState('-5');
  const [loadCurrent, setLoadCurrent] = useState('1');
  const [switchingFreq, setSwitchingFreq] = useState('100');
  const [rippleCurrent, setRippleCurrent] = useState('20');
  const [rippleVoltage, setRippleVoltage] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const Vin = parseFloat(inputVoltage);
    const Vout = Math.abs(parseFloat(outputVoltage));
    const Io = parseFloat(loadCurrent);
    const fs = parseFloat(switchingFreq) * 1000; // kHz to Hz
    const deltaIPercent = parseFloat(rippleCurrent) / 100;
    const deltaVPercent = parseFloat(rippleVoltage) / 100;

    if (isNaN(Vin) || isNaN(Vout) || isNaN(Io) || isNaN(fs) || Vin <= 0 || Vout <= 0 || Io <= 0 || fs <= 0) {
      setOutput('Please enter valid positive values for all parameters.');
      return;
    }

    // Duty cycle: D = Vout / (Vin + Vout)
    const D = Vout / (Vin + Vout);

    // Input current
    const Iin = (Io * Vout) / Vin;

    // Inductor L1 (input side)
    const deltaIL1 = Iin * deltaIPercent;
    const L1 = (Vin * D) / (fs * deltaIL1);

    // Inductor L2 (output side)
    const deltaIL2 = Io * deltaIPercent;
    const L2 = (Vout * (1 - D)) / (fs * deltaIL2);

    // Coupling capacitor C1
    const deltaVC1 = Vout * deltaVPercent;
    const C1 = (Io * D) / (fs * deltaVC1);

    // Output capacitor C2
    const deltaVout = Vout * deltaVPercent;
    const C2 = (Io * D) / (fs * deltaVout);

    // Switch stress
    const Vsw = Vin + Vout;
    const Isw = Iin + Io;

    const results = [
      `═══ Ćuk Converter Parameters ═══`,
      ``,
      `Duty Cycle (D): ${(D * 100).toFixed(2)}%`,
      `Input Current (Iin): ${Iin.toFixed(3)} A`,
      ``,
      `── Inductor Values ──`,
      `L1 (input): ${(L1 * 1e6).toFixed(2)} µH`,
      `L2 (output): ${(L2 * 1e6).toFixed(2)} µH`,
      `ΔI_L1: ${(deltaIL1 * 1000).toFixed(1)} mA`,
      `ΔI_L2: ${(deltaIL2 * 1000).toFixed(1)} mA`,
      ``,
      `── Capacitor Values ──`,
      `C1 (coupling): ${(C1 * 1e6).toFixed(2)} µF`,
      `C2 (output): ${(C2 * 1e6).toFixed(2)} µF`,
      ``,
      `── Switch Stress ──`,
      `Voltage stress: ${Vsw.toFixed(2)} V`,
      `Peak current: ${Isw.toFixed(3)} A`,
      ``,
      `── Configuration ──`,
      `Vin: ${Vin} V → Vout: -${Vout} V (inverted)`,
      `Switching frequency: ${(fs / 1000).toFixed(1)} kHz`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
              <input id={`${toolId}-vin`} type="number" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} className="input-field" aria-label="Input voltage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} className="input-field" aria-label="Output voltage" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-io`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (A)</label>
              <input id={`${toolId}-io`} type="number" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} className="input-field" aria-label="Load current" />
            </div>
            <div>
              <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Switching Freq (kHz)</label>
              <input id={`${toolId}-fs`} type="number" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} className="input-field" aria-label="Switching frequency" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-ripple-i`} className="block text-sm font-medium text-gray-700 mb-1">Current Ripple (%)</label>
              <input id={`${toolId}-ripple-i`} type="number" value={rippleCurrent} onChange={(e) => setRippleCurrent(e.target.value)} className="input-field" aria-label="Current ripple percentage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ripple-v`} className="block text-sm font-medium text-gray-700 mb-1">Voltage Ripple (%)</label>
              <input id={`${toolId}-ripple-v`} type="number" value={rippleVoltage} onChange={(e) => setRippleVoltage(e.target.value)} className="input-field" aria-label="Voltage ripple percentage" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
