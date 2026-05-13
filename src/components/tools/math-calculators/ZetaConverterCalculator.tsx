'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZetaConverterCalculator - Calculate Zeta converter (dual SEPIC) parameters.
 * Computes duty cycle, inductor values, capacitor values, and switch stress.
 */
export default function ZetaConverterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [vin, setVin] = useState('12');
  const [vout, setVout] = useState('5');
  const [iout, setIout] = useState('2');
  const [freq, setFreq] = useState('100');
  const [rippleCurrent, setRippleCurrent] = useState('30');
  const [rippleVoltage, setRippleVoltage] = useState('1');
  const [vd, setVd] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vinVal = parseFloat(vin);
    const voutVal = parseFloat(vout);
    const ioutVal = parseFloat(iout);
    const fVal = parseFloat(freq) * 1000; // kHz to Hz
    const rippleI = parseFloat(rippleCurrent) / 100;
    const rippleV = parseFloat(rippleVoltage) / 100;
    const vdVal = parseFloat(vd);

    if (isNaN(vinVal) || isNaN(voutVal) || isNaN(ioutVal) || isNaN(fVal) || vinVal <= 0 || voutVal <= 0 || ioutVal <= 0 || fVal <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Duty cycle: D = (Vout + Vd) / (Vin + Vout + Vd)
    const D = (voutVal + vdVal) / (vinVal + voutVal + vdVal);

    // Input current
    const iin = (ioutVal * voutVal) / (vinVal * (1 - 0.1)); // assuming 90% efficiency

    // Inductor L1 (input side)
    const deltaIL1 = iin * rippleI;
    const L1 = (vinVal * D) / (fVal * deltaIL1);

    // Inductor L2 (output side)
    const deltaIL2 = ioutVal * rippleI;
    const L2 = (voutVal * (1 - D)) / (fVal * deltaIL2);

    // Coupling capacitor Cc
    const Cc = (ioutVal * D) / (fVal * rippleV * voutVal);

    // Output capacitor Co
    const Co = (ioutVal * D) / (fVal * rippleV * voutVal);

    // Switch stress
    const vSwitch = vinVal + voutVal + vdVal;
    const iSwitchPeak = iin + ioutVal + deltaIL1 / 2;

    // Diode stress
    const vDiode = vinVal + voutVal;

    const results = [
      '=== Zeta Converter Parameters ===',
      '',
      `Input Voltage: ${vinVal} V`,
      `Output Voltage: ${voutVal} V`,
      `Output Current: ${ioutVal} A`,
      `Switching Frequency: ${fVal / 1000} kHz`,
      '',
      '--- Calculated Values ---',
      `Duty Cycle (D): ${(D * 100).toFixed(2)}%`,
      `Input Current (avg): ${iin.toFixed(3)} A`,
      '',
      '--- Inductor Values ---',
      `L1 (input): ${(L1 * 1e6).toFixed(2)} µH`,
      `L2 (output): ${(L2 * 1e6).toFixed(2)} µH`,
      `ΔI_L1: ${deltaIL1.toFixed(3)} A`,
      `ΔI_L2: ${deltaIL2.toFixed(3)} A`,
      '',
      '--- Capacitor Values ---',
      `Coupling Capacitor (Cc): ${(Cc * 1e6).toFixed(2)} µF`,
      `Output Capacitor (Co): ${(Co * 1e6).toFixed(2)} µF`,
      '',
      '--- Component Stress ---',
      `Switch Voltage Stress: ${vSwitch.toFixed(2)} V`,
      `Switch Peak Current: ${iSwitchPeak.toFixed(3)} A`,
      `Diode Reverse Voltage: ${vDiode.toFixed(2)} V`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
            <input type="number" value={vin} onChange={(e) => setVin(e.target.value)} className="input-field" aria-label={`Input voltage for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
            <input type="number" value={vout} onChange={(e) => setVout(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Current (A)</label>
            <input type="number" value={iout} onChange={(e) => setIout(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (kHz)</label>
            <input type="number" value={freq} onChange={(e) => setFreq(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ripple Current (%)</label>
            <input type="number" value={rippleCurrent} onChange={(e) => setRippleCurrent(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ripple Voltage (%)</label>
            <input type="number" value={rippleVoltage} onChange={(e) => setRippleVoltage(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diode Forward Voltage (V)</label>
            <input type="number" value={vd} onChange={(e) => setVd(e.target.value)} className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zeta Converter Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
