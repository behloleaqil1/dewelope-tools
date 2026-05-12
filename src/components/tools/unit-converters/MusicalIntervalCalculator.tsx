'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MusicalIntervalCalculator - Calculate musical intervals between notes.
 * Determines the interval name, semitone count, frequency ratio, and cents between two notes.
 */
export default function MusicalIntervalCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [note1, setNote1] = useState('C');
  const [octave1, setOctave1] = useState('4');
  const [note2, setNote2] = useState('G');
  const [octave2, setOctave2] = useState('4');
  const [output, setOutput] = useState('');

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const intervalNames: Record<number, string> = {
    0: 'Perfect Unison (P1)',
    1: 'Minor Second (m2)',
    2: 'Major Second (M2)',
    3: 'Minor Third (m3)',
    4: 'Major Third (M3)',
    5: 'Perfect Fourth (P4)',
    6: 'Tritone (A4/d5)',
    7: 'Perfect Fifth (P5)',
    8: 'Minor Sixth (m6)',
    9: 'Major Sixth (M6)',
    10: 'Minor Seventh (m7)',
    11: 'Major Seventh (M7)',
    12: 'Perfect Octave (P8)',
  };

  const calculate = () => {
    const idx1 = notes.indexOf(note1);
    const idx2 = notes.indexOf(note2);
    const oct1 = parseInt(octave1);
    const oct2 = parseInt(octave2);

    if (idx1 === -1 || idx2 === -1 || isNaN(oct1) || isNaN(oct2)) {
      setOutput('Please select valid notes and octaves.');
      return;
    }

    // MIDI note numbers
    const midi1 = (oct1 + 1) * 12 + idx1;
    const midi2 = (oct2 + 1) * 12 + idx2;
    const semitones = midi2 - midi1;
    const absSemitones = Math.abs(semitones);

    // Frequency calculation (A4 = 440 Hz)
    const freq1 = 440 * Math.pow(2, (midi1 - 69) / 12);
    const freq2 = 440 * Math.pow(2, (midi2 - 69) / 12);
    const ratio = freq2 / freq1;
    const cents = 1200 * Math.log2(ratio);

    // Interval name
    const simpleInterval = absSemitones % 12;
    const octaves = Math.floor(absSemitones / 12);
    let intervalName = intervalNames[simpleInterval] || `${simpleInterval} semitones`;
    if (octaves > 0 && simpleInterval > 0) {
      intervalName += ` + ${octaves} octave${octaves > 1 ? 's' : ''}`;
    } else if (octaves > 0 && simpleInterval === 0) {
      intervalName = `${octaves} Octave${octaves > 1 ? 's' : ''}`;
    }

    const direction = semitones >= 0 ? 'Ascending' : 'Descending';

    const lines = [
      `=== Musical Interval ===`,
      ``,
      `Note 1: ${note1}${oct1} (MIDI ${midi1}, ${freq1.toFixed(2)} Hz)`,
      `Note 2: ${note2}${oct2} (MIDI ${midi2}, ${freq2.toFixed(2)} Hz)`,
      ``,
      `--- Interval ---`,
      `Name: ${intervalName}`,
      `Direction: ${direction}`,
      `Semitones: ${semitones} (${absSemitones} absolute)`,
      `Cents: ${cents.toFixed(2)}`,
      `Frequency Ratio: ${ratio.toFixed(6)} (≈${simplifyRatio(ratio)})`,
      ``,
      `--- Just Intonation Reference ---`,
      `P1: 1:1 | m2: 16:15 | M2: 9:8 | m3: 6:5`,
      `M3: 5:4 | P4: 4:3 | P5: 3:2 | m6: 8:5`,
      `M6: 5:3 | m7: 16:9 | M7: 15:8 | P8: 2:1`,
    ];

    setOutput(lines.join('\n'));
  };

  const simplifyRatio = (ratio: number): string => {
    const justRatios: [number, string][] = [
      [1, '1:1'], [16/15, '16:15'], [9/8, '9:8'], [6/5, '6:5'],
      [5/4, '5:4'], [4/3, '4:3'], [Math.sqrt(2), '√2:1'], [3/2, '3:2'],
      [8/5, '8:5'], [5/3, '5:3'], [16/9, '16:9'], [15/8, '15:8'], [2, '2:1'],
    ];
    const absRatio = Math.abs(ratio);
    for (const [val, name] of justRatios) {
      if (Math.abs(absRatio - val) < 0.02) return name;
    }
    return ratio.toFixed(4) + ':1';
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Note</label>
            <div className="flex gap-2">
              <select value={note1} onChange={(e) => setNote1(e.target.value)} className="input-field flex-1" aria-label={`First note for ${toolName}`}>
                {notes.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={octave1} onChange={(e) => setOctave1(e.target.value)} className="input-field w-20" aria-label="First note octave">
                {[0,1,2,3,4,5,6,7,8].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Second Note</label>
            <div className="flex gap-2">
              <select value={note2} onChange={(e) => setNote2(e.target.value)} className="input-field flex-1" aria-label="Second note">
                {notes.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={octave2} onChange={(e) => setOctave2(e.target.value)} className="input-field w-20" aria-label="Second note octave">
                {[0,1,2,3,4,5,6,7,8].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Interval</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Interval Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
