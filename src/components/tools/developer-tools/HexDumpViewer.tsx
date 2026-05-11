'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexDumpViewer - Display text as hex dump with offset, hex bytes, and ASCII columns.
 */
export default function HexDumpViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [bytesPerLine, setBytesPerLine] = useState(16);
  const [output, setOutput] = useState('');

  function generateHexDump() {
    if (!input) {
      setOutput('');
      return;
    }

    const bytes = new TextEncoder().encode(input);
    const lines: string[] = [];

    for (let offset = 0; offset < bytes.length; offset += bytesPerLine) {
      const chunk = bytes.slice(offset, offset + bytesPerLine);

      // Offset column
      const offsetStr = offset.toString(16).padStart(8, '0');

      // Hex column
      const hexParts: string[] = [];
      for (let i = 0; i < bytesPerLine; i++) {
        if (i < chunk.length) {
          hexParts.push(chunk[i].toString(16).padStart(2, '0'));
        } else {
          hexParts.push('  ');
        }
      }
      const hexStr = hexParts.join(' ');

      // ASCII column
      const asciiParts: string[] = [];
      for (let i = 0; i < chunk.length; i++) {
        const byte = chunk[i];
        asciiParts.push(byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.');
      }
      const asciiStr = asciiParts.join('').padEnd(bytesPerLine, ' ');

      lines.push(`${offsetStr}  ${hexStr}  |${asciiStr}|`);
    }

    lines.push(`${bytes.length.toString(16).padStart(8, '0')}`);
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to view as hex dump
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to display as hex dump..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-bytes`} className="block text-xs text-gray-500 mb-1">Bytes per line</label>
          <select
            id={`${toolId}-bytes`}
            value={bytesPerLine}
            onChange={(e) => setBytesPerLine(parseInt(e.target.value))}
            aria-label="Bytes per line"
            className="input-field text-sm w-32"
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={32}>32</option>
          </select>
        </div>
      </InputArea>

      <button onClick={generateHexDump} aria-label="Generate hex dump" className="btn-primary">
        Generate Hex Dump
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 p-3 bg-gray-50 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
