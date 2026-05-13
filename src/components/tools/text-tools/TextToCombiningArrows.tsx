'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningArrows - Add combining arrows above/below characters.
 * Uses Unicode combining arrow diacritical marks for decorative text effects.
 */
export default function TextToCombiningArrows({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [position, setPosition] = useState<'above' | 'below' | 'both'>('above');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const ARROW_ABOVE = '\u20D7'; // Combining right arrow above
      const ARROW_BELOW = '\u20EF'; // Combining right arrow below

      const result = input
        .split('')
        .map((char) => {
          if (char === ' ' || char === '\n' || char === '\t') return char;
          if (position === 'above') return char + ARROW_ABOVE;
          if (position === 'below') return char + ARROW_BELOW;
          return char + ARROW_ABOVE + ARROW_BELOW;
        })
        .join('');

      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, position]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type text to add combining arrows..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-pos`} className="block text-sm font-medium text-gray-700 mb-1">Arrow Position</label>
            <select id={`${toolId}-pos`} value={position} onChange={(e) => setPosition(e.target.value as 'above' | 'below' | 'both')} className="input-field" aria-label="Arrow position">
              <option value="above">Above</option>
              <option value="below">Below</option>
              <option value="both">Both (Above &amp; Below)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all leading-loose">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
