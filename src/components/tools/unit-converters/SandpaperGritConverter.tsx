'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SandpaperGritConverter - Convert sandpaper grit between CAMI (US), FEPA (European P-grade), and micron ratings.
 */
export default function SandpaperGritConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gritValue, setGritValue] = useState('');
  const [standard, setStandard] = useState<'cami' | 'fepa' | 'micron'>('cami');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Lookup table: CAMI grit -> approximate micron and FEPA equivalent
  const gritTable: { cami: number; fepa: string; micron: number }[] = [
    { cami: 60, fepa: 'P60', micron: 269 },
    { cami: 80, fepa: 'P80', micron: 201 },
    { cami: 100, fepa: 'P100', micron: 162 },
    { cami: 120, fepa: 'P120', micron: 125 },
    { cami: 150, fepa: 'P150', micron: 100 },
    { cami: 180, fepa: 'P180', micron: 82 },
    { cami: 220, fepa: 'P220', micron: 68 },
    { cami: 240, fepa: 'P240', micron: 58.5 },
    { cami: 280, fepa: 'P280', micron: 52.2 },
    { cami: 320, fepa: 'P320', micron: 46.2 },
    { cami: 360, fepa: 'P360', micron: 40.5 },
    { cami: 400, fepa: 'P400', micron: 35 },
    { cami: 500, fepa: 'P500', micron: 30.2 },
    { cami: 600, fepa: 'P600', micron: 25.8 },
    { cami: 800, fepa: 'P800', micron: 21.8 },
    { cami: 1000, fepa: 'P1000', micron: 18.3 },
    { cami: 1200, fepa: 'P1200', micron: 15.3 },
    { cami: 1500, fepa: 'P1500', micron: 12.6 },
    { cami: 2000, fepa: 'P2000', micron: 10.3 },
    { cami: 2500, fepa: 'P2500', micron: 8.4 },
  ];

  function findClosest(value: number, key: 'cami' | 'micron'): typeof gritTable[0] | null {
    if (gritTable.length === 0) return null;
    let closest = gritTable[0];
    let minDiff = Math.abs(gritTable[0][key] - value);
    for (const entry of gritTable) {
      const diff = Math.abs(entry[key] - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = entry;
      }
    }
    return closest;
  }

  function findByFepa(value: string): typeof gritTable[0] | null {
    const normalized = value.toUpperCase().startsWith('P') ? value.toUpperCase() : `P${value.toUpperCase()}`;
    return gritTable.find((e) => e.fepa === normalized) || null;
  }

  function handleConvert() {
    setError('');
    setOutput('');

    if (!gritValue.trim()) {
      setError('Please enter a grit value.');
      return;
    }

    let match: typeof gritTable[0] | null = null;

    if (standard === 'cami') {
      const num = parseFloat(gritValue);
      if (isNaN(num) || num <= 0) {
        setError('Please enter a valid positive number.');
        return;
      }
      match = findClosest(num, 'cami');
    } else if (standard === 'fepa') {
      match = findByFepa(gritValue);
      if (!match) {
        setError('FEPA grade not found. Try values like P60, P120, P400, etc.');
        return;
      }
    } else {
      const num = parseFloat(gritValue);
      if (isNaN(num) || num <= 0) {
        setError('Please enter a valid positive micron value.');
        return;
      }
      match = findClosest(num, 'micron');
    }

    if (!match) {
      setError('Could not find a matching grit value.');
      return;
    }

    const lines = [
      `=== Sandpaper Grit Conversion ===`,
      ``,
      `CAMI (US) Grit: ${match.cami}`,
      `FEPA (European): ${match.fepa}`,
      `Particle Size: ~${match.micron} microns (μm)`,
      ``,
      `--- Usage Guide ---`,
      match.micron > 100 ? `Coarse: Good for heavy material removal, shaping` :
      match.micron > 50 ? `Medium: Good for smoothing, removing scratches` :
      match.micron > 20 ? `Fine: Good for finishing, between coats` :
      `Very Fine: Good for final finishing, polishing`,
    ];

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-standard`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Standard
        </label>
        <select
          id={`${toolId}-standard`}
          value={standard}
          onChange={(e) => setStandard(e.target.value as 'cami' | 'fepa' | 'micron')}
          className="input-field mb-3"
          aria-label={`Standard for ${toolName}`}
        >
          <option value="cami">CAMI (US Grit Number)</option>
          <option value="fepa">FEPA (European P-Grade)</option>
          <option value="micron">Micron (μm)</option>
        </select>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Grit Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          value={gritValue}
          onChange={(e) => setGritValue(e.target.value)}
          placeholder={standard === 'fepa' ? 'e.g. P120' : 'e.g. 120'}
          aria-label={`Grit value for ${toolName}`}
          className="input-field mb-3"
        />
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Convert
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

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
