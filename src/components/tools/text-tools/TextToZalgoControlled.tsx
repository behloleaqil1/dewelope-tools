'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToZalgoControlled - Controlled Zalgo text with exact number of combining marks.
 * Allows precise control over the number of marks above, middle, and below characters.
 */
export default function TextToZalgoControlled({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [aboveCount, setAboveCount] = useState(2);
  const [middleCount, setMiddleCount] = useState(0);
  const [belowCount, setBelowCount] = useState(2);
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const combiningAbove = [
    '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
    '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
    '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u033D',
    '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346', '\u034A', '\u034B', '\u034C',
  ];

  const combiningMiddle = [
    '\u0334', '\u0335', '\u0336', '\u0337', '\u0338',
  ];

  const combiningBelow = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
    '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
    '\u0328', '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
    '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033A', '\u033B', '\u033C',
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input
        .split('')
        .map((char) => {
          if (char === ' ' || char === '\n' || char === '\t') return char;
          let zalgo = char;
          for (let i = 0; i < aboveCount; i++) {
            zalgo += combiningAbove[Math.floor(Math.random() * combiningAbove.length)];
          }
          for (let i = 0; i < middleCount; i++) {
            zalgo += combiningMiddle[Math.floor(Math.random() * combiningMiddle.length)];
          }
          for (let i = 0; i < belowCount; i++) {
            zalgo += combiningBelow[Math.floor(Math.random() * combiningBelow.length)];
          }
          return zalgo;
        })
        .join('');

      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, aboveCount, middleCount, belowCount]);

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
              placeholder="Type text to Zalgo-ify..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-above`} className="block text-sm font-medium text-gray-700 mb-1">Above ({aboveCount})</label>
              <input id={`${toolId}-above`} type="range" min="0" max="10" value={aboveCount} onChange={(e) => setAboveCount(Number(e.target.value))} className="w-full" aria-label="Marks above count" />
            </div>
            <div>
              <label htmlFor={`${toolId}-middle`} className="block text-sm font-medium text-gray-700 mb-1">Middle ({middleCount})</label>
              <input id={`${toolId}-middle`} type="range" min="0" max="5" value={middleCount} onChange={(e) => setMiddleCount(Number(e.target.value))} className="w-full" aria-label="Marks middle count" />
            </div>
            <div>
              <label htmlFor={`${toolId}-below`} className="block text-sm font-medium text-gray-700 mb-1">Below ({belowCount})</label>
              <input id={`${toolId}-below`} type="range" min="0" max="10" value={belowCount} onChange={(e) => setBelowCount(Number(e.target.value))} className="w-full" aria-label="Marks below count" />
            </div>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zalgo Result</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all leading-loose">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
