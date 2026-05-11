'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BraSizeConverter - Convert between US, UK, EU, AU bra sizes.
 * Maps band sizes and cup sizes across international sizing systems.
 */
export default function BraSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [system, setSystem] = useState<'us' | 'uk' | 'eu' | 'au'>('us');
  const [bandSize, setBandSize] = useState('34');
  const [cupSize, setCupSize] = useState('C');
  const [result, setResult] = useState<{ us: string; uk: string; eu: string; au: string } | null>(null);

  const usBands = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46];
  const euBands = [60, 65, 70, 75, 80, 85, 90, 95, 100, 105];
  const usCups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I'];
  const ukCups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G'];
  const euCups = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const convert = () => {
    let bandIndex: number;
    let cupIndex: number;

    const bandNum = parseInt(bandSize);

    if (system === 'us' || system === 'uk' || system === 'au') {
      bandIndex = usBands.indexOf(bandNum);
      if (bandIndex === -1) bandIndex = usBands.findIndex((b) => b >= bandNum);
      if (bandIndex === -1) bandIndex = usBands.length - 1;
    } else {
      bandIndex = euBands.indexOf(bandNum);
      if (bandIndex === -1) bandIndex = euBands.findIndex((b) => b >= bandNum);
      if (bandIndex === -1) bandIndex = euBands.length - 1;
    }

    const cupUpper = cupSize.toUpperCase();
    if (system === 'us') {
      cupIndex = usCups.indexOf(cupUpper);
    } else if (system === 'uk') {
      cupIndex = ukCups.indexOf(cupUpper);
    } else {
      cupIndex = euCups.indexOf(cupUpper);
    }
    if (cupIndex === -1) cupIndex = 2; // default to B

    const usBand = usBands[bandIndex] || 34;
    const euBand = euBands[bandIndex] || 75;

    setResult({
      us: `${usBand}${usCups[cupIndex] || 'C'}`,
      uk: `${usBand}${ukCups[cupIndex] || 'C'}`,
      eu: `${euBand}${euCups[cupIndex] || 'C'}`,
      au: `${usBand - 14}${usCups[cupIndex] || 'C'}`, // AU band = US band - 14 (approx)
    });
  };

  const getBandOptions = () => {
    if (system === 'eu') return euBands.map((b) => b.toString());
    return usBands.map((b) => b.toString());
  };

  const getCupOptions = () => {
    if (system === 'uk') return ukCups;
    if (system === 'eu') return euCups;
    return usCups;
  };

  const copyText = result
    ? `Bra Size Conversion:\nUS: ${result.us}\nUK: ${result.uk}\nEU: ${result.eu}\nAU: ${result.au}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
              Size System
            </label>
            <select id={`${toolId}-system`} value={system} onChange={(e) => setSystem(e.target.value as 'us' | 'uk' | 'eu' | 'au')} aria-label={`Size system for ${toolName}`} className="input-field">
              <option value="us">US</option>
              <option value="uk">UK</option>
              <option value="eu">EU</option>
              <option value="au">AU</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-band`} className="block text-sm font-medium text-gray-700 mb-1">
              Band Size
            </label>
            <select id={`${toolId}-band`} value={bandSize} onChange={(e) => setBandSize(e.target.value)} aria-label={`Band size for ${toolName}`} className="input-field">
              {getBandOptions().map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-cup`} className="block text-sm font-medium text-gray-700 mb-1">
              Cup Size
            </label>
            <select id={`${toolId}-cup`} value={cupSize} onChange={(e) => setCupSize(e.target.value)} aria-label={`Cup size for ${toolName}`} className="input-field">
              {getCupOptions().map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert Bra Size" className="btn-primary">
        Convert Size
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.au}</div>
                <div className="text-xs text-gray-500 mt-1">AU</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Note: Sizes are approximate. Fit may vary between brands.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
