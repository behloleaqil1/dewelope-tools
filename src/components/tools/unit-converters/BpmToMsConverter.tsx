'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BpmToMsConverter - Convert BPM (beats per minute) to milliseconds per beat and note subdivisions.
 */
export default function BpmToMsConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bpm, setBpm] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const bpmVal = parseFloat(bpm);
    if (isNaN(bpmVal) || bpmVal <= 0) {
      setOutput('Please enter a valid BPM value greater than 0.');
      return;
    }

    const msPerBeat = 60000 / bpmVal;
    const wholeNote = msPerBeat * 4;
    const halfNote = msPerBeat * 2;
    const quarterNote = msPerBeat;
    const eighthNote = msPerBeat / 2;
    const sixteenthNote = msPerBeat / 4;
    const thirtySecondNote = msPerBeat / 8;
    const dottedQuarter = msPerBeat * 1.5;
    const dottedEighth = msPerBeat * 0.75;
    const tripletQuarter = msPerBeat * (2 / 3);
    const tripletEighth = msPerBeat * (1 / 3);

    let result = `BPM to Milliseconds Conversion\n`;
    result += `══════════════════════════════════\n\n`;
    result += `Input: ${bpmVal} BPM\n`;
    result += `Beats per second: ${(bpmVal / 60).toFixed(3)} Hz\n\n`;
    result += `Note Values:\n`;
    result += `  Whole note (4 beats):      ${wholeNote.toFixed(2)} ms\n`;
    result += `  Half note (2 beats):       ${halfNote.toFixed(2)} ms\n`;
    result += `  Quarter note (1 beat):     ${quarterNote.toFixed(2)} ms\n`;
    result += `  Eighth note (1/2 beat):    ${eighthNote.toFixed(2)} ms\n`;
    result += `  Sixteenth note (1/4 beat): ${sixteenthNote.toFixed(2)} ms\n`;
    result += `  32nd note (1/8 beat):      ${thirtySecondNote.toFixed(2)} ms\n\n`;
    result += `Dotted Notes:\n`;
    result += `  Dotted quarter:  ${dottedQuarter.toFixed(2)} ms\n`;
    result += `  Dotted eighth:   ${dottedEighth.toFixed(2)} ms\n\n`;
    result += `Triplets:\n`;
    result += `  Quarter triplet:  ${tripletQuarter.toFixed(2)} ms\n`;
    result += `  Eighth triplet:   ${tripletEighth.toFixed(2)} ms\n\n`;
    result += `Delay Times (for audio production):\n`;
    result += `  1/4 delay: ${quarterNote.toFixed(2)} ms\n`;
    result += `  1/8 delay: ${eighthNote.toFixed(2)} ms\n`;
    result += `  1/16 delay: ${sixteenthNote.toFixed(2)} ms\n`;
    result += `  Dotted 1/8 delay: ${dottedEighth.toFixed(2)} ms\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label htmlFor={`${toolId}-bpm`} className="block text-sm font-medium text-gray-700 mb-1">
            BPM (Beats Per Minute)
          </label>
          <input
            id={`${toolId}-bpm`}
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            placeholder="e.g. 120"
            aria-label={`BPM input for ${toolName}`}
            className="input-field"
            min="1"
            step="any"
          />
          <button onClick={calculate} className="btn-primary w-full">
            Convert BPM to Milliseconds
          </button>
        </div>
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
