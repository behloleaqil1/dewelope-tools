'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PoolVolumeCalculator - Calculates swimming pool volume for rectangular, circular, and oval shapes.
 * Shows volume in gallons, liters, and cubic feet/meters.
 */
export default function PoolVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState('rectangular');
  const [unit, setUnit] = useState('feet');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [longDiameter, setLongDiameter] = useState('');
  const [shortDiameter, setShortDiameter] = useState('');
  const [shallowDepth, setShallowDepth] = useState('');
  const [deepDepth, setDeepDepth] = useState('');
  const [result, setResult] = useState<{ gallons: number; liters: number; cubicFeet: number; cubicMeters: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const shallow = parseFloat(shallowDepth);
    const deep = parseFloat(deepDepth);

    if (!shallowDepth || isNaN(shallow) || shallow <= 0) newErrors.shallowDepth = 'Enter a valid depth';
    if (!deepDepth || isNaN(deep) || deep <= 0) newErrors.deepDepth = 'Enter a valid depth';

    let volumeCubicFeet = 0;
    const avgDepthFt = ((shallow || 0) + (deep || 0)) / 2;

    if (shape === 'rectangular') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      if (!length || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
      if (!width || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
      const lFt = unit === 'meters' ? l * 3.28084 : l;
      const wFt = unit === 'meters' ? w * 3.28084 : w;
      const dFt = unit === 'meters' ? avgDepthFt * 3.28084 : avgDepthFt;
      volumeCubicFeet = lFt * wFt * dFt;
    } else if (shape === 'circular') {
      const d = parseFloat(diameter);
      if (!diameter || isNaN(d) || d <= 0) newErrors.diameter = 'Enter a valid diameter';
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
      const dFt = unit === 'meters' ? d * 3.28084 : d;
      const depthFt = unit === 'meters' ? avgDepthFt * 3.28084 : avgDepthFt;
      const radius = dFt / 2;
      volumeCubicFeet = Math.PI * radius * radius * depthFt;
    } else {
      const ld = parseFloat(longDiameter);
      const sd = parseFloat(shortDiameter);
      if (!longDiameter || isNaN(ld) || ld <= 0) newErrors.longDiameter = 'Enter a valid long diameter';
      if (!shortDiameter || isNaN(sd) || sd <= 0) newErrors.shortDiameter = 'Enter a valid short diameter';
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
      const ldFt = unit === 'meters' ? ld * 3.28084 : ld;
      const sdFt = unit === 'meters' ? sd * 3.28084 : sd;
      const depthFt = unit === 'meters' ? avgDepthFt * 3.28084 : avgDepthFt;
      volumeCubicFeet = Math.PI * (ldFt / 2) * (sdFt / 2) * depthFt;
    }

    setErrors({});
    const gallons = volumeCubicFeet * 7.48052;
    const liters = volumeCubicFeet * 28.3168;
    const cubicMeters = volumeCubicFeet * 0.0283168;
    setResult({ gallons, liters, cubicFeet: volumeCubicFeet, cubicMeters });
  };

  const copyText = result
    ? `Volume: ${result.gallons.toFixed(0)} gallons / ${result.liters.toFixed(0)} liters\n${result.cubicFeet.toFixed(2)} ft³ / ${result.cubicMeters.toFixed(2)} m³`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Pool Shape</label>
          <select id={`${toolId}-shape`} value={shape} onChange={(e) => setShape(e.target.value)} aria-label={`Pool shape for ${toolName}`} className="input-field">
            <option value="rectangular">Rectangular</option>
            <option value="circular">Circular</option>
            <option value="oval">Oval</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </InputArea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shape === 'rectangular' && (
          <>
            <InputArea error={errors.length}>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Length</label>
              <input id={`${toolId}-length`} type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="e.g. 30" aria-label="Pool length" className="input-field" />
            </InputArea>
            <InputArea error={errors.width}>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 15" aria-label="Pool width" className="input-field" />
            </InputArea>
          </>
        )}
        {shape === 'circular' && (
          <InputArea error={errors.diameter}>
            <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">Diameter</label>
            <input id={`${toolId}-diameter`} type="text" inputMode="decimal" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="e.g. 20" aria-label="Pool diameter" className="input-field" />
          </InputArea>
        )}
        {shape === 'oval' && (
          <>
            <InputArea error={errors.longDiameter}>
              <label htmlFor={`${toolId}-long`} className="block text-sm font-medium text-gray-700 mb-1">Long Diameter</label>
              <input id={`${toolId}-long`} type="text" inputMode="decimal" value={longDiameter} onChange={(e) => setLongDiameter(e.target.value)} placeholder="e.g. 30" aria-label="Long diameter" className="input-field" />
            </InputArea>
            <InputArea error={errors.shortDiameter}>
              <label htmlFor={`${toolId}-short`} className="block text-sm font-medium text-gray-700 mb-1">Short Diameter</label>
              <input id={`${toolId}-short`} type="text" inputMode="decimal" value={shortDiameter} onChange={(e) => setShortDiameter(e.target.value)} placeholder="e.g. 15" aria-label="Short diameter" className="input-field" />
            </InputArea>
          </>
        )}
        <InputArea error={errors.shallowDepth}>
          <label htmlFor={`${toolId}-shallow`} className="block text-sm font-medium text-gray-700 mb-1">Shallow End Depth</label>
          <input id={`${toolId}-shallow`} type="text" inputMode="decimal" value={shallowDepth} onChange={(e) => setShallowDepth(e.target.value)} placeholder="e.g. 3" aria-label="Shallow depth" className="input-field" />
        </InputArea>
        <InputArea error={errors.deepDepth}>
          <label htmlFor={`${toolId}-deep`} className="block text-sm font-medium text-gray-700 mb-1">Deep End Depth</label>
          <input id={`${toolId}-deep`} type="text" inputMode="decimal" value={deepDepth} onChange={(e) => setDeepDepth(e.target.value)} placeholder="e.g. 8" aria-label="Deep depth" className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate pool volume" className="btn-primary">
        Calculate Volume
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.gallons.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">Gallons</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.liters.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">Liters</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cubicFeet.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Feet</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cubicMeters.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Cubic Meters</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
