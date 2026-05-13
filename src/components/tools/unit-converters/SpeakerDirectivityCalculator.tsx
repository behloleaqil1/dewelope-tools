'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerDirectivityCalculator - Calculate speaker directivity index.
 * Computes DI from coverage angles or on/off axis measurements.
 */
export default function SpeakerDirectivityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [horizontalAngle, setHorizontalAngle] = useState('90');
  const [verticalAngle, setVerticalAngle] = useState('60');
  const [onAxisSpl, setOnAxisSpl] = useState('95');
  const [power, setPower] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const hAngle = parseFloat(horizontalAngle);
    const vAngle = parseFloat(verticalAngle);
    const spl = parseFloat(onAxisSpl);
    const watts = parseFloat(power);

    if (isNaN(hAngle) || isNaN(vAngle) || isNaN(spl) || isNaN(watts)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Convert angles to radians (half-angles)
    const hRad = (hAngle / 2) * (Math.PI / 180);
    const vRad = (vAngle / 2) * (Math.PI / 180);

    // Directivity factor Q approximation for rectangular coverage
    // Q ≈ 180² / (hAngle × vAngle) for typical horn patterns
    const Q = (180 * 180) / (hAngle * vAngle);

    // Directivity Index DI = 10 * log10(Q)
    const DI = 10 * Math.log10(Q);

    // Solid angle in steradians (approximate)
    const solidAngle = 4 * Math.asin(Math.sin(hRad) * Math.sin(vRad));

    // Maximum SPL at 1m with given power
    const sensitivity1W = spl; // assuming 1W/1m sensitivity
    const maxSpl = sensitivity1W + 10 * Math.log10(watts);

    // SPL at various distances
    const distances = [1, 2, 4, 8, 16];

    const lines: string[] = [];
    lines.push('=== Speaker Directivity Calculator ===');
    lines.push('');
    lines.push(`Horizontal Coverage: ${hAngle}° (-6dB)`);
    lines.push(`Vertical Coverage: ${vAngle}° (-6dB)`);
    lines.push(`On-Axis Sensitivity: ${spl} dB (1W/1m)`);
    lines.push(`Amplifier Power: ${watts} W`);
    lines.push('');
    lines.push('--- Directivity Results ---');
    lines.push(`Directivity Factor (Q): ${Q.toFixed(2)}`);
    lines.push(`Directivity Index (DI): ${DI.toFixed(1)} dB`);
    lines.push(`Coverage Solid Angle: ${solidAngle.toFixed(3)} sr`);
    lines.push('');
    lines.push('--- SPL at Distance ---');
    lines.push(`Max SPL at 1m: ${maxSpl.toFixed(1)} dB`);
    distances.forEach(d => {
      const splAtDist = maxSpl - 20 * Math.log10(d);
      lines.push(`  ${d}m: ${splAtDist.toFixed(1)} dB SPL`);
    });
    lines.push('');
    lines.push('--- Classification ---');
    if (DI < 6) lines.push('Wide dispersion pattern (omnidirectional tendency)');
    else if (DI < 10) lines.push('Moderate directivity (typical full-range speaker)');
    else if (DI < 15) lines.push('Narrow directivity (horn-loaded / line array)');
    else lines.push('Very narrow directivity (long-throw horn)');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-h-angle`} className="block text-sm font-medium text-gray-700 mb-1">Horizontal Coverage (°)</label>
            <input id={`${toolId}-h-angle`} type="number" min="1" max="360" value={horizontalAngle} onChange={(e) => setHorizontalAngle(e.target.value)} className="input-field" aria-label={`Horizontal angle for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-v-angle`} className="block text-sm font-medium text-gray-700 mb-1">Vertical Coverage (°)</label>
            <input id={`${toolId}-v-angle`} type="number" min="1" max="360" value={verticalAngle} onChange={(e) => setVerticalAngle(e.target.value)} className="input-field" aria-label="Vertical angle" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spl`} className="block text-sm font-medium text-gray-700 mb-1">Sensitivity (dB 1W/1m)</label>
            <input id={`${toolId}-spl`} type="number" step="0.1" value={onAxisSpl} onChange={(e) => setOnAxisSpl(e.target.value)} className="input-field" aria-label="On-axis sensitivity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Amplifier Power (W)</label>
            <input id={`${toolId}-power`} type="number" min="1" value={power} onChange={(e) => setPower(e.target.value)} className="input-field" aria-label="Amplifier power" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Directivity</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
