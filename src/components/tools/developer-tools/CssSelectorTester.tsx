'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssSelectorTester({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [html, setHtml] = useState('');
  const [selector, setSelector] = useState('');
  const [output, setOutput] = useState('');

  const testSelector = () => {
    if (!html.trim() || !selector.trim()) { setOutput('Please provide both HTML and a CSS selector.'); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const elements = doc.querySelectorAll(selector);
      if (elements.length === 0) { setOutput('No elements matched.'); return; }
      const results = Array.from(elements).map((el, i) => `Match ${i + 1}: <${el.tagName.toLowerCase()}${el.id ? ` id="${el.id}"` : ''}${el.className ? ` class="${el.className}"` : ''}>`);
      setOutput(`Found ${elements.length} match(es):\n\n${results.join('\n')}`);
    } catch { setOutput('Invalid selector syntax.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-html`} className="block text-sm font-medium text-gray-700 mb-1">HTML</label>
        <textarea id={`${toolId}-html`} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<div class='test'><p>Hello</p></div>" aria-label={`HTML input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-selector`} className="block text-sm font-medium text-gray-700 mb-1">CSS Selector</label>
        <input id={`${toolId}-selector`} value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="e.g. div > p, .test" aria-label="CSS selector" className="input-field" />
      </InputArea>
      <button onClick={testSelector} className="btn-primary">Test Selector</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
