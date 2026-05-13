'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerImpedanceCalculator - Calculate combined speaker impedance.
 * Supports series and parallel configurations with multiple speakers.
 */
export default function SpeakerImpedanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [impedances, setImpedances] = useState('8, 8');
  const [config, setConfig] = useState<'series' | 'parallel' | 'series-parallel'>('parallel');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const values = impedances
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((v) => !isNaN(v) && v > 0);

    if (values.length < 2) {
      setOutput('Please enter at least 2 impedance values separated by commas.');
      return;
    }

    let totalSeries = 0;
    let totalParallel = 0;
    let totalSeriesParallel = 0;

    // Series: Z_total = Z1 + Z2 + ... + Zn
    totalSeries = values.reduce((sum, z) => sum + z, 0);

    // Parallel: 1/Z_total = 1/Z1 + 1/Z2 + ... + 1/Zn
    const reciprocalSum = values.reduce((sum, z) => sum + 1 / z, 0);
    totalParallel = 1 / reciprocalSum;

    // Series-Parallel (pairs in series, then parallel)
    if (values.length >= 4 && values.length % 2 === 0) {
      const pairs: number[] = [];
      for (let i = 0; i < values.length; i += 2) {
        pairs.push(values[i] + values[i + 1]);
      }
      const pairReciprocal = pairs.reduce((sum, z) => sum + 1 / z, 0);
      totalSeriesParallel = 1 / pairReciprocal;
    }

    const ampSafe4 = totalParallel >= 4 ? '✓ Safe for most amplifiers (≥4Ω)' : '⚠ Below 4Ω — check amplifier specs';
    const ampSafe2 = totalParallel >= 2 ? '' : '⚠ Below 2Ω — risk of amplifier damage';

    const results = [
      `═══ Speaker Impedance Calculator ═══`,
      ``,
      `Input Speakers: ${values.map((v) => v + 'Ω').join(', ')}`,
      `Number of speakers: ${values.length}`,
      ``,
      `Series Connection (daisy chain):`,
      `  Total: ${totalSeries.toFixed(2)} Ω`,
      `  Formula: ${values.join(' + ')} = ${totalSeries.toFixed(2)} Ω`,
      ``,
      `Parallel Connection:`,
      `  Total: ${totalParallel.toFixed(2)} Ω`,
      `  Formula: 1/(${values.map((v) => '1/' + v).join(' + ')}) = ${totalParallel.toFixed(2)} Ω`,
      `  ${ampSafe4}`,
      ampSafe2 ? `  ${ampSafe2}` : '',
      ``,
    ];

    if (totalSeriesParallel > 0) {
      results.push(
        `Series-Parallel (pairs in series, then parallel):`,
        `  Total: ${totalSeriesParallel.toFixed(2)} Ω`,
        ``
      );
    }

    results.push(
      `Power Distribution (parallel, 100W amp):`,
      ...values.map((z, i) => `  Speaker ${i + 1} (${z}Ω): ${((totalParallel / z) * 100).toFixed(1)}% → ${((totalParallel / z) * 100).toFixed(1)}W`),
      ``,
      `Common Safe Impedance Ranges:`,
      `  Most home amps: 4Ω minimum`,
      `  Pro audio amps: 2Ω minimum`,
      `  Tube amps: Match exactly (4, 8, or 16Ω)`,
    );

    setOutput(results.filter(Boolean).join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-imp`} className="block text-sm font-medium text-gray-700 mb-1">Speaker Impedances (Ω, comma-separated)</label>
            <input id={`${toolId}-imp`} type="text" value={impedances} onChange={(e) => setImpedances(e.target.value)} placeholder="e.g. 8, 8, 4" className="input-field" aria-label={`Speaker impedances for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-config`} className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
            <select id={`${toolId}-config`} value={config} onChange={(e) => setConfig(e.target.value as 'series' | 'parallel' | 'series-parallel')} className="input-field" aria-label="Wiring configuration">
              <option value="parallel">Parallel</option>
              <option value="series">Series</option>
              <option value="series-parallel">Series-Parallel</option>
            </select>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Impedance</button>
        </div>
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
