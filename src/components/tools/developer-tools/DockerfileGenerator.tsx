'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DockerfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseImage, setBaseImage] = useState('node:18-alpine');
  const [workdir, setWorkdir] = useState('/app');
  const [copyFiles, setCopyFiles] = useState('package*.json');
  const [runCmd, setRunCmd] = useState('npm install');
  const [exposePort, setExposePort] = useState('3000');
  const [startCmd, setStartCmd] = useState('npm start');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines = [
      `FROM ${baseImage}`,
      '',
      `WORKDIR ${workdir}`,
      '',
      `COPY ${copyFiles} ./`,
      `RUN ${runCmd}`,
      '',
      'COPY . .',
      '',
      exposePort ? `EXPOSE ${exposePort}` : '',
      '',
      `CMD ["${startCmd.split(' ').join('", "')}"]`,
    ].filter((l, i, arr) => !(l === '' && arr[i - 1] === ''));
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Image</label>
        <input id={`${toolId}-base`} type="text" value={baseImage} onChange={(e) => setBaseImage(e.target.value)} aria-label={`Base image for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-workdir`} className="block text-sm font-medium text-gray-700 mb-1">Working Directory</label>
        <input id={`${toolId}-workdir`} type="text" value={workdir} onChange={(e) => setWorkdir(e.target.value)} aria-label={`Working directory for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Expose Port</label>
        <input id={`${toolId}-port`} type="text" value={exposePort} onChange={(e) => setExposePort(e.target.value)} aria-label={`Port for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-cmd`} className="block text-sm font-medium text-gray-700 mb-1">Start Command</label>
        <input id={`${toolId}-cmd`} type="text" value={startCmd} onChange={(e) => setStartCmd(e.target.value)} aria-label={`Start command for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={generate} className="btn-primary" aria-label="Generate Dockerfile">Generate Dockerfile</button>
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
