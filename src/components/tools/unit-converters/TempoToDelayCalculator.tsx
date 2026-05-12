'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TempoToDelayCalculator - Calculate delay times from musical tempo (BPM).
 * Shows delay times for various note values including dotted and triplet variants.
 */
export default function TempoToDelayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bpm, setBpm] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const tempo = parseFloat(bpm);
    if (isNaN(tempo) || tempo <= 0) {
      setOutput('Error: Please enter a valid BPM value greater than 0.');
      return;
    }

    // Quarter note duration in ms
    const quarterMs = 60000 / tempo;

    const notes = [
      { name: 'Whole Note (1/1)', multiplier: 4 },
      { name: 'Half Note (1/2)', multiplier: 2 },
      { name: 'Quarter Note (1/4)', multiplier: 1 },
      { name: 'Eighth Note (1/8)', multiplier: 0.5 },
      { name: 'Sixteenth Note (1/16)', multiplier: 0.25 },
      { name: 'Thirty-Second (1/32)', multiplier: 0.125 },
    ];

    let result = `=== Delay Times for ${tempo} BPM ===\n\n`;
    result += `${'Note Value'.padEnd(28)} ${'Normal'.padEnd(12)} ${'Dotted'.padEnd(12)} ${'Triplet'.padEnd(12)}\n`;
    result += `${'─'.repeat(28)} ${'─'.repeat(12)} ${'─'.repeat(12)} ${'─'.repeat(12)}\n`;

    notes.forEach(note => {
      const normal = quarterMs * note.multiplier;
      const dotted = normal * 1.5;
      const triplet = normal * (2 / 3);

      result += `${note.name.padEnd(28)} ${(normal.toFixed(2) + ' ms').padEnd(12)} ${(dotted.toFixed(2) + ' ms').padEnd(12)} ${(triplet.toFixed(2) + ' ms').padEnd(12)}\n`;
    });

    result += `\n--- Frequency (Hz) ---\n\n`;
    result += `${'Note Value'.padEnd(28)} ${'Normal'.padEnd(12)} ${'Dotted'.padEnd(12)} ${'Triplet'.padEnd(12)}\n`;
    result += `${'─'.repeat(28)} ${'─'.repeat(12)} ${'─'.repeat(12)} ${'─'.repeat(12)}\n`;

    notes.forEach(note => {
      const normal = quarterMs * note.multiplier;
      const dotted = normal * 1.5;
      const triplet = normal * (2 / 3);

      const freqNormal = 1000 / normal;
      const freqDotted = 1000 / dotted;
      const freqTriplet = 1000 / triplet;

      result += `${note.name.padEnd(28)} ${(freqNormal.toFixed(3) + ' Hz').padEnd(12)} ${(freqDotted.toFixed(3) + ' Hz').padEnd(12)} ${(freqTriplet.toFixed(3) + ' Hz').padEnd(12)}\n`;
    });

    result += `\nFormula: Delay (ms) = 60000 / BPM × note multiplier\n`;
    result += `Quarter note at ${tempo} BPM = ${quarterMs.toFixed(2)} ms\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-bpm`} className="block text-sm font-medium text-gray-700 mb-1">
          Tempo (BPM)
        </label>
        <input
          id={`${toolId}-bpm`}
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="120"
          min="1"
          max="999"
          aria-label={`BPM input for ${toolName}`}
          className="input-field max-w-xs"
        />
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Delay Times
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Delay Times</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
