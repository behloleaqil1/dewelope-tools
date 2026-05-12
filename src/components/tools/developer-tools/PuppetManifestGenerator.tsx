'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PuppetManifestGenerator - Generate Puppet manifest from resource definitions.
 * Users define resources (packages, files, services) and the tool generates
 * valid Puppet manifest code.
 */
export default function PuppetManifestGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [className, setClassName] = useState('mymodule');
  const [resources, setResources] = useState([
    { type: 'package', title: 'nginx', ensure: 'present', extra: '' },
    { type: 'service', title: 'nginx', ensure: 'running', extra: 'enable => true,' },
  ]);
  const [output, setOutput] = useState('');

  const resourceTypes = ['package', 'service', 'file', 'exec', 'user', 'group', 'cron', 'notify'];
  const ensureOptions: Record<string, string[]> = {
    package: ['present', 'absent', 'latest', 'installed'],
    service: ['running', 'stopped'],
    file: ['present', 'absent', 'file', 'directory', 'link'],
    exec: [],
    user: ['present', 'absent'],
    group: ['present', 'absent'],
    cron: ['present', 'absent'],
    notify: [],
  };

  const addResource = () => {
    setResources([...resources, { type: 'package', title: '', ensure: 'present', extra: '' }]);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'type') {
      const opts = ensureOptions[value] || [];
      updated[index].ensure = opts[0] || '';
    }
    setResources(updated);
  };

  const generate = () => {
    if (!className.trim()) {
      setOutput('# Please provide a class name.');
      return;
    }

    const validResources = resources.filter(r => r.title.trim());
    if (validResources.length === 0) {
      setOutput('# Please define at least one resource with a title.');
      return;
    }

    const lines: string[] = [];
    lines.push(`# Puppet manifest: ${className}`);
    lines.push(`# Generated on: ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push(`class ${className} {`);

    validResources.forEach(r => {
      lines.push('');
      lines.push(`  ${r.type} { '${r.title}':`);
      if (r.ensure) {
        lines.push(`    ensure => '${r.ensure}',`);
      }
      if (r.extra.trim()) {
        r.extra.split(',').map(s => s.trim()).filter(Boolean).forEach(attr => {
          lines.push(`    ${attr}`);
        });
      }
      lines.push('  }');
    });

    lines.push('');
    lines.push('}');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-classname`} className="block text-sm font-medium text-gray-700 mb-1">
          Class Name
        </label>
        <input
          id={`${toolId}-classname`}
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="e.g., mymodule::webserver"
          aria-label={`Class name for ${toolName}`}
          className="input-field mb-4"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Resources</label>
          {resources.map((r, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
              <select
                value={r.type}
                onChange={(e) => updateResource(i, 'type', e.target.value)}
                aria-label={`Resource ${i + 1} type`}
                className="input-field text-sm"
              >
                {resourceTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="text"
                value={r.title}
                onChange={(e) => updateResource(i, 'title', e.target.value)}
                placeholder="Resource title"
                aria-label={`Resource ${i + 1} title`}
                className="input-field text-sm"
              />
              <select
                value={r.ensure}
                onChange={(e) => updateResource(i, 'ensure', e.target.value)}
                aria-label={`Resource ${i + 1} ensure`}
                className="input-field text-sm"
              >
                <option value="">No ensure</option>
                {(ensureOptions[r.type] || []).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <input
                type="text"
                value={r.extra}
                onChange={(e) => updateResource(i, 'extra', e.target.value)}
                placeholder="Extra attrs (comma-sep)"
                aria-label={`Resource ${i + 1} extra attributes`}
                className="input-field text-sm"
              />
              <button
                onClick={() => removeResource(i)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
                aria-label={`Remove resource ${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-3">
          <button
            onClick={addResource}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            + Add Resource
          </button>
          <button
            onClick={generate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Generate Manifest
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Puppet Manifest</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
