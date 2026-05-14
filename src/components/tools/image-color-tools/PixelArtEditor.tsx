'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PixelArtEditor - Simple pixel art grid editor.
 */
export default function PixelArtEditor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gridSize, setGridSize] = useState(16);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => '#ffffff'))
  );
  const [isDrawing, setIsDrawing] = useState(false);

  function resetGrid() {
    setGrid(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '#ffffff')));
  }

  function handleCellClick(row: number, col: number) {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = currentColor;
    setGrid(newGrid);
  }

  function handleMouseDown(row: number, col: number) {
    setIsDrawing(true);
    handleCellClick(row, col);
  }

  function handleMouseEnter(row: number, col: number) {
    if (isDrawing) handleCellClick(row, col);
  }

  function exportAsCss(): string {
    const pixelSize = 4;
    const shadows: string[] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== '#ffffff') {
          shadows.push(`${c * pixelSize}px ${r * pixelSize}px ${grid[r][c]}`);
        }
      }
    }
    return `box-shadow: ${shadows.join(',\n  ')};
width: ${pixelSize}px;
height: ${pixelSize}px;`;
  }

  const palette = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#888888', '#444444'];

  return (
    <div className="space-y-4" data-tool-id={toolId} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}>
      <InputArea>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Grid Size</label>
            <select id={`${toolId}-size`} value={gridSize} onChange={(e) => { setGridSize(parseInt(e.target.value)); resetGrid(); }} aria-label={`Grid size for ${toolName}`} className="input-field w-20">
              <option value="8">8×8</option>
              <option value="16">16×16</option>
              <option value="32">32×32</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input id={`${toolId}-color`} type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} aria-label="Drawing color" className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {palette.map(c => (
              <button key={c} onClick={() => setCurrentColor(c)} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: c }} aria-label={`Select color ${c}`} />
            ))}
          </div>
        </div>
      </InputArea>

      <div className="inline-grid gap-0 border border-gray-300 rounded" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="w-4 h-4 border border-gray-100 cursor-crosshair"
              style={{ backgroundColor: cell }}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
            />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={resetGrid} aria-label="Clear canvas" className="btn-primary bg-gray-500 hover:bg-gray-600">Clear</button>
      </div>

      <OutputArea hasContent={grid.some(row => row.some(c => c !== '#ffffff'))}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">CSS Box-Shadow Export</label>
          <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">{exportAsCss()}</pre>
          <CopyToClipboard text={exportAsCss()} />
        </div>
      </OutputArea>
    </div>
  );
}
