'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownTocGenerator - Generate table of contents from markdown headings.
 */
export default function MarkdownTocGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [maxDepth, setMaxDepth] = useState('3');
  const [style, setStyle] = useState<'bullet' | 'numbered'>('bullet');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter markdown text.'); return; }

    const depth = parseInt(maxDepth) || 3;
    const lines = input.split('\n');
    const headings: { level: number; text: string; anchor: string }[] = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match && match[1].length <= depth) {
        const text = match[2].replace(/[*_`\[\]]/g, '').trim();
        const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ level: match[1].length, text, anchor });
      }
    }

    if (headings.length === 0) { setError('No headings found in the markdown text.'); return; }

    const minLevel = Math.min(...headings.map((h) => h.level));
    const toc = headings.map((h, i) => {
      const indent = '  '.repeat(h.level - minLevel);
      const prefix = style === 'numbered' ? `${i + 1}.` : '-';
      return `${indent}${prefix} [${h.text}](#${h.anchor})`;
    }).join('\n');

    setResult(`## Table of Contents\n\n${toc}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Markdown Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="# Heading 1\n## Heading 2\n### Heading 3" rows={8} aria-label={`Markdown input for ${toolName}`} className="input-field font-mono" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">Max Depth</label>
            <select id={`${toolId}-depth`} value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)} aria-label="Maximum heading depth" className="input-field">
              {[1, 2, 3, 4, 5, 6].map((d) => <option key={d} value={d}>H{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">List Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as 'bullet' | 'numbered')} aria-label="List style" className="input-field">
              <option value="bullet">Bulleted</option>
              <option value="numbered">Numbered</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate table of contents">Generate TOC</button>

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
