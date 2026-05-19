'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownFootnoteGenerator - Generate markdown footnotes from inline references.
 */
export default function MarkdownFootnoteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter text with references.'); return; }

    const footnotes: string[] = [];
    let counter = 0;
    let output = input.replace(/\[([^\]]+)\]/g, (match, content) => {
      if (content.startsWith('^') || content.match(/^\d+$/)) return match;
      counter++;
      footnotes.push(`[^${counter}]: ${content}`);
      return `[^${counter}]`;
    });

    if (footnotes.length === 0) {
      setError('No inline references found. Use [reference text] format.');
      return;
    }

    output += '\n\n' + footnotes.join('\n');
    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text with Inline References</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"This is a fact [Source: Wikipedia]. Another claim [See: RFC 2616]."} rows={6} aria-label={`Input text for ${toolName}`} className="input-field" />
        <p className="text-xs text-gray-500 mt-1">Wrap references in [brackets] to convert them to footnotes.</p>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate footnotes">Generate Footnotes</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
