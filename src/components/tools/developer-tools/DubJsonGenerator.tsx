'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DubJsonGenerator - Generate D language dub.json package file.
 */
export default function DubJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [license, setLicense] = useState('MIT');
  const [targetType, setTargetType] = useState('executable');
  const [dependencies, setDependencies] = useState('');
  const [sourceDir, setSourceDir] = useState('source');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!name.trim()) {
      setOutput('Error: Package name is required.');
      return;
    }

    const authorsArr = authors.split(',').filter(a => a.trim()).map(a => a.trim());
    const depsObj: Record<string, string> = {};
    dependencies.split('\n').filter(d => d.trim()).forEach(d => {
      const parts = d.split(':').map(p => p.trim());
      if (parts.length === 2) {
        depsObj[parts[0]] = parts[1];
      } else if (parts[0]) {
        depsObj[parts[0]] = '~master';
      }
    });

    const dubJson: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      authors: authorsArr.length > 0 ? authorsArr : undefined,
      license: license,
      targetType: targetType,
      sourcePaths: [sourceDir.trim() || 'source'],
    };

    if (Object.keys(depsObj).length > 0) {
      dubJson.dependencies = depsObj;
    }

    // Remove undefined values
    Object.keys(dubJson).forEach(key => {
      if (dubJson[key] === undefined) delete dubJson[key];
    });

    setOutput(JSON.stringify(dubJson, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-d-project" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <select id={`${toolId}-license`} value={license} onChange={(e) => setLicense(e.target.value)} aria-label="License type" className="input-field">
              <option value="MIT">MIT</option>
              <option value="BSL-1.0">Boost Software License</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="public domain">Public Domain</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
            <select id={`${toolId}-target`} value={targetType} onChange={(e) => setTargetType(e.target.value)} aria-label="Target type" className="input-field">
              <option value="executable">Executable</option>
              <option value="library">Library</option>
              <option value="sourceLibrary">Source Library</option>
              <option value="dynamicLibrary">Dynamic Library</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source Directory</label>
            <input id={`${toolId}-source`} type="text" value={sourceDir} onChange={(e) => setSourceDir(e.target.value)} placeholder="source" aria-label="Source directory" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-authors`} className="block text-sm font-medium text-gray-700 mb-1">Authors (comma-separated)</label>
            <input id={`${toolId}-authors`} type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Author One, Author Two" aria-label="Authors" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A D language project" aria-label="Package description" className="input-field" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (name:version per line)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="vibe-d:~>0.9.0&#10;mir-algorithm:~>3.0" aria-label="Package dependencies" className="input-field h-24 resize-y font-mono" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate dub.json</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated dub.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
