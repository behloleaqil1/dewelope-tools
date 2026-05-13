'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbDifferentialPairCalculator - Calculate differential pair spacing for PCB design.
 * Computes differential impedance, coupling coefficient, and recommended spacing.
 */
export default function PcbDifferentialPairCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [traceWidth, setTraceWidth] = useState('5');
  const [traceThickness, setTraceThickness] = useState('1.4');
  const [dielectricHeight, setDielectricHeight] = useState('4');
  const [dielectricConstant, setDielectricConstant] = useState('4.2');
  const [spacing, setSpacing] = useState('5');
  const [targetImpedance, setTargetImpedance] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(traceWidth);
    const t = parseFloat(traceThickness);
    const h = parseFloat(dielectricHeight);
    const er = parseFloat(dielectricConstant);
    const s = parseFloat(spacing);
    const zTarget = parseFloat(targetImpedance);

    if (isNaN(w) || isNaN(t) || isNaN(h) || isNaN(er) || isNaN(s) || isNaN(zTarget)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    // Approximate single-ended microstrip impedance (IPC-2141 simplified)
    const effectiveEr = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 * (h / w)));
    const z0 = (87 / Math.sqrt(effectiveEr + 1.41)) * Math.log((5.98 * h) / (0.8 * w + t));

    // Coupling factor based on spacing
    const kCoupling = 1 - (0.48 * Math.exp(-0.96 * s / h));

    // Differential impedance approximation
    const zDiff = 2 * z0 * (1 - 0.48 * Math.exp(-0.96 * s / h));

    // Odd-mode impedance
    const zOdd = zDiff / 2;

    // Even-mode impedance
    const zEven = z0 * (1 + 0.48 * Math.exp(-0.96 * s / h));

    // Recommended spacing for target impedance
    const targetRatio = (zTarget / (2 * z0) - 1) / (-0.48);
    const recommendedSpacing = targetRatio > 0 ? -h * Math.log(targetRatio) / 0.96 : s;

    // Propagation delay (ps/inch)
    const propDelay = 85 * Math.sqrt(0.475 * er + 0.67);

    const lines: string[] = [];
    lines.push('=== PCB Differential Pair Analysis ===');
    lines.push('');
    lines.push('--- Input Parameters ---');
    lines.push(`Trace Width (W): ${w} mil`);
    lines.push(`Trace Thickness (T): ${t} mil`);
    lines.push(`Dielectric Height (H): ${h} mil`);
    lines.push(`Dielectric Constant (εr): ${er}`);
    lines.push(`Pair Spacing (S): ${s} mil`);
    lines.push(`Target Differential Impedance: ${zTarget} Ω`);
    lines.push('');
    lines.push('--- Calculated Results ---');
    lines.push(`Effective Dielectric Constant: ${effectiveEr.toFixed(3)}`);
    lines.push(`Single-Ended Impedance (Z₀): ${z0.toFixed(2)} Ω`);
    lines.push(`Differential Impedance (Zdiff): ${zDiff.toFixed(2)} Ω`);
    lines.push(`Odd-Mode Impedance (Zodd): ${zOdd.toFixed(2)} Ω`);
    lines.push(`Even-Mode Impedance (Zeven): ${zEven.toFixed(2)} Ω`);
    lines.push(`Coupling Coefficient (k): ${kCoupling.toFixed(4)}`);
    lines.push(`Propagation Delay: ${propDelay.toFixed(2)} ps/inch`);
    lines.push('');
    lines.push('--- Recommendations ---');
    lines.push(`Recommended Spacing for ${zTarget}Ω: ${recommendedSpacing.toFixed(2)} mil`);
    lines.push(`Spacing/Height Ratio (S/H): ${(s / h).toFixed(2)}`);
    lines.push(`Width/Height Ratio (W/H): ${(w / h).toFixed(2)}`);
    if (Math.abs(zDiff - zTarget) <= 5) {
      lines.push(`✓ Current spacing achieves target within ±5Ω`);
    } else {
      lines.push(`⚠ Current Zdiff (${zDiff.toFixed(1)}Ω) differs from target (${zTarget}Ω) by ${Math.abs(zDiff - zTarget).toFixed(1)}Ω`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Trace Width (mil)</label>
              <input id={`${toolId}-width`} type="number" value={traceWidth} onChange={(e) => setTraceWidth(e.target.value)} className="input-field" aria-label={`Trace width for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-thickness`} className="block text-sm font-medium text-gray-700 mb-1">Trace Thickness (mil)</label>
              <input id={`${toolId}-thickness`} type="number" value={traceThickness} onChange={(e) => setTraceThickness(e.target.value)} className="input-field" aria-label="Trace thickness" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Height (mil)</label>
              <input id={`${toolId}-height`} type="number" value={dielectricHeight} onChange={(e) => setDielectricHeight(e.target.value)} className="input-field" aria-label="Dielectric height" />
            </div>
            <div>
              <label htmlFor={`${toolId}-er`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
              <input id={`${toolId}-er`} type="number" step="0.1" value={dielectricConstant} onChange={(e) => setDielectricConstant(e.target.value)} className="input-field" aria-label="Dielectric constant" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mb-1">Pair Spacing (mil)</label>
              <input id={`${toolId}-spacing`} type="number" value={spacing} onChange={(e) => setSpacing(e.target.value)} className="input-field" aria-label="Pair spacing" />
            </div>
            <div>
              <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Impedance (Ω)</label>
              <input id={`${toolId}-target`} type="number" value={targetImpedance} onChange={(e) => setTargetImpedance(e.target.value)} className="input-field" aria-label="Target impedance" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Differential Pair</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Differential Pair Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
