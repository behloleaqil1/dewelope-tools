'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const GAUGE_TABLE: Record<number, { steel: number; aluminum: number; stainless: number }> = {
  3: { steel: 6.073, aluminum: 5.827, stainless: 6.073 },
  4: { steel: 5.695, aluminum: 5.189, stainless: 5.695 },
  5: { steel: 5.314, aluminum: 4.620, stainless: 5.314 },
  6: { steel: 4.935, aluminum: 4.115, stainless: 4.935 },
  7: { steel: 4.554, aluminum: 3.665, stainless: 4.554 },
  8: { steel: 4.176, aluminum: 3.264, stainless: 4.176 },
  9: { steel: 3.797, aluminum: 2.906, stainless: 3.797 },
  10: { steel: 3.416, aluminum: 2.588, stainless: 3.416 },
  11: { steel: 3.038, aluminum: 2.305, stainless: 3.038 },
  12: { steel: 2.657, aluminum: 2.053, stainless: 2.657 },
  13: { steel: 2.278, aluminum: 1.828, stainless: 2.278 },
  14: { steel: 1.897, aluminum: 1.628, stainless: 1.897 },
  15: { steel: 1.709, aluminum: 1.450, stainless: 1.709 },
  16: { steel: 1.519, aluminum: 1.291, stainless: 1.519 },
  17: { steel: 1.367, aluminum: 1.150, stainless: 1.367 },
  18: { steel: 1.214, aluminum: 1.024, stainless: 1.214 },
  19: { steel: 1.062, aluminum: 0.912, stainless: 1.062 },
  20: { steel: 0.912, aluminum: 0.813, stainless: 0.912 },
  21: { steel: 0.836, aluminum: 0.724, stainless: 0.836 },
  22: { steel: 0.759, aluminum: 0.643, stainless: 0.759 },
  23: { steel: 0.683, aluminum: 0.574, stainless: 0.683 },
  24: { steel: 0.607, aluminum: 0.511, stainless: 0.607 },
  25: { steel: 0.531, aluminum: 0.455, stainless: 0.531 },
  26: { steel: 0.455, aluminum: 0.404, stainless: 0.455 },
  27: { steel: 0.417, aluminum: 0.361, stainless: 0.417 },
  28: { steel: 0.378, aluminum: 0.321, stainless: 0.378 },
  30: { steel: 0.305, aluminum: 0.254, stainless: 0.305 },
};

export default function SheetMetalGaugeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gauge, setGauge] = useState('18');
  const [material, setMaterial] = useState<'steel' | 'aluminum' | 'stainless'>('steel');
  const [output, setOutput] = useState('');

  const convert = () => {
    const g = parseInt(gauge);
    const entry = GAUGE_TABLE[g];
    if (!entry) {
      setOutput(`Gauge ${g} not found. Supported gauges: ${Object.keys(GAUGE_TABLE).join(', ')}`);
      return;
    }
    const mm = entry[material];
    const inches = mm / 25.4;

    const lines = [
      `=== Sheet Metal Gauge Conversion ===`,
      ``,
      `Gauge: ${g}`,
      `Material: ${material.charAt(0).toUpperCase() + material.slice(1)}`,
      ``,
      `Thickness: ${mm.toFixed(3)} mm`,
      `Thickness: ${inches.toFixed(4)} inches`,
      `Thickness: ${(inches * 1000).toFixed(1)} mils (thousandths)`,
      ``,
      `--- All Materials at Gauge ${g} ---`,
      `Steel:     ${entry.steel.toFixed(3)} mm (${(entry.steel / 25.4).toFixed(4)}")`,
      `Aluminum:  ${entry.aluminum.toFixed(3)} mm (${(entry.aluminum / 25.4).toFixed(4)}")`,
      `Stainless: ${entry.stainless.toFixed(3)} mm (${(entry.stainless / 25.4).toFixed(4)}")`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-gauge`} className="block text-sm font-medium text-gray-700 mb-1">Gauge Number</label>
            <select id={`${toolId}-gauge`} value={gauge} onChange={(e) => setGauge(e.target.value)} className="input-field" aria-label={`Gauge number for ${toolName}`}>
              {Object.keys(GAUGE_TABLE).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-material`} className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <select id={`${toolId}-material`} value={material} onChange={(e) => setMaterial(e.target.value as 'steel' | 'aluminum' | 'stainless')} className="input-field" aria-label="Material type">
              <option value="steel">Steel</option>
              <option value="aluminum">Aluminum</option>
              <option value="stainless">Stainless Steel</option>
            </select>
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-3">Convert Gauge</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
