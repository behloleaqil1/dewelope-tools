'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XmlFormatter - Format and prettify XML with configurable indentation.
 */
export default function XmlFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState('2');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const format = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter XML to format.'); return; }

    const indentSize = parseInt(indent) || 2;
    const indentStr = ' '.repeat(indentSize);

    try {
      // Simple XML formatter
      let formatted = '';
      let level = 0;
      const xml = input.replace(/>\s*</g, '><').trim();
      const tokens = xml.match(/<[^>]+>|[^<]+/g);

      if (!tokens) { setError('Invalid XML format.'); return; }

      for (const token of tokens) {
        if (token.startsWith('</')) {
          level--;
          formatted += indentStr.repeat(level) + token + '\n';
        } else if (token.startsWith('<') && token.endsWith('/>')) {
          formatted += indentStr.repeat(level) + token + '\n';
        } else if (token.startsWith('<?') || token.startsWith('<!')) {
          formatted += indentStr.repeat(level) + token + '\n';
        } else if (token.startsWith('<')) {
          formatted += indentStr.repeat(level) + token + '\n';
          if (!token.includes('</')) level++;
        } else {
          const trimmed = token.trim();
          if (trimmed) {
            // Text content - put it inline with previous tag
            formatted = formatted.trimEnd() + '\n' + indentStr.repeat(level) + trimmed + '\n';
          }
        }
      }

      setResult(formatted.trim());
    } catch {
      setError('Failed to parse XML. Please check the input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">XML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='<root><item id="1"><name>Test</name></item></root>' rows={8} aria-label={`XML input for ${toolName}`} className="input-field font-mono" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-indent`} className="block text-sm font-medium text-gray-700 mb-1">Indent Spaces</label>
          <select id={`${toolId}-indent`} value={indent} onChange={(e) => setIndent(e.target.value)} aria-label="Indent size" className="input-field w-24">
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
          </select>
        </div>
      </InputArea>

      <button onClick={format} className="btn-primary" aria-label="Format XML">Format</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
