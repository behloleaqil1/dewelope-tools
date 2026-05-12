'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SoundFrequencyToNote - Convert frequency (Hz) to musical note name.
 * Uses A4 = 440 Hz standard tuning to determine the closest note, octave, and cents deviation.
 */
export default function SoundFrequencyToNote({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('');
  const [referenceA4, setReferenceA4] = useState('440');
  const [output, setOutput] = useState('');

  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const calculate = () => {
    const freq = parseFloat(frequency);
    const a4 = parseFloat(referenceA4);

    if (isNaN(freq) || freq <= 0) {
      setOutput('Please enter a valid positive frequency in Hz.');
      return;
    }
    if (isNaN(a4) || a4 <= 0) {
      setOutput('Please enter a valid reference frequency for A4.');
      return;
    }

    // Calculate semitones from A4
    const semitonesFromA4 = 12 * Math.log2(freq / a4);
    const roundedSemitones = Math.round(semitonesFromA4);
    const cents = (semitonesFromA4 - roundedSemitones) * 100;

    // A4 is MIDI note 69
    const midiNote = 69 + roundedSemitones;
    const noteIndex = ((midiNote % 12) + 12) % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = NOTE_NAMES[noteIndex];

    // Calculate exact frequency of the closest note
    const exactFreq = a4 * Math.pow(2, roundedSemitones / 12);

    const results = [
      `Input Frequency: ${freq} Hz`,
      `Reference A4: ${a4} Hz`,
      ``,
      `Closest Note: ${noteName}${octave}`,
      `MIDI Number: ${midiNote}`,
      `Exact Note Frequency: ${exactFreq.toFixed(4)} Hz`,
      `Deviation: ${cents >= 0 ? '+' : ''}${cents.toFixed(2)} cents`,
      ``,
      cents === 0 ? '✓ Perfectly in tune' :
        Math.abs(cents) <= 5 ? '≈ Nearly in tune (within ±5 cents)' :
        Math.abs(cents) <= 15 ? '~ Slightly off (within ±15 cents)' :
        '✗ Noticeably out of tune',
      ``,
      `Semitones from A4: ${semitonesFromA4.toFixed(4)}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (Hz)
            </label>
            <input
              id={`${toolId}-freq`}
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. 440, 261.63, 880"
              aria-label={`Frequency input for ${toolName}`}
              className="input-field"
              min="0"
              step="any"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ref`} className="block text-sm font-medium text-gray-700 mb-1">
              Reference A4 (Hz)
            </label>
            <input
              id={`${toolId}-ref`}
              type="number"
              value={referenceA4}
              onChange={(e) => setReferenceA4(e.target.value)}
              placeholder="440"
              aria-label="Reference A4 frequency"
              className="input-field"
              min="0"
              step="any"
            />
            <p className="text-xs text-gray-500 mt-1">Standard tuning: 440 Hz. Baroque: 415 Hz. Concert: 442 Hz.</p>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Convert to Note</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
