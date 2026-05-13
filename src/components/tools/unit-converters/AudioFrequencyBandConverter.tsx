'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AudioFrequencyBandConverter - Convert between audio frequency bands.
 * Identifies which band a frequency belongs to and shows band ranges.
 * Bands: sub-bass, bass, low-mid, mid, upper-mid, presence, brilliance.
 */
export default function AudioFrequencyBandConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('');
  const [output, setOutput] = useState('');

  const bands = [
    { name: 'Sub-Bass', min: 16, max: 60, description: 'Felt more than heard. Rumble, sub-bass synths, kick drum fundamentals.' },
    { name: 'Bass', min: 60, max: 250, description: 'Warmth and fullness. Bass guitar, kick drum body, low vocals.' },
    { name: 'Low-Mid', min: 250, max: 500, description: 'Body and thickness. Can become muddy if boosted too much.' },
    { name: 'Mid', min: 500, max: 2000, description: 'Clarity and definition. Vocals, guitars, snare body.' },
    { name: 'Upper-Mid', min: 2000, max: 4000, description: 'Presence and attack. Vocal intelligibility, guitar bite.' },
    { name: 'Presence', min: 4000, max: 6000, description: 'Definition and clarity. Sibilance, cymbal detail.' },
    { name: 'Brilliance', min: 6000, max: 20000, description: 'Air and sparkle. Cymbal shimmer, high harmonics.' },
  ];

  const calculate = () => {
    const freq = parseFloat(frequency);

    if (isNaN(freq) || freq <= 0) {
      setOutput('Please enter a valid positive frequency in Hz.');
      return;
    }

    const currentBand = bands.find((b) => freq >= b.min && freq <= b.max);

    const result = [
      `=== Audio Frequency Band Analysis ===`,
      ``,
      `Input Frequency: ${freq} Hz`,
      ``,
      currentBand
        ? `Band: ${currentBand.name} (${currentBand.min} Hz - ${currentBand.max} Hz)`
        : freq < 16
          ? `Below audible range (< 16 Hz) - Infrasound`
          : `Above audible range (> 20,000 Hz) - Ultrasound`,
      currentBand ? `Description: ${currentBand.description}` : '',
      ``,
      `--- All Audio Frequency Bands ---`,
      ...bands.map((b) => {
        const marker = currentBand && b.name === currentBand.name ? ' ◄ current' : '';
        return `${b.name.padEnd(12)} ${String(b.min).padStart(6)} Hz - ${String(b.max).padStart(6)} Hz${marker}`;
      }),
      ``,
      `Musical Reference:`,
      `  A0 (lowest piano) = 27.5 Hz`,
      `  Middle C (C4) = 261.6 Hz`,
      `  A4 (concert pitch) = 440 Hz`,
      `  C8 (highest piano) = 4186 Hz`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
          Frequency (Hz)
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-freq`}
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g. 440"
            className="input-field flex-1"
            aria-label={`Frequency input for ${toolName}`}
          />
          <span className="flex items-center text-sm text-gray-500">Hz</span>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">
          Identify Band
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
