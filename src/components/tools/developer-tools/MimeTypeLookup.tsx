'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MIME_MAP: Record<string, string> = {
  html: 'text/html', css: 'text/css', js: 'application/javascript', json: 'application/json',
  xml: 'application/xml', pdf: 'application/pdf', zip: 'application/zip', gz: 'application/gzip',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml',
  webp: 'image/webp', ico: 'image/x-icon', mp3: 'audio/mpeg', wav: 'audio/wav', mp4: 'video/mp4',
  webm: 'video/webm', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf',
  csv: 'text/csv', txt: 'text/plain', md: 'text/markdown', yaml: 'application/x-yaml',
  tar: 'application/x-tar', rar: 'application/vnd.rar', '7z': 'application/x-7z-compressed',
};

export default function MimeTypeLookup({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const lookup = () => {
    const ext = input.trim().replace(/^\./, '').toLowerCase();
    if (!ext) { setOutput(''); return; }
    const mime = MIME_MAP[ext];
    setOutput(mime ? `Extension: .${ext}\nMIME Type: ${mime}` : `No MIME type found for ".${ext}"`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">File Extension</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. png, .json, mp4" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={lookup} className="btn-primary">Look Up</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
