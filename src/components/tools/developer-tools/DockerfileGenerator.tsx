'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DockerfileGenerator - Generates a Dockerfile from form inputs.
 * Supports base image, workdir, copy, run commands, expose, and entrypoint.
 */
export default function DockerfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseImage, setBaseImage] = useState('node:18-alpine');
  const [workdir, setWorkdir] = useState('/app');
  const [copyFiles, setCopyFiles] = useState('package*.json ./');
  const [runCommands, setRunCommands] = useState('npm install');
  const [copySource, setCopySource] = useState('. .');
  const [expose, setExpose] = useState('3000');
  const [entrypoint, setEntrypoint] = useState('npm start');
  const [output, setOutput] = useState('');

  function generate() {
    const lines: string[] = [];

    if (baseImage.trim()) {
      lines.push(`FROM ${baseImage.trim()}`);
      lines.push('');
    }

    if (workdir.trim()) {
      lines.push(`WORKDIR ${workdir.trim()}`);
      lines.push('');
    }

    if (copyFiles.trim()) {
      copyFiles.trim().split('\n').forEach((line) => {
        if (line.trim()) lines.push(`COPY ${line.trim()}`);
      });
      lines.push('');
    }

    if (runCommands.trim()) {
      runCommands.trim().split('\n').forEach((line) => {
        if (line.trim()) lines.push(`RUN ${line.trim()}`);
      });
      lines.push('');
    }

    if (copySource.trim()) {
      copySource.trim().split('\n').forEach((line) => {
        if (line.trim()) lines.push(`COPY ${line.trim()}`);
      });
      lines.push('');
    }

    if (expose.trim()) {
      lines.push(`EXPOSE ${expose.trim()}`);
      lines.push('');
    }

    if (entrypoint.trim()) {
      const parts = entrypoint.trim().split(' ');
      lines.push(`CMD [${parts.map((p) => `"${p}"`).join(', ')}]`);
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Image</label>
            <input id={`${toolId}-base`} type="text" value={baseImage} onChange={(e) => setBaseImage(e.target.value)} placeholder="node:18-alpine" aria-label={`Base image for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-workdir`} className="block text-sm font-medium text-gray-700 mb-1">Working Directory</label>
            <input id={`${toolId}-workdir`} type="text" value={workdir} onChange={(e) => setWorkdir(e.target.value)} placeholder="/app" aria-label="Working directory" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-copy`} className="block text-sm font-medium text-gray-700 mb-1">COPY (before install, one per line)</label>
            <textarea id={`${toolId}-copy`} value={copyFiles} onChange={(e) => setCopyFiles(e.target.value)} placeholder="package*.json ./" aria-label="Copy files before install" className="input-field h-16 resize-y font-mono text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-run`} className="block text-sm font-medium text-gray-700 mb-1">RUN Commands (one per line)</label>
            <textarea id={`${toolId}-run`} value={runCommands} onChange={(e) => setRunCommands(e.target.value)} placeholder="npm install" aria-label="Run commands" className="input-field h-20 resize-y font-mono text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-copysrc`} className="block text-sm font-medium text-gray-700 mb-1">COPY Source (after install, one per line)</label>
            <textarea id={`${toolId}-copysrc`} value={copySource} onChange={(e) => setCopySource(e.target.value)} placeholder=". ." aria-label="Copy source files" className="input-field h-16 resize-y font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-expose`} className="block text-sm font-medium text-gray-700 mb-1">EXPOSE Port</label>
              <input id={`${toolId}-expose`} type="text" value={expose} onChange={(e) => setExpose(e.target.value)} placeholder="3000" aria-label="Expose port" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cmd`} className="block text-sm font-medium text-gray-700 mb-1">CMD / Entrypoint</label>
              <input id={`${toolId}-cmd`} type="text" value={entrypoint} onChange={(e) => setEntrypoint(e.target.value)} placeholder="npm start" aria-label="Entrypoint command" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Dockerfile" className="btn-primary">
        Generate Dockerfile
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Dockerfile</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
