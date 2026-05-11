'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToPantoneNearest - Finds the nearest Pantone color match for any hex color.
 * Uses a subset of common Pantone colors and Euclidean distance in RGB space.
 */

const PANTONE_COLORS: { name: string; hex: string }[] = [
  { name: 'Pantone 100 C', hex: '#F4ED7C' }, { name: 'Pantone 101 C', hex: '#F4ED47' },
  { name: 'Pantone 102 C', hex: '#F9E814' }, { name: 'Pantone 103 C', hex: '#C6AD0F' },
  { name: 'Pantone 104 C', hex: '#AD9B0C' }, { name: 'Pantone 105 C', hex: '#82750F' },
  { name: 'Pantone 106 C', hex: '#F7E859' }, { name: 'Pantone 107 C', hex: '#F9E526' },
  { name: 'Pantone 108 C', hex: '#F9DD16' }, { name: 'Pantone 109 C', hex: '#F9D616' },
  { name: 'Pantone 110 C', hex: '#D8AF0F' }, { name: 'Pantone 111 C', hex: '#AA8E0A' },
  { name: 'Pantone 112 C', hex: '#99800A' }, { name: 'Pantone 113 C', hex: '#F9E55B' },
  { name: 'Pantone 114 C', hex: '#F9E24C' }, { name: 'Pantone 115 C', hex: '#F9DD3D' },
  { name: 'Pantone 116 C', hex: '#FCCC0A' }, { name: 'Pantone 117 C', hex: '#C6960F' },
  { name: 'Pantone 118 C', hex: '#AA7E0A' }, { name: 'Pantone 119 C', hex: '#896B0A' },
  { name: 'Pantone 120 C', hex: '#F9E27F' }, { name: 'Pantone 1205 C', hex: '#F7E8AA' },
  { name: 'Pantone Red 032 C', hex: '#EF3340' }, { name: 'Pantone 185 C', hex: '#E4002B' },
  { name: 'Pantone 186 C', hex: '#C8102E' }, { name: 'Pantone 199 C', hex: '#D50032' },
  { name: 'Pantone 200 C', hex: '#BA0C2F' }, { name: 'Pantone 201 C', hex: '#9B2335' },
  { name: 'Pantone 202 C', hex: '#862633' }, { name: 'Pantone 208 C', hex: '#8E2344' },
  { name: 'Pantone 209 C', hex: '#6F263D' }, { name: 'Pantone 210 C', hex: '#F99FC9' },
  { name: 'Pantone 211 C', hex: '#F57EB6' }, { name: 'Pantone 212 C', hex: '#F04E98' },
  { name: 'Pantone 213 C', hex: '#E31C79' }, { name: 'Pantone 214 C', hex: '#CE0058' },
  { name: 'Pantone 215 C', hex: '#AC145A' }, { name: 'Pantone 216 C', hex: '#7C2855' },
  { name: 'Pantone 2715 C', hex: '#8F82C0' }, { name: 'Pantone 2718 C', hex: '#5C6BC0' },
  { name: 'Pantone 2725 C', hex: '#7B61C4' }, { name: 'Pantone 2728 C', hex: '#3949AB' },
  { name: 'Pantone 2735 C', hex: '#5E35B1' }, { name: 'Pantone 2738 C', hex: '#311B92' },
  { name: 'Pantone 2745 C', hex: '#4527A0' }, { name: 'Pantone 2748 C', hex: '#1A237E' },
  { name: 'Pantone 279 C', hex: '#418FDE' }, { name: 'Pantone 280 C', hex: '#012169' },
  { name: 'Pantone 281 C', hex: '#00205B' }, { name: 'Pantone 282 C', hex: '#041E42' },
  { name: 'Pantone 283 C', hex: '#92C1E9' }, { name: 'Pantone 284 C', hex: '#6CACE4' },
  { name: 'Pantone 285 C', hex: '#0072CE' }, { name: 'Pantone 286 C', hex: '#0033A0' },
  { name: 'Pantone 287 C', hex: '#003087' }, { name: 'Pantone 288 C', hex: '#002D72' },
  { name: 'Pantone 289 C', hex: '#0C2340' }, { name: 'Pantone 290 C', hex: '#B9D9EB' },
  { name: 'Pantone 300 C', hex: '#005EB8' }, { name: 'Pantone 301 C', hex: '#004B87' },
  { name: 'Pantone 302 C', hex: '#003B5C' }, { name: 'Pantone 306 C', hex: '#00B5E2' },
  { name: 'Pantone 320 C', hex: '#009CA6' }, { name: 'Pantone 321 C', hex: '#008C95' },
  { name: 'Pantone 322 C', hex: '#007680' }, { name: 'Pantone 323 C', hex: '#006269' },
  { name: 'Pantone 324 C', hex: '#7CCBCB' }, { name: 'Pantone 325 C', hex: '#64CCC9' },
  { name: 'Pantone 326 C', hex: '#00B2A9' }, { name: 'Pantone 327 C', hex: '#008675' },
  { name: 'Pantone 328 C', hex: '#007367' }, { name: 'Pantone 329 C', hex: '#00685E' },
  { name: 'Pantone 330 C', hex: '#005C5B' }, { name: 'Pantone 347 C', hex: '#009639' },
  { name: 'Pantone 348 C', hex: '#007A33' }, { name: 'Pantone 349 C', hex: '#046A38' },
  { name: 'Pantone 350 C', hex: '#2C5234' }, { name: 'Pantone 351 C', hex: '#86C8BC' },
  { name: 'Pantone 355 C', hex: '#009B3A' }, { name: 'Pantone 356 C', hex: '#007A33' },
  { name: 'Pantone 361 C', hex: '#43B02A' }, { name: 'Pantone 362 C', hex: '#509E2F' },
  { name: 'Pantone 363 C', hex: '#4C8C2B' }, { name: 'Pantone 364 C', hex: '#4A7729' },
  { name: 'Pantone 375 C', hex: '#97D700' }, { name: 'Pantone 376 C', hex: '#84BD00' },
  { name: 'Pantone 377 C', hex: '#7A9A01' }, { name: 'Pantone 378 C', hex: '#5E7E29' },
  { name: 'Pantone 380 C', hex: '#C4D600' }, { name: 'Pantone 381 C', hex: '#CEDC00' },
  { name: 'Pantone 382 C', hex: '#C5E86C' }, { name: 'Pantone 390 C', hex: '#B5BD00' },
  { name: 'Pantone 391 C', hex: '#9EA700' }, { name: 'Pantone 392 C', hex: '#8E8C13' },
  { name: 'Pantone Black C', hex: '#2D2926' }, { name: 'Pantone Cool Gray 1 C', hex: '#D9D9D6' },
  { name: 'Pantone Cool Gray 5 C', hex: '#B1B3B3' }, { name: 'Pantone Cool Gray 9 C', hex: '#75787B' },
  { name: 'Pantone Cool Gray 11 C', hex: '#53565A' }, { name: 'Pantone Warm Gray 1 C', hex: '#D7D2CB' },
  { name: 'Pantone Warm Gray 5 C', hex: '#B6ADA5' }, { name: 'Pantone Warm Gray 9 C', hex: '#83786F' },
  { name: 'Pantone Warm Gray 11 C', hex: '#6E6259' }, { name: 'Pantone Orange 021 C', hex: '#FE5000' },
  { name: 'Pantone 144 C', hex: '#ED8B00' }, { name: 'Pantone 151 C', hex: '#FF8200' },
  { name: 'Pantone 158 C', hex: '#E87722' }, { name: 'Pantone 165 C', hex: '#FF6900' },
  { name: 'Pantone 166 C', hex: '#E35205' }, { name: 'Pantone 172 C', hex: '#FA4616' },
  { name: 'Pantone 1788 C', hex: '#EE2737' }, { name: 'Pantone 485 C', hex: '#DA291C' },
  { name: 'Pantone 7621 C', hex: '#AB2328' }, { name: 'Pantone 7627 C', hex: '#893C47' },
  { name: 'Pantone White C', hex: '#FFFFFF' }, { name: 'Pantone Yellow C', hex: '#FEDD00' },
  { name: 'Pantone Process Blue C', hex: '#0085CA' }, { name: 'Pantone Reflex Blue C', hex: '#001489' },
  { name: 'Pantone Green C', hex: '#00AB84' }, { name: 'Pantone Purple C', hex: '#BB29BB' },
  { name: 'Pantone Rhodamine Red C', hex: '#E10098' }, { name: 'Pantone Violet C', hex: '#440099' },
  { name: 'Pantone Rubine Red C', hex: '#CE0058' },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

export default function ColorToPantoneNearest({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3498db');
  const [results, setResults] = useState<{ name: string; hex: string; distance: number }[]>([]);
  const [error, setError] = useState('');

  const findNearest = () => {
    const rgb = hexToRgb(hexInput);
    if (!rgb) {
      setError('Please enter a valid hex color (e.g. #FF5500)');
      setResults([]);
      return;
    }
    setError('');

    const distances = PANTONE_COLORS.map((p) => {
      const pRgb = hexToRgb(p.hex)!;
      return { name: p.name, hex: p.hex, distance: colorDistance(rgb, pRgb) };
    });

    distances.sort((a, b) => a.distance - b.distance);
    setResults(distances.slice(0, 5));
  };

  const copyText = results.length > 0
    ? `Input: ${hexInput}\nNearest Pantone: ${results[0].name} (${results[0].hex})\nDistance: ${results[0].distance.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Hex Color
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-hex`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3498db"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          <input
            type="color"
            value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#3498db'}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            aria-label="Color picker"
          />
        </div>
      </InputArea>

      <button onClick={findNearest} aria-label="Find nearest Pantone" className="btn-primary">
        Find Nearest Pantone
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Top 5 Nearest Pantone Colors</label>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: r.hex }} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{r.name}</div>
                    <div className="text-sm text-gray-500">{r.hex} — Distance: {r.distance.toFixed(2)}</div>
                  </div>
                  {i === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Best Match</span>}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-10 rounded border border-gray-300" style={{ backgroundColor: hexInput }} />
              <span className="text-sm text-gray-600">Your color: {hexInput}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
