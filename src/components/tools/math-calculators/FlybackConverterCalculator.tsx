'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FlybackConverterCalculator - Calculate flyback converter turns ratio,
 * primary inductance, duty cycle, and component stress values.
 */
export default function FlybackConverterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('325');
  const [outputVoltage, setOutputVoltage] = useState('12');
  const [outputCurrent, setOutputCurrent] = useState('2');
  const [switchingFreq, setSwitchingFreq] = useState('65000');
  const [maxDuty, setMaxDuty] = useState('45');
  const [efficiency, setEfficiency] = useState('85');
  const [diodeForward, setDiodeForward] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vin = parseFloat(inputVoltage);
    const vout = parseFloat(outputVoltage);
    const iout = parseFloat(outputCurrent);
    const fs = parseFloat(switchingFreq);
    const dMax = parseFloat(maxDuty) / 100;
    const eff = parseFloat(efficiency) / 100;
    const vd = parseFloat(diodeForward);

    if (!vin || !vout || !iout || !fs || !dMax || !eff) {
      setOutput('Error: Please fill in all fields with valid numbers.');
      return;
    }

    const pout = vout * iout;
    const pin = pout / eff;
    const turnsRatio = (vin * dMax) / ((vout + vd) * (1 - dMax));
    const primaryInductance = (vin * dMax) * (vin * dMax) / (2 * pin * fs);
    const peakPrimaryCurrent = (2 * pin) / (vin * dMax);
    const peakSecondaryCurrent = peakPrimaryCurrent * turnsRatio;
    const switchVoltageStress = vin + ((vout + vd) * turnsRatio);
    const diodeVoltageStress = vout + (vin / turnsRatio);
    const outputCapRipple = iout / (fs * 0.05);

    const results = [
      `=== Flyback Converter Results ===`,
      ``,
      `Output Power: ${pout.toFixed(2)} W`,
      `Input Power: ${pin.toFixed(2)} W`,
      ``,
      `=== Transformer ===`,
      `Turns Ratio (Np/Ns): ${turnsRatio.toFixed(3)}`,
      `Primary Inductance: ${(primaryInductance * 1e6).toFixed(2)} µH`,
      `Peak Primary Current: ${peakPrimaryCurrent.toFixed(3)} A`,
      `Peak Secondary Current: ${peakSecondaryCurrent.toFixed(3)} A`,
      ``,
      `=== Component Stress ===`,
      `Switch Voltage Stress: ${switchVoltageStress.toFixed(1)} V`,
      `Diode Reverse Voltage: ${diodeVoltageStress.toFixed(1)} V`,
      ``,
      `=== Capacitor ===`,
      `Min Output Capacitance (5% ripple): ${(outputCapRipple * 1e6).toFixed(1)} µF`,
      ``,
      `Duty Cycle (max): ${(dMax * 100).toFixed(1)}%`,
      `Efficiency (assumed): ${(eff * 100).toFixed(1)}%`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V DC)</label>
              <input id={`${toolId}-vin`} type="number" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} className="input-field" aria-label={`Input voltage for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} className="input-field" aria-label="Output voltage" />
            </div>
            <div>
              <label htmlFor={`${toolId}-iout`} className="block text-sm font-medium text-gray-700 mb-1">Output Current (A)</label>
              <input id={`${toolId}-iout`} type="number" value={outputCurrent} onChange={(e) => setOutputCurrent(e.target.value)} className="input-field" aria-label="Output current" />
            </div>
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (Hz)</label>
              <input id={`${toolId}-freq`} type="number" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} className="input-field" aria-label="Switching frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-duty`} className="block text-sm font-medium text-gray-700 mb-1">Max Duty Cycle (%)</label>
              <input id={`${toolId}-duty`} type="number" value={maxDuty} onChange={(e) => setMaxDuty(e.target.value)} className="input-field" aria-label="Maximum duty cycle" />
            </div>
            <div>
              <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">Efficiency (%)</label>
              <input id={`${toolId}-eff`} type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="input-field" aria-label="Estimated efficiency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vd`} className="block text-sm font-medium text-gray-700 mb-1">Diode Forward Voltage (V)</label>
              <input id={`${toolId}-vd`} type="number" value={diodeForward} onChange={(e) => setDiodeForward(e.target.value)} className="input-field" aria-label="Diode forward voltage" />
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
