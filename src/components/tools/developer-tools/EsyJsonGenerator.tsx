'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EsyJsonGenerator - Generate ReasonML/OCaml esy.json package configuration.
 */
export default function EsyJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('0.1.0');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [ocamlVersion, setOcamlVersion] = useState('~4.14.0');
  const [useDune, setUseDune] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('Error: Package name is required.');
      return;
    }

    const config: Record<string, unknown> = {
      name: packageName.trim(),
      version: version.trim() || '0.1.0',
      description: description.trim(),
      author: author.trim(),
      license: license.trim(),
      esy: {
        build: useDune ? 'dune build -p #{self.name}' : 'ocamlfind ocamlopt -package #{self.name} -linkpkg main.ml -o main',
        install: useDune ? 'esy-installer' : undefined,
        buildDev: useDune ? 'dune build @all' : undefined,
      },
      dependencies: {
        'ocaml': ocamlVersion.trim(),
        '@opam/dune': useDune ? '>=3.0' : undefined,
      },
      devDependencies: {
        '@opam/merlin': '*',
        '@opam/ocaml-lsp-server': '*',
      },
    };

    if (!useDune) {
      delete (config.esy as Record<string, unknown>).install;
      delete (config.esy as Record<string, unknown>).buildDev;
      delete (config.dependencies as Record<string, unknown>)['@opam/dune'];
    }

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="my-reason-app" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="0.1.0" aria-label="Package version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A ReasonML/OCaml project" aria-label="Package description" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input id={`${toolId}-author`} type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" aria-label="Package author" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="MIT" aria-label="Package license" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ocaml`} className="block text-sm font-medium text-gray-700 mb-1">OCaml Version</label>
            <input id={`${toolId}-ocaml`} type="text" value={ocamlVersion} onChange={(e) => setOcamlVersion(e.target.value)} placeholder="~4.14.0" aria-label="OCaml version constraint" className="input-field" />
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-dune`} type="checkbox" checked={useDune} onChange={(e) => setUseDune(e.target.checked)} aria-label="Use Dune build system" className="rounded" />
            <label htmlFor={`${toolId}-dune`} className="text-sm font-medium text-gray-700">Use Dune build system</label>
          </div>
          <button onClick={generate} className="btn-primary">Generate esy.json</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated esy.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
