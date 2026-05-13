'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RsyncCommandGenerator - Generate rsync commands from source, destination, and options.
 * Supports common flags like archive, verbose, compress, delete, dry-run, and exclude patterns.
 */
export default function RsyncCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [archive, setArchive] = useState(true);
  const [verbose, setVerbose] = useState(true);
  const [compress, setCompress] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [progress, setProgress] = useState(true);
  const [humanReadable, setHumanReadable] = useState(false);
  const [exclude, setExclude] = useState('');
  const [sshPort, setSshPort] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!source.trim() || !destination.trim()) {
      setOutput('');
      return;
    }

    const parts: string[] = ['rsync'];
    const flags: string[] = [];

    if (archive) flags.push('a');
    if (verbose) flags.push('v');
    if (compress) flags.push('z');
    if (humanReadable) flags.push('h');

    if (flags.length > 0) {
      parts.push(`-${flags.join('')}`);
    }
    if (progress) parts.push('--progress');
    if (deleteFlag) parts.push('--delete');
    if (dryRun) parts.push('--dry-run');

    if (sshPort.trim()) {
      parts.push(`-e "ssh -p ${sshPort.trim()}"`);
    }

    if (exclude.trim()) {
      const patterns = exclude.split(',').map(p => p.trim()).filter(Boolean);
      patterns.forEach(p => parts.push(`--exclude="${p}"`));
    }

    parts.push(`"${source.trim()}"`);
    parts.push(`"${destination.trim()}"`);

    setOutput(parts.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source Path</label>
            <input id={`${toolId}-source`} type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="/path/to/source/" aria-label={`Source path for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">Destination Path</label>
            <input id={`${toolId}-dest`} type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="user@host:/path/to/dest/" aria-label="Destination path" className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          <label className="flex items-center text-sm"><input type="checkbox" checked={archive} onChange={(e) => setArchive(e.target.checked)} className="mr-2" />Archive (-a)</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="mr-2" />Verbose (-v)</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={compress} onChange={(e) => setCompress(e.target.checked)} className="mr-2" />Compress (-z)</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={progress} onChange={(e) => setProgress(e.target.checked)} className="mr-2" />Progress</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={deleteFlag} onChange={(e) => setDeleteFlag(e.target.checked)} className="mr-2" />Delete</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} className="mr-2" />Dry Run</label>
          <label className="flex items-center text-sm"><input type="checkbox" checked={humanReadable} onChange={(e) => setHumanReadable(e.target.checked)} className="mr-2" />Human Readable (-h)</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-exclude`} className="block text-sm font-medium text-gray-700 mb-1">Exclude Patterns (comma-separated)</label>
            <input id={`${toolId}-exclude`} type="text" value={exclude} onChange={(e) => setExclude(e.target.value)} placeholder="node_modules, .git, *.log" className="input-field" aria-label="Exclude patterns" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">SSH Port (optional)</label>
            <input id={`${toolId}-port`} type="text" value={sshPort} onChange={(e) => setSshPort(e.target.value)} placeholder="22" className="input-field" aria-label="SSH port" />
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-3">Generate Command</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated rsync Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
