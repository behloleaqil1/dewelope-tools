'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DockerfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseImage, setBaseImage] = useState('node:18-alpine');
  const [workdir, setWorkdir] = useState('/app');
  const [port, setPort] = useState('3000');
  const [cmd, setCmd] = useState('npm start');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines = [`FROM ${baseImage}`, `WORKDIR ${workdir}`, 'COPY package*.json ./', 'RUN npm install', 'COPY . .'];
    if (port) lines.push(`EXPOSE ${port}`);
    lines.push(`CMD [${cmd.split(' ').map(c => `"${c}"`).join(', ')}]`);
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Image</label>
        <input id={`${toolId}-base`} value={baseImage} onChange={(e) => setBaseImage(e.target.value)} className="input-field" aria-label={`Base image for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-workdir`} className="block text-sm font-medium text-gray-700 mb-1">Working Directory</label>
        <input id={`${toolId}-workdir`} value={workdir} onChange={(e) => setWorkdir(e.target.value)} className="input-field" aria-label={`Workdir for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Expose Port</label>
        <input id={`${toolId}-port`} value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label={`Port for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-cmd`} className="block text-sm font-medium text-gray-700 mb-1">CMD</label>
        <input id={`${toolId}-cmd`} value={cmd} onChange={(e) => setCmd(e.target.value)} className="input-field" aria-label={`CMD for ${toolName}`} />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Dockerfile</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
