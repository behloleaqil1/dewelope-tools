'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface FocusItem { order: number; element: string; label: string; tabindex?: string; }

/**
 * FocusOrderVisualizer - Analyzes HTML and shows the tab/focus order of interactive elements.
 */
export default function FocusOrderVisualizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [items, setItems] = useState<FocusItem[]>([]);

  const analyze = () => {
    setError(undefined);
    setItems([]);
    if (!html.trim()) { setError('Please enter HTML to analyze'); return; }

    const _focusable: FocusItem[] = [];
    // Match interactive elements
    const patterns = [
      { regex: /<a\s[^>]*href[^>]*>(.*?)<\/a>/gi, type: 'link' },
      { regex: /<button[^>]*>(.*?)<\/button>/gi, type: 'button' },
      { regex: /<input[^>]*>/gi, type: 'input' },
      { regex: /<select[^>]*>.*?<\/select>/gi, type: 'select' },
      { regex: /<textarea[^>]*>.*?<\/textarea>/gi, type: 'textarea' },
      { regex: /<[^>]*tabindex="([^"]*)"[^>]*>/gi, type: 'tabindex' },
    ];

    const allMatches: { index: number; element: string; label: string; tabindex: number }[] = [];

    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      while ((match = regex.exec(html)) !== null) {
        const fullMatch = match[0];
        // Skip if disabled
        if (fullMatch.includes('disabled')) continue;
        // Skip if tabindex="-1"
        const tabindexMatch = fullMatch.match(/tabindex="(-?\d+)"/);
        const tabindex = tabindexMatch ? parseInt(tabindexMatch[1]) : 0;
        if (tabindex < 0) continue;

        // Extract label
        let label = '';
        const ariaLabel = fullMatch.match(/aria-label="([^"]*)"/);
        const id = fullMatch.match(/id="([^"]*)"/);
        const textContent = match[1] ? match[1].replace(/<[^>]*>/g, '').trim() : '';

        if (ariaLabel) label = ariaLabel[1];
        else if (textContent) label = textContent;
        else if (id) label = `#${id[1]}`;
        else label = pattern.type;

        allMatches.push({ index: match.index, element: pattern.type, label, tabindex });
      }
    }

    // Remove duplicates (tabindex pattern may match elements already caught)
    const seen = new Set<number>();
    const unique = allMatches.filter(m => {
      if (seen.has(m.index)) return false;
      seen.add(m.index);
      return true;
    });

    // Sort: positive tabindex first (by value), then tabindex=0 in DOM order
    const positive = unique.filter(m => m.tabindex > 0).sort((a, b) => a.tabindex - b.tabindex);
    const zero = unique.filter(m => m.tabindex === 0).sort((a, b) => a.index - b.index);
    const ordered = [...positive, ...zero];

    setItems(ordered.map((m, i) => ({
      order: i + 1,
      element: m.element,
      label: m.label.substring(0, 50),
      tabindex: m.tabindex > 0 ? String(m.tabindex) : undefined,
    })));
  };

  const copyText = items.map(i => `${i.order}. [${i.element}] ${i.label}${i.tabindex ? ` (tabindex=${i.tabindex})` : ''}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">HTML to Analyze</label>
        <textarea id={`${toolId}-input`} value={html} onChange={(e) => setHtml(e.target.value)} placeholder='<a href="/">Home</a>\n<button>Submit</button>\n<input type="text" aria-label="Name">' aria-label={`HTML input for ${toolName}`} className="input-field font-mono min-h-[120px] text-sm" />
      </InputArea>
      <button onClick={analyze} aria-label="Analyze focus order" className="btn-primary">Analyze Focus Order</button>
      <OutputArea hasContent={items.length > 0}>
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 mb-2">Found {items.length} focusable element(s):</div>
            {items.map(item => (
              <div key={item.order} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{item.order}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-500">&lt;{item.element}&gt;{item.tabindex ? ` tabindex="${item.tabindex}"` : ''}</div>
                </div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
