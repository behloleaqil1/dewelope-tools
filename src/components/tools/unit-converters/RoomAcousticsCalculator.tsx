'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RoomAcousticsCalculator - Calculate room reverberation time (RT60) using Sabine equation.
 */
export default function RoomAcousticsCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('5');
  const [width, setWidth] = useState('4');
  const [height, setHeight] = useState('2.8');
  const [surfaceType, setSurfaceType] = useState('living-room');
  const [output, setOutput] = useState('');

  const ABSORPTION_COEFFICIENTS: Record<string, { name: string; avg: number }> = {
    'living-room': { name: 'Living Room (furnished)', avg: 0.25 },
    'office': { name: 'Office (carpeted)', avg: 0.30 },
    'concert-hall': { name: 'Concert Hall', avg: 0.20 },
    'classroom': { name: 'Classroom', avg: 0.22 },
    'bare-concrete': { name: 'Bare Concrete Room', avg: 0.05 },
    'studio': { name: 'Recording Studio', avg: 0.45 },
    'bathroom': { name: 'Bathroom (tiled)', avg: 0.08 },
  };

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      setOutput('Please enter valid positive dimensions.');
      return;
    }

    const surface = ABSORPTION_COEFFICIENTS[surfaceType];
    if (!surface) return;

    const volume = l * w * h;
    const totalSurfaceArea = 2 * (l * w + l * h + w * h);
    const totalAbsorption = totalSurfaceArea * surface.avg;

    // Sabine equation: RT60 = 0.161 × V / A
    const rt60 = (0.161 * volume) / totalAbsorption;

    let quality = '';
    if (rt60 < 0.3) quality = 'Very dry (recording studio ideal)';
    else if (rt60 < 0.5) quality = 'Dry (good for speech/recording)';
    else if (rt60 < 0.8) quality = 'Moderate (good for general use)';
    else if (rt60 < 1.2) quality = 'Live (suitable for music)';
    else if (rt60 < 2.0) quality = 'Very live (concert hall range)';
    else quality = 'Excessive reverb (may need treatment)';

    const results = [
      `Room Dimensions: ${l}m × ${w}m × ${h}m`,
      `Surface type: ${surface.name}`,
      `Average absorption coefficient: ${surface.avg}`,
      ``,
      `Calculations:`,
      `  Volume: ${volume.toFixed(2)} m³`,
      `  Total surface area: ${totalSurfaceArea.toFixed(2)} m²`,
      `  Total absorption (A): ${totalAbsorption.toFixed(2)} sabins`,
      ``,
      `Results:`,
      `  RT60 (Sabine): ${rt60.toFixed(3)} seconds`,
      `  Quality: ${quality}`,
      ``,
      `Formula (Sabine equation):`,
      `  RT60 = 0.161 × V / A`,
      `  RT60 = 0.161 × ${volume.toFixed(2)} / ${totalAbsorption.toFixed(2)}`,
      `  RT60 = ${rt60.toFixed(3)} s`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
                Length (m)
              </label>
              <input
                id={`${toolId}-length`}
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                step="0.1"
                min="0.1"
                aria-label={`Room length for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
                Width (m)
              </label>
              <input
                id={`${toolId}-width`}
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                step="0.1"
                min="0.1"
                aria-label={`Room width for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
                Height (m)
              </label>
              <input
                id={`${toolId}-height`}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                step="0.1"
                min="0.1"
                aria-label={`Room height for ${toolName}`}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-surface`} className="block text-sm font-medium text-gray-700 mb-1">
              Room/Surface type
            </label>
            <select
              id={`${toolId}-surface`}
              value={surfaceType}
              onChange={(e) => setSurfaceType(e.target.value)}
              aria-label={`Surface type for ${toolName}`}
              className="input-field"
            >
              {Object.entries(ABSORPTION_COEFFICIENTS).map(([key, val]) => (
                <option key={key} value={key}>{val.name} (α={val.avg})</option>
              ))}
            </select>
          </div>
          <button onClick={calculate} className="btn-primary">
            Calculate RT60
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Room Acoustics Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
