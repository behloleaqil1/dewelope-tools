'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NoteToFrequencyConverter - Convert musical note name to frequency (Hz).
 * Uses A4 = 440 Hz standard tuning.
 */
export default function NoteToFrequencyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [note, setNote] = useState('A');
  const [octave, setOctave] = useState('4');
  const [accidental, setAccidental] = useState('natural');
  const [tuning, setTuning] = useState('440');
  const [output, setOutput] = useState('');

  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const semitoneMap: Record<string, number> = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11,
  };

  const calculate = () => {
    const a4Freq = parseFloat(tuning) || 440;
    const oct = parseInt(octave) || 4;

    let semitone = semitoneMap[note];
    if (semitone === undefined) {
      setOutput('Please select a valid note.');
      return;
    }

    if (accidental === 'sharp') semitone += 1;
    else if (accidental === 'flat') semitone -= 1;

    // Calculate semitones from A4
    const a4Semitone = 9; // A is 9 semitones from C
    const a4Octave = 4;
    const totalSemitones = (oct - a4Octave) * 12 + (semitone - a4Semitone);

    const frequency = a4Freq * Math.pow(2, totalSemitones / 12);

    const accidentalSymbol = accidental === 'sharp' ? '♯' : accidental === 'flat' ? '♭' : '';
    const noteName = `${note}${accidentalSymbol}${oct}`;

    const midiNote = 69 + totalSemitones;
    const period = 1 / frequency;

    const results = [
      `=== Note to Frequency Conversion ===`,
      ``,
      `Note: ${noteName}`,
      `Reference: A4 = ${a4Freq} Hz`,
      ``,
      `Frequency: ${frequency.toFixed(4)} Hz`,
      `Period: ${(period * 1000).toFixed(6)} ms`,
      `MIDI Note Number: ${midiNote}`,
      `Semitones from A4: ${totalSemitones > 0 ? '+' : ''}${totalSemitones}`,
      ``,
      `Wavelength (in air at 343 m/s): ${(343 / frequency).toFixed(4)} m`,
      ``,
      `Formula: f = ${a4Freq} × 2^(${totalSemitones}/12) = ${frequency.toFixed(4)} Hz`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-note`} className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <select id={`${toolId}-note`} value={note} onChange={(e) => setNote(e.target.value)} aria-label={`Note selection for ${toolName}`} className="input-field">
              {noteNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-accidental`} className="block text-sm font-medium text-gray-700 mb-1">Accidental</label>
            <select id={`${toolId}-accidental`} value={accidental} onChange={(e) => setAccidental(e.target.value)} aria-label="Accidental" className="input-field">
              <option value="natural">Natural (♮)</option>
              <option value="sharp">Sharp (♯)</option>
              <option value="flat">Flat (♭)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-octave`} className="block text-sm font-medium text-gray-700 mb-1">Octave (0-9)</label>
            <input id={`${toolId}-octave`} type="number" min="0" max="9" value={octave} onChange={(e) => setOctave(e.target.value)} aria-label="Octave number" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tuning`} className="block text-sm font-medium text-gray-700 mb-1">A4 Reference (Hz)</label>
            <input id={`${toolId}-tuning`} type="number" value={tuning} onChange={(e) => setTuning(e.target.value)} placeholder="440" aria-label="A4 tuning reference" className="input-field" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Convert to Frequency</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
