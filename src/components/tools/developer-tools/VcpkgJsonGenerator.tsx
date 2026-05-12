'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VcpkgJsonGenerator - Generate C++ vcpkg.json manifest files.
 * Configurable project name, version, dependencies, and features.
 */
export default function VcpkgJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('my-project');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('A C++ project using vcpkg.');
  const [homepage, setHomepage] = useState('');
  const [license, setLicense] = useState('MIT');
  const [dependencies, setDependencies] = useState('fmt\nspdlog\nnlohmann-json');
  const [supports, setSupports] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const deps = dependencies.trim().split('\n').filter(Boolean).map(d => {
      const trimmed = d.trim();
      if (trimmed.includes('[')) {
        const match = trimmed.match(/^([^[]+)\[([^\]]+)\]$/);
        if (match) {
          return {
            name: match[1].trim(),
            "default-features": true,
            features: match[2].split(',').map(f => f.trim())
          };
        }
      }
      return trimmed;
    });

    const manifest: Record<string, unknown> = {
      name,
      version,
      description,
    };

    if (homepage) manifest.homepage = homepage;
    if (license) manifest.license = license;
    if (supports) manifest.supports = supports;
    if (deps.length > 0) manifest.dependencies = deps;

    setOutput(JSON.stringify(manifest, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Project version" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" aria-label="Project description" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-homepage`} className="block text-sm font-medium text-gray-700 mb-1">Homepage URL (optional)</label>
            <input id={`${toolId}-homepage`} type="text" value={homepage} onChange={(e) => setHomepage(e.target.value)} className="input-field" aria-label="Homepage URL" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="input-field" aria-label="License identifier" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-supports`} className="block text-sm font-medium text-gray-700 mb-1">Supports (platform expression, optional)</label>
          <input id={`${toolId}-supports`} type="text" value={supports} onChange={(e) => setSupports(e.target.value)} placeholder="e.g. windows | linux" className="input-field" aria-label="Platform support expression" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line, use name[feature1,feature2] for features)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} className="input-field h-32 resize-y font-mono" aria-label="Dependencies list" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate vcpkg.json</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated vcpkg.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
