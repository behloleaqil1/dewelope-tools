'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SurfaceAreaCalculator - Calculate surface area of common 3D shapes.
 * Supports cube, sphere, cylinder, and cone with formulas displayed.
 */
export default function SurfaceAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState('cube');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; formula: string } | null>(null);
  const [error, setError] = useState('');

  const shapes: Record<string, { label: string; fields: { id: string; label: string; placeholder: string }[] }> = {
    cube: { label: 'Cube', fields: [{ id: 'side', label: 'Side Length', placeholder: 'e.g. 5' }] },
    sphere: { label: 'Sphere', fields: [{ id: 'radius', label: 'Radius', placeholder: 'e.g. 3' }] },
    cylinder: { label: 'Cylinder', fields: [{ id: 'radius', label: 'Radius', placeholder: 'e.g. 3' }, { id: 'height', label: 'Height', placeholder: 'e.g. 10' }] },
    cone: { label: 'Cone', fields: [{ id: 'radius', label: 'Radius', placeholder: 'e.g. 3' }, { id: 'slant', label: 'Slant Height', placeholder: 'e.g. 7' }] },
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const vals: Record<string, number> = {};
    for (const field of shapes[shape].fields) {
      const v = parseFloat(inputs[field.id] || '');
      if (isNaN(v) || v <= 0) {
        setError(`Please enter a valid positive number for ${field.label}`);
        return;
      }
      vals[field.id] = v;
    }

    let area = 0;
    let formula = '';

    switch (shape) {
      case 'cube':
        area = 6 * vals.side * vals.side;
        formula = `SA = 6 × s² = 6 × ${vals.side}² = ${area.toFixed(4)}`;
        break;
      case 'sphere':
        area = 4 * Math.PI * vals.radius * vals.radius;
        formula = `SA = 4πr² = 4 × π × ${vals.radius}² = ${area.toFixed(4)}`;
        break;
      case 'cylinder':
        area = 2 * Math.PI * vals.radius * (vals.radius + vals.height);
        formula = `SA = 2πr(r + h) = 2 × π × ${vals.radius} × (${vals.radius} + ${vals.height}) = ${area.toFixed(4)}`;
        break;
      case 'cone':
        area = Math.PI * vals.radius * (vals.radius + vals.slant);
        formula = `SA = πr(r + l) = π × ${vals.radius} × (${vals.radius} + ${vals.slant}) = ${area.toFixed(4)}`;
        break;
    }

    setResult({ area, formula });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Shape
        </label>
        <select
          id={`${toolId}-shape`}
          value={shape}
          onChange={(e) => { setShape(e.target.value); setInputs({}); setResult(null); setError(''); }}
          aria-label={`Shape selection for ${toolName}`}
          className="input-field w-auto"
        >
          {Object.entries(shapes).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <InputArea error={error}>
        <div className="space-y-3">
          {shapes[shape].fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={`${toolId}-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                id={`${toolId}-${field.id}`}
                type="text"
                inputMode="decimal"
                value={inputs[field.id] || ''}
                onChange={(e) => {
                  setInputs((prev) => ({ ...prev, [field.id]: e.target.value }));
                  if (error) setError('');
                }}
                placeholder={field.placeholder}
                aria-label={`${field.label} for ${toolName}`}
                className="input-field"
              />
            </div>
          ))}
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate surface area" className="btn-primary">
        Calculate Surface Area
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-1">Surface Area (square units)</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={`Surface Area: ${result.area.toFixed(4)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
