'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPhoneticNatoSentence - Convert full sentences to NATO phonetic alphabet with word breaks.
 * Each word is spelled out with NATO code words, separated by clear word boundaries.
 */
export default function TextToPhoneticNatoSentence({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState<'line' | 'pipe' | 'dash'>('line');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const NATO: Record<string, string> = {
    A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
    F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliet',
    K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
    P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
    U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee',
    Z: 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
    '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight',
    '9': 'Nine',
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const words = input.trim().split(/\s+/);
      const wordBreak = separator === 'line' ? '\n---\n' : separator === 'pipe' ? ' | ' : ' — ';

      const converted = words.map((word) => {
        const letters = word.toUpperCase().split('').map((char) => {
          if (NATO[char]) return `${char} = ${NATO[char]}`;
          return `${char} = [${char}]`;
        });
        return `[${word}]\n${letters.join('\n')}`;
      });

      setOutput(converted.join(wordBreak));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, separator]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter sentence to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Hello World"
          aria-label={`Sentence input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">
          Word Separator Style
        </label>
        <select
          id={`${toolId}-sep`}
          value={separator}
          onChange={(e) => setSeparator(e.target.value as typeof separator)}
          aria-label={`Separator style for ${toolName}`}
          className="input-field"
        >
          <option value="line">Line break (---)</option>
          <option value="pipe">Pipe ( | )</option>
          <option value="dash">Em dash ( — )</option>
        </select>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NATO Phonetic Sentence</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
