'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToWingdings3 - Convert text to Wingdings 3 Unicode symbols.
 * Maps ASCII characters to their Wingdings 3 equivalents using Unicode arrows and symbols.
 */
export default function TextToWingdings3({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const wingdings3Map: Record<string, string> = {
    'a': '🔺', 'b': '🔻', 'c': '◀', 'd': '▶', 'e': '◁', 'f': '▷',
    'g': '◂', 'h': '▸', 'i': '△', 'j': '▽', 'k': '◃', 'l': '▹',
    'm': '⊲', 'n': '⊳', 'o': '⟐', 'p': '⬠', 'q': '⬡', 'r': '⎔',
    's': '⏢', 't': '⏣', 'u': '⌖', 'v': '⌗', 'w': '⏥', 'x': '⏦',
    'y': '⏧', 'z': '⏨',
    'A': '⬆', 'B': '⬇', 'C': '⬅', 'D': '➡', 'E': '↖', 'F': '↗',
    'G': '↙', 'H': '↘', 'I': '⤡', 'J': '⤢', 'K': '⇐', 'L': '⇒',
    'M': '⇑', 'N': '⇓', 'O': '⇔', 'P': '⇕', 'Q': '⇖', 'R': '⇗',
    'S': '⇘', 'T': '⇙', 'U': '⏪', 'V': '⏩', 'W': '⏫', 'X': '⏬',
    'Y': '⤶', 'Z': '⤷',
    '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
    '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
    ' ': ' ',
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const result = input.split('').map(ch => wingdings3Map[ch] || ch).join('');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to convert</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to convert to Wingdings 3 symbols..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wingdings 3 Result</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
