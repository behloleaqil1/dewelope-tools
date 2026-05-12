'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FishingLineWeightConverter - Convert fishing line weight between lb, kg, and diameter.
 * Includes approximate diameter conversions for monofilament and braided lines.
 */

interface ConversionResult {
  lb: string;
  kg: string;
  monoDiameterMm: string;
  monoDiameterIn: string;
  braidDiameterMm: string;
  braidDiameterIn: string;
  japaneseRating: string;
}

// Approximate mono diameter (mm) for given lb test
function lbToMonoDiameter(lb: number): number {
  // Empirical approximation: diameter ≈ 0.012 * sqrt(lb) inches → mm
  return 0.012 * Math.sqrt(lb) * 25.4;
}

// Approximate braid diameter (mm) for given lb test (typically 1/3 to 1/4 of mono)
function lbToBraidDiameter(lb: number): number {
  return lbToMonoDiameter(lb) * 0.35;
}

// Japanese PE rating approximation
function lbToJapaneseRating(lb: number): string {
  if (lb <= 3) return 'PE 0.2';
  if (lb <= 5) return 'PE 0.4';
  if (lb <= 8) return 'PE 0.6';
  if (lb <= 10) return 'PE 0.8';
  if (lb <= 14) return 'PE 1.0';
  if (lb <= 18) return 'PE 1.2';
  if (lb <= 20) return 'PE 1.5';
  if (lb <= 25) return 'PE 2.0';
  if (lb <= 30) return 'PE 2.5';
  if (lb <= 40) return 'PE 3.0';
  if (lb <= 50) return 'PE 4.0';
  if (lb <= 65) return 'PE 5.0';
  if (lb <= 80) return 'PE 6.0';
  if (lb <= 100) return 'PE 8.0';
  return 'PE 10.0+';
}

export default function FishingLineWeightConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('lb');
  const [error, setError] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const units = [
    { value: 'lb', label: 'Pounds (lb test)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'mono-mm', label: 'Mono Diameter (mm)' },
    { value: 'mono-in', label: 'Mono Diameter (inches)' },
  ];

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    let lb: number;

    switch (fromUnit) {
      case 'lb':
        lb = num;
        break;
      case 'kg':
        lb = num * 2.20462;
        break;
      case 'mono-mm':
        // Reverse: diameter mm → lb
        // diameter = 0.012 * sqrt(lb) * 25.4 → lb = (diameter / (0.012 * 25.4))^2
        lb = Math.pow(num / (0.012 * 25.4), 2);
        break;
      case 'mono-in':
        // diameter in → lb
        lb = Math.pow(num / 0.012, 2);
        break;
      default:
        lb = num;
    }

    const monoDiamMm = lbToMonoDiameter(lb);
    const braidDiamMm = lbToBraidDiameter(lb);

    setResult({
      lb: lb.toFixed(1),
      kg: (lb / 2.20462).toFixed(2),
      monoDiameterMm: monoDiamMm.toFixed(3),
      monoDiameterIn: (monoDiamMm / 25.4).toFixed(4),
      braidDiameterMm: braidDiamMm.toFixed(3),
      braidDiameterIn: (braidDiamMm / 25.4).toFixed(4),
      japaneseRating: lbToJapaneseRating(lb),
    });
  };

  const copyText = result
    ? `Fishing Line Weight Conversion\nBreaking Strength: ${result.lb} lb / ${result.kg} kg\nMono Diameter: ${result.monoDiameterMm} mm (${result.monoDiameterIn} in)\nBraid Diameter: ${result.braidDiameterMm} mm (${result.braidDiameterIn} in)\nJapanese Rating: ${result.japaneseRating}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 20" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert fishing line weight" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.lb} lb</div>
                <div className="text-xs text-gray-500 mt-1">Breaking Strength</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.kg} kg</div>
                <div className="text-xs text-gray-500 mt-1">Kilograms</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.japaneseRating}</div>
                <div className="text-xs text-gray-500 mt-1">Japanese Rating</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Monofilament</h4>
                <div className="text-sm text-blue-700">
                  <div>Diameter: {result.monoDiameterMm} mm</div>
                  <div>Diameter: {result.monoDiameterIn} in</div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Braided Line</h4>
                <div className="text-sm text-green-700">
                  <div>Diameter: {result.braidDiameterMm} mm</div>
                  <div>Diameter: {result.braidDiameterIn} in</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">Diameters are approximate. Actual values vary by manufacturer and line material. Braided line is typically 1/3 the diameter of mono at the same strength.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
