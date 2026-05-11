'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GravelCalculator - Calculates gravel/mulch needed for an area (volume and weight).
 * Supports different material densities and unit systems.
 */
export default function GravelCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState('feet');
  const [depthUnit, setDepthUnit] = useState('inches');
  const [material, setMaterial] = useState('gravel');
  const [result, setResult] = useState<{ cubicYards: number; cubicMeters: number; tons: number; kg: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const densities: Record<string, number> = {
    gravel: 1400,
    'pea-gravel': 1500,
    sand: 1600,
    mulch: 400,
    topsoil: 1100,
    'crushed-stone': 1500,
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);

    if (!length || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
    if (!width || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';
    if (!depth || isNaN(d) || d <= 0) newErrors.depth = 'Enter a valid depth';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
    setErrors({});

    // Convert everything to meters
    let lengthM = l;
    let widthM = w;
    let depthM = d;

    if (unit === 'feet') { lengthM = l * 0.3048; widthM = w * 0.3048; }
    if (depthUnit === 'inches') { depthM = d * 0.0254; }
    else if (depthUnit === 'cm') { depthM = d * 0.01; }
    else if (depthUnit === 'feet') { depthM = d * 0.3048; }

    const cubicMeters = lengthM * widthM * depthM;
    const cubicYards = cubicMeters * 1.30795;
    const densityKgM3 = densities[material] || 1400;
    const kg = cubicMeters * densityKgM3;
    const tons = kg / 1000;

    setResult({ cubicYards, cubicMeters, tons, kg });
  };

  const copyText = result
    ? `Material: ${material}\nVolume: ${result.cubicYards.toFixed(2)} cubic yards / ${result.cubicMeters.toFixed(2)} m³\nWeight: ${result.tons.toFixed(2)} metric tons / ${result.kg.toFixed(0)} kg`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-material`} className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <select id={`${toolId}-material`} value={material} onChange={(e) => setMaterial(e.target.value)} aria-label={`Material for ${toolName}`} className="input-field">
            <option value="gravel">Gravel</option>
            <option value="pea-gravel">Pea Gravel</option>
            <option value="crushed-stone">Crushed Stone</option>
            <option value="sand">Sand</option>
            <option value="mulch">Mulch</option>
            <option value="topsoil">Topsoil</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Area Unit</label>
          <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label={`Area unit for ${toolName}`} className="input-field">
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </InputArea>

        <InputArea error={errors.length}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Length</label>
          <input id={`${toolId}-length`} type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="e.g. 20" aria-label="Area length" className="input-field" />
        </InputArea>

        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 10" aria-label="Area width" className="input-field" />
        </InputArea>

        <InputArea error={errors.depth}>
          <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
          <input id={`${toolId}-depth`} type="text" inputMode="decimal" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="e.g. 3" aria-label="Material depth" className="input-field" />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-depth-unit`} className="block text-sm font-medium text-gray-700 mb-1">Depth Unit</label>
          <select id={`${toolId}-depth-unit`} value={depthUnit} onChange={(e) => setDepthUnit(e.target.value)} aria-label="Depth unit" className="input-field">
            <option value="inches">Inches</option>
            <option value="cm">Centimeters</option>
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate material needed" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.cubicYards.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Yards</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.cubicMeters.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Meters</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.tons.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Metric Tons</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.kg.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">Kilograms</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
