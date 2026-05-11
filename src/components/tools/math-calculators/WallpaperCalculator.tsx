'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WallpaperCalculator - Calculate wallpaper rolls needed for a room.
 * Accounts for room dimensions, roll size, pattern repeat, and openings.
 */
export default function WallpaperCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('8');
  const [rollWidth, setRollWidth] = useState('20.5');
  const [rollLength, setRollLength] = useState('33');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ wallArea: number; usableArea: number; rolls: number; strips: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(roomLength);
    const w = parseFloat(roomWidth);
    const h = parseFloat(roomHeight);
    const rw = parseFloat(rollWidth);
    const rl = parseFloat(rollLength);
    const d = parseInt(doors) || 0;
    const win = parseInt(windows) || 0;

    if (!roomLength.trim() || isNaN(l) || l <= 0) newErrors.roomLength = 'Enter valid length';
    if (!roomWidth.trim() || isNaN(w) || w <= 0) newErrors.roomWidth = 'Enter valid width';
    if (isNaN(h) || h <= 0) newErrors.roomHeight = 'Enter valid height';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const perimeter = 2 * (l + w);
    const wallArea = perimeter * h;
    // Standard door ~21 sq ft, window ~15 sq ft
    const openingsArea = d * 21 + win * 15;
    const usableArea = Math.max(wallArea - openingsArea, 0);

    // Roll coverage: roll width in inches / 12 * roll length in feet
    const rollCoverage = (rw / 12) * rl;
    // Account for ~15% waste
    const effectiveCoverage = rollCoverage * 0.85;
    const rolls = Math.ceil(usableArea / effectiveCoverage);
    const totalStrips = Math.ceil(perimeter / (rw / 12));
    const strips = totalStrips;

    setResult({ wallArea, usableArea, rolls, strips });
  };

  const copyText = result
    ? `Wallpaper Estimate:\nWall Area: ${result.wallArea.toFixed(0)} sq ft\nUsable Area (minus openings): ${result.usableArea.toFixed(0)} sq ft\nRolls Needed: ${result.rolls}\nTotal Strips: ${result.strips}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputArea error={errors.roomLength}>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
              Room Length (ft)
            </label>
            <input id={`${toolId}-length`} type="text" inputMode="decimal" value={roomLength} onChange={(e) => { setRoomLength(e.target.value); if (errors.roomLength) setErrors((p) => ({ ...p, roomLength: '' })); }} placeholder="e.g. 14" aria-label={`Room length for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.roomWidth}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Room Width (ft)
            </label>
            <input id={`${toolId}-width`} type="text" inputMode="decimal" value={roomWidth} onChange={(e) => { setRoomWidth(e.target.value); if (errors.roomWidth) setErrors((p) => ({ ...p, roomWidth: '' })); }} placeholder="e.g. 12" aria-label={`Room width for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <InputArea error={errors.roomHeight}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
            Ceiling Height (ft)
          </label>
          <input id={`${toolId}-height`} type="text" inputMode="decimal" value={roomHeight} onChange={(e) => setRoomHeight(e.target.value)} placeholder="e.g. 8" aria-label={`Ceiling height for ${toolName}`} className="input-field" />
        </InputArea>

        <div className="grid grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-rw`} className="block text-sm font-medium text-gray-700 mb-1">
              Roll Width (inches)
            </label>
            <input id={`${toolId}-rw`} type="text" inputMode="decimal" value={rollWidth} onChange={(e) => setRollWidth(e.target.value)} placeholder="20.5" aria-label={`Roll width for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-rl`} className="block text-sm font-medium text-gray-700 mb-1">
              Roll Length (ft)
            </label>
            <input id={`${toolId}-rl`} type="text" inputMode="decimal" value={rollLength} onChange={(e) => setRollLength(e.target.value)} placeholder="33" aria-label={`Roll length for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-doors`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Doors
            </label>
            <input id={`${toolId}-doors`} type="text" inputMode="numeric" value={doors} onChange={(e) => setDoors(e.target.value)} placeholder="1" aria-label={`Doors for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-windows`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Windows
            </label>
            <input id={`${toolId}-windows`} type="text" inputMode="numeric" value={windows} onChange={(e) => setWindows(e.target.value)} placeholder="2" aria-label={`Windows for ${toolName}`} className="input-field" />
          </InputArea>
        </div>
      </div>

      <button onClick={calculate} aria-label="Calculate wallpaper" className="btn-primary">
        Calculate Wallpaper
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.rolls}</div>
                <div className="text-xs text-gray-500 mt-1">Rolls Needed</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.usableArea.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">Sq Ft to Cover</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Total wall area: {result.wallArea.toFixed(0)} sq ft</p>
              <p>After subtracting openings: {result.usableArea.toFixed(0)} sq ft</p>
              <p>Total strips: {result.strips} | Includes 15% waste allowance</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
