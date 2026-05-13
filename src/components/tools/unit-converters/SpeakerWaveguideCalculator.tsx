'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerWaveguideCalculator - Calculate waveguide/horn mouth dimensions.
 * Determines mouth size, coverage angle, and cutoff frequency for speaker waveguides.
 */
export default function SpeakerWaveguideCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cutoffFreq, setCutoffFreq] = useState('800');
  const [hAngle, setHAngle] = useState('90');
  const [vAngle, setVAngle] = useState('40');
  const [throatDiameter, setThroatDiameter] = useState('25.4');
  const [depth, setDepth] = useState('200');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fc = parseFloat(cutoffFreq);
    const hDeg = parseFloat(hAngle);
    const vDeg = parseFloat(vAngle);
    const dt = parseFloat(throatDiameter);
    const d = parseFloat(depth);

    if (isNaN(fc) || isNaN(hDeg) || isNaN(vDeg) || isNaN(dt) || isNaN(d) || fc <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    const c = 343; // speed of sound m/s
    const wavelength = c / fc; // meters
    const wavelengthMm = wavelength * 1000;

    // Mouth width for pattern control at cutoff
    // Mouth dimension should be approximately wavelength / 2 for -6dB beamwidth
    const mouthWidth = wavelengthMm * (hDeg / 57.3); // simplified
    const mouthHeight = wavelengthMm * (vDeg / 57.3);

    // Minimum mouth circumference for cutoff (conical horn)
    const minMouthCircumference = wavelengthMm;
    const minMouthDiameter = minMouthCircumference / Math.PI;

    // Flare rate (exponential horn)
    const throatArea = Math.PI * (dt / 2) ** 2;
    const mouthArea = mouthWidth * mouthHeight;
    const flareConstant = Math.log(mouthArea / throatArea) / d;

    // -6dB beamwidth at various frequencies
    const freqs = [fc, fc * 2, fc * 4, fc * 8];

    let result = `=== Speaker Waveguide/Horn Calculator ===\n\n`;
    result += `--- Input Parameters ---\n`;
    result += `Target Cutoff Frequency: ${fc} Hz\n`;
    result += `Horizontal Coverage: ${hDeg}°\n`;
    result += `Vertical Coverage: ${vDeg}°\n`;
    result += `Throat Diameter: ${dt} mm\n`;
    result += `Waveguide Depth: ${d} mm\n\n`;
    result += `--- Calculated Dimensions ---\n`;
    result += `Wavelength at Cutoff: ${wavelengthMm.toFixed(1)} mm\n`;
    result += `Mouth Width (H): ${mouthWidth.toFixed(1)} mm (${(mouthWidth / 25.4).toFixed(2)}")\n`;
    result += `Mouth Height (V): ${mouthHeight.toFixed(1)} mm (${(mouthHeight / 25.4).toFixed(2)}")\n`;
    result += `Mouth Area: ${(mouthWidth * mouthHeight / 100).toFixed(1)} cm²\n`;
    result += `Min Circular Mouth Ø: ${minMouthDiameter.toFixed(1)} mm\n`;
    result += `Throat Area: ${throatArea.toFixed(1)} mm²\n`;
    result += `Expansion Ratio: ${(mouthArea / throatArea).toFixed(1)}:1\n`;
    result += `Flare Constant (m): ${(flareConstant * 1000).toFixed(4)} /mm\n\n`;
    result += `--- Coverage vs Frequency ---\n`;
    freqs.forEach(f => {
      const wl = (c / f) * 1000;
      const beamH = Math.min(hDeg, (57.3 * wl) / mouthWidth);
      const beamV = Math.min(vDeg, (57.3 * wl) / mouthHeight);
      result += `${f} Hz: ~${beamH.toFixed(0)}° H × ${beamV.toFixed(0)}° V\n`;
    });
    result += `\n--- Design Notes ---\n`;
    result += `• Mouth must be ≥ λ/2 at lowest frequency for pattern control\n`;
    result += `• Deeper waveguides provide better low-frequency loading\n`;
    result += `• OS (oblate spheroid) contour reduces diffraction artifacts\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-cutoff`} className="block text-sm font-medium text-gray-700 mb-1">Cutoff Frequency (Hz)</label>
            <input id={`${toolId}-cutoff`} type="number" step="50" value={cutoffFreq} onChange={(e) => setCutoffFreq(e.target.value)} className="input-field" aria-label={`Cutoff frequency for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-hangle`} className="block text-sm font-medium text-gray-700 mb-1">Horizontal Coverage (°)</label>
            <input id={`${toolId}-hangle`} type="number" step="5" value={hAngle} onChange={(e) => setHAngle(e.target.value)} className="input-field" aria-label="Horizontal coverage angle" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vangle`} className="block text-sm font-medium text-gray-700 mb-1">Vertical Coverage (°)</label>
            <input id={`${toolId}-vangle`} type="number" step="5" value={vAngle} onChange={(e) => setVAngle(e.target.value)} className="input-field" aria-label="Vertical coverage angle" />
          </div>
          <div>
            <label htmlFor={`${toolId}-throat`} className="block text-sm font-medium text-gray-700 mb-1">Throat Diameter (mm)</label>
            <input id={`${toolId}-throat`} type="number" step="0.1" value={throatDiameter} onChange={(e) => setThroatDiameter(e.target.value)} className="input-field" aria-label="Throat diameter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">Waveguide Depth (mm)</label>
            <input id={`${toolId}-depth`} type="number" step="10" value={depth} onChange={(e) => setDepth(e.target.value)} className="input-field" aria-label="Waveguide depth" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Dimensions</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Waveguide Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
