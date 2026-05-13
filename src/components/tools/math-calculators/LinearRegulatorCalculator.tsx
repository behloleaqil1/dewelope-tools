'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LinearRegulatorCalculator - Calculate linear voltage regulator heat dissipation.
 * Computes power dissipation, junction temperature, and heatsink requirements.
 */
export default function LinearRegulatorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputVoltage, setInputVoltage] = useState('');
  const [outputVoltage, setOutputVoltage] = useState('');
  const [loadCurrent, setLoadCurrent] = useState('');
  const [thermalResJC, setThermalResJC] = useState('');
  const [thermalResCS, setThermalResCS] = useState('0.5');
  const [thermalResSA, setThermalResSA] = useState('');
  const [ambientTemp, setAmbientTemp] = useState('25');
  const [maxJunctionTemp, setMaxJunctionTemp] = useState('150');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vIn = parseFloat(inputVoltage);
    const vOut = parseFloat(outputVoltage);
    const iLoad = parseFloat(loadCurrent) / 1000; // mA to A
    const thetaJC = parseFloat(thermalResJC || '0');
    const thetaCS = parseFloat(thermalResCS || '0');
    const thetaSA = parseFloat(thermalResSA || '0');
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

    const vDrop = vIn - vOut;
    const powerDissipation = vDrop * iLoad;
    const efficiency = (vOut / vIn) * 100;

    let result = '=== Linear Regulator Heat Dissipation ===\n\n';
    result += `Input Voltage:           ${vIn.toFixed(2)} V\n`;
    result += `Output Voltage:          ${vOut.toFixed(2)} V\n`;
    result += `Voltage Drop:            ${vDrop.toFixed(2)} V\n`;
    result += `Load Current:            ${(iLoad * 1000).toFixed(1)} mA (${iLoad.toFixed(4)} A)\n\n`;
    result += `--- Power & Efficiency ---\n`;
    result += `Power Dissipation:       ${powerDissipation.toFixed(4)} W (${(powerDissipation * 1000).toFixed(2)} mW)\n`;
    result += `Output Power:            ${(vOut * iLoad).toFixed(4)} W\n`;
    result += `Input Power:             ${(vIn * iLoad).toFixed(4)} W\n`;
    result += `Efficiency:              ${efficiency.toFixed(1)}%\n`;
    result += `Wasted as Heat:          ${(100 - efficiency).toFixed(1)}%\n`;

    if (thetaJC > 0) {
      const thetaTotal = thetaJC + thetaCS + thetaSA;
      const tempRiseNoHeatsink = powerDissipation * thetaJC;
      const tempRiseWithHeatsink = powerDissipation * thetaTotal;
      const junctionTempNoHS = tAmb + tempRiseNoHeatsink;
      const junctionTempWithHS = tAmb + tempRiseWithHeatsink;
      const maxPowerNoHS = (tJMax - tAmb) / thetaJC;
      const maxPowerWithHS = thetaSA > 0 ? (tJMax - tAmb) / thetaTotal : 0;

      result += `\n--- Thermal Analysis (No Heatsink) ---\n`;
      result += `θ Junction-Case:         ${thetaJC.toFixed(1)} °C/W\n`;
      result += `Temp Rise (junction):    ${tempRiseNoHeatsink.toFixed(2)} °C\n`;
      result += `Junction Temperature:    ${junctionTempNoHS.toFixed(1)} °C\n`;
      result += `Max Power (no heatsink): ${maxPowerNoHS.toFixed(3)} W\n`;
      result += `Status:                  ${junctionTempNoHS < tJMax ? '✓ SAFE' : '✗ OVERHEATING - Heatsink needed'}\n`;

      if (thetaSA > 0) {
        result += `\n--- Thermal Analysis (With Heatsink) ---\n`;
        result += `θ Junction-Case:         ${thetaJC.toFixed(1)} °C/W\n`;
        result += `θ Case-Sink:             ${thetaCS.toFixed(1)} °C/W\n`;
        result += `θ Sink-Ambient:          ${thetaSA.toFixed(1)} °C/W\n`;
        result += `θ Total:                 ${thetaTotal.toFixed(1)} °C/W\n`;
        result += `Temp Rise (total):       ${tempRiseWithHeatsink.toFixed(2)} °C\n`;
        result += `Junction Temperature:    ${junctionTempWithHS.toFixed(1)} °C\n`;
        result += `Max Power (with sink):   ${maxPowerWithHS.toFixed(3)} W\n`;
        result += `Status:                  ${junctionTempWithHS < tJMax ? '✓ SAFE' : '✗ EXCEEDS MAX - Larger heatsink needed'}\n`;
      }

      // Required heatsink calculation
      if (junctionTempNoHS >= tJMax) {
        const requiredThetaSA = ((tJMax - tAmb) / powerDissipation) - thetaJC - thetaCS;
        result += `\n--- Required Heatsink ---\n`;
        result += `Max θ Sink-Ambient:      ${requiredThetaSA > 0 ? requiredThetaSA.toFixed(1) : 'N/A'} °C/W\n`;
        if (requiredThetaSA <= 0) {
          result += `⚠ Power too high even with perfect heatsink. Reduce current or voltage drop.\n`;
        }
      }
    }

    result += `\n--- Recommendations ---\n`;
    if (efficiency < 40) {
      result += `• Very low efficiency (${efficiency.toFixed(0)}%) - strongly consider a switching regulator\n`;
    } else if (efficiency < 60) {
      result += `• Low efficiency - switching regulator recommended for battery applications\n`;
    } else {
      result += `• Acceptable efficiency for a linear regulator\n`;
    }
    if (powerDissipation > 1) {
      result += `• High power dissipation (${powerDissipation.toFixed(2)}W) - heatsink required\n`;
    } else if (powerDissipation > 0.5) {
      result += `• Moderate power dissipation - consider thermal pad or small heatsink\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-vin`} className="block text-sm font-medium text-gray-700 mb-1">Input Voltage (V)</label>
              <input id={`${toolId}-vin`} type="number" step="0.1" value={inputVoltage} onChange={(e) => setInputVoltage(e.target.value)} placeholder="12" className="input-field" aria-label={`Input voltage for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-vout`} className="block text-sm font-medium text-gray-700 mb-1">Output Voltage (V)</label>
              <input id={`${toolId}-vout`} type="number" step="0.1" value={outputVoltage} onChange={(e) => setOutputVoltage(e.target.value)} placeholder="5" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-iload`} className="block text-sm font-medium text-gray-700 mb-1">Load Current (mA)</label>
              <input id={`${toolId}-iload`} type="number" step="1" value={loadCurrent} onChange={(e) => setLoadCurrent(e.target.value)} placeholder="500" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-tjc`} className="block text-sm font-medium text-gray-700 mb-1">θ Junction-Case (°C/W)</label>
              <input id={`${toolId}-tjc`} type="number" step="0.1" value={thermalResJC} onChange={(e) => setThermalResJC(e.target.value)} placeholder="5 (from datasheet)" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tcs`} className="block text-sm font-medium text-gray-700 mb-1">θ Case-Sink (°C/W)</label>
              <input id={`${toolId}-tcs`} type="number" step="0.1" value={thermalResCS} onChange={(e) => setThermalResCS(e.target.value)} placeholder="0.5" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-tsa`} className="block text-sm font-medium text-gray-700 mb-1">θ Sink-Ambient (°C/W)</label>
              <input id={`${toolId}-tsa`} type="number" step="0.1" value={thermalResSA} onChange={(e) => setThermalResSA(e.target.value)} placeholder="10 (heatsink)" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tamb`} className="block text-sm font-medium text-gray-700 mb-1">Ambient Temp (°C)</label>
              <input id={`${toolId}-tamb`} type="number" value={ambientTemp} onChange={(e) => setAmbientTemp(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tjmax`} className="block text-sm font-medium text-gray-700 mb-1">Max Tj (°C)</label>
              <input id={`${toolId}-tjmax`} type="number" value={maxJunctionTemp} onChange={(e) => setMaxJunctionTemp(e.target.value)} className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Heat Dissipation</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Linear Regulator Thermal Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
