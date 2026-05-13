'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChargePumpCalculator - Calculate charge pump voltage multiplier output.
 * Computes output voltage, ripple, and efficiency for various multiplier stages.
 */
export default function ChargePumpCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [vin, setVin] = useState('5');
  const [stages, setStages] = useState('2');
  const [freq, setFreq] = useState('100');
  const [capValue, setCapValue] = useState('10');
  const [loadCurrent, setLoadCurrent] = useState('50');
  const [vdDrop, setVdDrop] = useState('0.3');
  const [topology, setTopology] = useState('dickson');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vinVal = parseFloat(vin);
    const n = parseInt(stages);
    const fVal = parseFloat(freq) * 1000; // kHz to Hz
    const C = parseFloat(capValue) * 1e-6; // µF to F
    const iLoad = parseFloat(loadCurrent) * 1e-3; // mA to A
    const vd = parseFloat(vdDrop);

    if (isNaN(vinVal) || isNaN(n) || isNaN(fVal) || isNaN(C) || isNaN(iLoad) || vinVal <= 0 || n < 1 || fVal <= 0 || C <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    // Ideal output voltage
    const voutIdeal = vinVal * (n + 1);

    // Voltage drop per stage due to diode
    const vDiodeLoss = vd * (n + 1);

    // Voltage drop due to load (Dickson model)
    const vLoadDrop = (iLoad * n) / (fVal * C);

    // Ripple voltage
    const vRipple = iLoad / (fVal * C);

    // Actual output voltage
    const voutActual = voutIdeal - vDiodeLoss - vLoadDrop;

    // Efficiency estimate
    const pOut = voutActual * iLoad;
    const pIn = vinVal * iLoad * (n + 1); // simplified
    const efficiency = (pOut / pIn) * 100;

    // Output impedance
    const rOut = n / (fVal * C);

    const results = [
      '=== Charge Pump Calculator ===',
      '',
      `Topology: ${topology === 'dickson' ? 'Dickson' : 'Cockcroft-Walton'} Multiplier`,
      `Input Voltage: ${vinVal} V`,
      `Number of Stages: ${n}`,
      `Switching Frequency: ${fVal / 1000} kHz`,
      `Capacitor Value: ${capValue} µF`,
      `Load Current: ${loadCurrent} mA`,
      `Diode Drop: ${vd} V`,
      '',
      '--- Output ---',
      `Ideal Output Voltage: ${voutIdeal.toFixed(2)} V`,
      `Diode Voltage Loss: ${vDiodeLoss.toFixed(2)} V`,
      `Load-Dependent Drop: ${vLoadDrop.toFixed(3)} V`,
      `Actual Output Voltage: ${voutActual.toFixed(2)} V`,
      '',
      '--- Performance ---',
      `Output Ripple: ${(vRipple * 1000).toFixed(2)} mV`,
      `Output Impedance: ${rOut.toFixed(2)} Ω`,
      `Estimated Efficiency: ${efficiency.toFixed(1)}%`,
      '',
      '--- Design Notes ---',
      `Multiplication Factor: ${n + 1}x`,
      `Min Cap for <1% ripple: ${((iLoad * 100) / (fVal)).toFixed(2)} µF`,
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stages</label>
            <input type="number" value={stages} onChange={(e) => setStages(e.target.value)} min="1" max="10" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (kHz)</label>
            <input type="number" value={freq} onChange={(e) => setFreq(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacitor Value (µF)</label>
            <input type="number" value={capValue} onChange={(e) => setCapValue(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Load Current (mA)</label>
            <input type="number" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diode Forward Drop (V)</label>
            <input type="number" value={vdDrop} onChange={(e) => setVdDrop(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topology</label>
            <select value={topology} onChange={(e) => setTopology(e.target.value)} className="input-field">
              <option value="dickson">Dickson</option>
              <option value="cockcroft">Cockcroft-Walton</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Charge Pump Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
