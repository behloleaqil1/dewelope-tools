'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmlToMarkdown - Converts HTML markup to Markdown format.
 * Handles headings, paragraphs, links, images, lists, bold, italic, code blocks, and more.
 */
export default function HtmlToMarkdown({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      try {
        let md = input;
        // Headings
        md = md.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, content) => {
          return '\n' + '#'.repeat(parseInt(level)) + ' ' + content.trim() + '\n';
        });
        // Bold
        md = md.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
        // Italic
        md = md.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
        // Code blocks
        md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
        // Inline code
        md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
        // Links
        md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
        // Images
        md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
        md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');
        // Unordered lists
        md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
          return '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
        });
        // Ordered lists
        md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
          let counter = 0;
          return '\n' + content.replace(/<li[^>]*>(.*?)<\/li>/gi, (_m: string, text: string) => { counter++; return `${counter}. ${text.trim()}\n`; }).trim() + '\n';
        });
        // Blockquote
        md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
          return '\n> ' + content.trim().replace(/\n/g, '\n> ') + '\n';
        });
        // Horizontal rule
        md = md.replace(/<hr\s*\/?>/gi, '\n---\n');
        // Line breaks
        md = md.replace(/<br\s*\/?>/gi, '\n');
        // Paragraphs
        md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
        // Strip remaining tags
        md = md.replace(/<[^>]+>/g, '');
        // Decode common entities
        md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        // Clean up extra newlines
        md = md.replace(/\n{3,}/g, '\n\n').trim();
        setOutput(md);
      } catch {
        setOutput('Error converting HTML to Markdown');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter HTML
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> paragraph.</p>"
          aria-label={`HTML input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Markdown Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
