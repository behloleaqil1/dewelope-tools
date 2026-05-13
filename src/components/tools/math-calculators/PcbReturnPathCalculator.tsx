'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbReturnPathCalculator - Calculate return path impedance discontinuity.
 * Analyzes signal integrity issues caused by gaps or splits in reference planes.
 */
export default function PcbReturnPathCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [traceWidth, setTraceWidth] = useState('0.15');
  const [traceHeight, setTraceHeight] = useState('0.1');
  const [gapWidth, setGapWidth] = useState('1.0');
  const [frequency, setFrequency] = useState('1000');
  const [dielectric, setDielectric] = useState('4.2');
  const [traceImpedance, setTraceImpedance] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(traceWidth);
    const h = parseFloat(traceHeight);
    const gap = parseFloat(gapWidth);
    const freq = parseFloat(frequency) * 1e6;
    const er = parseFloat(dielectric);
    const z0 = parseFloat(traceImpedance);

    if (isNaN(w) || isNaN(h) || isNaN(gap) || isNaN(freq) || isNaN(er) || isNaN(z0)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    // Calculate wavelength
    const c = 3e8;
    const vp = c / Math.sqrt(er);
    const wavelength = vp / freq * 1000; // mm

    // Estimate additional inductance from gap
    const mu0 = 4 * Math.PI * 1e-7;
    const gapInductance = mu0 * gap * 1e-3 * Math.log(2 * gap / (w * 1e-3)) / Math.PI;

    // Impedance of the gap at frequency
    const omega = 2 * Math.PI * freq;
    const gapImpedance = omega * gapInductance;

    // Reflection coefficient
    const gamma = gapImpedance / (2 * z0 + gapImpedance);
    const reflectionDb = 20 * Math.log10(Math.abs(gamma));

    // Return path detour estimate
    const detourLength = 2 * gap + w;

    const lines: string[] = [];
    lines.push('=== Return Path Impedance Discontinuity Analysis ===');
    lines.push('');
    lines.push('Input Parameters:');
    lines.push(`  Trace Width: ${w} mm`);
    lines.push(`  Height Above Plane: ${h} mm`);
    lines.push(`  Gap Width: ${gap} mm`);
    lines.push(`  Frequency: ${(freq / 1e6).toFixed(1)} MHz`);
    lines.push(`  Dielectric Constant: ${er}`);
    lines.push(`  Trace Impedance: ${z0} Ω`);
    lines.push('');
    lines.push('Results:');
    lines.push(`  Signal Wavelength: ${wavelength.toFixed(2)} mm`);
    lines.push(`  Gap/Wavelength Ratio: ${(gap / wavelength).toFixed(4)}`);
    lines.push(`  Additional Inductance: ${(gapInductance * 1e9).toFixed(3)} nH`);
    lines.push(`  Gap Impedance at Freq: ${gapImpedance.toFixed(2)} Ω`);
    lines.push(`  Reflection Coefficient: ${gamma.toFixed(4)}`);
    lines.push(`  Return Loss: ${reflectionDb.toFixed(2)} dB`);
    lines.push(`  Return Path Detour: ~${detourLength.toFixed(2)} mm`);
    lines.push('');
    lines.push('Assessment:');
    if (gap / wavelength < 0.01) {
      lines.push('  ✓ Gap is small relative to wavelength - minimal impact expected.');
    } else if (gap / wavelength < 0.05) {
      lines.push('  ⚠ Moderate discontinuity - may cause signal integrity issues at this frequency.');
    } else {
      lines.push('  ✗ Significant discontinuity - likely to cause EMI and signal degradation.');
    }
    lines.push('');
    lines.push('Recommendations:');
    lines.push('  • Add stitching capacitors across the gap (100nF + 1nF)');
    lines.push('  • Route signals to avoid crossing reference plane splits');
    lines.push('  • Use continuous reference planes under high-speed signals');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-trace-width`} className="block text-sm font-medium text-gray-700 mb-1">Trace Width (mm)</label>
            <input id={`${toolId}-trace-width`} type="number" step="0.01" value={traceWidth} onChange={(e) => setTraceWidth(e.target.value)} className="input-field" aria-label={`Trace width for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-trace-height`} className="block text-sm font-medium text-gray-700 mb-1">Height Above Plane (mm)</label>
            <input id={`${toolId}-trace-height`} type="number" step="0.01" value={traceHeight} onChange={(e) => setTraceHeight(e.target.value)} className="input-field" aria-label="Height above reference plane" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gap-width`} className="block text-sm font-medium text-gray-700 mb-1">Gap/Split Width (mm)</label>
            <input id={`${toolId}-gap-width`} type="number" step="0.1" value={gapWidth} onChange={(e) => setGapWidth(e.target.value)} className="input-field" aria-label="Gap width in reference plane" />
          </div>
          <div>
            <label htmlFor={`${toolId}-frequency`} className="block text-sm font-medium text-gray-700 mb-1">Signal Frequency (MHz)</label>
            <input id={`${toolId}-frequency`} type="number" step="1" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Signal frequency" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dielectric`} className="block text-sm font-medium text-gray-700 mb-1">Dielectric Constant (εr)</label>
            <input id={`${toolId}-dielectric`} type="number" step="0.1" value={dielectric} onChange={(e) => setDielectric(e.target.value)} className="input-field" aria-label="Dielectric constant" />
          </div>
          <div>
            <label htmlFor={`${toolId}-impedance`} className="block text-sm font-medium text-gray-700 mb-1">Trace Impedance (Ω)</label>
            <input id={`${toolId}-impedance`} type="number" step="1" value={traceImpedance} onChange={(e) => setTraceImpedance(e.target.value)} className="input-field" aria-label="Trace impedance" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Return Path Discontinuity</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
