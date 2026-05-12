'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface SizeResult {
  us: string;
  uk: string;
  eu: string;
  au: string;
}

const BAND_SIZES: { us: number; uk: number; eu: number; au: number }[] = [
  { us: 28, uk: 28, eu: 60, au: 6 },
  { us: 30, uk: 30, eu: 65, au: 8 },
  { us: 32, uk: 32, eu: 70, au: 10 },
  { us: 34, uk: 34, eu: 75, au: 12 },
  { us: 36, uk: 36, eu: 80, au: 14 },
  { us: 38, uk: 38, eu: 85, au: 16 },
  { us: 40, uk: 40, eu: 90, au: 18 },
  { us: 42, uk: 42, eu: 95, au: 20 },
  { us: 44, uk: 44, eu: 100, au: 22 },
  { us: 46, uk: 46, eu: 105, au: 24 },
];

const CUP_SIZES_US = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J'];
const CUP_SIZES_UK = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG'];
const CUP_SIZES_EU = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const CUP_SIZES_AU = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'G', 'H', 'I'];

/**
 * BraSizeConverter - Convert bra sizes between US, UK, EU, and AU systems.
 */
export default function BraSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fromSystem, setFromSystem] = useState('us');
  const [bandSize, setBandSize] = useState('');
  const [cupSize, setCupSize] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<SizeResult | null>(null);

  const systems = [
    { value: 'us', label: 'US' },
    { value: 'uk', label: 'UK' },
    { value: 'eu', label: 'EU' },
    { value: 'au', label: 'AU' },
  ];

  function getCupOptions(): string[] {
    switch (fromSystem) {
      case 'us': return CUP_SIZES_US;
      case 'uk': return CUP_SIZES_UK;
      case 'eu': return CUP_SIZES_EU;
      case 'au': return CUP_SIZES_AU;
      default: return CUP_SIZES_US;
    }
  }

  function getBandOptions(): string[] {
    switch (fromSystem) {
      case 'us': return BAND_SIZES.map(b => b.us.toString());
      case 'uk': return BAND_SIZES.map(b => b.uk.toString());
      case 'eu': return BAND_SIZES.map(b => b.eu.toString());
      case 'au': return BAND_SIZES.map(b => b.au.toString());
      default: return BAND_SIZES.map(b => b.us.toString());
    }
  }

  function convert() {
    setError('');
    setResult(null);

    if (!bandSize || !cupSize) {
      setError('Please select both band and cup size');
      return;
    }

    const bandNum = parseInt(bandSize);
    const bandRow = BAND_SIZES.find(b => {
      switch (fromSystem) {
        case 'us': return b.us === bandNum;
        case 'uk': return b.uk === bandNum;
        case 'eu': return b.eu === bandNum;
        case 'au': return b.au === bandNum;
        default: return false;
      }
    });

    if (!bandRow) {
      setError('Invalid band size');
      return;
    }

    // Find cup index in source system
    let cupList: string[];
    switch (fromSystem) {
      case 'us': cupList = CUP_SIZES_US; break;
      case 'uk': cupList = CUP_SIZES_UK; break;
      case 'eu': cupList = CUP_SIZES_EU; break;
      case 'au': cupList = CUP_SIZES_AU; break;
      default: cupList = CUP_SIZES_US;
    }

    const cupIdx = cupList.indexOf(cupSize);
    if (cupIdx === -1) {
      setError('Invalid cup size');
      return;
    }

    const usCup = cupIdx < CUP_SIZES_US.length ? CUP_SIZES_US[cupIdx] : CUP_SIZES_US[CUP_SIZES_US.length - 1];
    const ukCup = cupIdx < CUP_SIZES_UK.length ? CUP_SIZES_UK[cupIdx] : CUP_SIZES_UK[CUP_SIZES_UK.length - 1];
    const euCup = cupIdx < CUP_SIZES_EU.length ? CUP_SIZES_EU[cupIdx] : CUP_SIZES_EU[CUP_SIZES_EU.length - 1];
    const auCup = cupIdx < CUP_SIZES_AU.length ? CUP_SIZES_AU[cupIdx] : CUP_SIZES_AU[CUP_SIZES_AU.length - 1];

    setResult({
      us: `${bandRow.us}${usCup}`,
      uk: `${bandRow.uk}${ukCup}`,
      eu: `${bandRow.eu}${euCup}`,
      au: `${bandRow.au}${auCup}`,
    });
  }

  const copyText = result
    ? `US: ${result.us}\nUK: ${result.uk}\nEU: ${result.eu}\nAU: ${result.au}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">From System</label>
          <select id={`${toolId}-system`} value={fromSystem} onChange={(e) => { setFromSystem(e.target.value); setBandSize(''); setCupSize(''); }} aria-label={`Size system for ${toolName}`} className="input-field">
            {systems.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </InputArea>
        <InputArea error={error && !bandSize ? error : ''}>
          <label htmlFor={`${toolId}-band`} className="block text-sm font-medium text-gray-700 mb-1">Band Size</label>
          <select id={`${toolId}-band`} value={bandSize} onChange={(e) => setBandSize(e.target.value)} aria-label={`Band size for ${toolName}`} className="input-field">
            <option value="">Select...</option>
            {getBandOptions().map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </InputArea>
        <InputArea error={error && !cupSize ? error : ''}>
          <label htmlFor={`${toolId}-cup`} className="block text-sm font-medium text-gray-700 mb-1">Cup Size</label>
          <select id={`${toolId}-cup`} value={cupSize} onChange={(e) => setCupSize(e.target.value)} aria-label={`Cup size for ${toolName}`} className="input-field">
            <option value="">Select...</option>
            {getCupOptions().map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </InputArea>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={convert} aria-label="Convert bra size" className="btn-primary">
        Convert
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
                <div className="text-xl font-bold text-green-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.au}</div>
                <div className="text-xs text-gray-500 mt-1">AU</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
