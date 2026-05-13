'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningRing - Add combining ring above characters (like å).
 */
export default function TextToCombiningRing({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'above' | 'below' | 'both'>('above');
  const [output, setOutput] = useState('');

  const COMBINING_RING_ABOVE = '\u030A';
  const COMBINING_RING_BELOW = '\u0325';

  const convert = () => {
    if (!input) {
      setOutput('');
      return;
    }

    const result = input
      .split('')
      .map((char) => {
        if (char === ' ' || char === '\n' || char === '\t') return char;
        if (mode === 'above') return char + COMBINING_RING_ABOVE;
        if (mode === 'below') return char + COMBINING_RING_BELOW;
        return char + COMBINING_RING_ABOVE + COMBINING_RING_BELOW;
      })
      .join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to add combining ring..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ring Position</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="ringMode" value="above" checked={mode === 'above'} onChange={() => setMode('above')} />
              Above (å style)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="ringMode" value="below" checked={mode === 'below'} onChange={() => setMode('below')} />
              Below (◌̥)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="ringMode" value="both" checked={mode === 'both'} onChange={() => setMode('both')} />
              Both
            </label>
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Add Combining Ring</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
