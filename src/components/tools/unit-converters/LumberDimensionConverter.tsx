'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LumberDimensionConverter - Convert between nominal and actual lumber dimensions.
 * Shows the real dimensions of standard lumber sizes (e.g., a 2x4 is actually 1.5" x 3.5").
 */
export default function LumberDimensionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [output, setOutput] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const lumberSizes: { nominal: string; actual: string; actualMm: string }[] = [
    { nominal: '1 x 2', actual: '0.75" x 1.5"', actualMm: '19mm x 38mm' },
    { nominal: '1 x 3', actual: '0.75" x 2.5"', actualMm: '19mm x 64mm' },
    { nominal: '1 x 4', actual: '0.75" x 3.5"', actualMm: '19mm x 89mm' },
    { nominal: '1 x 6', actual: '0.75" x 5.5"', actualMm: '19mm x 140mm' },
    { nominal: '1 x 8', actual: '0.75" x 7.25"', actualMm: '19mm x 184mm' },
    { nominal: '1 x 10', actual: '0.75" x 9.25"', actualMm: '19mm x 235mm' },
    { nominal: '1 x 12', actual: '0.75" x 11.25"', actualMm: '19mm x 286mm' },
    { nominal: '2 x 2', actual: '1.5" x 1.5"', actualMm: '38mm x 38mm' },
    { nominal: '2 x 3', actual: '1.5" x 2.5"', actualMm: '38mm x 64mm' },
    { nominal: '2 x 4', actual: '1.5" x 3.5"', actualMm: '38mm x 89mm' },
    { nominal: '2 x 6', actual: '1.5" x 5.5"', actualMm: '38mm x 140mm' },
    { nominal: '2 x 8', actual: '1.5" x 7.25"', actualMm: '38mm x 184mm' },
    { nominal: '2 x 10', actual: '1.5" x 9.25"', actualMm: '38mm x 235mm' },
    { nominal: '2 x 12', actual: '1.5" x 11.25"', actualMm: '38mm x 286mm' },
    { nominal: '4 x 4', actual: '3.5" x 3.5"', actualMm: '89mm x 89mm' },
    { nominal: '4 x 6', actual: '3.5" x 5.5"', actualMm: '89mm x 140mm' },
    { nominal: '6 x 6', actual: '5.5" x 5.5"', actualMm: '140mm x 140mm' },
    { nominal: '6 x 8', actual: '5.5" x 7.5"', actualMm: '140mm x 190mm' },
    { nominal: '8 x 8', actual: '7.5" x 7.5"', actualMm: '190mm x 190mm' },
  ];

  const convert = () => {
    if (!selectedSize) {
      // Show all sizes
      const header = 'Nominal Size | Actual (inches) | Actual (mm)';
      const separator = '-'.repeat(header.length);
      const rows = lumberSizes.map(s =>
        `${s.nominal.padEnd(12)} | ${s.actual.padEnd(15)} | ${s.actualMm}`
      );
      setOutput([header, separator, ...rows].join('\n'));
    } else {
      const found = lumberSizes.find(s => s.nominal === selectedSize);
      if (found) {
        setOutput([
          `Nominal Size: ${found.nominal}`,
          `Actual Size (inches): ${found.actual}`,
          `Actual Size (metric): ${found.actualMm}`,
          '',
          'Note: Nominal sizes refer to rough-cut dimensions before',
          'drying and planing. Actual sizes are smaller due to this process.',
        ].join('\n'));
      }
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Lumber Size (or leave empty for full table)
        </label>
        <select
          id={`${toolId}-size`}
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          aria-label={`Lumber size for ${toolName}`}
          className="input-field"
        >
          <option value="">All Sizes (Full Table)</option>
          {lumberSizes.map(s => (
            <option key={s.nominal} value={s.nominal}>{s.nominal}</option>
          ))}
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert lumber dimensions" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lumber Dimensions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
