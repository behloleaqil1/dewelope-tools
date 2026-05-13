'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerPowerHandlingCalculator - Calculate speaker thermal power handling.
 * Computes continuous, program, and peak power ratings based on voice coil parameters.
 */
export default function SpeakerPowerHandlingCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [impedance, setImpedance] = useState('8');
  const [voiceCoilDiameter, setVoiceCoilDiameter] = useState('50');
  const [xmax, setXmax] = useState('6');
  const [sensitivity, setSensitivity] = useState('88');
  const [ratedPower, setRatedPower] = useState('100');
  const [ambientTemp, setAmbientTemp] = useState('25');
  const [maxTemp, setMaxTemp] = useState('180');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const z = parseFloat(impedance);
    const vcDiam = parseFloat(voiceCoilDiameter);
    const xm = parseFloat(xmax);
    const sens = parseFloat(sensitivity);
    const pRated = parseFloat(ratedPower);
    const tAmb = parseFloat(ambientTemp);
    const tMax = parseFloat(maxTemp);

    if (isNaN(z) || isNaN(vcDiam) || isNaN(xm) || isNaN(sens) || isNaN(pRated) || isNaN(tAmb) || isNaN(tMax)) {
      setOutput('Error: All values must be valid numbers.');
      return;
    }

    // Thermal power handling estimation
    const thermalRise = tMax - tAmb;
    const surfaceArea = Math.PI * (vcDiam / 1000) * 0.02; // approximate coil surface area in m²
    const thermalResistance = thermalRise / pRated; // °C/W
    const continuousPower = thermalRise / thermalResistance;
    const programPower = continuousPower * 2;
    const peakPower = continuousPower * 4;

    // SPL at rated power
    const splAtRated = sens + 10 * Math.log10(pRated);
    const splAtContinuous = sens + 10 * Math.log10(continuousPower);
    const splAtPeak = sens + 10 * Math.log10(peakPower);

    // Voltage and current at rated power
    const voltage = Math.sqrt(pRated * z);
    const current = Math.sqrt(pRated / z);

    // Mechanical power limit (simplified)
    const mechPowerLimit = (xm / 1000) * (xm / 1000) * z * 1000; // rough estimate

    let results = `=== Speaker Thermal Power Handling ===\n\n`;
    results += `Input Parameters:\n`;
    results += `  Nominal Impedance: ${z} Ω\n`;
    results += `  Voice Coil Diameter: ${vcDiam} mm\n`;
    results += `  Xmax: ${xm} mm\n`;
    results += `  Sensitivity: ${sens} dB (1W/1m)\n`;
    results += `  Rated Power (AES): ${pRated} W\n`;
    results += `  Ambient Temperature: ${tAmb} °C\n`;
    results += `  Max Voice Coil Temperature: ${tMax} °C\n\n`;

    results += `Power Handling:\n`;
    results += `  Continuous (RMS): ${continuousPower.toFixed(1)} W\n`;
    results += `  Program (Music): ${programPower.toFixed(1)} W\n`;
    results += `  Peak (Instantaneous): ${peakPower.toFixed(1)} W\n\n`;

    results += `Thermal Analysis:\n`;
    results += `  Temperature Rise: ${thermalRise.toFixed(1)} °C\n`;
    results += `  Thermal Resistance: ${thermalResistance.toFixed(3)} °C/W\n`;
    results += `  Coil Surface Area: ${(surfaceArea * 1e4).toFixed(2)} cm²\n\n`;

    results += `SPL Output:\n`;
    results += `  At Rated Power: ${splAtRated.toFixed(1)} dB SPL\n`;
    results += `  At Continuous Power: ${splAtContinuous.toFixed(1)} dB SPL\n`;
    results += `  At Peak Power: ${splAtPeak.toFixed(1)} dB SPL\n\n`;

    results += `Electrical:\n`;
    results += `  Voltage at Rated Power: ${voltage.toFixed(2)} V RMS\n`;
    results += `  Current at Rated Power: ${current.toFixed(2)} A RMS\n\n`;

    results += `Mechanical Limit (est.): ${mechPowerLimit.toFixed(1)} W\n\n`;

    results += `Notes:\n`;
    results += `  • Continuous power = 2-hour pink noise (AES standard)\n`;
    results += `  • Program power = 2× continuous (typical music crest factor)\n`;
    results += `  • Peak power = 4× continuous (instantaneous)\n`;
    results += `  • Actual limits depend on enclosure, signal type, and cooling\n`;

    setOutput(results);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-z`} className="block text-sm font-medium text-gray-700 mb-1">Nominal Impedance (Ω)</label>
            <input id={`${toolId}-z`} type="number" value={impedance} onChange={(e) => setImpedance(e.target.value)} className="input-field" aria-label={`Impedance for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-vc`} className="block text-sm font-medium text-gray-700 mb-1">Voice Coil Diameter (mm)</label>
            <input id={`${toolId}-vc`} type="number" value={voiceCoilDiameter} onChange={(e) => setVoiceCoilDiameter(e.target.value)} className="input-field" aria-label="Voice coil diameter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-xmax`} className="block text-sm font-medium text-gray-700 mb-1">Xmax (mm)</label>
            <input id={`${toolId}-xmax`} type="number" value={xmax} onChange={(e) => setXmax(e.target.value)} className="input-field" aria-label="Xmax in mm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sens`} className="block text-sm font-medium text-gray-700 mb-1">Sensitivity (dB 1W/1m)</label>
            <input id={`${toolId}-sens`} type="number" value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className="input-field" aria-label="Sensitivity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Rated Power AES (W)</label>
            <input id={`${toolId}-power`} type="number" value={ratedPower} onChange={(e) => setRatedPower(e.target.value)} className="input-field" aria-label="Rated power" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tamb`} className="block text-sm font-medium text-gray-700 mb-1">Ambient Temp (°C)</label>
            <input id={`${toolId}-tamb`} type="number" value={ambientTemp} onChange={(e) => setAmbientTemp(e.target.value)} className="input-field" aria-label="Ambient temperature" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tmax`} className="block text-sm font-medium text-gray-700 mb-1">Max Coil Temp (°C)</label>
            <input id={`${toolId}-tmax`} type="number" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} className="input-field" aria-label="Max coil temperature" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate Power Handling</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Power Handling Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
