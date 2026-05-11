'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TileCalculator - Calculates number of tiles needed for a floor/wall area.
 * Accounts for waste factor and grout spacing.
 */
export default function TileCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [tileLength, setTileLength] = useState('');
  const [tileWidth, setTileWidth] = useState('');
  const [wasteFactor, setWasteFactor] = useState('10');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [result, setResult] = useState<{ area: number; tileArea: number; tilesNeeded: number; tilesWithWaste: number; boxes: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const al = parseFloat(areaLength);
    const aw = parseFloat(areaWidth);
    const tl = parseFloat(tileLength);
    const tw = parseFloat(tileWidth);
    const waste = parseFloat(wasteFactor) || 10;

    if (!areaLength.trim() || isNaN(al) || al <= 0) newErrors.areaLength = 'Enter valid area length';
    if (!areaWidth.trim() || isNaN(aw) || aw <= 0) newErrors.areaWidth = 'Enter valid area width';
    if (!tileLength.trim() || isNaN(tl) || tl <= 0) newErrors.tileLength = 'Enter valid tile length';
    if (!tileWidth.trim() || isNaN(tw) || tw <= 0) newErrors.tileWidth = 'Enter valid tile width';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Convert area to sq inches or sq cm
    // Area dimensions are in feet/meters, tile dimensions in inches/cm
    const areaMultiplier = unit === 'inches' ? 144 : 10000; // sqft->sqin or sqm->sqcm
    const totalArea = al * aw * areaMultiplier;
    const tileArea = tl * tw;
    const tilesNeeded = Math.ceil(totalArea / tileArea);
    const tilesWithWaste = Math.ceil(tilesNeeded * (1 + waste / 100));
    const boxes = Math.ceil(tilesWithWaste / 10); // Assume 10 tiles per box

    const areaValue = al * aw;

    setResult({ area: Math.round(areaValue * 100) / 100, tileArea, tilesNeeded, tilesWithWaste, boxes });
  };

  const areaLabel = unit === 'inches' ? 'feet' : 'meters';
  const tileLabel = unit === 'inches' ? 'inches' : 'cm';
  const areaUnitLabel = unit === 'inches' ? 'sq ft' : 'sq m';

  const copyText = result
    ? `Tile Calculator Results:\nArea: ${result.area} ${areaUnitLabel}\nTiles Needed: ${result.tilesNeeded}\nWith ${wasteFactor}% Waste: ${result.tilesWithWaste} tiles\nEstimated Boxes (10/box): ${result.boxes}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="flex gap-3 mb-2">
          {(['inches', 'cm'] as const).map((u) => (
            <label key={u} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name={`${toolId}-unit`} value={u} checked={unit === u} onChange={() => setUnit(u)} className="text-blue-600" />
              {u === 'inches' ? 'Imperial (ft / in)' : 'Metric (m / cm)'}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputArea error={errors.areaLength}>
            <label htmlFor={`${toolId}-al`} className="block text-sm font-medium text-gray-700 mb-1">Area Length ({areaLabel})</label>
            <input id={`${toolId}-al`} type="text" inputMode="decimal" value={areaLength} onChange={(e) => setAreaLength(e.target.value)} placeholder="e.g. 12" aria-label={`Area length for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.areaWidth}>
            <label htmlFor={`${toolId}-aw`} className="block text-sm font-medium text-gray-700 mb-1">Area Width ({areaLabel})</label>
            <input id={`${toolId}-aw`} type="text" inputMode="decimal" value={areaWidth} onChange={(e) => setAreaWidth(e.target.value)} placeholder="e.g. 10" aria-label={`Area width for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputArea error={errors.tileLength}>
            <label htmlFor={`${toolId}-tl`} className="block text-sm font-medium text-gray-700 mb-1">Tile Length ({tileLabel})</label>
            <input id={`${toolId}-tl`} type="text" inputMode="decimal" value={tileLength} onChange={(e) => setTileLength(e.target.value)} placeholder="e.g. 12" aria-label={`Tile length for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.tileWidth}>
            <label htmlFor={`${toolId}-tw`} className="block text-sm font-medium text-gray-700 mb-1">Tile Width ({tileLabel})</label>
            <input id={`${toolId}-tw`} type="text" inputMode="decimal" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} placeholder="e.g. 12" aria-label={`Tile width for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <div>
          <label htmlFor={`${toolId}-waste`} className="block text-sm font-medium text-gray-700 mb-1">Waste Factor (%)</label>
          <input id={`${toolId}-waste`} type="number" min="0" max="50" value={wasteFactor} onChange={(e) => setWasteFactor(e.target.value)} className="input-field w-32" aria-label="Waste factor percentage" />
        </div>
      </div>

      <button onClick={calculate} aria-label="Calculate tiles needed" className="btn-primary">
        Calculate Tiles
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.area}</div>
                <div className="text-xs text-gray-500 mt-1">{areaUnitLabel}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.tilesNeeded}</div>
                <div className="text-xs text-gray-500 mt-1">Tiles (exact)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.tilesWithWaste}</div>
                <div className="text-xs text-gray-500 mt-1">With {wasteFactor}% waste</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.boxes}</div>
                <div className="text-xs text-gray-500 mt-1">Boxes (~10/box)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
