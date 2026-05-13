'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SshConfigGenerator - Generate SSH config file entries.
 * Creates properly formatted ~/.ssh/config entries with common options.
 */
export default function SshConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hostAlias, setHostAlias] = useState('');
  const [hostname, setHostname] = useState('');
  const [user, setUser] = useState('');
  const [port, setPort] = useState('22');
  const [identityFile, setIdentityFile] = useState('');
  const [proxyJump, setProxyJump] = useState('');
  const [forwardAgent, setForwardAgent] = useState(false);
  const [compression, setCompression] = useState(false);
  const [serverAliveInterval, setServerAliveInterval] = useState('');
  const [localForward, setLocalForward] = useState('');
  const [remoteForward, setRemoteForward] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!hostAlias && !hostname) {
      setOutput('# Please provide at least a Host alias and Hostname');
      return;
    }

    const lines: string[] = [];
    lines.push(`Host ${hostAlias || 'my-server'}`);
    lines.push(`    HostName ${hostname || 'example.com'}`);
    if (user) lines.push(`    User ${user}`);
    if (port && port !== '22') lines.push(`    Port ${port}`);
    if (identityFile) lines.push(`    IdentityFile ${identityFile}`);
    if (proxyJump) lines.push(`    ProxyJump ${proxyJump}`);
    if (forwardAgent) lines.push(`    ForwardAgent yes`);
    if (compression) lines.push(`    Compression yes`);
    if (serverAliveInterval) lines.push(`    ServerAliveInterval ${serverAliveInterval}`);
    if (localForward) lines.push(`    LocalForward ${localForward}`);
    if (remoteForward) lines.push(`    RemoteForward ${remoteForward}`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-alias`} className="block text-sm font-medium text-gray-700 mb-1">Host Alias</label>
            <input id={`${toolId}-alias`} type="text" value={hostAlias} onChange={(e) => setHostAlias(e.target.value)} placeholder="my-server" className="input-field" aria-label={`Host alias for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-hostname`} className="block text-sm font-medium text-gray-700 mb-1">HostName (IP or domain)</label>
            <input id={`${toolId}-hostname`} type="text" value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="192.168.1.100 or example.com" className="input-field" aria-label="Hostname or IP address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="ubuntu" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder="22" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identity File</label>
            <input type="text" value={identityFile} onChange={(e) => setIdentityFile(e.target.value)} placeholder="~/.ssh/id_ed25519" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ProxyJump (bastion)</label>
            <input type="text" value={proxyJump} onChange={(e) => setProxyJump(e.target.value)} placeholder="bastion-host" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ServerAliveInterval (seconds)</label>
            <input type="text" value={serverAliveInterval} onChange={(e) => setServerAliveInterval(e.target.value)} placeholder="60" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LocalForward</label>
            <input type="text" value={localForward} onChange={(e) => setLocalForward(e.target.value)} placeholder="8080 localhost:80" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RemoteForward</label>
            <input type="text" value={remoteForward} onChange={(e) => setRemoteForward(e.target.value)} placeholder="9090 localhost:3000" className="input-field" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={forwardAgent} onChange={(e) => setForwardAgent(e.target.checked)} />
            ForwardAgent
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={compression} onChange={(e) => setCompression(e.target.checked)} />
            Compression
          </label>
        </div>

        <button onClick={generate} className="btn-primary mt-3">Generate Config</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SSH Config Entry (~/.ssh/config)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
