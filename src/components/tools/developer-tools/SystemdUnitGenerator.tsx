'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SystemdUnitGenerator - Generate systemd service unit files with common configurations.
 */
export default function SystemdUnitGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [execStart, setExecStart] = useState('');
  const [user, setUser] = useState('');
  const [workingDir, setWorkingDir] = useState('');
  const [restart, setRestart] = useState('on-failure');
  const [serviceType, setServiceType] = useState('simple');
  const [afterTarget, setAfterTarget] = useState('network.target');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = serviceName.trim() || 'myservice';
    const desc = description.trim() || `${name} service`;
    const exec = execStart.trim() || `/usr/bin/${name}`;
    const usr = user.trim() || 'root';
    const wd = workingDir.trim();

    let unit = `[Unit]
Description=${desc}
After=${afterTarget}
Wants=${afterTarget}

[Service]
Type=${serviceType}
ExecStart=${exec}
User=${usr}`;

    if (wd) {
      unit += `\nWorkingDirectory=${wd}`;
    }

    unit += `
Restart=${restart}
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${name}

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target`;

    setOutput(unit);
  };

  const installInstructions = serviceName.trim()
    ? `# Save as: /etc/systemd/system/${serviceName.trim()}.service
# Then run:
sudo systemctl daemon-reload
sudo systemctl enable ${serviceName.trim()}
sudo systemctl start ${serviceName.trim()}
sudo systemctl status ${serviceName.trim()}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g. myapp"
            aria-label={`Service name for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id={`${toolId}-desc`}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. My Application Service"
            aria-label={`Description for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-exec`} className="block text-sm font-medium text-gray-700 mb-1">
            ExecStart Command
          </label>
          <input
            id={`${toolId}-exec`}
            type="text"
            value={execStart}
            onChange={(e) => setExecStart(e.target.value)}
            placeholder="e.g. /usr/bin/node /opt/myapp/server.js"
            aria-label={`Exec command for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-user`} className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <input
            id={`${toolId}-user`}
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="e.g. www-data"
            aria-label={`User for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-wd`} className="block text-sm font-medium text-gray-700 mb-1">
            Working Directory (optional)
          </label>
          <input
            id={`${toolId}-wd`}
            type="text"
            value={workingDir}
            onChange={(e) => setWorkingDir(e.target.value)}
            placeholder="e.g. /opt/myapp"
            aria-label={`Working directory for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            id={`${toolId}-type`}
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            aria-label={`Service type for ${toolName}`}
            className="input-field"
          >
            <option value="simple">simple</option>
            <option value="forking">forking</option>
            <option value="oneshot">oneshot</option>
            <option value="notify">notify</option>
            <option value="exec">exec</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-restart`} className="block text-sm font-medium text-gray-700 mb-1">
            Restart Policy
          </label>
          <select
            id={`${toolId}-restart`}
            value={restart}
            onChange={(e) => setRestart(e.target.value)}
            aria-label={`Restart policy for ${toolName}`}
            className="input-field"
          >
            <option value="no">no</option>
            <option value="on-failure">on-failure</option>
            <option value="on-abnormal">on-abnormal</option>
            <option value="always">always</option>
            <option value="on-abort">on-abort</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-after`} className="block text-sm font-medium text-gray-700 mb-1">
            After Target
          </label>
          <select
            id={`${toolId}-after`}
            value={afterTarget}
            onChange={(e) => setAfterTarget(e.target.value)}
            aria-label={`After target for ${toolName}`}
            className="input-field"
          >
            <option value="network.target">network.target</option>
            <option value="network-online.target">network-online.target</option>
            <option value="multi-user.target">multi-user.target</option>
            <option value="syslog.target">syslog.target</option>
          </select>
        </InputArea>
      </div>

      <button onClick={generate} aria-label="Generate unit file" className="btn-primary">
        Generate Unit File
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Systemd Unit File</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
            {installInstructions && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Installation Commands</label>
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-blue-50 p-4 rounded-lg border border-blue-200">{installInstructions}</pre>
                <CopyToClipboard text={installInstructions} />
              </div>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
