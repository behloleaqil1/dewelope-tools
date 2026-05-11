'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface PaperSize {
  name: string;
  widthMm: number;
  heightMm: number;
}

const PAPER_SIZES: Record<string, PaperSize[]> = {
  'A-Series (ISO 216)': [
    { name: 'A0', widthMm: 841, heightMm: 1189 },
    { name: 'A1', widthMm: 594, heightMm: 841 },
    { name: 'A2', widthMm: 420, heightMm: 594 },
    { name: 'A3', widthMm: 297, heightMm: 420 },
    { name: 'A4', widthMm: 210, heightMm: 297 },
    { name: 'A5', widthMm: 148, heightMm: 210 },
    { name: 'A6', widthMm: 105, heightMm: 148 },
    { name: 'A7', widthMm: 74, heightMm: 105 },
    { name: 'A8', widthMm: 52, heightMm: 74 },
  ],
  'B-Series (ISO 216)': [
    { name: 'B0', widthMm: 1000, heightMm: 1414 },
    { name: 'B1', widthMm: 707, heightMm: 1000 },
    { name: 'B2', widthMm: 500, heightMm: 707 },
    { name: 'B3', widthMm: 353, heightMm: 500 },
    { name: 'B4', widthMm: 250, heightMm: 353 },
    { name: 'B5', widthMm: 176, heightMm: 250 },
    { name: 'B6', widthMm: 125, heightMm: 176 },
  ],
  'US Sizes': [
    { name: 'Letter', widthMm: 215.9, heightMm: 279.4 },
    { name: 'Legal', widthMm: 215.9, heightMm: 355.6 },
    { name: 'Tabloid (Ledger)', widthMm: 279.4, heightMm: 431.8 },
    { name: 'Executive', widthMm: 184.15, heightMm: 266.7 },
    { name: 'Half Letter', widthMm: 139.7, heightMm: 215.9 },
    { name: 'Government Letter', widthMm: 203.2, heightMm: 266.7 },
  ],
};

/**
 * PaperSizeReference - Reference for A-series, B-series, and US paper sizes in mm and inches.
 */
export default function PaperSizeReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedSeries, setSelectedSeries] = useState<string>('A-Series (ISO 216)');
  const [unit, setUnit] = useState<'mm' | 'inches'>('mm');

  const mmToInches = (mm: number) => (mm / 25.4).toFixed(2);

  const sizes = PAPER_SIZES[selectedSeries] || [];

  const copyText = sizes
    .map((s) =>
      unit === 'mm'
        ? `${s.name}: ${s.widthMm} × ${s.heightMm} mm`
        : `${s.name}: ${mmToInches(s.widthMm)} × ${mmToInches(s.heightMm)} in`
    )
    .join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-series`} className="block text-sm font-medium text-gray-700 mb-1">
          Paper Series
        </label>
        <select
          id={`${toolId}-series`}
          value={selectedSeries}
          onChange={(e) => setSelectedSeries(e.target.value)}
          aria-label={`Paper series for ${toolName}`}
          className="input-field"
        >
          {Object.keys(PAPER_SIZES).map((series) => (
            <option key={series} value={series}>{series}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
          Display Unit
        </label>
        <select
          id={`${toolId}-unit`}
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'mm' | 'inches')}
          aria-label="Display unit"
          className="input-field w-40"
        >
          <option value="mm">Millimeters (mm)</option>
          <option value="inches">Inches (in)</option>
        </select>
      </InputArea>

      <OutputArea hasContent={sizes.length > 0}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">{selectedSeries}</h3>
            <CopyToClipboard text={copyText} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200 font-medium">Size</th>
                  <th className="text-right p-2 border border-gray-200 font-medium">Width</th>
                  <th className="text-right p-2 border border-gray-200 font-medium">Height</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size.name} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-200 font-medium text-gray-800">{size.name}</td>
                    <td className="p-2 border border-gray-200 text-right font-mono text-gray-700">
                      {unit === 'mm' ? `${size.widthMm} mm` : `${mmToInches(size.widthMm)} in`}
                    </td>
                    <td className="p-2 border border-gray-200 text-right font-mono text-gray-700">
                      {unit === 'mm' ? `${size.heightMm} mm` : `${mmToInches(size.heightMm)} in`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </OutputArea>
    </div>
  );
}
