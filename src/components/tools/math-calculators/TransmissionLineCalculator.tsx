'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TransmissionLineCalculator - Calculate transmission line impedance and delay.
 * Computes characteristic impedance, propagation delay, wavelength, and velocity factor.
 */
export default function TransmissionLineCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lineType, setLineType] = useState('coaxial');
  const [innerDia, setInnerDia] = useState('1.0');
  const [outerDia, setOuterDia] = useState('3.5');
  const [dielectric, setDielectric] = useState('2.3');
  const [length, setLength] = useState('1.0');
  const [frequency, setFrequency] = useState('100');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = parseFloat(innerDia);
    const D = parseFloat(outerDia);
    const er = parseFloat(dielectric);
    const len = parseFloat(length);
    const f = parseFloat(frequency);

    if (isNaN(d) || isNaN(D) || isNaN(er) || isNaN(len) || isNaN(f) || d <= 0 || D <= 0 || er <= 0 || len <= 0 || f <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    if (D <= d) {
      setOutput('Outer diameter must be greater than inner diameter.');
      return;
    }

    const freqHz = freqUnit === 'GHz' ? f * 1e9 : freqUnit === 'MHz' ? f * 1e6 : freqUnit === 'kHz' ? f * 1e3 : f;
    const c = 299792458; // speed of light m/s

    let z0: number;
    if (lineType === 'coaxial') {
      z0 = (138 / Math.sqrt(er)) * Math.log10(D / d);
    } else {
      // Parallel wire: Z0 = (276/sqrt(er)) * log10(2*spacing/diameter)
      z0 = (276 / Math.sqrt(er)) * Math.log10(2 * D / d);
    }

    const vf = 1 / Math.sqrt(er);
    const vp = c * vf;
    const wavelength = vp / freqHz;
    const delay = len / vp;
    const electricalLength = (len / wavelength) * 360;

    const lines: string[] = [];
    lines.push(`=== Transmission Line Analysis ===`);
    lines.push(`Type: ${lineType === 'coaxial' ? 'Coaxial' : 'Parallel Wire'}`);
    lines.push(`${lineType === 'coaxial' ? 'Inner Diameter' : 'Wire Diameter'}: ${d} mm`);
    lines.push(`${lineType === 'coaxial' ? 'Outer Diameter' : 'Wire Spacing'}: ${D} mm`);
    lines.push(`Dielectric Constant (εr): ${er}`);
    lines.push(`Length: ${len} m`);
    lines.push(`Frequency: ${f} ${freqUnit}`);
    lines.push(``);
    lines.push(`--- Results ---`);
    lines.push(`Characteristic Impedance (Z₀): ${z0.toFixed(2)} Ω`);
    lines.push(`Velocity Factor: ${(vf * 100).toFixed(2)}%`);
    lines.push(`Propagation Velocity: ${(vp / 1e6).toFixed(2)} Mm/s`);
    lines.push(`Wavelength (λ): ${wavelength >= 1 ? wavelength.toFixed(4) + ' m' : (wavelength * 100).toFixed(4) + ' cm'}`);
    lines.push(`Propagation Delay: ${(delay * 1e9).toFixed(4)} ns`);
    lines.push(`Delay per meter: ${(1e9 / vp).toFixed(4)} ns/m`);
    lines.push(`Electrical Length: ${electricalLength.toFixed(2)}°`);
    lines.push(`Electrical Length: ${(electricalLength / 360).toFixed(4)} λ`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Line Type</label>
            <select id={`${toolId}-type`} value={lineType} onChange={(e) => setLineType(e.target.value)} className="input-field" aria-label={`Line type for ${toolName}`}>
              <option value="coaxial">Coaxial Cable</option>
              <option value="parallel">Parallel Wire</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-inner`} className="block text-sm font-medium text-gray-700 mb-1">{lineType === 'coaxial' ? 'Inner Diameter (mm)' : 'Wire Diameter (mm)'}</label>
              <input id={`${toolId}-inner`} type="number" value={innerDia} onChange={(e) => setInnerDia(e.target.value)} className="input-field" aria-label="Inner diameter" />
            </div>
            <div>
              <label htmlFor={`${toolId}-outer`} className="block text-sm font-medium text-gray-700 mb-1">{lineType === 'coaxial' ? 'Outer Diameter (mm)' : 'Wire Spacing (mm)'}</label>
              <input id={`${toolId}-outer`} type="number" value={outerDia} onChange={(e) => setOuterDia(e.target.value)} className="input-field" aria-label="Outer diameter" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
              <input id={`${toolId}-er`} type="number" value={dielectric} onChange={(e) => setDielectric(e.target.value)} className="input-field" aria-label="Dielectric constant" />
            </div>
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Line Length (m)</label>
              <input id={`${toolId}-length`} type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-field" aria-label="Line length" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-funit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-funit`} value={freqUnit} onChange={(e) => setFreqUnit(e.target.value)} className="input-field" aria-label="Frequency unit">
                <option value="Hz">Hz</option>
                <option value="kHz">kHz</option>
                <option value="MHz">MHz</option>
                <option value="GHz">GHz</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
