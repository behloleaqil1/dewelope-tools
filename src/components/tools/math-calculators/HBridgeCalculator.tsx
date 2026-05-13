'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HBridgeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [supplyVoltage, setSupplyVoltage] = useState('12');
  const [motorCurrent, setMotorCurrent] = useState('2');
  const [motorResistance, setMotorResistance] = useState('3');
  const [pwmFrequency, setPwmFrequency] = useState('20000');
  const [dutyCycle, setDutyCycle] = useState('75');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vs = parseFloat(supplyVoltage);
    const im = parseFloat(motorCurrent);
    const rm = parseFloat(motorResistance);
    const freq = parseFloat(pwmFrequency);
    const duty = parseFloat(dutyCycle) / 100;

    if (isNaN(vs) || isNaN(im) || isNaN(rm) || isNaN(freq) || isNaN(duty)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const avgVoltage = vs * duty;
    const backEmf = avgVoltage - (im * rm);
    const powerDissipation = im * im * rm;
    const mosfetRdsOn = 0.05;
    const mosfetLoss = 2 * im * im * mosfetRdsOn;
    const totalPower = vs * im * duty;
    const efficiency = ((totalPower - mosfetLoss - powerDissipation) / totalPower * 100);
    const period = 1 / freq * 1000000;

    const results = [
      `=== H-Bridge Motor Driver Parameters ===`,
      ``,
      `Supply Voltage: ${vs} V`,
      `Motor Current: ${im} A`,
      `Motor Resistance: ${rm} Ω`,
      `PWM Frequency: ${freq} Hz`,
      `Duty Cycle: ${(duty * 100).toFixed(1)}%`,
      ``,
      `--- Calculated Values ---`,
      `Average Motor Voltage: ${avgVoltage.toFixed(2)} V`,
      `Back-EMF (estimated): ${backEmf.toFixed(2)} V`,
      `Motor Power Dissipation: ${powerDissipation.toFixed(2)} W`,
      `MOSFET Losses (Rds=50mΩ × 2): ${mosfetLoss.toFixed(3)} W`,
      `Total Input Power: ${totalPower.toFixed(2)} W`,
      `Estimated Efficiency: ${efficiency.toFixed(1)}%`,
      `PWM Period: ${period.toFixed(2)} µs`,
      ``,
      `--- Recommendations ---`,
      `Min MOSFET Vds Rating: ${(vs * 1.5).toFixed(0)} V`,
      `Min MOSFET Id Rating: ${(im * 2).toFixed(1)} A`,
      `Bootstrap Cap (typical): 100 nF - 1 µF`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage (V)</label>
            <input type="number" value={supplyVoltage} onChange={(e) => setSupplyVoltage(e.target.value)} className="input-field" aria-label={`Supply voltage for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motor Current (A)</label>
            <input type="number" value={motorCurrent} onChange={(e) => setMotorCurrent(e.target.value)} className="input-field" aria-label="Motor current" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motor Resistance (Ω)</label>
            <input type="number" value={motorResistance} onChange={(e) => setMotorResistance(e.target.value)} className="input-field" aria-label="Motor resistance" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PWM Frequency (Hz)</label>
            <input type="number" value={pwmFrequency} onChange={(e) => setPwmFrequency(e.target.value)} className="input-field" aria-label="PWM frequency" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duty Cycle (%)</label>
          <input type="number" value={dutyCycle} onChange={(e) => setDutyCycle(e.target.value)} min="0" max="100" className="input-field" aria-label="Duty cycle" />
        </div>

        <button onClick={calculate} className="btn-primary">Calculate Parameters</button>
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
