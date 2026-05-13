'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScpCommandGenerator - Generate SCP file transfer commands from source, destination, and options.
 */
export default function ScpCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [user, setUser] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [direction, setDirection] = useState<'upload' | 'download'>('upload');
  const [recursive, setRecursive] = useState(false);
  const [preserveAttrs, setPreserveAttrs] = useState(false);
  const [compress, setCompress] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [identityFile, setIdentityFile] = useState('');

  const generateCommand = (): string => {
    if (!source || !host) return '';

    const flags: string[] = [];
    if (recursive) flags.push('-r');
    if (preserveAttrs) flags.push('-p');
    if (compress) flags.push('-C');
    if (verbose) flags.push('-v');
    if (port && port !== '22') flags.push(`-P ${port}`);
    if (identityFile) flags.push(`-i ${identityFile}`);

    const flagStr = flags.length > 0 ? ' ' + flags.join(' ') : '';
    const userHost = user ? `${user}@${host}` : host;

    if (direction === 'upload') {
      const dest = destination || '~';
      return `scp${flagStr} ${source} ${userHost}:${dest}`;
    } else {
      const dest = destination || '.';
      return `scp${flagStr} ${userHost}:${source} ${dest}`;
    }
  };

  const output = generateCommand();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as 'upload' | 'download')} className="input-field" aria-label={`Transfer direction for ${toolName}`}>
              <option value="upload">Upload (local → remote)</option>
              <option value="download">Download (remote → local)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-host`} className="block text-sm font-medium text-gray-700 mb-1">Remote Host</label>
              <input id={`${toolId}-host`} type="text" value={host} onChange={(e) => setHost(e.target.value)} placeholder="example.com" className="input-field" aria-label="Remote host" />
            </div>
            <div>
              <label htmlFor={`${toolId}-user`} className="block text-sm font-medium text-gray-700 mb-1">Username (optional)</label>
              <input id={`${toolId}-user`} type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="root" className="input-field" aria-label="SSH username" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">{direction === 'upload' ? 'Local Path' : 'Remote Path'}</label>
              <input id={`${toolId}-source`} type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder={direction === 'upload' ? '/path/to/local/file' : '/path/to/remote/file'} className="input-field" aria-label="Source path" />
            </div>
            <div>
              <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">{direction === 'upload' ? 'Remote Destination' : 'Local Destination'}</label>
              <input id={`${toolId}-dest`} type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={direction === 'upload' ? '~/uploads/' : './downloads/'} className="input-field" aria-label="Destination path" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder="22" className="input-field" aria-label="SSH port" />
            </div>
            <div>
              <label htmlFor={`${toolId}-identity`} className="block text-sm font-medium text-gray-700 mb-1">Identity File (optional)</label>
              <input id={`${toolId}-identity`} type="text" value={identityFile} onChange={(e) => setIdentityFile(e.target.value)} placeholder="~/.ssh/id_rsa" className="input-field" aria-label="SSH identity file" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={recursive} onChange={(e) => setRecursive(e.target.checked)} className="rounded" /> Recursive (-r)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={preserveAttrs} onChange={(e) => setPreserveAttrs(e.target.checked)} className="rounded" /> Preserve attributes (-p)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} className="rounded" /> Compress (-C)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="rounded" /> Verbose (-v)</label>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated SCP Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
