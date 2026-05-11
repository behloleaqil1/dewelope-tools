'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkupStripper - Removes HTML/XML tags from text, leaving only the plain text content.
 * Optionally preserves line breaks and decodes HTML entities.
 */
export default function MarkupStripper({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preserveBreaks, setPreserveBreaks] = useState(true);
  const [decodeEntities, setDecodeEntities] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let result = input;

      // Replace <br>, <br/>, <br /> with newlines if preserving breaks
      if (preserveBreaks) {
        result = result.replace(/<br\s*\/?>/gi, '\n');
        result = result.replace(/<\/p>/gi, '\n\n');
        result = result.replace(/<\/div>/gi, '\n');
        result = result.replace(/<\/li>/gi, '\n');
        result = result.replace(/<\/h[1-6]>/gi, '\n\n');
      }

      // Remove all HTML/XML tags
      result = result.replace(/<[^>]*>/g, '');

      // Decode HTML entities
      if (decodeEntities) {
        const entities: Record<string, string> = {
          '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
          '&#39;': "'", '&apos;': "'", '&nbsp;': ' ', '&copy;': '©',
          '&reg;': '®', '&trade;': '™', '&mdash;': '—', '&ndash;': '–',
          '&hellip;': '…', '&laquo;': '«', '&raquo;': '»',
        };
        for (const [entity, char] of Object.entries(entities)) {
          result = result.replace(new RegExp(entity, 'g'), char);
        }
        // Decode numeric entities
        result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
        result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      }

      // Clean up excessive whitespace
      result = result.replace(/[ \t]+/g, ' ');
      result = result.replace(/\n{3,}/g, '\n\n');
      result = result.trim();

      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, preserveBreaks, decodeEntities]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste HTML or XML to strip tags
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<h1>Hello</h1><p>This is <strong>bold</strong> text with &amp; entities.</p>'
          aria-label={`HTML/XML input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={preserveBreaks}
              onChange={(e) => setPreserveBreaks(e.target.checked)}
              className="rounded border-gray-300"
            />
            Preserve line breaks
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={decodeEntities}
              onChange={(e) => setDecodeEntities(e.target.checked)}
              className="rounded border-gray-300"
            />
            Decode entities
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Plain Text Output</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
