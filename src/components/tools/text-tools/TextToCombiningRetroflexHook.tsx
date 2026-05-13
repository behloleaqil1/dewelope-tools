'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningRetroflexHook - Add combining retroflex hook below (U+0322) to each character.
 */
export default function TextToCombiningRetroflexHook({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');

  const combiningMark = '\u0322';
  const output = input
    ? input.split('').map(char => (char === ' ' || char === '\n' || char === '\t') ? char : char + combiningMark).join('')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to add combining retroflex hook below
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result (with combining retroflex hook below U+0322)</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
