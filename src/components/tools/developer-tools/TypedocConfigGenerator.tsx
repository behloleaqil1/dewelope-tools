'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TypedocConfigGenerator - Generate TypeDoc typedoc.json configuration files.
 */
export default function TypedocConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entryPoints, setEntryPoints] = useState('./src');
  const [outDir, setOutDir] = useState('./docs');
  const [name, setName] = useState('My Project');
  const [theme, setTheme] = useState('default');
  const [excludePrivate, setExcludePrivate] = useState(true);
  const [excludeProtected, setExcludeProtected] = useState(false);
  const [excludeInternal, setExcludeInternal] = useState(true);
  const [includeVersion, setIncludeVersion] = useState(false);
  const [readme, setReadme] = useState('README.md');
  const [plugin, setPlugin] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const config: Record<string, unknown> = {
      entryPoints: entryPoints.split(',').map((e) => e.trim()),
      out: outDir,
      name,
      theme,
      excludePrivate,
      excludeProtected,
      excludeInternal,
      includeVersion,
    };

    if (readme) config.readme = readme;
    if (plugin.trim()) config.plugin = plugin.split(',').map((p) => p.trim());

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-entry`} className="block text-sm font-medium text-gray-700 mb-1">Entry Points (comma-separated)</label>
            <input id={`${toolId}-entry`} type="text" value={entryPoints} onChange={(e) => setEntryPoints(e.target.value)} className="input-field" aria-label={`Entry points for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-out`} className="block text-sm font-medium text-gray-700 mb-1">Output Directory</label>
            <input id={`${toolId}-out`} type="text" value={outDir} onChange={(e) => setOutDir(e.target.value)} className="input-field" aria-label="Output directory" />
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" aria-label="Project name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label="TypeDoc theme">
              <option value="default">default</option>
              <option value="minimal">minimal</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-readme`} className="block text-sm font-medium text-gray-700 mb-1">README Path</label>
            <input id={`${toolId}-readme`} type="text" value={readme} onChange={(e) => setReadme(e.target.value)} className="input-field" aria-label="README file path" />
          </div>
          <div>
            <label htmlFor={`${toolId}-plugin`} className="block text-sm font-medium text-gray-700 mb-1">Plugins (comma-separated)</label>
            <input id={`${toolId}-plugin`} type="text" value={plugin} onChange={(e) => setPlugin(e.target.value)} className="input-field" aria-label="TypeDoc plugins" placeholder="e.g. typedoc-plugin-markdown" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={excludePrivate} onChange={(e) => setExcludePrivate(e.target.checked)} className="rounded" />
            Exclude Private
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={excludeProtected} onChange={(e) => setExcludeProtected(e.target.checked)} className="rounded" />
            Exclude Protected
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={excludeInternal} onChange={(e) => setExcludeInternal(e.target.checked)} className="rounded" />
            Exclude Internal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeVersion} onChange={(e) => setIncludeVersion(e.target.checked)} className="rounded" />
            Include Version
          </label>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate typedoc.json</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated typedoc.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
