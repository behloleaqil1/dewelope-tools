'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownLinkChecker - Extract and validate all links from markdown text.
 */
export default function MarkdownLinkChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ links: { text: string; url: string; type: string; valid: boolean; line: number }[] } | null>(null);

  const check = () => {
    setError('');
    setResult(null);
    if (!input.trim()) { setError('Please enter markdown text.'); return; }

    const links: { text: string; url: string; type: string; valid: boolean; line: number }[] = [];
    const lines = input.split('\n');

    lines.forEach((line, idx) => {
      // Inline links: [text](url)
      const inlineRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      while ((match = inlineRegex.exec(line)) !== null) {
        const url = match[2].trim();
        const isImage = line[match.index - 1] === '!';
        links.push({ text: match[1], url, type: isImage ? 'image' : 'inline', valid: isValidUrl(url), line: idx + 1 });
      }

      // Image links: ![alt](url)
      const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      while ((match = imgRegex.exec(line)) !== null) {
        const url = match[2].trim();
        if (!links.some((l) => l.url === url && l.line === idx + 1 && l.type === 'image')) {
          links.push({ text: match[1], url, type: 'image', valid: isValidUrl(url), line: idx + 1 });
        }
      }

      // Reference links: [text][ref] or [ref]: url
      const refDefRegex = /^\[([^\]]+)\]:\s*(.+)$/;
      const refMatch = line.match(refDefRegex);
      if (refMatch) {
        const url = refMatch[2].trim().split(/\s/)[0];
        links.push({ text: refMatch[1], url, type: 'reference-def', valid: isValidUrl(url), line: idx + 1 });
      }
    });

    setResult({ links });
  };

  const isValidUrl = (url: string): boolean => {
    if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;
    try { new URL(url); return true; } catch { return /^https?:\/\/.+/.test(url) || /^mailto:.+/.test(url); }
  };

  const copyText = result ? result.links.map((l) => `[Line ${l.line}] ${l.type}: ${l.text} -> ${l.url} (${l.valid ? 'valid' : 'invalid'})`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Markdown Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your markdown here..." rows={8} aria-label={`Markdown input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={check} className="btn-primary" aria-label="Check markdown links">Check Links</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Found {result.links.length} link(s)</div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {result.links.map((l, i) => (
                <div key={i} className={`p-3 rounded-lg border ${l.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-gray-500">Line {l.line} • {l.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${l.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.valid ? 'Valid' : 'Invalid'}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 mt-1">{l.text || '(no text)'}</div>
                  <div className="text-xs text-gray-500 font-mono truncate">{l.url}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
