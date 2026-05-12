'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HtmlLinkGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [newTab, setNewTab] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!url.trim()) { setOutput('Please enter a URL.'); return; }
    const linkText = text.trim() || url.trim();
    const target = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    setOutput(`<a href="${url.trim()}"${target}>${linkText}</a>`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input id={`${toolId}-url`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" aria-label={`URL for ${toolName}`} className="input-field" />
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Link Text</label>
        <input id={`${toolId}-text`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Click here" aria-label={`Link text for ${toolName}`} className="input-field" />
        <label className="flex items-center gap-2 mt-2 text-sm">
          <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} /> Open in new tab
        </label>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Link</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
