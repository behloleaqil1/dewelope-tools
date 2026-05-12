'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpagoDhallGenerator - Generate PureScript Spago spago.dhall configuration file.
 * Creates a valid spago.dhall with package name, dependencies, and sources.
 */
export default function SpagoDhallGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [dependencies, setDependencies] = useState('prelude, effect, console');
  const [sources, setSources] = useState('src/**/*.purs, test/**/*.purs');
  const [packageSet, setPackageSet] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('');
      return;
    }

    const deps = dependencies.split(',').map(d => d.trim()).filter(Boolean);
    const srcs = sources.split(',').map(s => `"${s.trim()}"`).filter(Boolean);

    const lines: string[] = [];
    lines.push(`{ name = "${packageName.trim()}"`);
    lines.push(`, dependencies =`);
    lines.push(`    [ ${deps.map(d => `"${d}"`).join('\n    , ')}`);
    lines.push(`    ]`);
    lines.push(`, packages = ./packages.dhall`);
    lines.push(`, sources = [ ${srcs.join(', ')} ]`);
    if (packageSet.trim()) {
      lines.push(`, backend = "${packageSet.trim()}"`);
    }
    lines.push(`}`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="my-purescript-app" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
            <input id={`${toolId}-deps`} type="text" value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="prelude, effect, console, aff" className="input-field" aria-label="Dependencies" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sources`} className="block text-sm font-medium text-gray-700 mb-1">Sources (comma-separated globs)</label>
            <input id={`${toolId}-sources`} type="text" value={sources} onChange={(e) => setSources(e.target.value)} placeholder="src/**/*.purs, test/**/*.purs" className="input-field" aria-label="Source globs" />
          </div>
          <div>
            <label htmlFor={`${toolId}-backend`} className="block text-sm font-medium text-gray-700 mb-1">Backend (optional)</label>
            <input id={`${toolId}-backend`} type="text" value={packageSet} onChange={(e) => setPackageSet(e.target.value)} placeholder="purs-backend-es" className="input-field" aria-label="Backend" />
          </div>
          <button onClick={generate} className="btn-primary">Generate spago.dhall</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">spago.dhall</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
