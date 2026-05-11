'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XmlFormatter - Formats and beautifies XML with proper indentation.
 */
export default function XmlFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [error, setError] = useState<string | undefined>();

  function formatXml(xml: string, indent: number): string {
    const tab = ' '.repeat(indent);
    let formatted = '';
    let depth = 0;

    // Normalize whitespace between tags
    const normalized = xml.replace(/>\s*</g, '><').trim();

    // Split into tags and text
    const tokens = normalized.match(/(<[^>]+>)|([^<]+)/g) || [];

    for (const token of tokens) {
      if (token.startsWith('</')) {
        // Closing tag
        depth--;
        formatted += tab.repeat(depth) + token + '\n';
      } else if (token.startsWith('<?') || token.startsWith('<!')) {
        // Processing instruction or comment
        formatted += tab.repeat(depth) + token + '\n';
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        // Self-closing tag
        formatted += tab.repeat(depth) + token + '\n';
      } else if (token.startsWith('<')) {
        // Opening tag
        formatted += tab.repeat(depth) + token + '\n';
        depth++;
      } else {
        // Text content
        const trimmed = token.trim();
        if (trimmed) {
          formatted = formatted.trimEnd() + trimmed + '\n';
          // Adjust: text was inline, so undo the last newline from opening tag
        }
      }
    }

    return formatted.trim();
  }

  function handleFormat() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter XML to format');
      return;
    }

    if (!trimmed.includes('<')) {
      setError('Input does not appear to be valid XML');
      return;
    }

    try {
      const indent = Math.max(1, Math.min(8, parseInt(indentSize) || 2));
      const formatted = formatXml(trimmed, indent);
      setOutput(formatted);
    } catch {
      setError('Failed to format XML. Please check your input.');
    }
  }

  function handleMinify() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter XML to minify');
      return;
    }

    const minified = trimmed.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    setOutput(minified);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          XML input for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<root><item id="1"><name>Test</name><value>123</value></item></root>'
          aria-label={`XML input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor={`${toolId}-indent`} className="text-xs text-gray-500">Indent:</label>
          <input
            id={`${toolId}-indent`}
            type="number"
            min="1"
            max="8"
            value={indentSize}
            onChange={(e) => setIndentSize(e.target.value)}
            className="w-14 input-field text-sm"
            aria-label="Indent size"
          />
          <span className="text-xs text-gray-500">spaces</span>
        </div>
      </InputArea>

      <div className="flex gap-2">
        <button onClick={handleFormat} aria-label="Format XML" className="btn-primary">Format XML</button>
        <button onClick={handleMinify} aria-label="Minify XML" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">Minify</button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Formatted XML</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto max-h-80 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
