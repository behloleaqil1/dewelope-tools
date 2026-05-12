'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpringWireGaugeConverter - Convert spring wire gauge to diameter.
 * Supports SWG (Standard Wire Gauge), AWG (American Wire Gauge), and metric.
 */

const SWG_TABLE: Record<number, number> = {
  0: 8.230, 1: 7.620, 2: 7.010, 3: 6.401, 4: 5.893,
  5: 5.385, 6: 4.877, 7: 4.470, 8: 4.064, 9: 3.658,
  10: 3.251, 11: 2.946, 12: 2.642, 13: 2.337, 14: 2.032,
  15: 1.829, 16: 1.626, 17: 1.422, 18: 1.219, 19: 1.016,
  20: 0.914, 21: 0.813, 22: 0.711, 23: 0.610, 24: 0.559,
  25: 0.508, 26: 0.457, 27: 0.417, 28: 0.376, 29: 0.345,
  30: 0.315, 31: 0.295, 32: 0.274, 33: 0.254, 34: 0.234,
  35: 0.213, 36: 0.193, 37: 0.173, 38: 0.152, 39: 0.132,
  40: 0.122,
};

const AWG_TABLE: Record<number, number> = {
  0: 8.251, 1: 7.348, 2: 6.544, 3: 5.827, 4: 5.189,
  5: 4.621, 6: 4.115, 7: 3.665, 8: 3.264, 9: 2.906,
  10: 2.588, 11: 2.305, 12: 2.053, 13: 1.828, 14: 1.628,
  15: 1.450, 16: 1.291, 17: 1.150, 18: 1.024, 19: 0.912,
  20: 0.812, 21: 0.723, 22: 0.644, 23: 0.573, 24: 0.511,
  25: 0.455, 26: 0.405, 27: 0.361, 28: 0.321, 29: 0.286,
  30: 0.255, 31: 0.227, 32: 0.202, 33: 0.180, 34: 0.160,
  35: 0.143, 36: 0.127, 37: 0.113, 38: 0.101, 39: 0.090,
  40: 0.080,
};

export default function SpringWireGaugeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gauge, setGauge] = useState('');
  const [standard, setStandard] = useState<'swg' | 'awg'>('swg');
  const [output, setOutput] = useState('');

  const convert = () => {
    const g = parseInt(gauge, 10);
    const table = standard === 'swg' ? SWG_TABLE : AWG_TABLE;

    if (isNaN(g) || g < 0 || g > 40) {
      setOutput('Error: Please enter a gauge number between 0 and 40.');
      return;
    }

    const diameter = table[g];
    if (diameter === undefined) {
      setOutput('Error: Gauge not found in table.');
      return;
    }

    const diameterInch = diameter / 25.4;
    const area = Math.PI * (diameter / 2) ** 2;

    const lines: string[] = [];
    lines.push(`═══ ${standard.toUpperCase()} Gauge ${g} ═══`);
    lines.push('');
    lines.push(`Diameter: ${diameter.toFixed(3)} mm`);
    lines.push(`Diameter: ${diameterInch.toFixed(4)} inches`);
    lines.push(`Cross-sectional area: ${area.toFixed(4)} mm²`);
    lines.push('');
    lines.push('─── Reference Table (nearby gauges) ───');

    const start = Math.max(0, g - 3);
    const end = Math.min(40, g + 3);
    for (let i = start; i <= end; i++) {
      const d = table[i];
      if (d !== undefined) {
        const marker = i === g ? ' ◄' : '';
        lines.push(`  Gauge ${i.toString().padStart(2)}: ${d.toFixed(3)} mm (${(d / 25.4).toFixed(4)} in)${marker}`);
      }
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-standard`} className="block text-sm font-medium text-gray-700 mb-1">Wire Gauge Standard</label>
            <select id={`${toolId}-standard`} value={standard} onChange={(e) => setStandard(e.target.value as 'swg' | 'awg')} className="input-field" aria-label={`Standard for ${toolName}`}>
              <option value="swg">SWG (Standard Wire Gauge)</option>
              <option value="awg">AWG (American Wire Gauge)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-gauge`} className="block text-sm font-medium text-gray-700 mb-1">Gauge Number (0-40)</label>
            <input id={`${toolId}-gauge`} type="number" value={gauge} onChange={(e) => setGauge(e.target.value)} placeholder="18" min="0" max="40" className="input-field" aria-label="Gauge number" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert Gauge</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wire Gauge Conversion</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
