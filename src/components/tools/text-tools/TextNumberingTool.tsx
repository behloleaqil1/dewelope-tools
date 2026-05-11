'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextNumberingTool - Number paragraphs, sentences, or items in a list with configurable format.
 * Supports multiple numbering styles and separators.
 */
export default function TextNumberingTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'lines' | 'paragraphs' | 'sentences'>('lines');
  const [format, setFormat] = useState<'number-dot' | 'number-paren' | 'number-bracket' | 'padded'>('number-dot');
  const [startNum, setStartNum] = useState('1');
  const [skipEmpty, setSkipEmpty] = useState(true);
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const start = parseInt(startNum, 10) || 1;
    let items: string[];

    if (mode === 'lines') {
      items = input.split('\n');
    } else if (mode === 'paragraphs') {
      items = input.split(/\n\s*\n/).map((p) => p.trim());
    } else {
      items = input.split(/(?<=[.!?])\s+/).map((s) => s.trim());
    }

    let counter = start;
    const totalItems = skipEmpty ? items.filter((item) => item.trim()).length : items.length;
    const padLength = String(start + totalItems - 1).length;

    const result = items
      .map((item) => {
        if (skipEmpty && !item.trim()) return item;

        let prefix: string;
        switch (format) {
          case 'number-dot':
            prefix = `${counter}.`;
            break;
          case 'number-paren':
            prefix = `${counter})`;
            break;
          case 'number-bracket':
            prefix = `[${counter}]`;
            break;
          case 'padded':
            prefix = `${String(counter).padStart(padLength, '0')}.`;
            break;
          default:
            prefix = `${counter}.`;
        }

        counter++;
        return `${prefix} ${item}`;
      })
      .join(mode === 'paragraphs' ? '\n\n' : '\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to number
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Apple\nBanana\nCherry\nDate"}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
            Number By
          </label>
          <select
            id={`${toolId}-mode`}
            value={mode}
            onChange={(e) => setMode(e.target.value as 'lines' | 'paragraphs' | 'sentences')}
            aria-label={`Numbering mode for ${toolName}`}
            className="input-field"
          >
            <option value="lines">Lines</option>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            id={`${toolId}-format`}
            value={format}
            onChange={(e) => setFormat(e.target.value as 'number-dot' | 'number-paren' | 'number-bracket' | 'padded')}
            aria-label={`Number format for ${toolName}`}
            className="input-field"
          >
            <option value="number-dot">1. Item</option>
            <option value="number-paren">1) Item</option>
            <option value="number-bracket">[1] Item</option>
            <option value="padded">01. Item (padded)</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
            Start Number
          </label>
          <input
            id={`${toolId}-start`}
            type="number"
            value={startNum}
            onChange={(e) => setStartNum(e.target.value)}
            min="0"
            aria-label={`Start number for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={skipEmpty}
              onChange={(e) => setSkipEmpty(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Skip empty</span>
          </label>
        </div>
      </div>

      <button onClick={process} aria-label="Number text" className="btn-primary">
        Number Text
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Numbered Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
