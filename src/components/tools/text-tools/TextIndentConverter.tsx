'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextIndentConverter - Convert between tabs and spaces with configurable indent size.
 * Supports tabs-to-spaces and spaces-to-tabs conversion.
 */
export default function TextIndentConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState<'tabs-to-spaces' | 'spaces-to-tabs'>('tabs-to-spaces');

  const convert = () => {
    if (!input) {
      setOutput('');
      return;
    }

    if (mode === 'tabs-to-spaces') {
      setOutput(input.replace(/\t/g, ' '.repeat(indentSize)));
    } else {
      const regex = new RegExp(`^( {${indentSize}})+`, 'gm');
      setOutput(
        input.replace(regex, (match) => '\t'.repeat(match.length / indentSize))
      );
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('tabs-to-spaces'); setOutput(''); }}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'tabs-to-spaces' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-label="Convert tabs to spaces"
          >
            Tabs → Spaces
          </button>
          <button
            onClick={() => { setMode('spaces-to-tabs'); setOutput(''); }}
            className={`px-4 py-2 rounded text-sm font-medium ${mode === 'spaces-to-tabs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-label="Convert spaces to tabs"
          >
            Spaces → Tabs
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={`${toolId}-indent-size`} className="text-sm font-medium text-gray-700">
            Indent size:
          </label>
          <select
            id={`${toolId}-indent-size`}
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            aria-label={`Indent size for ${toolName}`}
            className="input-field w-20"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your code here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert indentation">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 overflow-x-auto bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
