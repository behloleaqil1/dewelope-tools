'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PulumiConfigGenerator - Generate Pulumi stack configuration YAML.
 * Allows users to define stack name, project, config keys/values and outputs valid Pulumi YAML.
 */
export default function PulumiConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [stackName, setStackName] = useState('dev');
  const [projectName, setProjectName] = useState('my-project');
  const [configEntries, setConfigEntries] = useState('aws:region: us-east-1\nproject:env: development');
  const [secretKeys, setSecretKeys] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push(`encryptionsalt: v1:placeholder:v1`);
    lines.push(`config:`);

    const entries = configEntries.split('\n').filter(l => l.trim());
    entries.forEach(entry => {
      const colonIdx = entry.indexOf(':');
      if (colonIdx === -1) return;
      const key = entry.substring(0, colonIdx).trim();
      const value = entry.substring(colonIdx + 1).trim();
      const secrets = secretKeys.split(',').map(s => s.trim()).filter(Boolean);
      if (secrets.includes(key)) {
        lines.push(`  ${key}:`);
        lines.push(`    secure: v1:encrypted:${btoa(value).substring(0, 20)}`);
      } else {
        lines.push(`  ${key}: ${value}`);
      }
    });

    const header = `# Pulumi.${stackName}.yaml\n# Project: ${projectName}\n`;
    setOutput(header + lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-stack`} className="block text-sm font-medium text-gray-700 mb-1">Stack Name</label>
              <input id={`${toolId}-stack`} type="text" value={stackName} onChange={e => setStackName(e.target.value)} className="input-field" aria-label={`Stack name for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input id={`${toolId}-project`} type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-config`} className="block text-sm font-medium text-gray-700 mb-1">Config Entries (key: value per line)</label>
            <textarea id={`${toolId}-config`} value={configEntries} onChange={e => setConfigEntries(e.target.value)} placeholder="aws:region: us-east-1" className="input-field h-32 resize-y font-mono" aria-label="Configuration entries" />
          </div>
          <div>
            <label htmlFor={`${toolId}-secrets`} className="block text-sm font-medium text-gray-700 mb-1">Secret Keys (comma-separated)</label>
            <input id={`${toolId}-secrets`} type="text" value={secretKeys} onChange={e => setSecretKeys(e.target.value)} placeholder="db:password,api:key" className="input-field" aria-label="Secret key names" />
          </div>
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Generate Config</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Pulumi Config YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
