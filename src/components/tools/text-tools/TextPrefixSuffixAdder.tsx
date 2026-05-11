'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextPrefixSuffixAdder - Adds prefix and/or suffix to each line of text.
 * Useful for adding quotes, list markers, or wrapping lines with tags.
 */
export default function TextPrefixSuffixAdder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines = input.split('\n');
    const result = lines
      .map((line) => {
        if (skipEmpty && !line.trim()) return line;
        return `${prefix}${line}${suffix}`;
      })
      .join('\n');

    setOutput(result);
  };

  const presets = [
    { label: 'Quote ("")', p: '"', s: '"' },
    { label: "Quote ('')", p: "'", s: "'" },
    { label: 'Bullet (• )', p: '• ', s: '' },
    { label: 'Dash (- )', p: '- ', s: '' },
    { label: 'Number', p: '', s: '' },
    { label: 'HTML <li>', p: '<li>', s: '</li>' },
    { label: 'Comma end', p: '', s: ',' },
  ];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (one item per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"apple\nbanana\ncherry"}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">
            Prefix
          </label>
          <input
            id={`${toolId}-prefix`}
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder='e.g. "  or  - '
            aria-label={`Prefix for ${toolName}`}
            className="input-field font-mono"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-suffix`} className="block text-sm font-medium text-gray-700 mb-1">
            Suffix
          </label>
          <input
            id={`${toolId}-suffix`}
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder='e.g. "  or  ,'
            aria-label={`Suffix for ${toolName}`}
            className="input-field font-mono"
          />
        </InputArea>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600">Presets:</span>
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => { setPrefix(preset.p); setSuffix(preset.s); }}
            className="px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600"
            aria-label={`Apply ${preset.label} preset`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          id={`${toolId}-skip`}
          type="checkbox"
          checked={skipEmpty}
          onChange={(e) => setSkipEmpty(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor={`${toolId}-skip`} className="text-sm text-gray-700">
          Skip empty lines
        </label>
      </div>

      <button onClick={process} aria-label="Add prefix and suffix" className="btn-primary">
        Add Prefix/Suffix
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
