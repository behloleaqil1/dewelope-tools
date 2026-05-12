'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToScytaleCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [diameter, setDiameter] = useState(4);
  const [output, setOutput] = useState('');

  const encrypt = () => {
    if (!input.trim()) return;
    const text = input.toUpperCase();
    const rows = diameter;
    const cols = Math.ceil(text.length / rows);
    const padded = text.padEnd(rows * cols, 'X');

    // Write row by row, read column by column
    const grid: string[][] = [];
    for (let r = 0; r < rows; r++) {
      grid.push([]);
      for (let c = 0; c < cols; c++) {
        grid[r].push(padded[r * cols + c]);
      }
    }

    let ciphertext = '';
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        ciphertext += grid[r][c];
      }
    }

    const gridDisplay = grid.map(row => row.join(' ')).join('\n');
    setOutput(`Cylinder Diameter: ${rows} faces\nColumns: ${cols}\n\nWrapped Grid:\n${gridDisplay}\n\nCiphertext: ${ciphertext}`);
  };

  const decrypt = () => {
    if (!input.trim()) return;
    const text = input.toUpperCase().replace(/[^A-Z]/g, '');
    const rows = diameter;
    const cols = Math.ceil(text.length / rows);

    // Write column by column, read row by row
    let plaintext = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = c * rows + r;
        if (idx < text.length) {
          plaintext += text[idx];
        }
      }
    }
    setOutput(`Decrypted: ${plaintext}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
          Cylinder Diameter (number of faces)
        </label>
        <input
          id={`${toolId}-diameter`}
          type="number"
          min={2}
          max={20}
          value={diameter}
          onChange={(e) => setDiameter(Number(e.target.value))}
          className="input-field mb-3 w-32"
          aria-label="Cylinder diameter"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt/decrypt with Scytale cipher..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="flex gap-2 mt-2">
          <button onClick={encrypt} className="btn-primary">Encrypt</button>
          <button onClick={decrypt} className="btn-primary">Decrypt</button>
        </div>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Scytale Cipher Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
