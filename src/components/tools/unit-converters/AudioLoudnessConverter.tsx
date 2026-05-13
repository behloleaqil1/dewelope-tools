'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AudioLoudnessConverter - Convert between LUFS, dBFS, and RMS audio levels.
 * Provides conversions and context for common loudness standards.
 */
export default function AudioLoudnessConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('lufs');
  const [output, setOutput] = useState('');

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutput('Error: Please enter a valid numeric value');
      return;
    }

    let lufs: number;
    let dbfs: number;
    let rms: number;

    // Approximate relationships:
    // LUFS ≈ dBFS for a sine wave (LUFS uses K-weighting)
    // RMS dBFS is typically ~3 dB below peak dBFS for typical audio
    // LUFS is typically 1-3 dB lower than RMS due to K-weighting

    switch (inputUnit) {
      case 'lufs':
        lufs = val;
        dbfs = val + 1.5; // Approximate: dBFS peak is slightly higher
        rms = val + 2; // RMS is typically slightly higher than LUFS
        break;
      case 'dbfs':
        dbfs = val;
        lufs = val - 1.5; // LUFS is typically lower than dBFS
        rms = val + 0.5;
        break;
      case 'rms':
        rms = val;
        lufs = val - 2; // LUFS is typically lower than RMS
        dbfs = val - 0.5;
        break;
      default:
        setOutput('Error: Unknown unit');
        return;
    }

    // Calculate linear values
    const linearPeak = Math.pow(10, dbfs / 20);
    const linearRms = Math.pow(10, rms / 20);

    const standards = [
      { name: 'Spotify', target: '-14 LUFS' },
      { name: 'Apple Music', target: '-16 LUFS' },
      { name: 'YouTube', target: '-14 LUFS' },
      { name: 'CD/Streaming (loud)', target: '-9 LUFS' },
      { name: 'Broadcast (EBU R128)', target: '-23 LUFS' },
      { name: 'Podcast', target: '-16 to -18 LUFS' },
    ];

    const results = [
      `Input: ${val} ${inputUnit.toUpperCase()}`,
      ``,
      `Conversions (approximate):`,
      `  LUFS: ${lufs.toFixed(1)} LUFS`,
      `  dBFS (peak): ${dbfs.toFixed(1)} dBFS`,
      `  RMS: ${rms.toFixed(1)} dBFS RMS`,
      `  Linear Peak: ${linearPeak.toFixed(6)}`,
      `  Linear RMS: ${linearRms.toFixed(6)}`,
      ``,
      `Common Loudness Standards:`,
      ...standards.map((s) => `  ${s.name}: ${s.target}`),
      ``,
      `Note: Conversions between LUFS, dBFS, and RMS are`,
      `approximate as they depend on audio content and`,
      `K-weighting characteristics.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              Level Value
            </label>
            <input
              id={`${toolId}-value`}
              type="number"
              step="0.1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. -14"
              aria-label={`Level value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              Input Unit
            </label>
            <select
              id={`${toolId}-unit`}
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              aria-label="Input unit"
              className="input-field"
            >
              <option value="lufs">LUFS (Loudness Units Full Scale)</option>
              <option value="dbfs">dBFS (Decibels Full Scale)</option>
              <option value="rms">RMS (Root Mean Square dBFS)</option>
            </select>
          </div>
          <button onClick={convert} className="btn-primary w-full">
            Convert
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
