'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpamFileGenerator - Generate OCaml opam package file from user inputs.
 */
export default function OpamFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [synopsis, setSynopsis] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [license, setLicense] = useState('MIT');
  const [homepage, setHomepage] = useState('');
  const [bugReports, setBugReports] = useState('');
  const [depends, setDepends] = useState('ocaml >= 4.14.0\ndune >= 3.0');
  const [buildCmd, setBuildCmd] = useState('dune build -p %{name}% -j %{jobs}%');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push(`opam-version: "2.0"`);
    if (packageName) lines.push(`name: "${packageName}"`);
    lines.push(`version: "${version}"`);
    if (synopsis) lines.push(`synopsis: "${synopsis}"`);
    if (description) {
      lines.push(`description: """`);
      lines.push(description);
      lines.push(`"""`);
    }
    if (authors) {
      const authorList = authors.split(',').map(a => `"${a.trim()}"`).join(' ');
      lines.push(`authors: [${authorList}]`);
    }
    lines.push(`license: "${license}"`);
    if (homepage) lines.push(`homepage: "${homepage}"`);
    if (bugReports) lines.push(`bug-reports: "${bugReports}"`);
    if (depends) {
      lines.push(`depends: [`);
      depends.split('\n').filter(d => d.trim()).forEach(dep => {
        const parts = dep.trim().split(/\s+/);
        if (parts.length > 1) {
          lines.push(`  "${parts[0]}" {${parts.slice(1).join(' ')}}`);
        } else {
          lines.push(`  "${parts[0]}"`);
        }
      });
      lines.push(`]`);
    }
    if (buildCmd) {
      const cmds = buildCmd.split('\n').filter(c => c.trim());
      lines.push(`build: [`);
      cmds.forEach(cmd => {
        const parts = cmd.trim().split(/\s+/).map(p => `"${p}"`).join(' ');
        lines.push(`  [${parts}]`);
      });
      lines.push(`]`);
    }
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="my-package" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" aria-label="Package version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-synopsis`} className="block text-sm font-medium text-gray-700 mb-1">Synopsis</label>
            <input id={`${toolId}-synopsis`} type="text" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="A short description" aria-label="Package synopsis" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="MIT" aria-label="Package license" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-authors`} className="block text-sm font-medium text-gray-700 mb-1">Authors (comma-separated)</label>
            <input id={`${toolId}-authors`} type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Author Name" aria-label="Package authors" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-homepage`} className="block text-sm font-medium text-gray-700 mb-1">Homepage URL</label>
            <input id={`${toolId}-homepage`} type="text" value={homepage} onChange={(e) => setHomepage(e.target.value)} placeholder="https://github.com/user/repo" aria-label="Homepage URL" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bugs`} className="block text-sm font-medium text-gray-700 mb-1">Bug Reports URL</label>
            <input id={`${toolId}-bugs`} type="text" value={bugReports} onChange={(e) => setBugReports(e.target.value)} placeholder="https://github.com/user/repo/issues" aria-label="Bug reports URL" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A longer description of the package..." aria-label="Package description" className="input-field h-20 resize-y" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-depends`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line, e.g. ocaml &gt;= 4.14.0)</label>
          <textarea id={`${toolId}-depends`} value={depends} onChange={(e) => setDepends(e.target.value)} placeholder="ocaml >= 4.14.0" aria-label="Package dependencies" className="input-field h-24 resize-y font-mono" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-build`} className="block text-sm font-medium text-gray-700 mb-1">Build Commands (one per line)</label>
          <textarea id={`${toolId}-build`} value={buildCmd} onChange={(e) => setBuildCmd(e.target.value)} placeholder="dune build -p %{name}% -j %{jobs}%" aria-label="Build commands" className="input-field h-20 resize-y font-mono" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate opam File</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated opam File</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
