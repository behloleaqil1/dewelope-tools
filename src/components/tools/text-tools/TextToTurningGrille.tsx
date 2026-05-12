'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTurningGrille - Encrypt text with Turning Grille cipher.
 * Uses a 4x4 grille with holes that is rotated 90° four times to fill a grid.
 */
export default function TextToTurningGrille({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [grille, setGrille] = useState<boolean[][]>([
    [true, false, false, false],
    [false, false, true, false],
    [false, true, false, false],
    [false, false, false, true],
  ]);
  const [output, setOutput] = useState('');
  const [gridDisplay, setGridDisplay] = useState('');

  const toggleCell = (row: number, col: number) => {
    const newGrille = grille.map(r => [...r]);
    newGrille[row][col] = !newGrille[row][col];
    setGrille(newGrille);
  };

  const rotateGrille90 = (g: boolean[][]): boolean[][] => {
    const size = g.length;
    const rotated: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        rotated[c][size - 1 - r] = g[r][c];
      }
    }
    return rotated;
  };

  const encrypt = () => {
    const cleaned = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleaned) {
      setOutput('');
      setGridDisplay('');
      return;
    }

    const size = 4;
    const totalCells = size * size;
    const padded = cleaned.padEnd(totalCells, 'X').slice(0, totalCells);

    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    let charIndex = 0;
    let currentGrille = grille.map(r => [...r]);

    for (let rotation = 0; rotation < 4; rotation++) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (currentGrille[r][c] && !grid[r][c] && charIndex < padded.length) {
            grid[r][c] = padded[charIndex];
            charIndex++;
          }
        }
      }
      currentGrille = rotateGrille90(currentGrille);
    }

    // Fill any remaining empty cells
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) {
          grid[r][c] = charIndex < padded.length ? padded[charIndex++] : 'X';
        }
      }
    }

    const display = grid.map(row => row.join(' ')).join('\n');
    setGridDisplay(display);

    // Read off row by row
    const ciphertext = grid.map(row => row.join('')).join('');
    setOutput(ciphertext);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to encrypt (max 16 chars used)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter plaintext to encrypt with Turning Grille cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grille Pattern (click to toggle holes)
          </label>
          <div className="inline-grid grid-cols-4 gap-1">
            {grille.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  className={`w-10 h-10 rounded border-2 text-sm font-bold ${
                    cell
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
                  aria-label={`Grille cell row ${r + 1} col ${c + 1} ${cell ? 'open' : 'closed'}`}
                >
                  {cell ? '○' : '■'}
                </button>
              ))
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">○ = hole (open), ■ = blocked</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Filled Grid</label>
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
