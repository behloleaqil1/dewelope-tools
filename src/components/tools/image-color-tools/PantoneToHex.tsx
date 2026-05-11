'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PantoneToHex - Look up common Pantone colors and get their hex equivalents.
 */

const PANTONE_COLORS: { name: string; hex: string }[] = [
  { name: 'Pantone 100 C', hex: '#F4ED7C' },
  { name: 'Pantone 101 C', hex: '#F4ED47' },
  { name: 'Pantone 102 C', hex: '#F9E814' },
  { name: 'Pantone 103 C', hex: '#C6AD0F' },
  { name: 'Pantone 104 C', hex: '#AD9B0C' },
  { name: 'Pantone 109 C', hex: '#FFD204' },
  { name: 'Pantone 116 C', hex: '#FFCD00' },
  { name: 'Pantone 123 C', hex: '#FFC845' },
  { name: 'Pantone 130 C', hex: '#F2A900' },
  { name: 'Pantone 137 C', hex: '#FFA300' },
  { name: 'Pantone 144 C', hex: '#ED8B00' },
  { name: 'Pantone 151 C', hex: '#FF8200' },
  { name: 'Pantone 158 C', hex: '#E87722' },
  { name: 'Pantone 165 C', hex: '#FF6900' },
  { name: 'Pantone 172 C', hex: '#FA4616' },
  { name: 'Pantone 179 C', hex: '#E03C31' },
  { name: 'Pantone 185 C', hex: '#E4002B' },
  { name: 'Pantone 186 C', hex: '#C8102E' },
  { name: 'Pantone 199 C', hex: '#D50032' },
  { name: 'Pantone 200 C', hex: '#BA0C2F' },
  { name: 'Pantone 206 C', hex: '#CE0058' },
  { name: 'Pantone 213 C', hex: '#E31C79' },
  { name: 'Pantone 219 C', hex: '#DA1884' },
  { name: 'Pantone 226 C', hex: '#D0006F' },
  { name: 'Pantone 233 C', hex: '#C800A1' },
  { name: 'Pantone 240 C', hex: '#C964CF' },
  { name: 'Pantone 247 C', hex: '#BB29BB' },
  { name: 'Pantone 254 C', hex: '#A05EB5' },
  { name: 'Pantone 261 C', hex: '#7C2D91' },
  { name: 'Pantone 268 C', hex: '#6B3FA0' },
  { name: 'Pantone 275 C', hex: '#2E1A47' },
  { name: 'Pantone 280 C', hex: '#012169' },
  { name: 'Pantone 281 C', hex: '#00205B' },
  { name: 'Pantone 286 C', hex: '#0032A0' },
  { name: 'Pantone 293 C', hex: '#003DA5' },
  { name: 'Pantone 300 C', hex: '#005EB8' },
  { name: 'Pantone 306 C', hex: '#00B5E2' },
  { name: 'Pantone 313 C', hex: '#0092BC' },
  { name: 'Pantone 320 C', hex: '#009CA6' },
  { name: 'Pantone 327 C', hex: '#008C69' },
  { name: 'Pantone 334 C', hex: '#009B77' },
  { name: 'Pantone 341 C', hex: '#007A53' },
  { name: 'Pantone 348 C', hex: '#006338' },
  { name: 'Pantone 355 C', hex: '#009639' },
  { name: 'Pantone 362 C', hex: '#509E2F' },
  { name: 'Pantone 369 C', hex: '#64A70B' },
  { name: 'Pantone 376 C', hex: '#84BD00' },
  { name: 'Pantone 382 C', hex: '#C4D600' },
  { name: 'Pantone 389 C', hex: '#CFE100' },
  { name: 'Pantone Black C', hex: '#2D2926' },
  { name: 'Pantone Cool Gray 1 C', hex: '#D9D9D6' },
  { name: 'Pantone Cool Gray 5 C', hex: '#B1B3B3' },
  { name: 'Pantone Cool Gray 9 C', hex: '#75787B' },
  { name: 'Pantone Cool Gray 11 C', hex: '#53565A' },
  { name: 'Pantone Warm Red C', hex: '#F9423A' },
  { name: 'Pantone Red 032 C', hex: '#EF3340' },
  { name: 'Pantone Rubine Red C', hex: '#CE0058' },
  { name: 'Pantone Rhodamine Red C', hex: '#E10098' },
  { name: 'Pantone Purple C', hex: '#BB29BB' },
  { name: 'Pantone Violet C', hex: '#440099' },
  { name: 'Pantone Blue 072 C', hex: '#10069F' },
  { name: 'Pantone Reflex Blue C', hex: '#001489' },
  { name: 'Pantone Process Blue C', hex: '#0085CA' },
  { name: 'Pantone Green C', hex: '#00AB84' },
  { name: 'Pantone Yellow C', hex: '#FEDD00' },
  { name: 'Pantone Orange 021 C', hex: '#FE5000' },
];

export default function PantoneToHex({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<{ name: string; hex: string } | null>(null);

  const filtered = search.trim()
    ? PANTONE_COLORS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.hex.toLowerCase().includes(search.toLowerCase()))
    : PANTONE_COLORS;

  const copyText = selected ? `${selected.name}: ${selected.hex}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search Pantone colors
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. 185, Blue, Red..."
          aria-label={`Search input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
        {filtered.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelected(color)}
            title={`${color.name} - ${color.hex}`}
            aria-label={`Select ${color.name}`}
            className={`w-full aspect-square rounded-md border-2 transition-all ${selected?.name === color.name ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500 py-4">No matching Pantone colors found</div>
        )}
      </div>

      <OutputArea hasContent={selected !== null}>
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-lg border border-gray-200"
                style={{ backgroundColor: selected.hex }}
                aria-label={`Color preview for ${selected.name}`}
              />
              <div>
                <div className="text-lg font-bold text-gray-800">{selected.name}</div>
                <div className="text-2xl font-mono font-bold text-blue-600">{selected.hex}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
