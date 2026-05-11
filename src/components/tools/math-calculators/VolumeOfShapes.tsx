'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Shape = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid';

/**
 * VolumeOfShapes - Calculate volume of 3D shapes (cube, sphere, cylinder, cone, pyramid).
 * Shows formulas and step-by-step calculations.
 */
export default function VolumeOfShapes({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<Shape>('cube');
  const [side, setSide] = useState('');
  const [radius, setRadius] = useState('');
  const [height, setHeight] = useState('');
  const [baseLength, setBaseLength] = useState('');
  const [baseWidth, setBaseWidth] = useState('');
  const [result, setResult] = useState<{ volume: number; formula: string; steps: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    let volume = 0;
    let formula = '';
    let steps = '';

    switch (shape) {
      case 'cube': {
        const s = parseFloat(side);
        if (!s || s <= 0) { setError('Please enter a valid side length'); return; }
        volume = s * s * s;
        formula = 'V = s³';
        steps = `V = ${s}³ = ${volume}`;
        break;
      }
      case 'sphere': {
        const r = parseFloat(radius);
        if (!r || r <= 0) { setError('Please enter a valid radius'); return; }
        volume = (4 / 3) * Math.PI * r * r * r;
        formula = 'V = (4/3)πr³';
        steps = `V = (4/3) × π × ${r}³ = ${volume.toFixed(6)}`;
        break;
      }
      case 'cylinder': {
        const r = parseFloat(radius);
        const h = parseFloat(height);
        if (!r || r <= 0) { setError('Please enter a valid radius'); return; }
        if (!h || h <= 0) { setError('Please enter a valid height'); return; }
        volume = Math.PI * r * r * h;
        formula = 'V = πr²h';
        steps = `V = π × ${r}² × ${h} = ${volume.toFixed(6)}`;
        break;
      }
      case 'cone': {
        const r = parseFloat(radius);
        const h = parseFloat(height);
        if (!r || r <= 0) { setError('Please enter a valid radius'); return; }
        if (!h || h <= 0) { setError('Please enter a valid height'); return; }
        volume = (1 / 3) * Math.PI * r * r * h;
        formula = 'V = (1/3)πr²h';
        steps = `V = (1/3) × π × ${r}² × ${h} = ${volume.toFixed(6)}`;
        break;
      }
      case 'pyramid': {
        const l = parseFloat(baseLength);
        const w = parseFloat(baseWidth);
        const h = parseFloat(height);
        if (!l || l <= 0) { setError('Please enter a valid base length'); return; }
        if (!w || w <= 0) { setError('Please enter a valid base width'); return; }
        if (!h || h <= 0) { setError('Please enter a valid height'); return; }
        volume = (1 / 3) * l * w * h;
        formula = 'V = (1/3) × base length × base width × height';
        steps = `V = (1/3) × ${l} × ${w} × ${h} = ${volume.toFixed(6)}`;
        break;
      }
    }

    setResult({ volume, formula, steps });
  };

  const copyText = result
    ? `Shape: ${shape}\nFormula: ${result.formula}\nCalculation: ${result.steps}\nVolume: ${result.volume.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Shape
            </label>
            <select
              id={`${toolId}-shape`}
              value={shape}
              onChange={(e) => { setShape(e.target.value as Shape); setResult(null); setError(''); }}
              aria-label={`Shape selection for ${toolName}`}
              className="input-field"
            >
              <option value="cube">Cube</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="cone">Cone</option>
              <option value="pyramid">Rectangular Pyramid</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shape === 'cube' && (
              <div>
                <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
                <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="e.g. 5" aria-label="Side length" className="input-field" />
              </div>
            )}
            {(shape === 'sphere' || shape === 'cylinder' || shape === 'cone') && (
              <div>
                <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
                <input id={`${toolId}-radius`} type="text" inputMode="decimal" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="e.g. 3" aria-label="Radius" className="input-field" />
              </div>
            )}
            {(shape === 'cylinder' || shape === 'cone' || shape === 'pyramid') && (
              <div>
                <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 10" aria-label="Height" className="input-field" />
              </div>
            )}
            {shape === 'pyramid' && (
              <>
                <div>
                  <label htmlFor={`${toolId}-base-length`} className="block text-sm font-medium text-gray-700 mb-1">Base Length</label>
                  <input id={`${toolId}-base-length`} type="text" inputMode="decimal" value={baseLength} onChange={(e) => setBaseLength(e.target.value)} placeholder="e.g. 4" aria-label="Base length" className="input-field" />
                </div>
                <div>
                  <label htmlFor={`${toolId}-base-width`} className="block text-sm font-medium text-gray-700 mb-1">Base Width</label>
                  <input id={`${toolId}-base-width`} type="text" inputMode="decimal" value={baseWidth} onChange={(e) => setBaseWidth(e.target.value)} placeholder="e.g. 4" aria-label="Base width" className="input-field" />
                </div>
              </>
            )}
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate volume" className="btn-primary">
        Calculate Volume
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.volume.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">cubic units</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              <div className="font-medium text-gray-700 mb-1">Formula: {result.formula}</div>
              <div>{result.steps}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
