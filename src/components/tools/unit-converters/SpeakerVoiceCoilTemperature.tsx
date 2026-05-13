'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerVoiceCoilTemperature - Calculate voice coil temperature rise.
 */
export default function SpeakerVoiceCoilTemperature({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [power, setPower] = useState('50');
  const [dcResistance, setDcResistance] = useState('6');
  const [thermalResistance, setThermalResistance] = useState('4');
  const [ambientTemp, setAmbientTemp] = useState('25');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const p = parseFloat(power);
    const re = parseFloat(dcResistance);
    const rth = parseFloat(thermalResistance);
    const ta = parseFloat(ambientTemp);

    if (isNaN(p) || isNaN(re) || isNaN(rth) || isNaN(ta) || p < 0 || re <= 0 || rth <= 0) {
      setOutput('Please enter valid positive numbers. Resistance values must be greater than 0.');
      return;
    }

    const tempRise = p * rth;
    const voiceCoilTemp = ta + tempRise;
    const hotResistance = re * (1 + 0.00393 * (voiceCoilTemp - 25));
    const powerDerating = voiceCoilTemp > 180 ? Math.max(0, (250 - voiceCoilTemp) / (250 - 180) * 100) : 100;

    const lines: string[] = [
      `=== Voice Coil Temperature Calculator ===`,
      ``,
      `Input Parameters:`,
      `  Input Power: ${p} W`,
      `  DC Resistance (Re): ${re} Ω`,
      `  Thermal Resistance (Rth): ${rth} °C/W`,
      `  Ambient Temperature: ${ta} °C`,
      ``,
      `Results:`,
      `  Temperature Rise: ${tempRise.toFixed(1)} °C`,
      `  Voice Coil Temperature: ${voiceCoilTemp.toFixed(1)} °C`,
      `  Hot Resistance: ${hotResistance.toFixed(2)} Ω`,
      `  Resistance Increase: ${((hotResistance - re) / re * 100).toFixed(1)}%`,
      ``,
      `Safety Assessment:`,
      voiceCoilTemp < 150 ? `  ✅ Safe operating temperature` :
      voiceCoilTemp < 200 ? `  ⚠️ Elevated temperature — monitor closely` :
      `  🔴 DANGER — risk of voice coil damage!`,
      `  Power handling at this temp: ${powerDerating.toFixed(0)}%`,
      ``,
      `Notes:`,
      `  • Copper TCR: 0.00393/°C`,
      `  • Typical max voice coil temp: 180-250°C`,
      `  • Higher temp = higher resistance = power compression`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Input Power (W)</label>
            <input id={`${toolId}-power`} type="number" value={power} onChange={(e) => setPower(e.target.value)} aria-label={`Input power for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-re`} className="block text-sm font-medium text-gray-700 mb-1">DC Resistance Re (Ω)</label>
            <input id={`${toolId}-re`} type="number" value={dcResistance} onChange={(e) => setDcResistance(e.target.value)} aria-label="DC resistance" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rth`} className="block text-sm font-medium text-gray-700 mb-1">Thermal Resistance (°C/W)</label>
            <input id={`${toolId}-rth`} type="number" value={thermalResistance} onChange={(e) => setThermalResistance(e.target.value)} aria-label="Thermal resistance" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ambient`} className="block text-sm font-medium text-gray-700 mb-1">Ambient Temperature (°C)</label>
            <input id={`${toolId}-ambient`} type="number" value={ambientTemp} onChange={(e) => setAmbientTemp(e.target.value)} aria-label="Ambient temperature" className="input-field" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Temperature</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Voice Coil Temperature Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
