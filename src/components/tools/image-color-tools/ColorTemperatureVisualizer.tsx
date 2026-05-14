'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorTemperatureVisualizer - Visualize warm/cool color temperatures.
 */
export default function ColorTemperatureVisualizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [kelvin, setKelvin] = useState('5500');
  const [result, setResult] = useState<{ hex: string; kelvin: number; description: string; r: number; g: number; b: number } | null>(null);

  function kelvinToRgb(k: number): [number, number, number] {
    const temp = k / 100;
    let r: number, g: number, b: number;

    if (temp <= 66) {
      r = 255;
      g = Math.min(255, Math.max(0, 99.4708025861 * Math.log(temp) - 161.1195681661));
    } else {
      r = Math.min(255, Math.max(0, 329.698727446 * Math.pow(temp - 60, -0.1332047592)));
      g = Math.min(255, Math.max(0, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)));
    }

    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = Math.min(255, Math.max(0, 138.5177312231 * Math.log(temp - 10) - 305.0447927307));
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  function visualize() {
    const k = parseInt(kelvin);
    if (isNaN(k) || k < 1000 || k > 15000) return;

    const [r, g, b] = kelvinToRgb(k);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    let description = '';
    if (k < 2000) description = 'Candlelight (very warm)';
    else if (k < 3500) description = 'Warm white (incandescent)';
    else if (k < 5000) description = 'Neutral white (fluorescent)';
    else if (k < 6500) description = 'Daylight (natural)';
    else if (k < 8000) description = 'Cool daylight (overcast)';
    else description = 'Blue sky (very cool)';

    setResult({ hex, kelvin: k, description, r, g, b });
  }

  const copyText = result ? `${result.kelvin}K — ${result.description}\nHex: ${result.hex}\nRGB: rgb(${result.r}, ${result.g}, ${result.b})` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-kelvin`} className="block text-sm font-medium text-gray-700 mb-1">Color Temperature (Kelvin)</label>
        <input id={`${toolId}-kelvin`} type="range" min="1000" max="15000" step="100" value={kelvin} onChange={(e) => setKelvin(e.target.value)} aria-label={`Color temperature for ${toolName}`} className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1000K (Warm)</span>
          <span className="font-mono">{kelvin}K</span>
          <span>15000K (Cool)</span>
        </div>
      </InputArea>

      <button onClick={visualize} aria-label="Visualize color temperature" className="btn-primary">Visualize</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="h-24 rounded-lg border border-gray-200" style={{ backgroundColor: result.hex }} />
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1 text-sm">
              <div><span className="font-medium">Temperature:</span> {result.kelvin}K</div>
              <div><span className="font-medium">Description:</span> {result.description}</div>
              <div><span className="font-medium">Hex:</span> <span className="font-mono">{result.hex}</span></div>
              <div><span className="font-medium">RGB:</span> <span className="font-mono">rgb({result.r}, {result.g}, {result.b})</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
