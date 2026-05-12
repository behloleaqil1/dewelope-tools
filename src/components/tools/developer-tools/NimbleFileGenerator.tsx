'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NimbleFileGenerator - Generate Nim Nimble .nimble package file.
 * Creates a valid .nimble file with package metadata for Nim projects.
 */
export default function NimbleFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('0.1.0');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [license, setLicense] = useState('MIT');
  const [srcDir, setSrcDir] = useState('src');
  const [bin, setBin] = useState('');
  const [requires, setRequires] = useState('nim >= 1.6.0');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('');
      return;
    }

    const lines: string[] = [];
    lines.push(`# Package`);
    lines.push(``);
    lines.push(`version       = "${version}"`);
    lines.push(`author        = "${author}"`);
    lines.push(`description   = "${description}"`);
    lines.push(`license       = "${license}"`);
    lines.push(`srcDir        = "${srcDir}"`);
    if (bin.trim()) {
      lines.push(`bin           = @["${bin.trim()}"]`);
    }
    lines.push(``);
    lines.push(``);
    lines.push(`# Dependencies`);
    lines.push(``);
    const deps = requires.split(',').map(d => d.trim()).filter(Boolean);
    deps.forEach(dep => {
      lines.push(`requires "${dep}"`);
    });

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="mypackage" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Package version" />
            </div>
            <div>
              <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
              <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="input-field" aria-label="License" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input id={`${toolId}-author`} type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" className="input-field" aria-label="Author name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description" className="input-field" aria-label="Package description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-srcdir`} className="block text-sm font-medium text-gray-700 mb-1">Source Directory</label>
              <input id={`${toolId}-srcdir`} type="text" value={srcDir} onChange={(e) => setSrcDir(e.target.value)} className="input-field" aria-label="Source directory" />
            </div>
            <div>
              <label htmlFor={`${toolId}-bin`} className="block text-sm font-medium text-gray-700 mb-1">Binary Name (optional)</label>
              <input id={`${toolId}-bin`} type="text" value={bin} onChange={(e) => setBin(e.target.value)} placeholder="myapp" className="input-field" aria-label="Binary name" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-requires`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
            <input id={`${toolId}-requires`} type="text" value={requires} onChange={(e) => setRequires(e.target.value)} placeholder="nim >= 1.6.0, jester >= 0.5.0" className="input-field" aria-label="Dependencies" />
          </div>
          <button onClick={generate} className="btn-primary">Generate .nimble File</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{packageName}.nimble</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
