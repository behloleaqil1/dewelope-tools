'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorNameFinder - Finds the closest named CSS color for any hex value.
 * Uses Euclidean distance in RGB space to find the nearest match.
 */
export default function ColorNameFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ name: string; hex: string; distance: number; inputHex: string } | null>(null);
  const [error, setError] = useState('');

  const cssColors: [string, string][] = [
    ['aliceblue', '#F0F8FF'], ['antiquewhite', '#FAEBD7'], ['aqua', '#00FFFF'], ['aquamarine', '#7FFFD4'],
    ['azure', '#F0FFFF'], ['beige', '#F5F5DC'], ['bisque', '#FFE4C4'], ['black', '#000000'],
    ['blanchedalmond', '#FFEBCD'], ['blue', '#0000FF'], ['blueviolet', '#8A2BE2'], ['brown', '#A52A2A'],
    ['burlywood', '#DEB887'], ['cadetblue', '#5F9EA0'], ['chartreuse', '#7FFF00'], ['chocolate', '#D2691E'],
    ['coral', '#FF7F50'], ['cornflowerblue', '#6495ED'], ['cornsilk', '#FFF8DC'], ['crimson', '#DC143C'],
    ['cyan', '#00FFFF'], ['darkblue', '#00008B'], ['darkcyan', '#008B8B'], ['darkgoldenrod', '#B8860B'],
    ['darkgray', '#A9A9A9'], ['darkgreen', '#006400'], ['darkkhaki', '#BDB76B'], ['darkmagenta', '#8B008B'],
    ['darkolivegreen', '#556B2F'], ['darkorange', '#FF8C00'], ['darkorchid', '#9932CC'], ['darkred', '#8B0000'],
    ['darksalmon', '#E9967A'], ['darkseagreen', '#8FBC8F'], ['darkslateblue', '#483D8B'], ['darkslategray', '#2F4F4F'],
    ['darkturquoise', '#00CED1'], ['darkviolet', '#9400D3'], ['deeppink', '#FF1493'], ['deepskyblue', '#00BFFF'],
    ['dimgray', '#696969'], ['dodgerblue', '#1E90FF'], ['firebrick', '#B22222'], ['floralwhite', '#FFFAF0'],
    ['forestgreen', '#228B22'], ['fuchsia', '#FF00FF'], ['gainsboro', '#DCDCDC'], ['ghostwhite', '#F8F8FF'],
    ['gold', '#FFD700'], ['goldenrod', '#DAA520'], ['gray', '#808080'], ['green', '#008000'],
    ['greenyellow', '#ADFF2F'], ['honeydew', '#F0FFF0'], ['hotpink', '#FF69B4'], ['indianred', '#CD5C5C'],
    ['indigo', '#4B0082'], ['ivory', '#FFFFF0'], ['khaki', '#F0E68C'], ['lavender', '#E6E6FA'],
    ['lavenderblush', '#FFF0F5'], ['lawngreen', '#7CFC00'], ['lemonchiffon', '#FFFACD'], ['lightblue', '#ADD8E6'],
    ['lightcoral', '#F08080'], ['lightcyan', '#E0FFFF'], ['lightgoldenrodyellow', '#FAFAD2'], ['lightgray', '#D3D3D3'],
    ['lightgreen', '#90EE90'], ['lightpink', '#FFB6C1'], ['lightsalmon', '#FFA07A'], ['lightseagreen', '#20B2AA'],
    ['lightskyblue', '#87CEFA'], ['lightslategray', '#778899'], ['lightsteelblue', '#B0C4DE'], ['lightyellow', '#FFFFE0'],
    ['lime', '#00FF00'], ['limegreen', '#32CD32'], ['linen', '#FAF0E6'], ['magenta', '#FF00FF'],
    ['maroon', '#800000'], ['mediumaquamarine', '#66CDAA'], ['mediumblue', '#0000CD'], ['mediumorchid', '#BA55D3'],
    ['mediumpurple', '#9370DB'], ['mediumseagreen', '#3CB371'], ['mediumslateblue', '#7B68EE'], ['mediumspringgreen', '#00FA9A'],
    ['mediumturquoise', '#48D1CC'], ['mediumvioletred', '#C71585'], ['midnightblue', '#191970'], ['mintcream', '#F5FFFA'],
    ['mistyrose', '#FFE4E1'], ['moccasin', '#FFE4B5'], ['navajowhite', '#FFDEAD'], ['navy', '#000080'],
    ['oldlace', '#FDF5E6'], ['olive', '#808000'], ['olivedrab', '#6B8E23'], ['orange', '#FFA500'],
    ['orangered', '#FF4500'], ['orchid', '#DA70D6'], ['palegoldenrod', '#EEE8AA'], ['palegreen', '#98FB98'],
    ['paleturquoise', '#AFEEEE'], ['palevioletred', '#DB7093'], ['papayawhip', '#FFEFD5'], ['peachpuff', '#FFDAB9'],
    ['peru', '#CD853F'], ['pink', '#FFC0CB'], ['plum', '#DDA0DD'], ['powderblue', '#B0E0E6'],
    ['purple', '#800080'], ['rebeccapurple', '#663399'], ['red', '#FF0000'], ['rosybrown', '#BC8F8F'],
    ['royalblue', '#4169E1'], ['saddlebrown', '#8B4513'], ['salmon', '#FA8072'], ['sandybrown', '#F4A460'],
    ['seagreen', '#2E8B57'], ['seashell', '#FFF5EE'], ['sienna', '#A0522D'], ['silver', '#C0C0C0'],
    ['skyblue', '#87CEEB'], ['slateblue', '#6A5ACD'], ['slategray', '#708090'], ['snow', '#FFFAFA'],
    ['springgreen', '#00FF7F'], ['steelblue', '#4682B4'], ['tan', '#D2B48C'], ['teal', '#008080'],
    ['thistle', '#D8BFD8'], ['tomato', '#FF6347'], ['turquoise', '#40E0D0'], ['violet', '#EE82EE'],
    ['wheat', '#F5DEB3'], ['white', '#FFFFFF'], ['whitesmoke', '#F5F5F5'], ['yellow', '#FFFF00'],
    ['yellowgreen', '#9ACD32'],
  ];

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const clean = hex.replace('#', '');
    let full = clean;
    if (clean.length === 3) {
      full = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  };

  const colorDistance = (a: [number, number, number], b: [number, number, number]): number => {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  };

  const findClosest = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a hex color');
      setResult(null);
      return;
    }

    const rgb = hexToRgb(trimmed);
    if (!rgb) {
      setError('Invalid hex color. Use format: #FF5733 or FF5733');
      setResult(null);
      return;
    }

    setError('');
    const inputHex = '#' + trimmed.replace('#', '').toUpperCase();

    let closest = { name: '', hex: '', distance: Infinity };

    for (const [name, hex] of cssColors) {
      const colorRgb = hexToRgb(hex)!;
      const dist = colorDistance(rgb, colorRgb);
      if (dist < closest.distance) {
        closest = { name, hex, distance: dist };
      }
    }

    setResult({ ...closest, inputHex, distance: Math.round(closest.distance * 100) / 100 });
  };

  const copyText = result
    ? `Input: ${result.inputHex}\nClosest CSS Color: ${result.name} (${result.hex})\nDistance: ${result.distance}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a hex color
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-input`}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. #FF5733 or 3A7BD5"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          {input && hexToRgb(input.trim()) && (
            <div
              className="w-10 h-10 rounded-lg border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: input.startsWith('#') ? input : `#${input}` }}
              aria-label="Color preview"
            />
          )}
        </div>
      </InputArea>

      <button onClick={findClosest} aria-label="Find closest color name" className="btn-primary">
        Find Color Name
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: result.inputHex }} />
                <div className="text-xs text-gray-500 mt-1">Your Color</div>
              </div>
              <div className="text-gray-400 text-xl">→</div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: result.hex }} />
                <div className="text-xs text-gray-500 mt-1">Closest Match</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-lg font-bold text-gray-800">{result.name}</p>
              <p className="text-sm text-gray-600 font-mono">{result.hex}</p>
              <p className="text-xs text-gray-500 mt-1">
                Distance: {result.distance} {result.distance === 0 ? '(exact match!)' : ''}
              </p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
