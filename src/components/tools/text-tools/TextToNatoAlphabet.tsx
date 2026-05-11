'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToNatoAlphabet - Converts text to NATO phonetic alphabet representation.
 * Each letter is replaced with its NATO code word (Alpha, Bravo, Charlie, etc.)
 */
export default function TextToNatoAlphabet({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
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
      const result = input
        .toUpperCase()
        .split('')
        .map((char) => {
          if (char === ' ') return '(space)';
          return NATO[char] || char;
        })
        .join(' ');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to NATO phonetic alphabet
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here... e.g. Hello"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NATO Phonetic Alphabet</label>
            <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
              {output}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <details className="bg-gray-50 rounded-lg border border-gray-200">
        <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          NATO Alphabet Reference
        </summary>
        <div className="px-4 pb-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
          {Object.entries(NATO).map(([letter, word]) => (
            <div key={letter} className="text-center p-1">
              <span className="font-bold text-blue-600">{letter}</span>
              <span className="text-gray-500"> = {word}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
