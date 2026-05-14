'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type CVDType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const CVD_INFO: Record<CVDType, { name: string; description: string; prevalence: string }> = {
  protanopia: { name: 'Protanopia', description: 'No red cones - red appears dark', prevalence: '~1% of males' },
  deuteranopia: { name: 'Deuteranopia', description: 'No green cones - green/red confusion', prevalence: '~1% of males' },
  tritanopia: { name: 'Tritanopia', description: 'No blue cones - blue/yellow confusion', prevalence: '~0.003% of population' },
  achromatopsia: { name: 'Achromatopsia', description: 'Complete color blindness - grayscale only', prevalence: '~0.003% of population' },
};

/**
 * ColorBlindnessSimulator - Simulates how colors appear to people with different types of CVD.
 */
export default function ColorBlindnessSimulator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#ff6600');
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<Record<CVDType, string> | null>(null);

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const match = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return null;
    return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
  };

  // Simplified CVD simulation using color transformation matrices
  const simulate = (r: number, g: number, b: number, type: CVDType): [number, number, number] => {
    const matrices: Record<CVDType, number[][]> = {
      protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
      deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
      tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
      achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
    };
    const m = matrices[type];
    return [
      m[0][0] * r + m[0][1] * g + m[0][2] * b,
      m[1][0] * r + m[1][1] * g + m[1][2] * b,
      m[2][0] * r + m[2][1] * g + m[2][2] * b,
    ];
  };

  const process = () => {
    setError(undefined);
    setResults(null);
    const rgb = hexToRgb(color);
    if (!rgb) { setError('Enter a valid hex color'); return; }

    const simulated: Record<CVDType, string> = {} as Record<CVDType, string>;
    for (const type of Object.keys(CVD_INFO) as CVDType[]) {
      const [r, g, b] = simulate(...rgb, type);
      simulated[type] = rgbToHex(r, g, b);
    }
    setResults(simulated);
  };

  const copyText = results ? Object.entries(results).map(([type, hex]) => `${CVD_INFO[type as CVDType].name}: ${hex}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color to Simulate</label>
        <div className="flex gap-2">
          <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color picker for ${toolName}`} className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Hex color value" className="input-field font-mono flex-1" />
        </div>
      </InputArea>
      <button onClick={process} aria-label="Simulate color blindness" className="btn-primary">Simulate</button>
      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Original</div>
                <div className="h-12 rounded" style={{ backgroundColor: color }} />
                <div className="text-xs font-mono text-gray-600 mt-1">{color}</div>
              </div>
              {(Object.keys(CVD_INFO) as CVDType[]).map(type => (
                <div key={type} className="p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{CVD_INFO[type].name}</div>
                  <div className="h-12 rounded" style={{ backgroundColor: results[type] }} />
                  <div className="text-xs font-mono text-gray-600 mt-1">{results[type]}</div>
                  <div className="text-xs text-gray-400">{CVD_INFO[type].prevalence}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
