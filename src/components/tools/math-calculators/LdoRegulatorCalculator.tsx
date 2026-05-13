'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LdoRegulatorCalculator - Calculate LDO voltage regulator parameters.
 * Computes dropout voltage, power dissipation, efficiency, and thermal considerations.
 */
export default function LdoRegulatorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('');
  const [outputVoltage, setOutputVoltage] = useState('');
  const [loadCurrent, setLoadCurrent] = useState('');
  const [quiescentCurrent, setQuiescentCurrent] = useState('');
  const [thermalResistance, setThermalResistance] = useState('');
  const [ambientTemp, setAmbientTemp] = useState('25');
  const [maxJunctionTemp, setMaxJunctionTemp] = useState('125');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vIn = parseFloat(inputVoltage);
    const vOut = parseFloat(outputVoltage);
    const iLoad = parseFloat(loadCurrent) / 1000; // mA to A
    const iQ = parseFloat(quiescentCurrent || '0') / 1000000; // µA to A
    const thetaJA = parseFloat(thermalResistance || '0');
    const tAmb = parseFloat(ambientTemp);
    const tJMax = parseFloat(maxJunctionTemp);

    if (isNaN(vIn) || isNaN(vOut) || isNaN(iLoad)) {
      setOutput('Please enter valid input voltage, output voltage, and load current.');
      return;
    }

    if (vIn <= vOut) {
      setOutput('Input voltage must be greater than output voltage.');
      return;
    }

    const dropout = vIn - vOut;
    const powerDissipation = dropout * iLoad;
    const efficiency = (vOut * iLoad) / (vIn * (iLoad + iQ)) * 100;
    const totalInputCurrent = iLoad + iQ;
    const inputPower = vIn * totalInputCurrent;
    const outputPower = vOut * iLoad;

    let result = '=== LDO Regulator Calculations ===\n\n';
    result += `Input Voltage (Vin):     ${vIn.toFixed(3)} V\n`;
    result += `Output Voltage (Vout):   ${vOut.toFixed(3)} V\n`;
    result += `Load Current (Iload):    ${(iLoad * 1000).toFixed(2)} mA\n\n`;
    result += `--- Key Parameters ---\n`;
    result += `Dropout Voltage:         ${dropout.toFixed(3)} V\n`;
    result += `Power Dissipation:       ${(powerDissipation * 1000).toFixed(2)} mW\n`;
    result += `Efficiency:              ${efficiency.toFixed(2)}%\n`;
    result += `Input Power:             ${(inputPower * 1000).toFixed(2)} mW\n`;
    result += `Output Power:            ${(outputPower * 1000).toFixed(2)} mW\n`;
    result += `Heat Generated:          ${(powerDissipation * 1000).toFixed(2)} mW\n`;

    if (thetaJA > 0) {
      const tempRise = powerDissipation * thetaJA;
      const junctionTemp = tAmb + tempRise;
      const maxPower = (tJMax - tAmb) / thetaJA;

      result += `\n--- Thermal Analysis ---\n`;
      result += `Thermal Resistance:      ${thetaJA.toFixed(1)} °C/W\n`;
      result += `Temperature Rise:        ${tempRise.toFixed(2)} °C\n`;
      result += `Junction Temperature:    ${junctionTemp.toFixed(1)} °C\n`;
      result += `Max Junction Temp:       ${tJMax} °C\n`;
      result += `Max Power Dissipation:   ${(maxPower * 1000).toFixed(1)} mW\n`;
      result += `Thermal Status:          ${junctionTemp < tJMax ? '✓ SAFE' : '✗ EXCEEDS MAX TEMP'}\n`;
    }

    result += `\n--- Recommendations ---\n`;
    if (dropout < 0.3) {
      result += `• Low dropout - suitable for most LDOs\n`;
    } else if (dropout < 1.0) {
      result += `• Moderate dropout - check LDO minimum dropout spec\n`;
    } else {
      result += `• High dropout - consider a switching regulator for better efficiency\n`;
    }
    if (efficiency < 50) {
      result += `• Low efficiency (${efficiency.toFixed(0)}%) - switching regulator recommended\n`;
    } else if (efficiency < 80) {
      result += `• Moderate efficiency - acceptable for low-power applications\n`;
    } else {
      result += `• Good efficiency for an LDO application\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
              <input id={`${toolId}-vin`} type="number" step="0.1" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} placeholder="5.0" className="input-field" aria-label={`Input voltage for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" step="0.1" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} placeholder="3.3" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-iload`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (mA)</label>
              <input id={`${toolId}-iload`} type="number" step="1" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} placeholder="500" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-iq`} className="block text-sm font-medium text-gray-700 mb-1">Quiescent Current (µA)</label>
              <input id={`${toolId}-iq`} type="number" step="1" value={quiescentCurrent} onChange={(e) => setQuiescentCurrent(e.target.value)} placeholder="50" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-theta`} className="block text-sm font-medium text-gray-700 mb-1">θJA (°C/W)</label>
              <input id={`${toolId}-theta`} type="number" step="1" value={thermalResistance} onChange={(e) => setThermalResistance(e.target.value)} placeholder="150" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tamb`} className="block text-sm font-medium text-gray-700 mb-1">Ambient (°C)</label>
              <input id={`${toolId}-tamb`} type="number" value={ambientTemp} onChange={(e) => setAmbientTemp(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tjmax`} className="block text-sm font-medium text-gray-700 mb-1">Max Tj (°C)</label>
              <input id={`${toolId}-tjmax`} type="number" value={maxJunctionTemp} onChange={(e) => setMaxJunctionTemp(e.target.value)} className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">LDO Regulator Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
