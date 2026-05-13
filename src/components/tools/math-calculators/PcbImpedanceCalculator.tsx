'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbImpedanceCalculator - Calculate PCB microstrip and stripline impedance.
 * Uses standard formulas for characteristic impedance based on trace geometry and dielectric.
 */
export default function PcbImpedanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'microstrip' | 'stripline'>('microstrip');
  const [traceWidth, setTraceWidth] = useState('10');
  const [traceThickness, setTraceThickness] = useState('1.4');
  const [dielectricHeight, setDielectricHeight] = useState('10');
  const [dielectricConstant, setDielectricConstant] = useState('4.4');
  const [dielectricHeight2, setDielectricHeight2] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(traceWidth);
    const t = parseFloat(traceThickness);
    const h = parseFloat(dielectricHeight);
    const er = parseFloat(dielectricConstant);

    if (isNaN(w) || isNaN(t) || isNaN(h) || isNaN(er) || w <= 0 || t <= 0 || h <= 0 || er <= 0) {
      setOutput('Error: All values must be positive numbers.');
      return;
    }

    let results = '';

    if (mode === 'microstrip') {
      // IPC-2141 microstrip impedance approximation
      const wEff = w + (t / Math.PI) * Math.log(4 * Math.E / Math.sqrt(Math.pow(t / h, 2) + Math.pow(t / (w * Math.PI + 1.1 * t * Math.PI), 2)));
      const ratio = wEff / h;
      let z0: number;

      if (ratio <= 1) {
        const erEff = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / wEff));
        z0 = (60 / Math.sqrt(erEff)) * Math.log((8 * h / wEff) + (wEff / (4 * h)));
      } else {
        const erEff = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / wEff));
        z0 = (120 * Math.PI) / (Math.sqrt(erEff) * (ratio + 1.393 + 0.667 * Math.log(ratio + 1.444)));
      }

      const erEff = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / wEff));
      const velocity = 3e8 / Math.sqrt(erEff);
      const delay = 1e12 / velocity; // ps/m

      results = `=== Microstrip Impedance Calculator ===\n\n`;
      results += `Input Parameters:\n`;
      results += `  Trace Width (W): ${w} mil\n`;
      results += `  Trace Thickness (T): ${t} mil\n`;
      results += `  Dielectric Height (H): ${h} mil\n`;
      results += `  Dielectric Constant (εr): ${er}\n\n`;
      results += `Results:\n`;
      results += `  Characteristic Impedance (Z₀): ${z0.toFixed(2)} Ω\n`;
      results += `  Effective Dielectric Constant (εr_eff): ${erEff.toFixed(4)}\n`;
      results += `  Propagation Velocity: ${(velocity / 1e6).toFixed(2)} m/μs\n`;
      results += `  Propagation Delay: ${(delay / 1e3).toFixed(3)} ns/m\n`;
      results += `  Effective Trace Width: ${wEff.toFixed(3)} mil\n`;
      results += `  W/H Ratio: ${ratio.toFixed(4)}\n`;
    } else {
      // Stripline impedance
      const h2 = parseFloat(dielectricHeight2);
      if (isNaN(h2) || h2 <= 0) {
        setOutput('Error: Second dielectric height must be a positive number.');
        return;
      }

      const b = h + h2 + t;
      const wEff = w + (t / Math.PI) * Math.log(4 * Math.E / Math.sqrt(Math.pow(t / (b - t), 2) + Math.pow(1 / (0.268 * w / t + 0.8), 2)));
      const z0 = (60 / Math.sqrt(er)) * Math.log((1.9 * b) / (0.8 * wEff + t));

      const velocity = 3e8 / Math.sqrt(er);
      const delay = 1e12 / velocity;

      results = `=== Stripline Impedance Calculator ===\n\n`;
      results += `Input Parameters:\n`;
      results += `  Trace Width (W): ${w} mil\n`;
      results += `  Trace Thickness (T): ${t} mil\n`;
      results += `  Dielectric Height Above (H1): ${h} mil\n`;
      results += `  Dielectric Height Below (H2): ${h2} mil\n`;
      results += `  Dielectric Constant (εr): ${er}\n\n`;
      results += `Results:\n`;
      results += `  Characteristic Impedance (Z₀): ${z0.toFixed(2)} Ω\n`;
      results += `  Total Board Thickness (b): ${b.toFixed(2)} mil\n`;
      results += `  Propagation Velocity: ${(velocity / 1e6).toFixed(2)} m/μs\n`;
      results += `  Propagation Delay: ${(delay / 1e3).toFixed(3)} ns/m\n`;
      results += `  Effective Trace Width: ${wEff.toFixed(3)} mil\n`;
    }

    setOutput(results);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Transmission Line Type</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'microstrip' | 'stripline')} className="input-field" aria-label={`Mode for ${toolName}`}>
              <option value="microstrip">Microstrip (outer layer)</option>
              <option value="stripline">Stripline (inner layer)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Trace Width (mil)</label>
              <input id={`${toolId}-width`} type="number" value={traceWidth} onChange={(e) => setTraceWidth(e.target.value)} className="input-field" aria-label="Trace width in mil" />
            </div>
            <div>
              <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">Trace Thickness (mil)</label>
              <input id={`${toolId}-thickness`} type="number" value={traceThickness} onChange={(e) => setTraceThickness(e.target.value)} className="input-field" aria-label="Trace thickness in mil" />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'stripline' ? 'Dielectric Height Above (mil)' : 'Dielectric Height (mil)'}</label>
              <input id={`${toolId}-height`} type="number" value={dielectricHeight} onChange={(e) => setDielectricHeight(e.target.value)} className="input-field" aria-label="Dielectric height in mil" />
            </div>
            {mode === 'stripline' && (
              <div>
                <label htmlFor={`${toolId}-height2`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Height Below (mil)</label>
                <input id={`${toolId}-height2`} type="number" value={dielectricHeight2} onChange={(e) => setDielectricHeight2(e.target.value)} className="input-field" aria-label="Dielectric height below in mil" />
              </div>
            )}
            <div>
              <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
              <input id={`${toolId}-er`} type="number" step="0.1" value={dielectricConstant} onChange={(e) => setDielectricConstant(e.target.value)} className="input-field" aria-label="Dielectric constant" />
            </div>
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate Impedance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Impedance Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
