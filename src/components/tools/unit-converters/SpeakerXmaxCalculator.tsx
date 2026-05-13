'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerXmaxCalculator - Calculate speaker maximum linear excursion (Xmax).
 * Determines Xmax from voice coil height, gap height, and overhang/underhang configuration.
 */
export default function SpeakerXmaxCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [voiceCoilHeight, setVoiceCoilHeight] = useState('20');
  const [gapHeight, setGapHeight] = useState('8');
  const [config, setConfig] = useState('overhang');
  const [blProduct, setBlProduct] = useState('10');
  const [movingMass, setMovingMass] = useState('50');
  const [compliance, setCompliance] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const vcHeight = parseFloat(voiceCoilHeight);
    const gHeight = parseFloat(gapHeight);
    const bl = parseFloat(blProduct);
    const mms = parseFloat(movingMass) / 1000; // g to kg
    const cms = parseFloat(compliance) / 1000; // mm/N to m/N

    if (isNaN(vcHeight) || isNaN(gHeight) || isNaN(bl) || isNaN(mms) || isNaN(cms)) {
      setOutput('Please enter valid numeric values for all fields.');
      return;
    }

    // Xmax calculation
    let xmax: number;
    if (config === 'overhang') {
      xmax = (vcHeight - gHeight) / 2;
    } else {
      xmax = (gHeight - vcHeight) / 2;
    }

    // Resonant frequency
    const fs = 1 / (2 * Math.PI * Math.sqrt(mms * cms));

    // Maximum displacement volume (for circular cone approximation)
    // Vd = Sd * Xmax (we'll show Xmax in mm and note about Sd)
    const xmaxMeters = xmax / 1000;

    // Peak velocity at resonance
    const peakVelocity = 2 * Math.PI * fs * xmaxMeters;

    const lines: string[] = [];
    lines.push('=== Speaker Xmax (Maximum Linear Excursion) ===');
    lines.push('');
    lines.push('Input Parameters:');
    lines.push(`  Voice Coil Height: ${vcHeight} mm`);
    lines.push(`  Gap Height: ${gHeight} mm`);
    lines.push(`  Configuration: ${config === 'overhang' ? 'Overhang (coil taller than gap)' : 'Underhang (gap taller than coil)'}`);
    lines.push(`  BL Product: ${bl} T·m`);
    lines.push(`  Moving Mass (Mms): ${movingMass} g`);
    lines.push(`  Compliance (Cms): ${compliance} mm/N`);
    lines.push('');
    lines.push('Results:');
    lines.push(`  Xmax (one-way): ${xmax.toFixed(2)} mm`);
    lines.push(`  Xmax (peak-to-peak): ${(xmax * 2).toFixed(2)} mm`);
    lines.push(`  Resonant Frequency (Fs): ${fs.toFixed(1)} Hz`);
    lines.push(`  Peak Velocity at Fs: ${(peakVelocity * 1000).toFixed(2)} mm/s`);
    lines.push('');
    lines.push('Notes:');
    if (xmax <= 0) {
      lines.push('  ⚠ Invalid configuration: voice coil must be taller than gap for overhang,');
      lines.push('    or gap must be taller than coil for underhang.');
    } else {
      if (config === 'overhang') {
        lines.push('  • Overhang design: good for high-excursion woofers');
        lines.push('  • BL remains relatively constant within Xmax');
      } else {
        lines.push('  • Underhang design: higher BL efficiency but lower Xmax');
        lines.push('  • Better linearity within limited excursion range');
      }
      lines.push(`  • Displacement volume (Vd) = Sd × ${xmax.toFixed(2)} mm`);
      lines.push('  • Actual Xmax may be limited by suspension linearity');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-vc-height`} className="block text-sm font-medium text-gray-700 mb-1">Voice Coil Height (mm)</label>
            <input id={`${toolId}-vc-height`} type="number" step="0.1" value={voiceCoilHeight} onChange={(e) => setVoiceCoilHeight(e.target.value)} className="input-field" aria-label={`Voice coil height for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-gap-height`} className="block text-sm font-medium text-gray-700 mb-1">Gap Height (mm)</label>
            <input id={`${toolId}-gap-height`} type="number" step="0.1" value={gapHeight} onChange={(e) => setGapHeight(e.target.value)} className="input-field" aria-label="Magnetic gap height" />
          </div>
          <div>
            <label htmlFor={`${toolId}-config`} className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
            <select id={`${toolId}-config`} value={config} onChange={(e) => setConfig(e.target.value)} className="input-field" aria-label="Coil configuration">
              <option value="overhang">Overhang (coil &gt; gap)</option>
              <option value="underhang">Underhang (gap &gt; coil)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bl`} className="block text-sm font-medium text-gray-700 mb-1">BL Product (T·m)</label>
            <input id={`${toolId}-bl`} type="number" step="0.1" value={blProduct} onChange={(e) => setBlProduct(e.target.value)} className="input-field" aria-label="BL product" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mms`} className="block text-sm font-medium text-gray-700 mb-1">Moving Mass - Mms (g)</label>
            <input id={`${toolId}-mms`} type="number" step="1" value={movingMass} onChange={(e) => setMovingMass(e.target.value)} className="input-field" aria-label="Moving mass" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cms`} className="block text-sm font-medium text-gray-700 mb-1">Compliance - Cms (mm/N)</label>
            <input id={`${toolId}-cms`} type="number" step="0.01" value={compliance} onChange={(e) => setCompliance(e.target.value)} className="input-field" aria-label="Compliance" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Xmax</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Xmax Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
