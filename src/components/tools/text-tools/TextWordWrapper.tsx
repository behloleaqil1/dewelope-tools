'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextWordWrapper - Wrap text at word boundaries to specified width.
 */
export default function TextWordWrapper({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [width, setWidth] = useState('80');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const wrapText = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some text to wrap.');
      return;
    }

    const maxWidth = parseInt(width);
    if (isNaN(maxWidth) || maxWidth < 1) {
      setError('Please enter a valid width (minimum 1).');
      return;
    }

    const paragraphs = input.split('\n');
    const wrappedParagraphs = paragraphs.map((paragraph) => {
      if (paragraph.trim() === '') return '';

      const words = paragraph.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if (currentLine === '') {
          currentLine = word;
        } else if ((currentLine + ' ' + word).length <= maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines.join('\n');
    });

    setOutput(wrappedParagraphs.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Line Width (characters)</label>
            <input id={`${toolId}-width`} type="number" min="1" max="500" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Line width for ${toolName}`} className="input-field w-32" />
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Wrap</label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or type text to wrap at word boundaries..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-40 resize-y font-mono"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={wrapText} className="btn-primary" aria-label="Wrap text">Wrap Text</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wrapped Text (max {width} chars/line)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
