'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Harmony = 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'split-complementary' | 'double-complementary';

/**
 * ColorHarmonyWheel - Interactive color wheel showing harmony relationships.
 * Displays color harmonies visually on a wheel with generated color swatches.
 */
export default function ColorHarmonyWheel({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseHue, setBaseHue] = useState(210);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(50);
  const [harmony, setHarmony] = useState<Harmony>('complementary');

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getHarmonyAngles = (): number[] => {
    switch (harmony) {
      case 'complementary': return [0, 180];
      case 'triadic': return [0, 120, 240];
      case 'tetradic': return [0, 90, 180, 270];
      case 'analogous': return [-30, 0, 30];
      case 'split-complementary': return [0, 150, 210];
      case 'double-complementary': return [0, 30, 180, 210];
      default: return [0];
    }
  };

  const angles = getHarmonyAngles();
  const colors = angles.map((angle) => {
    const hue = (baseHue + angle + 360) % 360;
    return { hue, hex: hslToHex(hue, saturation, lightness), angle };
  });

  const wheelSize = 240;
  const center = wheelSize / 2;
  const markerRadius = wheelSize / 2 - 20;

  const copyText = colors.map((c, i) => `Color ${i + 1}: ${c.hex} (hue: ${c.hue}°)`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-harmony`} className="block text-sm font-medium text-gray-700 mb-1">
              Harmony Type
            </label>
            <select
              id={`${toolId}-harmony`}
              value={harmony}
              onChange={(e) => setHarmony(e.target.value as Harmony)}
              aria-label={`Harmony type for ${toolName}`}
              className="input-field"
            >
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic (Square)</option>
              <option value="analogous">Analogous</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="double-complementary">Double Complementary</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-hue`} className="block text-sm font-medium text-gray-700 mb-1">
              Base Hue: {baseHue}°
            </label>
            <input
              id={`${toolId}-hue`}
              type="range"
              min="0"
              max="359"
              value={baseHue}
              onChange={(e) => setBaseHue(parseInt(e.target.value))}
              aria-label={`Base hue for ${toolName}`}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-sat`} className="block text-sm font-medium text-gray-700 mb-1">
              Saturation: {saturation}%
            </label>
            <input
              id={`${toolId}-sat`}
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              aria-label={`Saturation for ${toolName}`}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-light`} className="block text-sm font-medium text-gray-700 mb-1">
              Lightness: {lightness}%
            </label>
            <input
              id={`${toolId}-light`}
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => setLightness(parseInt(e.target.value))}
              aria-label={`Lightness for ${toolName}`}
              className="w-full"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`} aria-label="Color harmony wheel">
              {/* Color wheel background */}
              {Array.from({ length: 360 }, (_, i) => (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={center + (wheelSize / 2 - 5) * Math.cos((i - 90) * Math.PI / 180)}
                  y2={center + (wheelSize / 2 - 5) * Math.sin((i - 90) * Math.PI / 180)}
                  stroke={hslToHex(i, saturation, lightness)}
                  strokeWidth="3"
                />
              ))}
              {/* Center circle */}
              <circle cx={center} cy={center} r="30" fill="white" stroke="#e5e7eb" strokeWidth="2" />
              {/* Harmony lines */}
              {colors.length > 1 && (
                <polygon
                  points={colors.map((c) => {
                    const x = center + markerRadius * Math.cos((c.hue - 90) * Math.PI / 180);
                    const y = center + markerRadius * Math.sin((c.hue - 90) * Math.PI / 180);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}
              {/* Markers */}
              {colors.map((c, i) => {
                const x = center + markerRadius * Math.cos((c.hue - 90) * Math.PI / 180);
                const y = center + markerRadius * Math.sin((c.hue - 90) * Math.PI / 180);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === 0 ? 12 : 9}
                    fill={c.hex}
                    stroke="white"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colors.map((c, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-full h-16 rounded-lg border border-gray-200 mb-1"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="text-xs font-medium text-gray-700">{i === 0 ? 'Base' : `Color ${i + 1}`}</div>
                <div className="text-xs font-mono text-gray-500">{c.hex}</div>
                <div className="text-xs text-gray-400">{c.hue}°</div>
              </div>
            ))}
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
