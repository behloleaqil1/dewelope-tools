'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToRouteCipher - Encrypt text with Route cipher.
 * Writes text into a grid and reads it off in a specified pattern
 * (spiral clockwise, spiral counter-clockwise, columns top-down, columns bottom-up).
 */
export default function TextToRouteCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [cols, setCols] = useState(5);
  const [route, setRoute] = useState<'spiral-cw' | 'spiral-ccw' | 'col-down' | 'col-up'>('spiral-cw');
  const [output, setOutput] = useState('');
  const [gridDisplay, setGridDisplay] = useState('');

  const padText = (text: string, totalCells: number): string => {
    const padded = text.padEnd(totalCells, 'X');
    return padded;
  };

  const buildGrid = (text: string, numCols: number): string[][] => {
    const rows = Math.ceil(text.length / numCols);
    const padded = padText(text, rows * numCols);
    const grid: string[][] = [];
    for (let r = 0; r < rows; r++) {
      grid.push(padded.slice(r * numCols, (r + 1) * numCols).split(''));
    }
    return grid;
  };

  const readSpiralCW = (grid: string[][]): string => {
    const result: string[] = [];
    let top = 0, bottom = grid.length - 1;
    let left = 0, right = grid[0].length - 1;

    while (top <= bottom && left <= right) {
      for (let i = left; i <= right; i++) result.push(grid[top][i]);
      top++;
      for (let i = top; i <= bottom; i++) result.push(grid[i][right]);
      right--;
      if (top <= bottom) {
        for (let i = right; i >= left; i--) result.push(grid[bottom][i]);
        bottom--;
      }
      if (left <= right) {
        for (let i = bottom; i >= top; i--) result.push(grid[i][left]);
        left++;
      }
    }
    return result.join('');
  };

  const readSpiralCCW = (grid: string[][]): string => {
    const result: string[] = [];
    let top = 0, bottom = grid.length - 1;
    let left = 0, right = grid[0].length - 1;

    while (top <= bottom && left <= right) {
      for (let i = top; i <= bottom; i++) result.push(grid[i][left]);
      left++;
      for (let i = left; i <= right; i++) result.push(grid[bottom][i]);
      bottom--;
      if (left <= right) {
        for (let i = bottom; i >= top; i--) result.push(grid[i][right]);
        right--;
      }
      if (top <= bottom) {
        for (let i = right; i >= left; i--) result.push(grid[top][i]);
        top++;
      }
    }
    return result.join('');
  };

  const readColDown = (grid: string[][]): string => {
    const result: string[] = [];
    for (let c = 0; c < grid[0].length; c++) {
      for (let r = 0; r < grid.length; r++) {
        result.push(grid[r][c]);
      }
    }
    return result.join('');
  };

  const readColUp = (grid: string[][]): string => {
    const result: string[] = [];
    for (let c = 0; c < grid[0].length; c++) {
      for (let r = grid.length - 1; r >= 0; r--) {
        result.push(grid[r][c]);
      }
    }
    return result.join('');
  };

  const encrypt = () => {
    const cleaned = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleaned) {
      setOutput('');
      setGridDisplay('');
      return;
    }

    const numCols = Math.max(2, cols);
    const grid = buildGrid(cleaned, numCols);

    // Display grid
    const display = grid.map(row => row.join(' ')).join('\n');
    setGridDisplay(display);

    let result = '';
    switch (route) {
      case 'spiral-cw': result = readSpiralCW(grid); break;
      case 'spiral-ccw': result = readSpiralCCW(grid); break;
      case 'col-down': result = readColDown(grid); break;
      case 'col-up': result = readColUp(grid); break;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to encrypt
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter plaintext to encrypt with Route cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">
              Grid Columns
            </label>
            <input
              id={`${toolId}-cols`}
              type="number"
              min={2}
              max={20}
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 5)}
              aria-label="Number of grid columns"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-route`} className="block text-sm font-medium text-gray-700 mb-1">
              Read Pattern
            </label>
            <select
              id={`${toolId}-route`}
              value={route}
              onChange={(e) => setRoute(e.target.value as typeof route)}
              aria-label="Route pattern"
              className="input-field"
            >
              <option value="spiral-cw">Spiral Clockwise</option>
              <option value="spiral-ccw">Spiral Counter-Clockwise</option>
              <option value="col-down">Columns Top-Down</option>
              <option value="col-up">Columns Bottom-Up</option>
            </select>
          </div>
        </div>

        <button
          onClick={encrypt}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Encrypt
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            {gridDisplay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grid Layout</label>
                <pre className="whitespace-pre text-sm font-mono text-gray-600 bg-gray-50 p-3 rounded-lg">{gridDisplay}</pre>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciphertext</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
