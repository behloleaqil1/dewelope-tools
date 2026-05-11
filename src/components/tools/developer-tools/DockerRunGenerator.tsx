'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DockerRunGenerator - Generates docker run commands from form inputs.
 */
export default function DockerRunGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [image, setImage] = useState('');
  const [containerName, setContainerName] = useState('');
  const [ports, setPorts] = useState('');
  const [volumes, setVolumes] = useState('');
  const [envVars, setEnvVars] = useState('');
  const [network, setNetwork] = useState('');
  const [restartPolicy, setRestartPolicy] = useState('no');
  const [detached, setDetached] = useState(true);
  const [removeOnExit, setRemoveOnExit] = useState(false);
  const [command, setCommand] = useState('');

  const generateCommand = (): string => {
    if (!image.trim()) return '';

    const parts = ['docker run'];

    if (detached) parts.push('-d');
    if (removeOnExit) parts.push('--rm');
    if (containerName.trim()) parts.push(`--name ${containerName.trim()}`);
    if (restartPolicy !== 'no') parts.push(`--restart ${restartPolicy}`);
    if (network.trim()) parts.push(`--network ${network.trim()}`);

    if (ports.trim()) {
      ports.split('\n').filter(p => p.trim()).forEach(p => {
        parts.push(`-p ${p.trim()}`);
      });
    }

    if (volumes.trim()) {
      volumes.split('\n').filter(v => v.trim()).forEach(v => {
        parts.push(`-v ${v.trim()}`);
      });
    }

    if (envVars.trim()) {
      envVars.split('\n').filter(e => e.trim()).forEach(e => {
        parts.push(`-e ${e.trim()}`);
      });
    }

    parts.push(image.trim());

    if (command.trim()) parts.push(command.trim());

    return parts.join(' \\\n  ');
  };

  const output = generateCommand();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">
            Image Name *
          </label>
          <input
            id={`${toolId}-image`}
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="e.g. nginx:latest"
            aria-label={`Docker image for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
            Container Name
          </label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            placeholder="e.g. my-nginx"
            aria-label={`Container name for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-ports`} className="block text-sm font-medium text-gray-700 mb-1">
            Port Mappings (one per line, host:container)
          </label>
          <textarea
            id={`${toolId}-ports`}
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            placeholder="e.g. 8080:80&#10;443:443"
            aria-label={`Port mappings for ${toolName}`}
            className="input-field h-20 resize-y font-mono"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-volumes`} className="block text-sm font-medium text-gray-700 mb-1">
            Volume Mounts (one per line, host:container)
          </label>
          <textarea
            id={`${toolId}-volumes`}
            value={volumes}
            onChange={(e) => setVolumes(e.target.value)}
            placeholder="e.g. ./data:/app/data&#10;/var/log:/logs"
            aria-label={`Volume mounts for ${toolName}`}
            className="input-field h-20 resize-y font-mono"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">
            Environment Variables (one per line, KEY=VALUE)
          </label>
          <textarea
            id={`${toolId}-env`}
            value={envVars}
            onChange={(e) => setEnvVars(e.target.value)}
            placeholder="e.g. NODE_ENV=production&#10;PORT=3000"
            aria-label={`Environment variables for ${toolName}`}
            className="input-field h-20 resize-y font-mono"
          />
        </InputArea>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-network`} className="block text-sm font-medium text-gray-700 mb-1">
              Network
            </label>
            <input
              id={`${toolId}-network`}
              type="text"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              placeholder="e.g. my-network"
              aria-label={`Network for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea>
            <label htmlFor={`${toolId}-restart`} className="block text-sm font-medium text-gray-700 mb-1">
              Restart Policy
            </label>
            <select
              id={`${toolId}-restart`}
              value={restartPolicy}
              onChange={(e) => setRestartPolicy(e.target.value)}
              aria-label={`Restart policy for ${toolName}`}
              className="input-field"
            >
              <option value="no">no</option>
              <option value="always">always</option>
              <option value="unless-stopped">unless-stopped</option>
              <option value="on-failure">on-failure</option>
            </select>
          </InputArea>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={detached} onChange={(e) => setDetached(e.target.checked)} className="rounded" />
            Detached (-d)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={removeOnExit} onChange={(e) => setRemoveOnExit(e.target.checked)} className="rounded" />
            Remove on exit (--rm)
          </label>
        </div>

        <InputArea>
          <label htmlFor={`${toolId}-cmd`} className="block text-sm font-medium text-gray-700 mb-1">
            Command (optional)
          </label>
          <input
            id={`${toolId}-cmd`}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g. /bin/bash"
            aria-label={`Command for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
