'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BuckConverterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('24');
  const [outputVoltage, setOutputVoltage] = useState('5');
  const [loadCurrent, setLoadCurrent] = useState('2');
  const [switchingFreq, setSwitchingFreq] = useState('500');
  const [ripplePercent, setRipplePercent] = useState('30');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vin = parseFloat(inputVoltage);
    const vout = parseFloat(outputVoltage);
    const iout = parseFloat(loadCurrent);
    const fsw = parseFloat(switchingFreq) * 1000;
    const ripple = parseFloat(ripplePercent) / 100;

    if (isNaN(vin) || isNaN(vout) || isNaN(iout) || isNaN(fsw) || isNaN(ripple)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    if (vout >= vin) {
      setOutput('Output voltage must be less than input voltage for a buck converter.');
      return;
    }

    const dutyCycle = vout / vin;
    const period = 1 / fsw;
    const deltaIL = ripple * iout;
    const inductance = (vout * (1 - dutyCycle)) / (fsw * deltaIL);
    const inductanceUH = inductance * 1e6;
    const ilPeak = iout + deltaIL / 2;
    const ilMin = iout - deltaIL / 2;
    const _outputRippleVoltage = deltaIL / (8 * fsw * 100e-6);
    const minCapacitance = deltaIL / (8 * fsw * 0.05);
    const minCapUF = minCapacitance * 1e6;
    const inputPower = vin * iout * dutyCycle * 1.1;
    const efficiency = (vout * iout) / inputPower * 100;

    const results = [
      `=== Buck Converter Parameters ===`,
      ``,
      `Input: ${vin} V → Output: ${vout} V @ ${iout} A`,
      `Switching Frequency: ${(fsw / 1000).toFixed(0)} kHz`,
      ``,
      `--- Calculated Values ---`,
      `Duty Cycle: ${(dutyCycle * 100).toFixed(2)}%`,
      `Period: ${(period * 1e6).toFixed(2)} µs`,
      `On-Time: ${(dutyCycle * period * 1e6).toFixed(2)} µs`,
      `Off-Time: ${((1 - dutyCycle) * period * 1e6).toFixed(2)} µs`,
      ``,
      `--- Inductor ---`,
      `Min Inductance: ${inductanceUH.toFixed(2)} µH`,
      `Recommended: ${(inductanceUH * 1.5).toFixed(0)} µH`,
      `Ripple Current (ΔIL): ${deltaIL.toFixed(3)} A`,
      `Peak Inductor Current: ${ilPeak.toFixed(3)} A`,
      `Min Inductor Current: ${ilMin.toFixed(3)} A`,
      `Saturation Rating: ≥ ${(ilPeak * 1.2).toFixed(2)} A`,
      ``,
      `--- Output Capacitor ---`,
      `Min Capacitance (50mV ripple): ${minCapUF.toFixed(1)} µF`,
      `Recommended: ${(minCapUF * 2).toFixed(0)} µF`,
      ``,
      `--- Efficiency Estimate ---`,
      `Estimated Efficiency: ~${efficiency.toFixed(1)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
            <input type="number" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} className="input-field" aria-label={`Input voltage for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
            <input type="number" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} className="input-field" aria-label="Output voltage" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Load Current (A)</label>
            <input type="number" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} className="input-field" aria-label="Load current" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Switching Freq (kHz)</label>
            <input type="number" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} className="input-field" aria-label="Switching frequency" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Inductor Ripple Current (%)</label>
          <input type="number" value={ripplePercent} onChange={(e) => setRipplePercent(e.target.value)} min="10" max="80" className="input-field" aria-label="Ripple current percentage" />
        </div>

        <button onClick={calculate} className="btn-primary">Calculate</button>
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
