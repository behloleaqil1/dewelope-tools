'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WireDiameterConverter - Convert wire diameter between SWG, BWG, and mm.
 * Standard Wire Gauge (Imperial), Birmingham Wire Gauge, and metric millimeters.
 */
export default function WireDiameterConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'mm' | 'swg' | 'bwg'>('mm');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // SWG gauge to mm mapping (common gauges 0-50)
  const swgToMm: Record<number, number> = {
    0: 8.230, 1: 7.620, 2: 7.010, 3: 6.401, 4: 5.893,
    5: 5.385, 6: 4.877, 7: 4.470, 8: 4.064, 9: 3.658,
    10: 3.251, 11: 2.946, 12: 2.642, 13: 2.337, 14: 2.032,
    15: 1.829, 16: 1.626, 17: 1.422, 18: 1.219, 19: 1.016,
    20: 0.914, 21: 0.813, 22: 0.711, 23: 0.610, 24: 0.559,
    25: 0.508, 26: 0.457, 27: 0.417, 28: 0.376, 29: 0.345,
    30: 0.315, 31: 0.295, 32: 0.274, 33: 0.254, 34: 0.234,
    35: 0.213, 36: 0.193, 37: 0.173, 38: 0.152, 39: 0.132,
    40: 0.122, 41: 0.112, 42: 0.102, 43: 0.091, 44: 0.081,
    45: 0.071, 46: 0.061, 47: 0.051, 48: 0.041, 49: 0.031, 50: 0.025,
  };

  // BWG gauge to mm mapping (common gauges 0-36)
  const bwgToMm: Record<number, number> = {
    0: 8.636, 1: 7.620, 2: 7.214, 3: 6.579, 4: 6.045,
    5: 5.588, 6: 5.156, 7: 4.572, 8: 4.191, 9: 3.759,
    10: 3.404, 11: 3.048, 12: 2.769, 13: 2.413, 14: 2.108,
    15: 1.829, 16: 1.651, 17: 1.473, 18: 1.245, 19: 1.067,
    20: 0.889, 21: 0.813, 22: 0.711, 23: 0.635, 24: 0.559,
    25: 0.508, 26: 0.457, 27: 0.406, 28: 0.356, 29: 0.330,
    30: 0.305, 31: 0.254, 32: 0.229, 33: 0.203, 34: 0.178,
    35: 0.165, 36: 0.152,
  };

  function findClosestGauge(mm: number, table: Record<number, number>): { gauge: number; mm: number } {
    let closest = { gauge: 0, mm: table[0] };
    let minDiff = Math.abs(mm - table[0]);
    for (const [g, v] of Object.entries(table)) {
      const diff = Math.abs(mm - v);
      if (diff < minDiff) {
        minDiff = diff;
        closest = { gauge: parseInt(g), mm: v };
      }
    }
    return closest;
  }

  function handleConvert() {
    setError('');
    setOutput('');
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a positive number.');
      return;
    }

    let mm: number;
    if (fromUnit === 'mm') {
      mm = val;
    } else if (fromUnit === 'swg') {
      const gauge = Math.round(val);
      if (gauge < 0 || gauge > 50 || !(gauge in swgToMm)) {
        setError('SWG gauge must be between 0 and 50.');
        return;
      }
      mm = swgToMm[gauge];
    } else {
      const gauge = Math.round(val);
      if (gauge < 0 || gauge > 36 || !(gauge in bwgToMm)) {
        setError('BWG gauge must be between 0 and 36.');
        return;
      }
      mm = bwgToMm[gauge];
    }

    const inches = mm / 25.4;
    const closestSWG = findClosestGauge(mm, swgToMm);
    const closestBWG = findClosestGauge(mm, bwgToMm);

    const lines = [
      `Wire Diameter Conversion`,
      `────────────────────────────`,
      `Metric:     ${mm.toFixed(3)} mm`,
      `Imperial:   ${inches.toFixed(4)} inches`,
      `────────────────────────────`,
      `Closest SWG: Gauge ${closestSWG.gauge} (${closestSWG.mm.toFixed(3)} mm)`,
      `Closest BWG: Gauge ${closestBWG.gauge} (${closestBWG.mm.toFixed(3)} mm)`,
      `────────────────────────────`,
      `AWG approx:  ${(Math.log(mm / 0.127) / Math.log(92 ** (1 / 39)) - 36).toFixed(1)} (estimated)`,
    ];
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input id={`${toolId}-value`} type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" aria-label={`Wire diameter value for ${toolName}`} className="input-field" min="0" step="0.001" />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
            <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value as 'mm' | 'swg' | 'bwg')} aria-label="Source unit" className="input-field">
              <option value="mm">Millimeters (mm)</option>
              <option value="swg">SWG (Standard Wire Gauge)</option>
              <option value="bwg">BWG (Birmingham Wire Gauge)</option>
            </select>
          </div>
        </div>
        <button onClick={handleConvert} className="btn-primary mt-3">Convert</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
