'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Pm2ConfigGenerator - Generate PM2 ecosystem config files for Node.js process management.
 */
export default function Pm2ConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('');
  const [script, setScript] = useState('');
  const [instances, setInstances] = useState('1');
  const [execMode, setExecMode] = useState('fork');
  const [envVars, setEnvVars] = useState('');
  const [watch, setWatch] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = appName.trim() || 'my-app';
    const scriptPath = script.trim() || './index.js';
    const inst = parseInt(instances) || 1;

    const envObj: Record<string, string> = {};
    if (envVars.trim()) {
      envVars.trim().split('\n').forEach((line) => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) {
          envObj[key.trim()] = rest.join('=').trim();
        }
      });
    }

    const app: Record<string, unknown> = {
      name,
      script: scriptPath,
      instances: execMode === 'cluster' ? inst : 1,
      exec_mode: execMode,
    };

    if (watch) {
      app.watch = true;
      app.ignore_watch = ['node_modules', 'logs'];
    }

    if (Object.keys(envObj).length > 0) {
      app.env = envObj;
      app.env_production = { ...envObj, NODE_ENV: 'production' };
    } else {
      app.env = { NODE_ENV: 'development' };
      app.env_production = { NODE_ENV: 'production' };
    }

    const config = {
      apps: [app],
    };

    const result = `module.exports = ${JSON.stringify(config, null, 2)};`;
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
              <input id={`${toolId}-name`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="my-app" aria-label={`App name for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-script`} className="block text-sm font-medium text-gray-700 mb-1">Script Path</label>
              <input id={`${toolId}-script`} type="text" value={script} onChange={(e) => setScript(e.target.value)} placeholder="./index.js" aria-label="Script path" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-instances`} className="block text-sm font-medium text-gray-700 mb-1">Instances</label>
              <input id={`${toolId}-instances`} type="number" min="1" max="16" value={instances} onChange={(e) => setInstances(e.target.value)} aria-label="Number of instances" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Exec Mode</label>
              <select id={`${toolId}-mode`} value={execMode} onChange={(e) => setExecMode(e.target.value)} aria-label="Execution mode" className="input-field">
                <option value="fork">Fork</option>
                <option value="cluster">Cluster</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={watch} onChange={(e) => setWatch(e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Watch Mode</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">Environment Variables (KEY=VALUE per line)</label>
            <textarea id={`${toolId}-env`} value={envVars} onChange={(e) => setEnvVars(e.target.value)} placeholder="PORT=3000&#10;DB_HOST=localhost" aria-label="Environment variables" className="input-field h-24 resize-y font-mono" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate PM2 config">Generate Config</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ecosystem.config.js</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
