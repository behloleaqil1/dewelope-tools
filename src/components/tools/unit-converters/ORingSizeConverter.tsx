'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ORingSizeConverter - Convert O-ring sizes between AS568, metric, and dimensions.
 * Provides inner diameter, outer diameter, and cross-section for standard sizes.
 */
export default function ORingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [searchType, setSearchType] = useState<'as568' | 'metric' | 'dimensions'>('as568');
  const [as568Number, setAs568Number] = useState('210');
  const [metricId, setMetricId] = useState('25');
  const [metricCs, setMetricCs] = useState('3');
  const [dimId, setDimId] = useState('');
  const [output, setOutput] = useState('');

  // Common AS568 O-ring sizes (dash number → ID inches, CS inches)
  const as568Sizes: Record<string, { id: number; cs: number; desc: string }> = {
    '006': { id: 0.114, cs: 0.070, desc: '-006' },
    '010': { id: 0.239, cs: 0.070, desc: '-010' },
    '012': { id: 0.364, cs: 0.070, desc: '-012' },
    '014': { id: 0.489, cs: 0.070, desc: '-014' },
    '016': { id: 0.614, cs: 0.070, desc: '-016' },
    '110': { id: 0.362, cs: 0.103, desc: '-110' },
    '112': { id: 0.487, cs: 0.103, desc: '-112' },
    '114': { id: 0.612, cs: 0.103, desc: '-114' },
    '116': { id: 0.737, cs: 0.103, desc: '-116' },
    '210': { id: 0.734, cs: 0.139, desc: '-210' },
    '212': { id: 0.859, cs: 0.139, desc: '-212' },
    '214': { id: 0.984, cs: 0.139, desc: '-214' },
    '216': { id: 1.109, cs: 0.139, desc: '-216' },
    '218': { id: 1.234, cs: 0.139, desc: '-218' },
    '220': { id: 1.359, cs: 0.139, desc: '-220' },
    '222': { id: 1.484, cs: 0.139, desc: '-222' },
    '224': { id: 1.609, cs: 0.139, desc: '-224' },
    '226': { id: 1.859, cs: 0.139, desc: '-226' },
    '228': { id: 2.109, cs: 0.139, desc: '-228' },
    '230': { id: 2.359, cs: 0.139, desc: '-230' },
    '310': { id: 0.612, cs: 0.210, desc: '-310' },
    '312': { id: 0.737, cs: 0.210, desc: '-312' },
    '314': { id: 0.862, cs: 0.210, desc: '-314' },
    '316': { id: 0.987, cs: 0.210, desc: '-316' },
    '318': { id: 1.112, cs: 0.210, desc: '-318' },
    '320': { id: 1.237, cs: 0.210, desc: '-320' },
    '325': { id: 1.549, cs: 0.210, desc: '-325' },
    '330': { id: 1.862, cs: 0.210, desc: '-330' },
    '340': { id: 2.487, cs: 0.210, desc: '-340' },
    '350': { id: 3.112, cs: 0.210, desc: '-350' },
  };

  const inchToMm = (inches: number) => inches * 25.4;

  const convert = () => {
    const results: string[] = [];

    switch (searchType) {
      case 'as568': {
        const key = as568Number.padStart(3, '0');
        const size = as568Sizes[key];
        if (!size) {
          setOutput(`AS568 dash number -${key} not found in database.\nAvailable: ${Object.keys(as568Sizes).map(k => '-' + k).join(', ')}`);
          return;
        }
        const idMm = inchToMm(size.id);
        const csMm = inchToMm(size.cs);
        const odIn = size.id + 2 * size.cs;
        const odMm = inchToMm(odIn);

        results.push(`=== AS568 ${size.desc} O-Ring ===`);
        results.push('');
        results.push('--- Imperial (inches) ---');
        results.push(`Inner Diameter (ID): ${size.id.toFixed(3)}"`);
        results.push(`Cross Section (CS): ${size.cs.toFixed(3)}"`);
        results.push(`Outer Diameter (OD): ${odIn.toFixed(3)}"`);
        results.push('');
        results.push('--- Metric (mm) ---');
        results.push(`Inner Diameter (ID): ${idMm.toFixed(2)} mm`);
        results.push(`Cross Section (CS): ${csMm.toFixed(2)} mm`);
        results.push(`Outer Diameter (OD): ${odMm.toFixed(2)} mm`);
        break;
      }
      case 'metric': {
        const id = parseFloat(metricId);
        const cs = parseFloat(metricCs);
        if (isNaN(id) || isNaN(cs) || id <= 0 || cs <= 0) {
          setOutput('Please enter valid positive values for ID and cross-section.');
          return;
        }
        const od = id + 2 * cs;
        const idIn = id / 25.4;
        const csIn = cs / 25.4;
        const odIn = od / 25.4;

        results.push(`=== Metric O-Ring (${id} × ${cs} mm) ===`);
        results.push('');
        results.push('--- Metric (mm) ---');
        results.push(`Inner Diameter (ID): ${id.toFixed(2)} mm`);
        results.push(`Cross Section (CS): ${cs.toFixed(2)} mm`);
        results.push(`Outer Diameter (OD): ${od.toFixed(2)} mm`);
        results.push('');
        results.push('--- Imperial (inches) ---');
        results.push(`Inner Diameter (ID): ${idIn.toFixed(4)}"`);
        results.push(`Cross Section (CS): ${csIn.toFixed(4)}"`);
        results.push(`Outer Diameter (OD): ${odIn.toFixed(4)}"`);
        results.push('');

        // Find closest AS568 match
        let closest = '';
        let minDiff = Infinity;
        Object.entries(as568Sizes).forEach(([key, s]) => {
          const diff = Math.abs(inchToMm(s.id) - id) + Math.abs(inchToMm(s.cs) - cs);
          if (diff < minDiff) {
            minDiff = diff;
            closest = key;
          }
        });
        if (closest && minDiff < 2) {
          results.push(`Closest AS568: -${closest} (difference: ${minDiff.toFixed(2)} mm total)`);
        }
        break;
      }
      case 'dimensions': {
        const searchId = parseFloat(dimId);
        if (isNaN(searchId) || searchId <= 0) {
          setOutput('Please enter a valid inner diameter to search.');
          return;
        }
        results.push(`=== Searching for ID ≈ ${searchId} mm ===`);
        results.push('');

        const matches: { key: string; size: typeof as568Sizes[string]; diff: number }[] = [];
        Object.entries(as568Sizes).forEach(([key, s]) => {
          const idMm = inchToMm(s.id);
          const diff = Math.abs(idMm - searchId);
          if (diff < 5) {
            matches.push({ key, size: s, diff });
          }
        });

        matches.sort((a, b) => a.diff - b.diff);

        if (matches.length === 0) {
          results.push('No close matches found in AS568 database.');
        } else {
          results.push('Closest AS568 matches:');
          results.push('');
          matches.slice(0, 5).forEach(m => {
            const idMm = inchToMm(m.size.id);
            const csMm = inchToMm(m.size.cs);
            results.push(`  -${m.key}: ID=${idMm.toFixed(2)}mm, CS=${csMm.toFixed(2)}mm (diff: ${m.diff.toFixed(2)}mm)`);
          });
        }
        break;
      }
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Search By
            </label>
            <select
              id={`${toolId}-type`}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as typeof searchType)}
              aria-label={`Search type for ${toolName}`}
              className="input-field"
            >
              <option value="as568">AS568 Dash Number</option>
              <option value="metric">Metric Size (ID × CS)</option>
              <option value="dimensions">Search by Inner Diameter</option>
            </select>
          </div>

          {searchType === 'as568' && (
            <div>
              <label htmlFor={`${toolId}-as568`} className="block text-sm font-medium text-gray-700 mb-1">
                AS568 Dash Number
              </label>
              <input
                id={`${toolId}-as568`}
                type="text"
                value={as568Number}
                onChange={(e) => setAs568Number(e.target.value)}
                placeholder="e.g., 210"
                aria-label="AS568 dash number"
                className="input-field"
              />
            </div>
          )}

          {searchType === 'metric' && (
            <>
              <div>
                <label htmlFor={`${toolId}-metricid`} className="block text-sm font-medium text-gray-700 mb-1">
                  Inner Diameter (mm)
                </label>
                <input
                  id={`${toolId}-metricid`}
                  type="number"
                  value={metricId}
                  onChange={(e) => setMetricId(e.target.value)}
                  placeholder="e.g., 25"
                  aria-label="Metric inner diameter"
                  className="input-field"
                  step="any"
                />
              </div>
              <div>
                <label htmlFor={`${toolId}-metriccs`} className="block text-sm font-medium text-gray-700 mb-1">
                  Cross Section (mm)
                </label>
                <input
                  id={`${toolId}-metriccs`}
                  type="number"
                  value={metricCs}
                  onChange={(e) => setMetricCs(e.target.value)}
                  placeholder="e.g., 3"
                  aria-label="Metric cross section"
                  className="input-field"
                  step="any"
                />
              </div>
            </>
          )}

          {searchType === 'dimensions' && (
            <div>
              <label htmlFor={`${toolId}-dimid`} className="block text-sm font-medium text-gray-700 mb-1">
                Inner Diameter to Search (mm)
              </label>
              <input
                id={`${toolId}-dimid`}
                type="number"
                value={dimId}
                onChange={(e) => setDimId(e.target.value)}
                placeholder="e.g., 18.64"
                aria-label="Search inner diameter"
                className="input-field"
                step="any"
              />
            </div>
          )}
        </div>

        <button
          onClick={convert}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Convert / Search
        </button>
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
