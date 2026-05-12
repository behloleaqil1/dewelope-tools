'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PolarToCartesian - Convert polar coordinates to Cartesian and vice versa.
 * Polar: (r, θ) → Cartesian: (x, y)
 */
export default function PolarToCartesian({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'polar-to-cart' | 'cart-to-polar'>('polar-to-cart');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ val1: string; val2: string; label1: string; label2: string; formula: string } | null>(null);

  function convert() {
    const newErrors: Record<string, string> = {};
    const v1 = parseFloat(input1);
    const v2 = parseFloat(input2);

    if (!input1.trim() || isNaN(v1)) newErrors.input1 = 'Enter a valid number';
    if (!input2.trim() || isNaN(v2)) newErrors.input2 = 'Enter a valid number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    if (mode === 'polar-to-cart') {
      const r = v1;
      const theta = angleUnit === 'degrees' ? (v2 * Math.PI) / 180 : v2;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      setResult({
        val1: x.toFixed(6),
        val2: y.toFixed(6),
        label1: 'x',
        label2: 'y',
        formula: `x = r × cos(θ) = ${r} × cos(${v2}${angleUnit === 'degrees' ? '°' : ' rad'}) = ${x.toFixed(6)}\ny = r × sin(θ) = ${r} × sin(${v2}${angleUnit === 'degrees' ? '°' : ' rad'}) = ${y.toFixed(6)}`,
      });
    } else {
      const x = v1;
      const y = v2;
      const r = Math.sqrt(x * x + y * y);
      let theta = Math.atan2(y, x);
      if (angleUnit === 'degrees') theta = (theta * 180) / Math.PI;
      setResult({
        val1: r.toFixed(6),
        val2: theta.toFixed(6),
        label1: 'r',
        label2: `θ (${angleUnit})`,
        formula: `r = √(x² + y²) = √(${x}² + ${y}²) = ${r.toFixed(6)}\nθ = atan2(y, x) = atan2(${y}, ${x}) = ${theta.toFixed(6)}${angleUnit === 'degrees' ? '°' : ' rad'}`,
      });
    }
  }

  const copyText = result ? `${result.label1} = ${result.val1}\n${result.label2} = ${result.val2}\n\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Mode</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => { setMode(e.target.value as 'polar-to-cart' | 'cart-to-polar'); setResult(null); }} aria-label={`Conversion mode for ${toolName}`} className="input-field">
          <option value="polar-to-cart">Polar → Cartesian</option>
          <option value="cart-to-polar">Cartesian → Polar</option>
        </select>
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={errors.input1}>
          <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'polar-to-cart' ? 'r (radius)' : 'x'}
          </label>
          <input id={`${toolId}-v1`} type="text" inputMode="decimal" value={input1} onChange={(e) => setInput1(e.target.value)} placeholder={mode === 'polar-to-cart' ? 'e.g. 5' : 'e.g. 3'} aria-label={`${mode === 'polar-to-cart' ? 'Radius' : 'X coordinate'} for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.input2}>
          <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'polar-to-cart' ? 'θ (angle)' : 'y'}
          </label>
          <input id={`${toolId}-v2`} type="text" inputMode="decimal" value={input2} onChange={(e) => setInput2(e.target.value)} placeholder={mode === 'polar-to-cart' ? 'e.g. 45' : 'e.g. 4'} aria-label={`${mode === 'polar-to-cart' ? 'Angle' : 'Y coordinate'} for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Angle Unit</label>
          <select id={`${toolId}-unit`} value={angleUnit} onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')} aria-label={`Angle unit for ${toolName}`} className="input-field">
            <option value="degrees">Degrees</option>
            <option value="radians">Radians</option>
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert coordinates" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.val1}</div>
                <div className="text-xs text-gray-500 mt-1">{result.label1}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.val2}</div>
                <div className="text-xs text-gray-500 mt-1">{result.label2}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
