'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MulchCalculator - Calculate mulch volume and bags needed for garden beds.
 * Supports multiple area shapes and common bag sizes.
 */
export default function MulchCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('3');
  const [bagSize, setBagSize] = useState('2');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ cubicFeet: number; cubicYards: number; bags: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const bag = parseFloat(bagSize);

    if (!length.trim() || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
    if (!width.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';
    if (!depth.trim() || isNaN(d) || d <= 0) newErrors.depth = 'Enter a valid depth';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const depthFeet = d / 12; // convert inches to feet
    const cubicFeet = l * w * depthFeet;
    const cubicYards = cubicFeet / 27;
    const bags = Math.ceil(cubicFeet / bag);

    setResult({ cubicFeet, cubicYards, bags });
  };

  const copyText = result
    ? `Mulch Needed:\nArea: ${length} ft × ${width} ft\nDepth: ${depth} inches\nVolume: ${result.cubicFeet.toFixed(1)} cu ft (${result.cubicYards.toFixed(2)} cu yd)\nBags (${bagSize} cu ft each): ${result.bags}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.length}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
            Length (feet)
          </label>
          <input
            id={`${toolId}-length`}
            type="text"
            inputMode="decimal"
            value={length}
            onChange={(e) => { setLength(e.target.value); if (errors.length) setErrors((p) => ({ ...p, length: '' })); }}
            placeholder="e.g. 20"
            aria-label={`Bed length for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
            Width (feet)
          </label>
          <input
            id={`${toolId}-width`}
            type="text"
            inputMode="decimal"
            value={width}
            onChange={(e) => { setWidth(e.target.value); if (errors.width) setErrors((p) => ({ ...p, width: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Bed width for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.depth}>
          <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">
            Depth (inches)
          </label>
          <input
            id={`${toolId}-depth`}
            type="text"
            inputMode="decimal"
            value={depth}
            onChange={(e) => { setDepth(e.target.value); if (errors.depth) setErrors((p) => ({ ...p, depth: '' })); }}
            placeholder="e.g. 3"
            aria-label={`Mulch depth for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-bag`} className="block text-sm font-medium text-gray-700 mb-1">
            Bag Size (cubic feet)
          </label>
          <select id={`${toolId}-bag`} value={bagSize} onChange={(e) => setBagSize(e.target.value)} aria-label={`Bag size for ${toolName}`} className="input-field">
            <option value="1.5">1.5 cu ft</option>
            <option value="2">2 cu ft (standard)</option>
            <option value="3">3 cu ft (large)</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate mulch" className="btn-primary">
        Calculate Mulch
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-700">{result.cubicFeet.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Feet</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-700">{result.cubicYards.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Yards</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-700">{result.bags}</div>
                <div className="text-xs text-gray-500 mt-1">Bags Needed</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Area: {length} × {width} = {(parseFloat(length) * parseFloat(width)).toFixed(1)} sq ft | Depth: {depth}&quot; | Bag size: {bagSize} cu ft
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
