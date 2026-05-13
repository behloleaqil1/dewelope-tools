'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BoostConverterCalculator - Calculate boost (step-up) converter duty cycle,
 * minimum inductance, output capacitance, and efficiency estimates.
 */
export default function BoostConverterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('12');
  const [outputVoltage, setOutputVoltage] = useState('24');
  const [loadCurrent, setLoadCurrent] = useState('1');
  const [switchingFreq, setSwitchingFreq] = useState('100000');
  const [ripplePercent, setRipplePercent] = useState('30');
  const [outputRipple, setOutputRipple] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vin = parseFloat(inputVoltage);
    const vout = parseFloat(outputVoltage);
    const iLoad = parseFloat(loadCurrent);
    const fs = parseFloat(switchingFreq);
    const ripple = parseFloat(ripplePercent) / 100;
    const vRipple = parseFloat(outputRipple) / 1000;

    if (!vin || !vout || !iLoad || !fs || vout <= vin) {
      setOutput('Error: Output voltage must be greater than input voltage. Check all values.');
      return;
    }

    const dutyCycle = 1 - (vin / vout);
    const inputCurrent = iLoad / (1 - dutyCycle);
    const deltaIL = ripple * inputCurrent;
    const inductance = (vin * dutyCycle) / (fs * deltaIL);
    const capacitance = (iLoad * dutyCycle) / (fs * vRipple);
    const peakCurrent = inputCurrent + (deltaIL / 2);
    const efficiency = (vout * iLoad) / (vin * inputCurrent) * 100;

    const results = [
      `=== Boost Converter Results ===`,
      ``,
      `Duty Cycle: ${(dutyCycle * 100).toFixed(2)}%`,
      `Input Current (avg): ${inputCurrent.toFixed(3)} A`,
      `Inductor Ripple Current (ΔIL): ${deltaIL.toFixed(3)} A`,
      `Peak Inductor Current: ${peakCurrent.toFixed(3)} A`,
      ``,
      `=== Component Values ===`,
      `Minimum Inductance: ${(inductance * 1e6).toFixed(2)} µH`,
      `Output Capacitance: ${(capacitance * 1e6).toFixed(2)} µF`,
      ``,
      `=== Ratings ===`,
      `Switch Voltage Rating: ≥ ${vout.toFixed(1)} V`,
      `Switch Current Rating: ≥ ${peakCurrent.toFixed(2)} A`,
      `Diode Voltage Rating: ≥ ${vout.toFixed(1)} V`,
      `Diode Current Rating: ≥ ${iLoad.toFixed(2)} A`,
      ``,
      `Ideal Efficiency: ${efficiency.toFixed(1)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
              <input id={`${toolId}-vin`} type="number" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} className="input-field" aria-label={`Input voltage for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} className="input-field" aria-label="Output voltage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-iload`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (A)</label>
              <input id={`${toolId}-iload`} type="number" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} className="input-field" aria-label="Load current" />
            </div>
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (Hz)</label>
              <input id={`${toolId}-freq`} type="number" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} className="input-field" aria-label="Switching frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-ripple`} className="block text-sm font-medium text-gray-700 mb-1">Inductor Ripple (%)</label>
              <input id={`${toolId}-ripple`} type="number" value={ripplePercent} onChange={(e) => setRipplePercent(e.target.value)} className="input-field" aria-label="Inductor ripple percentage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vripple`} className="block text-sm font-medium text-gray-700 mb-1">Output Ripple (mV)</label>
              <input id={`${toolId}-vripple`} type="number" value={outputRipple} onChange={(e) => setOutputRipple(e.target.value)} className="input-field" aria-label="Output voltage ripple" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
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
