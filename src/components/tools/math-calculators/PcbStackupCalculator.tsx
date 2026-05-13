'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbStackupCalculator - Calculate PCB layer stackup impedance.
 */
export default function PcbStackupCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [traceWidth, setTraceWidth] = useState('0.15');
  const [traceThickness, setTraceThickness] = useState('0.035');
  const [dielectricHeight, setDielectricHeight] = useState('0.1');
  const [dielectricConstant, setDielectricConstant] = useState('4.2');
  const [layers, setLayers] = useState('4');
  const [stackupType, setStackupType] = useState('microstrip');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(traceWidth);
    const t = parseFloat(traceThickness);
    const h = parseFloat(dielectricHeight);
    const er = parseFloat(dielectricConstant);
    const numLayers = parseInt(layers);

    if (isNaN(w) || isNaN(t) || isNaN(h) || isNaN(er) || w <= 0 || h <= 0 || er <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    let z0: number;
    let erEff: number;

    if (stackupType === 'microstrip') {
      // Microstrip impedance approximation (IPC-2141)
      const wEff = w + (t / Math.PI) * Math.log(4 * Math.E / Math.sqrt(Math.pow(t / h, 2) + Math.pow(t / (w * Math.PI + 1.1 * t * Math.PI), 2)));
      const ratio = wEff / h;
      if (ratio <= 1) {
        erEff = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / wEff));
        z0 = (60 / Math.sqrt(erEff)) * Math.log(8 * h / wEff + wEff / (4 * h));
      } else {
        erEff = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / wEff));
        z0 = (120 * Math.PI) / (Math.sqrt(erEff) * (ratio + 1.393 + 0.667 * Math.log(ratio + 1.444)));
      }
    } else {
      // Stripline impedance approximation
      erEff = er;
      const wEff = w + (t / Math.PI) * Math.log(4 * Math.E / Math.sqrt(Math.pow(t / (2 * h), 2) + Math.pow(t / (w * Math.PI + 1.1 * t * Math.PI), 2)));
      const ratio = wEff / (2 * h);
      if (ratio < 0.35) {
        z0 = (60 / Math.sqrt(er)) * Math.log(4 * (2 * h) / (0.67 * Math.PI * (0.8 * wEff + t)));
      } else {
        z0 = (60 / Math.sqrt(er)) * Math.log(4 * (2 * h) / (0.67 * Math.PI * (0.8 * wEff + t)));
      }
    }

    const propagationDelay = (Math.sqrt(erEff) * 3.336).toFixed(3);
    const wavelengthAt1GHz = (300 / Math.sqrt(erEff)).toFixed(2);

    const result = `PCB Stackup Impedance Analysis
================================
Configuration: ${stackupType === 'microstrip' ? 'Microstrip (outer layer)' : 'Stripline (inner layer)'}
Number of Layers: ${numLayers}

Input Parameters:
  Trace Width: ${w} mm
  Trace Thickness: ${t} mm
  Dielectric Height: ${h} mm
  Dielectric Constant (εr): ${er}

Results:
  Characteristic Impedance (Z₀): ${z0.toFixed(2)} Ω
  Effective Dielectric Constant (εr_eff): ${erEff.toFixed(3)}
  Propagation Delay: ${propagationDelay} ps/mm
  Wavelength at 1 GHz: ${wavelengthAt1GHz} mm

Stackup Recommendation (${numLayers}-layer):
${numLayers === 4 ? `  Layer 1: Signal (Top) - Microstrip
  Layer 2: Ground Plane
  Layer 3: Power Plane
  Layer 4: Signal (Bottom) - Microstrip` :
numLayers === 6 ? `  Layer 1: Signal (Top) - Microstrip
  Layer 2: Ground Plane
  Layer 3: Signal (Inner) - Stripline
  Layer 4: Signal (Inner) - Stripline
  Layer 5: Power Plane
  Layer 6: Signal (Bottom) - Microstrip` :
`  Layer 1: Signal (Top) - Microstrip
  Layer 2: Ground Plane
  Layer 3: Signal (Inner 1) - Stripline
  Layer 4: Power Plane
  Layer 5: Ground Plane
  Layer 6: Signal (Inner 2) - Stripline
  Layer 7: Power Plane
  Layer 8: Signal (Bottom) - Microstrip`}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Trace Width (mm)</label>
            <input id={`${toolId}-width`} type="number" step="0.001" value={traceWidth} onChange={(e) => setTraceWidth(e.target.value)} className="input-field" aria-label={`Trace width for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">Trace Thickness (mm)</label>
            <input id={`${toolId}-thickness`} type="number" step="0.001" value={traceThickness} onChange={(e) => setTraceThickness(e.target.value)} className="input-field" aria-label="Trace thickness" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Height (mm)</label>
            <input id={`${toolId}-height`} type="number" step="0.001" value={dielectricHeight} onChange={(e) => setDielectricHeight(e.target.value)} className="input-field" aria-label="Dielectric height" />
          </div>
          <div>
            <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
            <input id={`${toolId}-er`} type="number" step="0.1" value={dielectricConstant} onChange={(e) => setDielectricConstant(e.target.value)} className="input-field" aria-label="Dielectric constant" />
          </div>
          <div>
            <label htmlFor={`${toolId}-layers`} className="block text-sm font-medium text-gray-700 mb-1">Number of Layers</label>
            <select id={`${toolId}-layers`} value={layers} onChange={(e) => setLayers(e.target.value)} className="input-field" aria-label="Number of layers">
              <option value="2">2 Layers</option>
              <option value="4">4 Layers</option>
              <option value="6">6 Layers</option>
              <option value="8">8 Layers</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Stackup Type</label>
            <select id={`${toolId}-type`} value={stackupType} onChange={(e) => setStackupType(e.target.value)} className="input-field" aria-label="Stackup type">
              <option value="microstrip">Microstrip (Outer Layer)</option>
              <option value="stripline">Stripline (Inner Layer)</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Stackup Impedance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Stackup Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
