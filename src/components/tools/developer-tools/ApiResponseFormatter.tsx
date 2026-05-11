'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ApiResponseFormatter - Format and pretty-print API responses.
 * Auto-detects JSON or XML and formats accordingly.
 */
export default function ApiResponseFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [detectedFormat, setDetectedFormat] = useState('');
  const [error, setError] = useState('');

  const formatXml = (xml: string): string => {
    let formatted = '';
    let indent = 0;
    const parts = xml.replace(/(>)(<)/g, '$1\n$2').split('\n');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }

      formatted += '  '.repeat(indent) + trimmed + '\n';

      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent++;
      }
    }

    return formatted.trim();
  };

  const format = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please paste an API response to format.');
      setOutput('');
      setDetectedFormat('');
      return;
    }

    setError('');

    // Try JSON first
    try {
      const parsed = JSON.parse(trimmed);
      setOutput(JSON.stringify(parsed, null, 2));
      setDetectedFormat('JSON');
      return;
    } catch {
      // Not JSON, try XML
    }

    // Try XML
    if (trimmed.startsWith('<') || trimmed.startsWith('<?xml')) {
      try {
        const formatted = formatXml(trimmed);
        setOutput(formatted);
        setDetectedFormat('XML');
        return;
      } catch {
        // Not valid XML either
      }
    }

    setError('Could not detect format. Supported formats: JSON, XML.');
    setOutput('');
    setDetectedFormat('');
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste API Response
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"John","age":30} or <root><item>value</item></root>'
          aria-label={`API response input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={format} aria-label="Format response" className="btn-primary">
        Format Response
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700">Formatted Output</label>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{detectedFormat}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
