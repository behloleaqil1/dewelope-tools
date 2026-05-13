'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbCrosstalkCalculator - Calculate PCB trace crosstalk.
 * Estimates near-end (NEXT) and far-end (FEXT) crosstalk between parallel traces.
 */
export default function PcbCrosstalkCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [traceWidth, setTraceWidth] = useState('0.15');
  const [traceSpacing, setTraceSpacing] = useState('0.2');
  const [traceHeight, setTraceHeight] = useState('0.1');
  const [coupledLength, setCoupledLength] = useState('50');
  const [dielectric, setDielectric] = useState('4.3');
  const [riseTime, setRiseTime] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(traceWidth);
    const s = parseFloat(traceSpacing);
    const h = parseFloat(traceHeight);
    const len = parseFloat(coupledLength);
    const er = parseFloat(dielectric);
    const tr = parseFloat(riseTime);

    if (isNaN(w) || isNaN(s) || isNaN(h) || isNaN(len) || isNaN(er) || isNaN(tr) || s <= 0 || h <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Self capacitance (microstrip approximation)
    const effectiveEr = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * h / w));
    const Z0 = (87 / Math.sqrt(effectiveEr + 1.41)) * Math.log(5.98 * h / (0.8 * w + 0.25 * h));
    
    // Propagation delay
    const c = 299.792; // mm/ns
    const vp = c / Math.sqrt(effectiveEr);
    const tpd = len / vp; // ns
    
    // Coupling coefficient (Kb - backward crosstalk coefficient)
    const Kb = (1 / 4) * (1 / (1 + (s / h) * (s / h)));
    
    // Near-end crosstalk (NEXT)
    const NEXT_dB = -20 * Math.log10(Kb);
    const NEXT_pct = Kb * 100;
    
    // Far-end crosstalk (FEXT) - for stripline it's ideally 0, for microstrip:
    const Kf = (2 * len * Kb) / (vp * tr);
    const FEXT_dB = Kf > 0 ? -20 * Math.log10(Math.min(Kf, 1)) : 60;
    const FEXT_pct = Math.min(Kf * 100, 100);
    
    // Critical length
    const criticalLength = (vp * tr) / 2;

    let result = `=== PCB Crosstalk Analysis ===\n\n`;
    result += `--- Input Parameters ---\n`;
    result += `Trace Width: ${w} mm\n`;
    result += `Trace Spacing: ${s} mm\n`;
    result += `Height Above Ground: ${h} mm\n`;
    result += `Coupled Length: ${len} mm\n`;
    result += `Dielectric Constant (εr): ${er}\n`;
    result += `Signal Rise Time: ${tr} ns\n\n`;
    result += `--- Calculated Results ---\n`;
    result += `Characteristic Impedance (Z₀): ${Z0.toFixed(2)} Ω\n`;
    result += `Effective Dielectric: ${effectiveEr.toFixed(3)}\n`;
    result += `Propagation Velocity: ${vp.toFixed(2)} mm/ns\n`;
    result += `Propagation Delay: ${tpd.toFixed(3)} ns\n`;
    result += `Critical Length: ${criticalLength.toFixed(2)} mm\n\n`;
    result += `--- Crosstalk Results ---\n`;
    result += `Near-End Crosstalk (NEXT): ${NEXT_pct.toFixed(3)}% (${NEXT_dB.toFixed(2)} dB)\n`;
    result += `Far-End Crosstalk (FEXT): ${FEXT_pct.toFixed(3)}% (${FEXT_dB.toFixed(2)} dB)\n`;
    result += `Backward Coupling Coeff (Kb): ${Kb.toFixed(6)}\n`;
    result += `Forward Coupling Coeff (Kf): ${Kf.toFixed(6)}\n\n`;
    result += `--- Recommendations ---\n`;
    if (s < 3 * h) {
      result += `⚠ Spacing < 3×height: Consider increasing trace spacing to ≥${(3 * h).toFixed(2)} mm\n`;
    } else {
      result += `✓ Spacing ≥ 3×height: Good crosstalk isolation\n`;
    }
    if (len > criticalLength) {
      result += `⚠ Coupled length exceeds critical length: NEXT is saturated\n`;
    }
    result += `Tip: Use 3W rule (space ≥ 3× trace width) for minimal crosstalk\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Trace Width (mm)</label>
            <input id={`${toolId}-width`} type="number" step="0.01" value={traceWidth} onChange={(e) => setTraceWidth(e.target.value)} className="input-field" aria-label={`Trace width for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mb-1">Trace Spacing (mm)</label>
            <input id={`${toolId}-spacing`} type="number" step="0.01" value={traceSpacing} onChange={(e) => setTraceSpacing(e.target.value)} className="input-field" aria-label="Trace spacing" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height Above Ground (mm)</label>
            <input id={`${toolId}-height`} type="number" step="0.01" value={traceHeight} onChange={(e) => setTraceHeight(e.target.value)} className="input-field" aria-label="Trace height above ground plane" />
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Coupled Length (mm)</label>
            <input id={`${toolId}-length`} type="number" step="1" value={coupledLength} onChange={(e) => setCoupledLength(e.target.value)} className="input-field" aria-label="Coupled trace length" />
          </div>
          <div>
            <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
            <input id={`${toolId}-er`} type="number" step="0.1" value={dielectric} onChange={(e) => setDielectric(e.target.value)} className="input-field" aria-label="Dielectric constant" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rise`} className="block text-sm font-medium text-gray-700 mb-1">Rise Time (ns)</label>
            <input id={`${toolId}-rise`} type="number" step="0.1" value={riseTime} onChange={(e) => setRiseTime(e.target.value)} className="input-field" aria-label="Signal rise time" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Crosstalk</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Crosstalk Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
