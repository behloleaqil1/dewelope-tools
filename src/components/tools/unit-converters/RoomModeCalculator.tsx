'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RoomModeCalculator - Calculate room acoustic modes from dimensions.
 * Computes axial, tangential, and oblique modes using the room mode formula.
 */
export default function RoomModeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maxOrder, setMaxOrder] = useState('3');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const order = parseInt(maxOrder) || 3;

    if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
      setOutput('Please enter valid positive room dimensions.');
      return;
    }

    const speedOfSound = 343; // m/s at ~20°C
    const modes: { type: string; nx: number; ny: number; nz: number; freq: number }[] = [];

    for (let nx = 0; nx <= order; nx++) {
      for (let ny = 0; ny <= order; ny++) {
        for (let nz = 0; nz <= order; nz++) {
          if (nx === 0 && ny === 0 && nz === 0) continue;

          const freq = (speedOfSound / 2) * Math.sqrt(
            Math.pow(nx / l, 2) + Math.pow(ny / w, 2) + Math.pow(nz / h, 2)
          );

          let type = 'Oblique';
          const nonZero = [nx, ny, nz].filter(n => n > 0).length;
          if (nonZero === 1) type = 'Axial';
          else if (nonZero === 2) type = 'Tangential';

          modes.push({ type, nx, ny, nz, freq });
        }
      }
    }

    modes.sort((a, b) => a.freq - b.freq);

    const lines = [
      '=== Room Acoustic Modes ===',
      '',
      `Room: ${l}m × ${w}m × ${h}m`,
      `Speed of Sound: ${speedOfSound} m/s`,
      `Max Order: ${order}`,
      '',
      'Mode (nx,ny,nz) | Type        | Frequency',
      '─'.repeat(50),
      ...modes.slice(0, 30).map(m =>
        `(${m.nx},${m.ny},${m.nz})`.padEnd(16) + `| ${m.type.padEnd(12)}| ${m.freq.toFixed(2)} Hz`
      ),
      '',
      `Total modes found: ${modes.length}`,
      modes.length > 30 ? '(Showing first 30 modes)' : '',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
            <input id={`${toolId}-length`} type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="5.0" className="input-field" aria-label={`Room length for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
            <input id={`${toolId}-width`} type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="4.0" className="input-field" aria-label="Room width" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
            <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="2.8" className="input-field" aria-label="Room height" />
          </div>
          <div>
            <label htmlFor={`${toolId}-order`} className="block text-sm font-medium text-gray-700 mb-1">Max Order</label>
            <input id={`${toolId}-order`} type="number" min="1" max="5" value={maxOrder} onChange={(e) => setMaxOrder(e.target.value)} className="input-field" aria-label="Maximum mode order" />
          </div>
        </div>

        <button onClick={calculate} className="btn-primary mt-3">Calculate Modes</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Room Modes</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
