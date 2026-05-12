'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Shape = 'solid-cylinder' | 'hollow-cylinder' | 'solid-sphere' | 'hollow-sphere' | 'thin-rod-center' | 'thin-rod-end' | 'rectangular-plate' | 'disk';

/**
 * MomentOfInertiaCalculator - Calculate moment of inertia for basic shapes.
 * Supports solid/hollow cylinders, spheres, rods, rectangular plates, and disks.
 */
export default function MomentOfInertiaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<Shape>('solid-cylinder');
  const [mass, setMass] = useState('');
  const [radius, setRadius] = useState('');
  const [innerRadius, setInnerRadius] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const m = parseFloat(mass);
    if (isNaN(m) || m <= 0) {
      setOutput('Error: Please enter a valid positive mass.');
      return;
    }

    const results: string[] = [];
    let I = 0;
    let formula = '';

    switch (shape) {
      case 'solid-cylinder':
      case 'disk': {
        const r = parseFloat(radius);
        if (isNaN(r) || r <= 0) { setOutput('Error: Enter a valid radius.'); return; }
        I = 0.5 * m * r * r;
        formula = shape === 'disk' ? 'I = ½mr² (thin disk)' : 'I = ½mr² (solid cylinder, about central axis)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Radius (r) = ${r} m`);
        break;
      }
      case 'hollow-cylinder': {
        const r1 = parseFloat(innerRadius);
        const r2 = parseFloat(radius);
        if (isNaN(r1) || isNaN(r2) || r1 < 0 || r2 <= 0) { setOutput('Error: Enter valid radii.'); return; }
        I = 0.5 * m * (r1 * r1 + r2 * r2);
        formula = 'I = ½m(R₁² + R₂²) (hollow cylinder, about central axis)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Inner Radius (R₁) = ${r1} m`);
        results.push(`Outer Radius (R₂) = ${r2} m`);
        break;
      }
      case 'solid-sphere': {
        const r = parseFloat(radius);
        if (isNaN(r) || r <= 0) { setOutput('Error: Enter a valid radius.'); return; }
        I = (2 / 5) * m * r * r;
        formula = 'I = ⅖mr² (solid sphere, about diameter)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Radius (r) = ${r} m`);
        break;
      }
      case 'hollow-sphere': {
        const r = parseFloat(radius);
        if (isNaN(r) || r <= 0) { setOutput('Error: Enter a valid radius.'); return; }
        I = (2 / 3) * m * r * r;
        formula = 'I = ⅔mr² (thin hollow sphere, about diameter)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Radius (r) = ${r} m`);
        break;
      }
      case 'thin-rod-center': {
        const l = parseFloat(length);
        if (isNaN(l) || l <= 0) { setOutput('Error: Enter a valid length.'); return; }
        I = (1 / 12) * m * l * l;
        formula = 'I = (1/12)mL² (thin rod, about center)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Length (L) = ${l} m`);
        break;
      }
      case 'thin-rod-end': {
        const l = parseFloat(length);
        if (isNaN(l) || l <= 0) { setOutput('Error: Enter a valid length.'); return; }
        I = (1 / 3) * m * l * l;
        formula = 'I = (1/3)mL² (thin rod, about end)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Length (L) = ${l} m`);
        break;
      }
      case 'rectangular-plate': {
        const a = parseFloat(length);
        const b = parseFloat(width);
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { setOutput('Error: Enter valid dimensions.'); return; }
        I = (1 / 12) * m * (a * a + b * b);
        formula = 'I = (1/12)m(a² + b²) (rectangular plate, about center)';
        results.push(formula);
        results.push(`Mass (m) = ${m} kg`);
        results.push(`Length (a) = ${a} m`);
        results.push(`Width (b) = ${b} m`);
        break;
      }
    }

    results.push('');
    results.push(`Moment of Inertia (I) = ${I.toFixed(6)} kg·m²`);
    results.push(`                      = ${(I * 10000).toFixed(6)} kg·cm²`);
    results.push(`                      = ${(I * 1e6).toFixed(4)} g·cm²`);

    setOutput(results.join('\n'));
  };

  const needsRadius = ['solid-cylinder', 'hollow-cylinder', 'solid-sphere', 'hollow-sphere', 'disk'].includes(shape);
  const needsInnerRadius = shape === 'hollow-cylinder';
  const needsLength = ['thin-rod-center', 'thin-rod-end', 'rectangular-plate'].includes(shape);
  const needsWidth = shape === 'rectangular-plate';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as Shape)}
              aria-label={`Shape selection for ${toolName}`}
              className="input-field w-full"
            >
              <option value="solid-cylinder">Solid Cylinder (about central axis)</option>
              <option value="hollow-cylinder">Hollow Cylinder (about central axis)</option>
              <option value="solid-sphere">Solid Sphere (about diameter)</option>
              <option value="hollow-sphere">Thin Hollow Sphere (about diameter)</option>
              <option value="thin-rod-center">Thin Rod (about center)</option>
              <option value="thin-rod-end">Thin Rod (about end)</option>
              <option value="rectangular-plate">Rectangular Plate (about center)</option>
              <option value="disk">Thin Disk (about central axis)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
            <input
              id={`${toolId}-mass`}
              type="number"
              step="any"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              placeholder="Enter mass in kg"
              aria-label="Mass in kilograms"
              className="input-field w-full"
            />
          </div>
          {needsRadius && (
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
                {needsInnerRadius ? 'Outer Radius (m)' : 'Radius (m)'}
              </label>
              <input
                id={`${toolId}-radius`}
                type="number"
                step="any"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Enter radius in meters"
                aria-label="Radius in meters"
                className="input-field w-full"
              />
            </div>
          )}
          {needsInnerRadius && (
            <div>
              <label htmlFor={`${toolId}-inner`} className="block text-sm font-medium text-gray-700 mb-1">Inner Radius (m)</label>
              <input
                id={`${toolId}-inner`}
                type="number"
                step="any"
                value={innerRadius}
                onChange={(e) => setInnerRadius(e.target.value)}
                placeholder="Enter inner radius in meters"
                aria-label="Inner radius in meters"
                className="input-field w-full"
              />
            </div>
          )}
          {needsLength && (
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
              <input
                id={`${toolId}-length`}
                type="number"
                step="any"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Enter length in meters"
                aria-label="Length in meters"
                className="input-field w-full"
              />
            </div>
          )}
          {needsWidth && (
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
              <input
                id={`${toolId}-width`}
                type="number"
                step="any"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter width in meters"
                aria-label="Width in meters"
                className="input-field w-full"
              />
            </div>
          )}
          <button onClick={calculate} className="btn-primary text-sm">
            Calculate Moment of Inertia
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
