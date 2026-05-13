'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SpeakerCrossoverCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [crossoverType, setCrossoverType] = useState('2way');
  const [order, setOrder] = useState('1');
  const [impedance, setImpedance] = useState('8');
  const [freq1, setFreq1] = useState('3000');
  const [freq2, setFreq2] = useState('500');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const z = parseFloat(impedance);
    const f1 = parseFloat(freq1);
    const f2 = parseFloat(freq2);
    const n = parseInt(order);

    if (isNaN(z) || isNaN(f1) || z <= 0 || f1 <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    const calcComponents = (freq: number, impedanceOhm: number, filterOrder: number) => {
      const cap = 1 / (2 * Math.PI * freq * impedanceOhm);
      const ind = impedanceOhm / (2 * Math.PI * freq);

      if (filterOrder === 1) {
        return { lowCap: cap, lowInd: ind, highCap: cap, highInd: ind };
      } else if (filterOrder === 2) {
        return {
          lowCap: Math.sqrt(2) * cap,
          lowInd: ind / Math.sqrt(2),
          highCap: cap / Math.sqrt(2),
          highInd: Math.sqrt(2) * ind,
        };
      } else {
        return {
          lowCap: 2 * cap,
          lowInd: ind / 2,
          highCap: cap / 2,
          highInd: 2 * ind,
        };
      }
    };

    const formatValue = (val: number, unit: string) => {
      if (unit === 'F') {
        if (val >= 1e-3) return `${(val * 1e3).toFixed(2)} mF`;
        if (val >= 1e-6) return `${(val * 1e6).toFixed(2)} µF`;
        return `${(val * 1e9).toFixed(2)} nF`;
      } else {
        if (val >= 1) return `${val.toFixed(3)} H`;
        if (val >= 1e-3) return `${(val * 1e3).toFixed(3)} mH`;
        return `${(val * 1e6).toFixed(2)} µH`;
      }
    };

    const lines: string[] = [];
    lines.push(`=== ${crossoverType === '2way' ? '2-Way' : '3-Way'} Crossover Calculator ===`);
    lines.push(`Order: ${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'rd'} (${n === 1 ? 'Butterworth 6dB/oct' : n === 2 ? 'Butterworth 12dB/oct' : 'Butterworth 18dB/oct'})`);
    lines.push(`Impedance: ${z} Ω`);
    lines.push('');

    const comp1 = calcComponents(f1, z, n);
    lines.push(`--- Crossover @ ${f1} Hz ---`);
    lines.push(`Low-Pass: C = ${formatValue(comp1.lowCap, 'F')}, L = ${formatValue(comp1.lowInd, 'H')}`);
    lines.push(`High-Pass: C = ${formatValue(comp1.highCap, 'F')}, L = ${formatValue(comp1.highInd, 'H')}`);

    if (crossoverType === '3way' && !isNaN(f2) && f2 > 0) {
      lines.push('');
      const comp2 = calcComponents(f2, z, n);
      lines.push(`--- Crossover @ ${f2} Hz ---`);
      lines.push(`Low-Pass: C = ${formatValue(comp2.lowCap, 'F')}, L = ${formatValue(comp2.lowInd, 'H')}`);
      lines.push(`High-Pass: C = ${formatValue(comp2.highCap, 'F')}, L = ${formatValue(comp2.highInd, 'H')}`);
      lines.push('');
      lines.push(`Woofer: Low-pass @ ${f2} Hz`);
      lines.push(`Midrange: High-pass @ ${f2} Hz + Low-pass @ ${f1} Hz`);
      lines.push(`Tweeter: High-pass @ ${f1} Hz`);
    } else if (crossoverType === '2way') {
      lines.push('');
      lines.push(`Woofer: Low-pass @ ${f1} Hz`);
      lines.push(`Tweeter: High-pass @ ${f1} Hz`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crossover Type</label>
            <select value={crossoverType} onChange={(e) => setCrossoverType(e.target.value)} className="input-field" aria-label={`Crossover type for ${toolName}`}>
              <option value="2way">2-Way</option>
              <option value="3way">3-Way</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Order</label>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="input-field" aria-label="Filter order">
              <option value="1">1st Order (6 dB/oct)</option>
              <option value="2">2nd Order (12 dB/oct)</option>
              <option value="3">3rd Order (18 dB/oct)</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Impedance (Ω)</label>
          <input type="number" value={impedance} onChange={(e) => setImpedance(e.target.value)} className="input-field" aria-label="Speaker impedance" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crossover Frequency (Hz)</label>
            <input type="number" value={freq1} onChange={(e) => setFreq1(e.target.value)} className="input-field" aria-label="Crossover frequency" />
          </div>
          {crossoverType === '3way' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Crossover (Hz)</label>
              <input type="number" value={freq2} onChange={(e) => setFreq2(e.target.value)} className="input-field" aria-label="Low crossover frequency" />
            </div>
          )}
        </div>

        <button onClick={calculate} className="btn-primary">Calculate Components</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
