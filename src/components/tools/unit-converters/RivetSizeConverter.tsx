'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RivetSizeConverter - Convert rivet sizes between standards.
 * Supports common rivet diameter designations in imperial (dash numbers) and metric.
 */

interface RivetSize {
  dash: string;
  diameter_inch: number;
  diameter_mm: number;
  drill_size: string;
}

const RIVET_SIZES: RivetSize[] = [
  { dash: '-3', diameter_inch: 3/32, diameter_mm: 2.38, drill_size: '#40 (0.098")' },
  { dash: '-4', diameter_inch: 1/8, diameter_mm: 3.18, drill_size: '#30 (0.129")' },
  { dash: '-5', diameter_inch: 5/32, diameter_mm: 3.97, drill_size: '#21 (0.159")' },
  { dash: '-6', diameter_inch: 3/16, diameter_mm: 4.76, drill_size: '#11 (0.191")' },
  { dash: '-8', diameter_inch: 1/4, diameter_mm: 6.35, drill_size: 'F (0.257")' },
  { dash: '-10', diameter_inch: 5/16, diameter_mm: 7.94, drill_size: 'P (0.323")' },
  { dash: '-12', diameter_inch: 3/8, diameter_mm: 9.53, drill_size: 'W (0.386")' },
  { dash: '-14', diameter_inch: 7/16, diameter_mm: 11.11, drill_size: '29/64 (0.453")' },
  { dash: '-16', diameter_inch: 1/2, diameter_mm: 12.70, drill_size: '33/64 (0.516")' },
];

export default function RivetSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [conversionMode, setConversionMode] = useState<'table' | 'convert'>('table');
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<'inch' | 'mm'>('inch');
  const [convertResult, setConvertResult] = useState('');

  const filtered = search.trim()
    ? RIVET_SIZES.filter(r =>
        r.dash.includes(search) ||
        r.diameter_inch.toFixed(4).includes(search) ||
        r.diameter_mm.toFixed(2).includes(search)
      )
    : RIVET_SIZES;

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) return;

    let inch: number, mm: number;
    if (inputUnit === 'inch') {
      inch = val;
      mm = val * 25.4;
    } else {
      mm = val;
      inch = val / 25.4;
    }

    const closest = RIVET_SIZES.reduce((prev, curr) =>
      Math.abs(curr.diameter_inch - inch) < Math.abs(prev.diameter_inch - inch) ? curr : prev
    );

    setConvertResult(
      `Input: ${val} ${inputUnit === 'inch' ? 'inches' : 'mm'}\n` +
      `Converted: ${inch.toFixed(4)}" / ${mm.toFixed(2)} mm\n` +
      `Closest standard rivet: ${closest.dash} (${closest.diameter_inch.toFixed(4)}" / ${closest.diameter_mm} mm)\n` +
      `Recommended drill: ${closest.drill_size}`
    );
  };

  const tableText = RIVET_SIZES.map(r =>
    `${r.dash}\t${r.diameter_inch.toFixed(4)}"\t${r.diameter_mm} mm\t${r.drill_size}`
  ).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setConversionMode('table')}
            className={`px-4 py-2 rounded text-sm font-medium ${conversionMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Reference Table
          </button>
          <button
            onClick={() => setConversionMode('convert')}
            className={`px-4 py-2 rounded text-sm font-medium ${conversionMode === 'convert' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Convert Size
          </button>
        </div>

        {conversionMode === 'table' ? (
          <div>
            <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
              Search rivet size
            </label>
            <input
              id={`${toolId}-search`}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by dash number, inches, or mm..."
              aria-label={`Search for ${toolName}`}
              className="input-field"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">
                Diameter Value
              </label>
              <input
                id={`${toolId}-val`}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0.125"
                step="any"
                min="0"
                aria-label="Rivet diameter value"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id={`${toolId}-unit`}
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as 'inch' | 'mm')}
                aria-label="Input unit"
                className="input-field"
              >
                <option value="inch">Inches</option>
                <option value="mm">Millimeters</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={convert} disabled={!inputValue} className="btn-primary w-full">
                Convert
              </button>
            </div>
          </div>
        )}
      </InputArea>

      <OutputArea hasContent={conversionMode === 'table' ? filtered.length > 0 : !!convertResult}>
        {conversionMode === 'table' ? (
          <div className="space-y-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-medium">Dash #</th>
                    <th className="text-left p-2 font-medium">Diameter (in)</th>
                    <th className="text-left p-2 font-medium">Diameter (mm)</th>
                    <th className="text-left p-2 font-medium">Drill Size</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.dash} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono font-semibold">{r.dash}</td>
                      <td className="p-2 font-mono">{r.diameter_inch.toFixed(4)}&quot;</td>
                      <td className="p-2 font-mono">{r.diameter_mm} mm</td>
                      <td className="p-2 font-mono">{r.drill_size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CopyToClipboard text={tableText} />
          </div>
        ) : convertResult ? (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border">{convertResult}</pre>
            <CopyToClipboard text={convertResult} />
          </div>
        ) : null}
      </OutputArea>
    </div>
  );
}
