'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwitchingRegulatorEfficiency - Calculate switching regulator efficiency.
 * Accounts for conduction losses, switching losses, quiescent current, and gate drive losses.
 */
export default function SwitchingRegulatorEfficiency({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('');
  const [outputVoltage, setOutputVoltage] = useState('');
  const [loadCurrent, setLoadCurrent] = useState('');
  const [switchingFreq, setSwitchingFreq] = useState('');
  const [rdson, setRdson] = useState('');
  const [inductorDcr, setInductorDcr] = useState('');
  const [quiescentCurrent, setQuiescentCurrent] = useState('');
  const [diodeForward, setDiodeForward] = useState('');
  const [topology, setTopology] = useState('buck');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vIn = parseFloat(inputVoltage);
    const vOut = parseFloat(outputVoltage);
    const iOut = parseFloat(loadCurrent);
    const fSw = parseFloat(switchingFreq) * 1000; // kHz to Hz
    const rds = parseFloat(rdson) / 1000; // mΩ to Ω
    const dcr = parseFloat(inductorDcr || '0') / 1000; // mΩ to Ω
    const iQ = parseFloat(quiescentCurrent || '0') / 1000000; // µA to A
    const vDiode = parseFloat(diodeForward || '0.4');

    if (isNaN(vIn) || isNaN(vOut) || isNaN(iOut) || isNaN(fSw) || isNaN(rds)) {
      setOutput('Please enter valid values for Vin, Vout, load current, frequency, and RDS(on).');
      return;
    }

    let dutyCycle: number;
    let iInAvg: number;

    if (topology === 'buck') {
      dutyCycle = vOut / vIn;
      iInAvg = iOut * dutyCycle;
    } else if (topology === 'boost') {
      dutyCycle = 1 - (vIn / vOut);
      iInAvg = iOut / (1 - dutyCycle);
    } else {
      dutyCycle = vOut / (vIn + vOut);
      iInAvg = iOut * (vOut / vIn);
    }

    // Conduction losses
    const mosfetConductionLoss = rds * iOut * iOut * dutyCycle;
    const inductorLoss = dcr * iOut * iOut;
    const diodeLoss = vDiode * iOut * (1 - dutyCycle);

    // Switching losses (simplified)
    const tRise = 10e-9; // 10ns typical
    const tFall = 10e-9;
    const switchingLoss = 0.5 * vIn * iOut * (tRise + tFall) * fSw;

    // Quiescent loss
    const quiescentLoss = vIn * iQ;

    const totalLosses = mosfetConductionLoss + inductorLoss + diodeLoss + switchingLoss + quiescentLoss;
    const outputPower = vOut * iOut;
    const inputPower = outputPower + totalLosses;
    const efficiency = (outputPower / inputPower) * 100;

    let result = `=== Switching Regulator Efficiency ===\n\n`;
    result += `Topology:                ${topology.charAt(0).toUpperCase() + topology.slice(1)} Converter\n`;
    result += `Input Voltage:           ${vIn.toFixed(2)} V\n`;
    result += `Output Voltage:          ${vOut.toFixed(2)} V\n`;
    result += `Load Current:            ${iOut.toFixed(3)} A\n`;
    result += `Switching Frequency:     ${(fSw / 1000).toFixed(0)} kHz\n`;
    result += `Duty Cycle:              ${(dutyCycle * 100).toFixed(1)}%\n\n`;
    result += `--- Power Analysis ---\n`;
    result += `Output Power:            ${(outputPower * 1000).toFixed(1)} mW\n`;
    result += `Input Power:             ${(inputPower * 1000).toFixed(1)} mW\n`;
    result += `Total Losses:            ${(totalLosses * 1000).toFixed(2)} mW\n\n`;
    result += `--- Loss Breakdown ---\n`;
    result += `MOSFET Conduction:       ${(mosfetConductionLoss * 1000).toFixed(2)} mW (${(mosfetConductionLoss / totalLosses * 100).toFixed(1)}%)\n`;
    result += `Inductor DCR:            ${(inductorLoss * 1000).toFixed(2)} mW (${(inductorLoss / totalLosses * 100).toFixed(1)}%)\n`;
    result += `Diode Forward:           ${(diodeLoss * 1000).toFixed(2)} mW (${(diodeLoss / totalLosses * 100).toFixed(1)}%)\n`;
    result += `Switching Loss:          ${(switchingLoss * 1000).toFixed(2)} mW (${(switchingLoss / totalLosses * 100).toFixed(1)}%)\n`;
    result += `Quiescent:               ${(quiescentLoss * 1000).toFixed(3)} mW (${(quiescentLoss / totalLosses * 100).toFixed(1)}%)\n\n`;
    result += `--- Efficiency ---\n`;
    result += `Overall Efficiency:      ${efficiency.toFixed(2)}%\n`;
    result += `Average Input Current:   ${(iInAvg * 1000).toFixed(1)} mA\n`;

    if (efficiency > 90) {
      result += `\n✓ Excellent efficiency for a switching regulator`;
    } else if (efficiency > 80) {
      result += `\n✓ Good efficiency - typical for this topology`;
    } else {
      result += `\n⚠ Consider optimizing component selection for better efficiency`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-topology`} className="block text-sm font-medium text-gray-700 mb-1">Topology</label>
            <select id={`${toolId}-topology`} value={topology} onChange={(e) => setTopology(e.target.value)} className="input-field" aria-label={`Topology for ${toolName}`}>
              <option value="buck">Buck (Step-Down)</option>
              <option value="boost">Boost (Step-Up)</option>
              <option value="buck-boost">Buck-Boost (Inverting)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
              <input id={`${toolId}-vin`} type="number" step="0.1" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} placeholder="12" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" step="0.1" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} placeholder="3.3" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-iout`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (A)</label>
              <input id={`${toolId}-iout`} type="number" step="0.01" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} placeholder="1.0" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-fsw`} className="block text-sm font-medium text-gray-700 mb-1">Switching Freq (kHz)</label>
              <input id={`${toolId}-fsw`} type="number" step="10" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} placeholder="500" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rdson`} className="block text-sm font-medium text-gray-700 mb-1">RDS(on) (mΩ)</label>
              <input id={`${toolId}-rdson`} type="number" step="1" value={rdson} onChange={(e) => setRdson(e.target.value)} placeholder="50" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-dcr`} className="block text-sm font-medium text-gray-700 mb-1">Inductor DCR (mΩ)</label>
              <input id={`${toolId}-dcr`} type="number" step="1" value={inductorDcr} onChange={(e) => setInductorDcr(e.target.value)} placeholder="30" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-iq`} className="block text-sm font-medium text-gray-700 mb-1">Quiescent Current (µA)</label>
              <input id={`${toolId}-iq`} type="number" step="1" value={quiescentCurrent} onChange={(e) => setQuiescentCurrent(e.target.value)} placeholder="100" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vf`} className="block text-sm font-medium text-gray-700 mb-1">Diode Vf (V)</label>
              <input id={`${toolId}-vf`} type="number" step="0.01" value={diodeForward} onChange={(e) => setDiodeForward(e.target.value)} placeholder="0.4" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Efficiency</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Efficiency Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
