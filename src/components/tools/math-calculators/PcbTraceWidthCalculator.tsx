'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PcbTraceWidthCalculator - Calculate PCB trace width for current capacity using IPC-2221.
 */
export default function PcbTraceWidthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [current, setCurrent] = useState('');
  const [tempRise, setTempRise] = useState('10');
  const [copperWeight, setCopperWeight] = useState('1');
  const [layer, setLayer] = useState<'external' | 'internal'>('external');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const I = parseFloat(current);
    const dT = parseFloat(tempRise);
    const oz = parseFloat(copperWeight);

    if (isNaN(I) || isNaN(dT) || isNaN(oz) || I <= 0 || dT <= 0 || oz <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // IPC-2221 formula: A = (I / (k * dT^b))^(1/c)
    // where A is cross-sectional area in mils²
    const k = layer === 'external' ? 0.048 : 0.024;
    const b = 0.44;
    const c = 0.725;

    // Cross-sectional area in mils²
    const area = Math.pow(I / (k * Math.pow(dT, b)), 1 / c);

    // Copper thickness: 1 oz = 1.378 mils
    const thickness = oz * 1.378;

    // Width in mils
    const widthMils = area / thickness;
    const widthMm = widthMils * 0.0254;
    const widthInch = widthMils / 1000;

    // Resistance per inch (ρ for copper = 0.679 µΩ·in at 20°C)
    const resistancePerInch = 0.679 / area;
    const voltageDrop = resistancePerInch * I;

    const results = [
      '=== PCB Trace Width Calculator (IPC-2221) ===',
      '',
      `Current: ${I} A`,
      `Temperature Rise: ${dT} °C`,
      `Copper Weight: ${oz} oz (${thickness.toFixed(3)} mils)`,
      `Layer: ${layer === 'external' ? 'External (outer)' : 'Internal (inner)'}`,
      '',
      '--- Results ---',
      '',
      `Cross-sectional Area: ${area.toFixed(2)} mils²`,
      `Minimum Trace Width: ${widthMils.toFixed(2)} mils (${widthMm.toFixed(3)} mm)`,
      `                     ${widthInch.toFixed(4)} inches`,
      '',
      `Resistance: ${(resistancePerInch * 1000).toFixed(3)} mΩ/inch`,
      `Voltage Drop: ${(voltageDrop * 1000).toFixed(3)} mV/inch at ${I} A`,
      `Power Loss: ${(voltageDrop * I * 1000).toFixed(3)} mW/inch`,
      '',
      '--- Recommendations ---',
      `• Add 20-50% margin: ${(widthMils * 1.3).toFixed(1)} - ${(widthMils * 1.5).toFixed(1)} mils`,
      `• Standard width: ${Math.ceil(widthMils * 1.3 / 5) * 5} mils (rounded up)`,
      '• Use thermal relief for pads connected to power planes',
      '• Consider via stitching for high-current paths',
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current (A)</label>
              <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className="input-field" placeholder="e.g. 2" step="0.1" aria-label="Current in amps" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temp Rise (°C)</label>
              <input type="number" value={tempRise} onChange={e => setTempRise(e.target.value)} className="input-field" placeholder="e.g. 10" aria-label="Temperature rise in degrees C" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copper Weight (oz)</label>
              <select value={copperWeight} onChange={e => setCopperWeight(e.target.value)} className="input-field" aria-label="Copper weight in ounces">
                <option value="0.5">0.5 oz</option>
                <option value="1">1 oz</option>
                <option value="2">2 oz</option>
                <option value="3">3 oz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layer</label>
              <select value={layer} onChange={e => setLayer(e.target.value as 'external' | 'internal')} className="input-field" aria-label="PCB layer type">
                <option value="external">External (outer)</option>
                <option value="internal">Internal (inner)</option>
              </select>
            </div>
          </div>

          <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Calculate ${toolName}`}>
            Calculate Trace Width
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
