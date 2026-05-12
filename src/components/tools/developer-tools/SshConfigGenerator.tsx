'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SshConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [host, setHost] = useState('');
  const [hostname, setHostname] = useState('');
  const [user, setUser] = useState('');
  const [port, setPort] = useState('22');
  const [keyPath, setKeyPath] = useState('~/.ssh/id_rsa');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!host || !hostname) return;
    const lines = [`Host ${host}`, `  HostName ${hostname}`];
    if (user) lines.push(`  User ${user}`);
    if (port && port !== '22') lines.push(`  Port ${port}`);
    if (keyPath) lines.push(`  IdentityFile ${keyPath}`);
    lines.push('  ServerAliveInterval 60');
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-host`} className="block text-sm font-medium text-gray-700 mb-1">Host Alias</label>
        <input id={`${toolId}-host`} value={host} onChange={(e) => setHost(e.target.value)} placeholder="myserver" className="input-field" aria-label={`Host alias for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-hostname`} className="block text-sm font-medium text-gray-700 mb-1">HostName (IP/Domain)</label>
        <input id={`${toolId}-hostname`} value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="192.168.1.100" className="input-field" aria-label={`Hostname for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-user`} className="block text-sm font-medium text-gray-700 mb-1">User</label>
        <input id={`${toolId}-user`} value={user} onChange={(e) => setUser(e.target.value)} placeholder="root" className="input-field" aria-label={`User for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
        <input id={`${toolId}-port`} value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label={`Port for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">Identity File</label>
        <input id={`${toolId}-key`} value={keyPath} onChange={(e) => setKeyPath(e.target.value)} className="input-field" aria-label={`Key path for ${toolName}`} />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Config</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
