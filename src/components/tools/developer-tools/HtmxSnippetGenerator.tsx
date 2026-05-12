'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmxSnippetGenerator - Generate HTMX attribute snippets for common patterns.
 * Creates ready-to-use HTML with hx-get, hx-post, hx-swap, hx-trigger, etc.
 */

interface HtmxPattern {
  name: string;
  description: string;
  generate: (url: string, target: string) => string;
}

const PATTERNS: HtmxPattern[] = [
  {
    name: 'Click to Load',
    description: 'Load content on button click',
    generate: (url, target) => `<button hx-get="${url}" hx-target="${target}" hx-swap="innerHTML">\n  Load Content\n</button>\n\n<div id="${target.replace('#', '')}"></div>`,
  },
  {
    name: 'Form Submit',
    description: 'Submit form via AJAX with POST',
    generate: (url, target) => `<form hx-post="${url}" hx-target="${target}" hx-swap="outerHTML">\n  <input type="text" name="name" placeholder="Enter name" />\n  <button type="submit">Submit</button>\n</form>\n\n<div id="${target.replace('#', '')}"></div>`,
  },
  {
    name: 'Infinite Scroll',
    description: 'Load more items when scrolling to bottom',
    generate: (url, target) => `<div id="${target.replace('#', '')}">\n  <!-- Existing items -->\n</div>\n\n<div hx-get="${url}" hx-trigger="revealed" hx-target="${target}" hx-swap="beforeend">\n  Loading more...\n</div>`,
  },
  {
    name: 'Search with Debounce',
    description: 'Live search with 300ms debounce',
    generate: (url, target) => `<input type="search"\n  name="q"\n  hx-get="${url}"\n  hx-trigger="keyup changed delay:300ms"\n  hx-target="${target}"\n  hx-swap="innerHTML"\n  placeholder="Search..." />\n\n<div id="${target.replace('#', '')}"></div>`,
  },
  {
    name: 'Delete with Confirm',
    description: 'Delete item with confirmation dialog',
    generate: (url, target) => `<button hx-delete="${url}"\n  hx-confirm="Are you sure you want to delete this?"\n  hx-target="${target}"\n  hx-swap="outerHTML swap:1s">\n  Delete\n</button>`,
  },
  {
    name: 'Polling',
    description: 'Poll endpoint every 2 seconds',
    generate: (url, target) => `<div hx-get="${url}"\n  hx-trigger="every 2s"\n  hx-target="${target}"\n  hx-swap="innerHTML"\n  id="${target.replace('#', '')}">\n  Loading...\n</div>`,
  },
  {
    name: 'Tabs',
    description: 'Tab navigation with HTMX',
    generate: (url, target) => `<div class="tabs">\n  <button hx-get="${url}/tab1" hx-target="${target}" hx-swap="innerHTML" class="active">Tab 1</button>\n  <button hx-get="${url}/tab2" hx-target="${target}" hx-swap="innerHTML">Tab 2</button>\n  <button hx-get="${url}/tab3" hx-target="${target}" hx-swap="innerHTML">Tab 3</button>\n</div>\n\n<div id="${target.replace('#', '')}"></div>`,
  },
  {
    name: 'Modal Dialog',
    description: 'Load modal content dynamically',
    generate: (url, target) => `<button hx-get="${url}"\n  hx-target="${target}"\n  hx-swap="innerHTML"\n  hx-trigger="click">\n  Open Modal\n</button>\n\n<div id="${target.replace('#', '')}" class="modal"></div>`,
  },
];

export default function HtmxSnippetGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pattern, setPattern] = useState(0);
  const [url, setUrl] = useState('/api/data');
  const [target, setTarget] = useState('#result');
  const [output, setOutput] = useState('');

  const generate = () => {
    const snippet = PATTERNS[pattern].generate(url || '/api/data', target || '#result');
    setOutput(snippet);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-pattern`} className="block text-sm font-medium text-gray-700 mb-1">
          HTMX Pattern
        </label>
        <select
          id={`${toolId}-pattern`}
          value={pattern}
          onChange={(e) => setPattern(Number(e.target.value))}
          aria-label={`Pattern for ${toolName}`}
          className="input-field"
        >
          {PATTERNS.map((p, i) => (
            <option key={i} value={i}>{p.name} — {p.description}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">
          Endpoint URL
        </label>
        <input
          id={`${toolId}-url`}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/api/data"
          aria-label={`Endpoint URL for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">
          Target Selector
        </label>
        <input
          id={`${toolId}-target`}
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="#result"
          aria-label={`Target selector for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate HTMX snippet" className="btn-primary">
        Generate Snippet
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated HTMX Snippet</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
