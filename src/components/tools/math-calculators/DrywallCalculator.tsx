'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DrywallCalculator - Calculate drywall sheets needed for walls and ceiling.
 * Accounts for room dimensions, doors, windows, and waste factor.
 */
export default function DrywallCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('8');
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [sheetSize, setSheetSize] = useState('4x8');
  const [wasteFactor, setWasteFactor] = useState('10');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ wallArea: number; ceilingArea: number; openings: number; netArea: number; sheetArea: number; sheets: number; totalWithWaste: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(roomLength);
    const w = parseFloat(roomWidth);
    const h = parseFloat(ceilingHeight);

    if (!roomLength.trim() || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
    if (!roomWidth.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const perimeter = 2 * (l + w);
    const wallArea = perimeter * h;
    const ceilingArea = includeCeiling ? l * w : 0;

    const doorArea = (parseInt(doors) || 0) * 21; // standard door ~3x7 = 21 sq ft
    const windowArea = (parseInt(windows) || 0) * 12; // standard window ~3x4 = 12 sq ft
    const openings = doorArea + windowArea;

    const netArea = wallArea + ceilingArea - openings;

    const [sheetW, sheetH] = sheetSize.split('x').map(Number);
    const sheetArea = sheetW * sheetH;

    const sheetsNeeded = netArea / sheetArea;
    const waste = parseFloat(wasteFactor) || 10;
    const totalWithWaste = Math.ceil(sheetsNeeded * (1 + waste / 100));

    setResult({ wallArea, ceilingArea, openings, netArea, sheetArea, sheets: Math.ceil(sheetsNeeded), totalWithWaste });
  };

  const copyText = result
    ? `Drywall Calculator Results\nWall Area: ${result.wallArea.toFixed(1)} sq ft\nCeiling Area: ${result.ceilingArea.toFixed(1)} sq ft\nOpenings Deducted: ${result.openings.toFixed(1)} sq ft\nNet Area: ${result.netArea.toFixed(1)} sq ft\nSheets Needed: ${result.sheets}\nWith ${wasteFactor}% Waste: ${result.totalWithWaste} sheets`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.length}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Room Length (feet)</label>
          <input id={`${toolId}-length`} type="text" inputMode="decimal" value={roomLength} onChange={(e) => { setRoomLength(e.target.value); if (errors.length) setErrors((p) => ({ ...p, length: '' })); }} placeholder="e.g. 14" aria-label={`Room length for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Room Width (feet)</label>
          <input id={`${toolId}-width`} type="text" inputMode="decimal" value={roomWidth} onChange={(e) => { setRoomWidth(e.target.value); if (errors.width) setErrors((p) => ({ ...p, width: '' })); }} placeholder="e.g. 12" aria-label={`Room width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Ceiling Height (feet)</label>
          <input id={`${toolId}-height`} type="text" inputMode="decimal" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} placeholder="8" aria-label="Ceiling height" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-sheet`} className="block text-sm font-medium text-gray-700 mb-1">Sheet Size</label>
          <select id={`${toolId}-sheet`} value={sheetSize} onChange={(e) => setSheetSize(e.target.value)} className="input-field" aria-label="Sheet size">
            <option value="4x8">4×8 ft (32 sq ft)</option>
            <option value="4x10">4×10 ft (40 sq ft)</option>
            <option value="4x12">4×12 ft (48 sq ft)</option>
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-doors`} className="block text-sm font-medium text-gray-700 mb-1">Number of Doors</label>
          <input id={`${toolId}-doors`} type="text" inputMode="numeric" value={doors} onChange={(e) => setDoors(e.target.value)} placeholder="1" aria-label="Number of doors" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-windows`} className="block text-sm font-medium text-gray-700 mb-1">Number of Windows</label>
          <input id={`${toolId}-windows`} type="text" inputMode="numeric" value={windows} onChange={(e) => setWindows(e.target.value)} placeholder="2" aria-label="Number of windows" className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-waste`} className="block text-sm font-medium text-gray-700 mb-1">Waste Factor (%)</label>
          <input id={`${toolId}-waste`} type="text" inputMode="decimal" value={wasteFactor} onChange={(e) => setWasteFactor(e.target.value)} placeholder="10" aria-label="Waste factor percentage" className="input-field" />
        </InputArea>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={includeCeiling} onChange={(e) => setIncludeCeiling(e.target.checked)} className="rounded border-gray-300" />
            Include ceiling
          </label>
        </div>
      </div>

      <button onClick={calculate} aria-label="Calculate drywall needed" className="btn-primary">
        Calculate Drywall
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.wallArea.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Wall Area (sq ft)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.ceilingArea.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Ceiling (sq ft)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.netArea.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Net Area (sq ft)</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-700">{result.totalWithWaste}</div>
              <div className="text-sm text-blue-600 mt-1">Sheets Needed (incl. {wasteFactor}% waste)</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
