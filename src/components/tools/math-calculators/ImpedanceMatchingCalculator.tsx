'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImpedanceMatchingCalculator - Calculate impedance matching network (L-network).
 * Computes component values for L-network matching between source and load impedances.
 */
export default function ImpedanceMatchingCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sourceZ, setSourceZ] = useState('50');
  const [loadZ, setLoadZ] = useState('100');
  const [frequency, setFrequency] = useState('100');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rs = parseFloat(sourceZ);
    const rl = parseFloat(loadZ);
    const f = parseFloat(frequency);

    if (isNaN(rs) || isNaN(rl) || isNaN(f) || rs <= 0 || rl <= 0 || f <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    if (rs === rl) {
      setOutput('Source and load impedances are already matched. No network needed.');
      return;
    }

    const freqHz = freqUnit === 'GHz' ? f * 1e9 : freqUnit === 'MHz' ? f * 1e6 : freqUnit === 'kHz' ? f * 1e3 : f;
    const omega = 2 * Math.PI * freqHz;

    // L-network calculation
    // Ensure RL > RS for standard L-network (swap if needed)
    const rHigh = Math.max(rs, rl);
    const rLow = Math.min(rs, rl);

    const Q = Math.sqrt(rHigh / rLow - 1);
    const xSeries = Q * rLow;
    const xShunt = rHigh / Q;

    // Component values
    const lSeries = xSeries / omega;
    const cShunt = 1 / (omega * xShunt);
    const cSeries = 1 / (omega * xSeries);
    const lShunt = xShunt / omega;

    const formatValue = (val: number, unit: string) => {
      if (val >= 1e-3) return `${(val * 1e3).toFixed(4)} m${unit}`;
      if (val >= 1e-6) return `${(val * 1e6).toFixed(4)} µ${unit}`;
      if (val >= 1e-9) return `${(val * 1e9).toFixed(4)} n${unit}`;
      return `${(val * 1e12).toFixed(4)} p${unit}`;
    };

    const lines: string[] = [];
    lines.push(`=== Impedance Matching L-Network ===`);
    lines.push(`Source: ${rs} Ω → Load: ${rl} Ω`);
    lines.push(`Frequency: ${f} ${freqUnit}`);
    lines.push(`Q Factor: ${Q.toFixed(4)}`);
    lines.push(``);
    lines.push(`--- Solution 1: Series L + Shunt C ---`);
    lines.push(`Series Inductor (${rs < rl ? 'source side' : 'load side'}): ${formatValue(lSeries, 'H')}`);
    lines.push(`Shunt Capacitor (across ${rs < rl ? 'load' : 'source'}): ${formatValue(cShunt, 'F')}`);
    lines.push(``);
    lines.push(`--- Solution 2: Series C + Shunt L ---`);
    lines.push(`Series Capacitor (${rs < rl ? 'source side' : 'load side'}): ${formatValue(cSeries, 'F')}`);
    lines.push(`Shunt Inductor (across ${rs < rl ? 'load' : 'source'}): ${formatValue(lShunt, 'H')}`);
    lines.push(``);
    lines.push(`Reactances:`);
    lines.push(`  X_series = ${xSeries.toFixed(4)} Ω`);
    lines.push(`  X_shunt  = ${xShunt.toFixed(4)} Ω`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source Impedance (Ω)</label>
              <input id={`${toolId}-source`} type="number" value={sourceZ} onChange={(e) => setSourceZ(e.target.value)} className="input-field" aria-label={`Source impedance for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-load`} className="block text-sm font-medium text-gray-700 mb-1">Load Impedance (Ω)</label>
              <input id={`${toolId}-load`} type="number" value={loadZ} onChange={(e) => setLoadZ(e.target.value)} className="input-field" aria-label="Load impedance" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-unit`} value={freqUnit} onChange={(e) => setFreqUnit(e.target.value)} className="input-field" aria-label="Frequency unit">
                <option value="Hz">Hz</option>
                <option value="kHz">kHz</option>
                <option value="MHz">MHz</option>
                <option value="GHz">GHz</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate L-Network</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
