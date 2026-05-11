'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorTemperaturePicker - Pick warm/cool colors by temperature (Kelvin).
 * Converts color temperature to approximate RGB values.
 */
export default function ColorTemperaturePicker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temperature, setTemperature] = useState('5500');

  const kelvinToRgb = (kelvin: number): { r: number; g: number; b: number } => {
    const temp = kelvin / 100;
    let r: number, g: number, b: number;

    if (temp <= 66) {
      r = 255;
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.max(0, Math.min(255, r));
    }

    if (temp <= 66) {
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      g = Math.max(0, Math.min(255, g));
    } else {
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      g = Math.max(0, Math.min(255, g));
    }

    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(0, Math.min(255, b));
    }

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  };

  const kelvin = parseInt(temperature) || 5500;
  const clampedKelvin = Math.max(1000, Math.min(15000, kelvin));
  const rgb = kelvinToRgb(clampedKelvin);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  const getTemperatureLabel = (k: number): string => {
    if (k < 2000) return 'Candlelight';
    if (k < 3000) return 'Warm White / Tungsten';
    if (k < 4000) return 'Soft White';
    if (k < 5000) return 'Neutral White';
    if (k < 6000) return 'Daylight';
    if (k < 7000) return 'Overcast Sky';
    if (k < 9000) return 'Shade / Blue Sky';
    return 'Deep Blue Sky';
  };

  const copyText = `Temperature: ${clampedKelvin}K (${getTemperatureLabel(clampedKelvin)})\nHEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">
          Color Temperature (Kelvin): {clampedKelvin}K
        </label>
        <input
          id={`${toolId}-temp`}
          type="range"
          min="1000"
          max="15000"
          step="100"
          value={clampedKelvin}
          onChange={(e) => setTemperature(e.target.value)}
          aria-label={`Color temperature slider for ${toolName}`}
          className="w-full h-2 bg-gradient-to-r from-orange-500 via-white to-blue-400 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1000K (Warm)</span>
          <span>5500K (Daylight)</span>
          <span>15000K (Cool)</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder="Enter Kelvin value"
          aria-label={`Color temperature input for ${toolName}`}
          className="input-field mt-2"
        />
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="w-full h-32 rounded-lg border border-gray-200" style={{ backgroundColor: hex }} />
          <div className="text-center text-sm font-medium text-gray-700">
            {getTemperatureLabel(clampedKelvin)}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800">{clampedKelvin}K</div>
              <div className="text-xs text-gray-500">Temperature</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{hex}</div>
              <div className="text-xs text-gray-500">HEX</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-sm font-bold text-gray-800 font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
              <div className="text-xs text-gray-500">RGB</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1800, 2700, 3500, 5000, 5500, 6500, 8000, 12000].map(k => (
              <button
                key={k}
                onClick={() => setTemperature(k.toString())}
                className="px-2 py-1 text-xs rounded border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                {k}K
              </button>
            ))}
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
