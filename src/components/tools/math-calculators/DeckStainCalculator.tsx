'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DeckStainCalculator - Calculate deck stain/sealer needed from deck dimensions.
 * Accounts for railings, stairs, and multiple coats.
 */
export default function DeckStainCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [railingLength, setRailingLength] = useState('');
  const [railingHeight, setRailingHeight] = useState('3');
  const [stairCount, setStairCount] = useState('');
  const [stairWidth, setStairWidth] = useState('36');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('200');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ deckArea: number; railingArea: number; stairArea: number; totalArea: number; gallons: number; quarts: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(length);
    const w = parseFloat(width);

    if (!length.trim() || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
    if (!width.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const deckArea = l * w;
    const rLen = parseFloat(railingLength) || 0;
    const rHeight = parseFloat(railingHeight) || 3;
    const railingArea = rLen * rHeight * 2; // both sides

    const stairs = parseInt(stairCount) || 0;
    const sWidth = parseFloat(stairWidth) / 12; // convert inches to feet
    const stairArea = stairs * sWidth * 1; // ~1 sq ft per stair tread

    const totalArea = (deckArea + railingArea + stairArea) * (parseInt(coats) || 1);
    const coverageSqFt = parseFloat(coverage) || 200;
    const gallons = totalArea / coverageSqFt;
    const quarts = gallons * 4;

    setResult({ deckArea, railingArea, stairArea, totalArea, gallons: Math.ceil(gallons), quarts: Math.ceil(quarts) });
  };

  const copyText = result
    ? `Deck Stain Calculator Results\nDeck Floor Area: ${result.deckArea.toFixed(1)} sq ft\nRailing Area: ${result.railingArea.toFixed(1)} sq ft\nStair Area: ${result.stairArea.toFixed(1)} sq ft\nTotal Area (with coats): ${result.totalArea.toFixed(1)} sq ft\nStain Needed: ${result.gallons} gallon(s) (${result.quarts} quarts)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.length}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Deck Length (feet)</label>
          <input id={`${toolId}-length`} type="text" inputMode="decimal" value={length} onChange={(e) => { setLength(e.target.value); if (errors.length) setErrors((p) => ({ ...p, length: '' })); }} placeholder="e.g. 20" aria-label={`Deck length for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Deck Width (feet)</label>
          <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => { setWidth(e.target.value); if (errors.width) setErrors((p) => ({ ...p, width: '' })); }} placeholder="e.g. 12" aria-label={`Deck width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-railing`} className="block text-sm font-medium text-gray-700 mb-1">Railing Length (feet, optional)</label>
          <input id={`${toolId}-railing`} type="text" inputMode="decimal" value={railingLength} onChange={(e) => setRailingLength(e.target.value)} placeholder="e.g. 40" aria-label="Railing length" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-rh`} className="block text-sm font-medium text-gray-700 mb-1">Railing Height (feet)</label>
          <input id={`${toolId}-rh`} type="text" inputMode="decimal" value={railingHeight} onChange={(e) => setRailingHeight(e.target.value)} placeholder="3" aria-label="Railing height" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-stairs`} className="block text-sm font-medium text-gray-700 mb-1">Number of Stairs (optional)</label>
          <input id={`${toolId}-stairs`} type="text" inputMode="numeric" value={stairCount} onChange={(e) => setStairCount(e.target.value)} placeholder="e.g. 5" aria-label="Number of stairs" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-sw`} className="block text-sm font-medium text-gray-700 mb-1">Stair Width (inches)</label>
          <input id={`${toolId}-sw`} type="text" inputMode="decimal" value={stairWidth} onChange={(e) => setStairWidth(e.target.value)} placeholder="36" aria-label="Stair width" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-coats`} className="block text-sm font-medium text-gray-700 mb-1">Number of Coats</label>
          <select id={`${toolId}-coats`} value={coats} onChange={(e) => setCoats(e.target.value)} className="input-field" aria-label="Number of coats">
            <option value="1">1 coat</option>
            <option value="2">2 coats</option>
            <option value="3">3 coats</option>
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-coverage`} className="block text-sm font-medium text-gray-700 mb-1">Coverage (sq ft/gallon)</label>
          <input id={`${toolId}-coverage`} type="text" inputMode="decimal" value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="200" aria-label="Coverage per gallon" className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate stain needed" className="btn-primary">
        Calculate Stain Needed
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.deckArea.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Deck Floor (sq ft)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.railingArea.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Railing (sq ft)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.totalArea.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Total Area (sq ft)</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.gallons}</div>
                <div className="text-xs text-blue-600 mt-1">Gallon(s) Needed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.quarts}</div>
                <div className="text-xs text-blue-600 mt-1">Quart(s) Needed</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
