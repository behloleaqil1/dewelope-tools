'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextWrapFormatter - Wraps text at a specified column width (hard wrap).
 * Breaks lines at word boundaries when possible.
 */
export default function TextWrapFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [width, setWidth] = useState('80');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const wrapText = () => {
    setError(undefined);
    const cols = parseInt(width, 10);

    if (isNaN(cols) || cols < 1 || cols > 1000) {
      setError('Column width must be between 1 and 1000');
      setOutput('');
      return;
    }

    if (!input.trim()) {
      setError('Please enter some text to wrap');
      setOutput('');
      return;
    }

    const paragraphs = input.split('\n');
    const wrapped = paragraphs.map((paragraph) => {
      if (paragraph.length <= cols) return paragraph;

      const words = paragraph.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if (word.length > cols) {
          // Word is longer than column width, force break
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }
          for (let i = 0; i < word.length; i += cols) {
            lines.push(word.slice(i, i + cols));
          }
        } else if (currentLine.length + (currentLine ? 1 : 0) + word.length > cols) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      }

      if (currentLine) lines.push(currentLine);
      return lines.join('\n');
    });

    setOutput(wrapped.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to Wrap
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
          Column Width (characters)
        </label>
        <input
          id={`${toolId}-width`}
          type="number"
          min="1"
          max="1000"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          aria-label="Column width in characters"
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={wrapText} aria-label="Wrap text" className="btn-primary">
        Wrap Text
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wrapped Text</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
