'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HvacDuctSizeConverter - Converts HVAC duct sizes between round and rectangular equivalents.
 * Uses the equal friction method to find equivalent duct dimensions.
 */
export default function HvacDuctSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [conversionType, setConversionType] = useState<'roundToRect' | 'rectToRound'>('roundToRect');
  const [roundDiameter, setRoundDiameter] = useState('');
  const [rectWidth, setRectWidth] = useState('');
  const [rectHeight, setRectHeight] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    equivalentRound?: number;
    equivalentRect?: { width: number; height: number }[];
    area: number;
    perimeter: number;
    hydraulicDiameter: number;
  } | null>(null);

  // Calculate equivalent round duct diameter from rectangular dimensions
  // Using the Huebscher equation: De = 1.30 * ((a*b)^0.625) / ((a+b)^0.250)
  const rectToRoundEquivalent = (width: number, height: number): number => {
    return 1.30 * Math.pow(width * height, 0.625) / Math.pow(width + height, 0.250);
  };

  // Calculate hydraulic diameter: Dh = 4*A/P
  const hydraulicDiameter = (width: number, height: number): number => {
    return (4 * width * height) / (2 * (width + height));
  };

  const calculate = () => {
    if (conversionType === 'roundToRect') {
      const diameter = parseFloat(roundDiameter);
      if (!roundDiameter.trim() || isNaN(diameter) || diameter <= 0) {
        setError('Please enter a valid positive round duct diameter');
        setResult(null);
        return;
      }

      setError(undefined);
      const area = Math.PI * Math.pow(diameter / 2, 2);
      const perimeter = Math.PI * diameter;

      // Find rectangular equivalents with common aspect ratios
      const equivalents: { width: number; height: number }[] = [];
      const aspectRatios = [1, 1.5, 2, 2.5, 3, 4];

      for (const ratio of aspectRatios) {
        // Solve for width given aspect ratio and equivalent diameter
        // De = 1.30 * ((w * w/ratio)^0.625) / ((w + w/ratio)^0.250) = diameter
        // Iterative approach
        let w = diameter;
        for (let i = 0; i < 50; i++) {
          const h = w / ratio;
          const de = rectToRoundEquivalent(w, h);
          const error = de - diameter;
          if (Math.abs(error) < 0.01) break;
          w = w * (diameter / de);
        }
        const h = w / ratio;
        equivalents.push({ width: Math.round(w * 10) / 10, height: Math.round(h * 10) / 10 });
      }

      setResult({
        equivalentRect: equivalents,
        area,
        perimeter,
        hydraulicDiameter: diameter,
      });
    } else {
      const width = parseFloat(rectWidth);
      const height = parseFloat(rectHeight);

      if (!rectWidth.trim() || isNaN(width) || width <= 0) {
        setError('Please enter a valid positive width');
        setResult(null);
        return;
      }
      if (!rectHeight.trim() || isNaN(height) || height <= 0) {
        setError('Please enter a valid positive height');
        setResult(null);
        return;
      }

      setError(undefined);
      const equivRound = rectToRoundEquivalent(width, height);
      const area = width * height;
      const perimeter = 2 * (width + height);
      const hd = hydraulicDiameter(width, height);

      setResult({
        equivalentRound: Math.round(equivRound * 10) / 10,
        area,
        perimeter,
        hydraulicDiameter: Math.round(hd * 10) / 10,
      });
    }
  };

  const copyText = result
    ? conversionType === 'roundToRect'
      ? `Round Duct: ${roundDiameter}" diameter\nArea: ${result.area.toFixed(2)} sq.in.\nEquivalent Rectangular Sizes:\n${result.equivalentRect?.map(r => `  ${r.width}" × ${r.height}"`).join('\n')}`
      : `Rectangular Duct: ${rectWidth}" × ${rectHeight}"\nEquivalent Round: ${result.equivalentRound}" diameter\nHydraulic Diameter: ${result.hydraulicDiameter}"\nArea: ${result.area.toFixed(2)} sq.in.`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <select
          value={conversionType}
          onChange={(e) => { setConversionType(e.target.value as 'roundToRect' | 'rectToRound'); setResult(null); }}
          aria-label="Conversion direction"
          className="input-field"
        >
          <option value="roundToRect">Round → Rectangular Equivalent</option>
          <option value="rectToRound">Rectangular → Round Equivalent</option>
        </select>
      </div>

      {conversionType === 'roundToRect' ? (
        <InputArea error={error}>
          <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
            Round Duct Diameter (inches)
          </label>
          <input
            id={`${toolId}-diameter`}
            type="text"
            inputMode="decimal"
            value={roundDiameter}
            onChange={(e) => setRoundDiameter(e.target.value)}
            placeholder="e.g. 12"
            aria-label={`Round duct diameter for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      ) : (
        <InputArea error={error}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
                Width (inches)
              </label>
              <input
                id={`${toolId}-width`}
                type="text"
                inputMode="decimal"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                placeholder="e.g. 16"
                aria-label="Rectangular duct width"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
                Height (inches)
              </label>
              <input
                id={`${toolId}-height`}
                type="text"
                inputMode="decimal"
                value={rectHeight}
                onChange={(e) => setRectHeight(e.target.value)}
                placeholder="e.g. 10"
                aria-label="Rectangular duct height"
                className="input-field"
              />
            </div>
          </div>
        </InputArea>
      )}

      <button onClick={calculate} aria-label="Convert duct size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && conversionType === 'roundToRect' && result.equivalentRect && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Equivalent Rectangular Sizes (by aspect ratio)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {result.equivalentRect.map((r, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600">{r.width}&quot; × {r.height}&quot;</div>
                  <div className="text-xs text-gray-500">Ratio {(r.width / r.height).toFixed(1)}:1</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Cross-sectional area: {result.area.toFixed(2)} sq.in.</p>
              <p>Method: Huebscher equation (equal friction)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
        {result && conversionType === 'rectToRound' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.equivalentRound}&quot;</div>
                <div className="text-xs text-gray-500">Equiv. Round Diameter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.hydraulicDiameter}&quot;</div>
                <div className="text-xs text-gray-500">Hydraulic Diameter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.area.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Area (sq.in.)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
