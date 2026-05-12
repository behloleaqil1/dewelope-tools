'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToGrilleCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [gridSize, setGridSize] = useState(4);
  const [output, setOutput] = useState('');

  const encrypt = () => {
    const text = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const totalCells = gridSize * gridSize;
    const holes = Math.floor(totalCells / 4);

    // Generate random grille positions for first quadrant
    const positions: number[] = [];
    const used = new Set<number>();
    while (positions.length < holes) {
      const pos = Math.floor(Math.random() * totalCells);
      if (!used.has(pos)) {
        used.add(pos);
        positions.push(pos);
      }
    }

    // Fill grid with text through 4 rotations
    const grid: string[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill('.')
    );

    let charIdx = 0;
    for (let rotation = 0; rotation < 4; rotation++) {
      for (const pos of positions) {
        let row = Math.floor(pos / gridSize);
        let col = pos % gridSize;
        // Rotate position
        for (let r = 0; r < rotation; r++) {
          const newRow = col;
          const newCol = gridSize - 1 - row;
          row = newRow;
          col = newCol;
        }
        if (charIdx < text.length) {
          grid[row][col] = text[charIdx];
          charIdx++;
        } else {
          grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    const grilleMask = positions.map(p => `(${Math.floor(p / gridSize)},${p % gridSize})`).join(' ');
    const gridStr = grid.map(row => row.join(' ')).join('\n');
    setOutput(`Grille Holes: ${grilleMask}\n\nEncrypted Grid:\n${gridStr}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Grid Size
        </label>
        <select
          id={`${toolId}-size`}
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="input-field mb-3 w-32"
          aria-label="Grid size"
        >
          <option value={4}>4×4</option>
          <option value={6}>6×6</option>
          <option value={8}>8×8</option>
        </select>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Plaintext
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt with Grille cipher..."
          aria-label={`Plaintext input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={encrypt} className="btn-primary mt-2">Encrypt with Grille Cipher</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Grille Cipher Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
