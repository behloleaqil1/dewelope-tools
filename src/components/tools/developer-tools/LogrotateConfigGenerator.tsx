'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LogrotateConfigGenerator - Generate logrotate configuration files.
 */
export default function LogrotateConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [logPath, setLogPath] = useState('/var/log/myapp/*.log');
  const [frequency, setFrequency] = useState('daily');
  const [rotate, setRotate] = useState('7');
  const [maxSize, setMaxSize] = useState('100M');
  const [compress, setCompress] = useState(true);
  const [delayCompress, setDelayCompress] = useState(true);
  const [missingOk, setMissingOk] = useState(true);
  const [notIfEmpty, setNotIfEmpty] = useState(true);
  const [copyTruncate, setCopyTruncate] = useState(false);
  const [create, setCreate] = useState(true);
  const [createMode, setCreateMode] = useState('0640');
  const [createOwner, setCreateOwner] = useState('root');
  const [createGroup, setCreateGroup] = useState('adm');
  const [postRotate, setPostRotate] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [
      `${logPath} {`,
      `    ${frequency}`,
      `    rotate ${rotate}`,
    ];

    if (maxSize) lines.push(`    maxsize ${maxSize}`);
    if (compress) lines.push('    compress');
    if (delayCompress) lines.push('    delaycompress');
    if (missingOk) lines.push('    missingok');
    if (notIfEmpty) lines.push('    notifempty');
    if (copyTruncate) lines.push('    copytruncate');
    if (create && !copyTruncate) lines.push(`    create ${createMode} ${createOwner} ${createGroup}`);

    if (postRotate.trim()) {
      lines.push('    postrotate');
      postRotate.trim().split('\n').forEach(l => lines.push(`        ${l}`));
      lines.push('    endscript');
    }

    lines.push('}');
    setOutput(lines.join('\n'));
  };

  const presets = [
    { name: 'Nginx', path: '/var/log/nginx/*.log', post: 'systemctl reload nginx > /dev/null 2>&1 || true' },
    { name: 'Apache', path: '/var/log/apache2/*.log', post: 'systemctl reload apache2 > /dev/null 2>&1 || true' },
    { name: 'Syslog', path: '/var/log/syslog', post: 'systemctl restart rsyslog > /dev/null 2>&1 || true' },
    { name: 'App', path: '/var/log/myapp/*.log', post: '' },
  ];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {presets.map(p => (
              <button key={p.name} onClick={() => { setLogPath(p.path); setPostRotate(p.post); }} className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300" aria-label={`${p.name} preset`}>
                {p.name}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Log Path</label>
            <input type="text" value={logPath} onChange={e => setLogPath(e.target.value)} className="input-field" aria-label="Log file path" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input-field" aria-label="Rotation frequency">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keep (rotate)</label>
              <input type="number" value={rotate} onChange={e => setRotate(e.target.value)} className="input-field" aria-label="Number of rotations to keep" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Size</label>
              <input type="text" value={maxSize} onChange={e => setMaxSize(e.target.value)} className="input-field" placeholder="e.g. 100M" aria-label="Maximum file size" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={compress} onChange={e => setCompress(e.target.checked)} /> Compress</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={delayCompress} onChange={e => setDelayCompress(e.target.checked)} /> Delay Compress</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={missingOk} onChange={e => setMissingOk(e.target.checked)} /> Missing OK</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notIfEmpty} onChange={e => setNotIfEmpty(e.target.checked)} /> Not If Empty</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={copyTruncate} onChange={e => setCopyTruncate(e.target.checked)} /> Copy Truncate</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={create} onChange={e => setCreate(e.target.checked)} /> Create</label>
          </div>

          {create && !copyTruncate && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <input type="text" value={createMode} onChange={e => setCreateMode(e.target.value)} className="input-field" aria-label="File mode" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                <input type="text" value={createOwner} onChange={e => setCreateOwner(e.target.value)} className="input-field" aria-label="File owner" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                <input type="text" value={createGroup} onChange={e => setCreateGroup(e.target.value)} className="input-field" aria-label="File group" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post-Rotate Script (optional)</label>
            <textarea value={postRotate} onChange={e => setPostRotate(e.target.value)} className="input-field h-16 resize-y font-mono text-sm" placeholder="e.g. systemctl reload nginx" aria-label="Post-rotate script" />
          </div>

          <button onClick={generate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Generate ${toolName} configuration`}>
            Generate Logrotate Config
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
