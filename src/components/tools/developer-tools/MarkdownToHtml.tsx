'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownToHtml - Convert Markdown text to HTML with a simple inline parser.
 * Supports headings, bold, italic, links, code, code blocks, lists, blockquotes, and paragraphs.
 */
export default function MarkdownToHtml({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function parseMarkdown(md: string): string {
    let html = md;

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
      return `<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`;
    });

    const lines = html.split('\n');
    const result: string[] = [];
    let inList = false;
    let inBlockquote = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip lines that are part of pre blocks (already handled)
      if (line.includes('<pre><code>') || line.includes('</code></pre>')) {
        if (inList) { result.push('</ul>'); inList = false; }
        if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false; }
        result.push(line);
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (inList) { result.push('</ul>'); inList = false; }
        if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false; }
        const level = headingMatch[1].length;
        result.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        if (inList) { result.push('</ul>'); inList = false; }
        if (!inBlockquote) { result.push('<blockquote>'); inBlockquote = true; }
        result.push(`<p>${parseInline(line.slice(2))}</p>`);
        continue;
      } else if (inBlockquote) {
        result.push('</blockquote>');
        inBlockquote = false;
      }

      // Unordered lists
      if (line.match(/^[-*+]\s+(.+)$/)) {
        if (!inList) { result.push('<ul>'); inList = true; }
        const content = line.replace(/^[-*+]\s+/, '');
        result.push(`<li>${parseInline(content)}</li>`);
        continue;
      } else if (inList) {
        result.push('</ul>');
        inList = false;
      }

      // Empty lines
      if (line.trim() === '') {
        result.push('');
        continue;
      }

      // Paragraphs
      result.push(`<p>${parseInline(line)}</p>`);
    }

    if (inList) result.push('</ul>');
    if (inBlockquote) result.push('</blockquote>');

    return result.join('\n');
  }

  function parseInline(text: string): string {
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return text;
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOutput(parseMarkdown(input));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div className="space-y-5">
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Markdown Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"# Hello World\n\nType your **markdown** here..."}
          aria-label="Markdown input text"
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <div className="flex gap-2">
        <button
          onClick={() => setShowPreview(false)}
          aria-label="Show HTML source code"
          className={!showPreview ? 'btn-primary' : 'btn-secondary'}
        >
          HTML Source
        </button>
        <button
          onClick={() => setShowPreview(true)}
          aria-label="Show rendered HTML preview"
          className={showPreview ? 'btn-primary' : 'btn-secondary'}
        >
          Preview
        </button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {showPreview ? 'Rendered Preview' : 'HTML Output'}
              </h3>
              <CopyToClipboard text={output} />
            </div>
            {showPreview ? (
              <div
                className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg border border-gray-100"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
                {output}
              </pre>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
