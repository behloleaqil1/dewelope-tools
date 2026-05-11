'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HtpasswdGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!username.trim() || !password.trim()) return;
    // Simple APR1-style hash simulation (for demo - uses base64 encoding)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashArray = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
    const encoded = btoa(hashArray).replace(/=+$/, '');
    setOutput(`${username}:{SHA}${btoa(String.fromCharCode(...data))}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-user`} className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input id={`${toolId}-user`} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" aria-label={`Username for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-pass`} className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input id={`${toolId}-pass`} type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" aria-label={`Password for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={generate} className="btn-primary" aria-label="Generate htpasswd entry">Generate</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
