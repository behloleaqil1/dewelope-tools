'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SepicConverterCalculator - Calculate SEPIC converter parameters.
 * Computes duty cycle, inductor values, coupling capacitor, and output capacitor.
 */
export default function SepicConverterCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('12');
  const [outputVoltage, setOutputVoltage] = useState('5');
  const [loadCurrent, setLoadCurrent] = useState('1');
  const [switchingFreq, setSwitchingFreq] = useState('200');
  const [rippleCurrent, setRippleCurrent] = useState('30');
  const [rippleVoltage, setRippleVoltage] = useState('2');
  const [diodeVf, setDiodeVf] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const Vin = parseFloat(inputVoltage);
    const Vout = parseFloat(outputVoltage);
    const Io = parseFloat(loadCurrent);
    const fs = parseFloat(switchingFreq) * 1000; // kHz to Hz
    const deltaIPercent = parseFloat(rippleCurrent) / 100;
    const deltaVPercent = parseFloat(rippleVoltage) / 100;
    const Vd = parseFloat(diodeVf);

    if (isNaN(Vin) || isNaN(Vout) || isNaN(Io) || isNaN(fs) || Vin <= 0 || Vout <= 0 || Io <= 0 || fs <= 0) {
      setOutput('Please enter valid positive values for all parameters.');
      return;
    }

    // Duty cycle: D = (Vout + Vd) / (Vin + Vout + Vd)
    const D = (Vout + Vd) / (Vin + Vout + Vd);

    // Input current
    const _Iin = (Io * (Vout + Vd)) / (Vin * (1 - 0)); // Ideal efficiency
    const IinActual = Io * Vout / (Vin * 0.85); // ~85% efficiency estimate

    // Inductor L1 (input)
    const deltaIL1 = IinActual * deltaIPercent;
    const L1 = (Vin * D) / (fs * deltaIL1);

    // Inductor L2 (coupled)
    const deltaIL2 = Io * deltaIPercent;
    const L2 = (Vin * D) / (fs * deltaIL2);

    // Coupling capacitor Cs
    const deltaVCs = Vin * deltaVPercent;
    const Cs = (Io * D) / (fs * deltaVCs);

    // Output capacitor Co
    const deltaVout = Vout * deltaVPercent;
    const Co = (Io * D) / (fs * deltaVout);

    // Switch stress
    const Vsw = Vin + Vout + Vd;
    const IswPeak = IinActual + Io + (deltaIL1 / 2) + (deltaIL2 / 2);

    const results = [
      `═══ SEPIC Converter Parameters ═══`,
      ``,
      `Duty Cycle (D): ${(D * 100).toFixed(2)}%`,
      `Estimated Input Current: ${IinActual.toFixed(3)} A`,
      ``,
      `── Inductor Values ──`,
      `L1 (input): ${(L1 * 1e6).toFixed(2)} µH`,
      `L2 (coupled): ${(L2 * 1e6).toFixed(2)} µH`,
      `ΔI_L1: ${(deltaIL1 * 1000).toFixed(1)} mA`,
      `ΔI_L2: ${(deltaIL2 * 1000).toFixed(1)} mA`,
      ``,
      `── Capacitor Values ──`,
      `Cs (coupling): ${(Cs * 1e6).toFixed(2)} µF`,
      `Co (output): ${(Co * 1e6).toFixed(2)} µF`,
      ``,
      `── Switch/Diode Stress ──`,
      `Max switch voltage: ${Vsw.toFixed(2)} V`,
      `Peak switch current: ${IswPeak.toFixed(3)} A`,
      `Diode reverse voltage: ${Vsw.toFixed(2)} V`,
      ``,
      `── Configuration ──`,
      `Vin: ${Vin} V → Vout: ${Vout} V (non-inverting)`,
      `Switching frequency: ${(fs / 1000).toFixed(1)} kHz`,
      `Efficiency estimate: ~85%`,
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
          <div>
            <label htmlFor={`${toolId}-vf`} className="block text-sm font-medium text-gray-700 mb-1">Diode Forward Voltage (V)</label>
            <input id={`${toolId}-vf`} type="number" value={diodeVf} onChange={(e) => setDiodeVf(e.target.value)} className="input-field" aria-label="Diode forward voltage" />
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
