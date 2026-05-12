'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PoetryTomlGenerator - Generate Python Poetry pyproject.toml configuration files.
 * Allows users to configure package name, version, description, authors, dependencies,
 * and dev-dependencies, then outputs a properly formatted pyproject.toml.
 */
export default function PoetryTomlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('0.1.0');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [pythonVersion, setPythonVersion] = useState('^3.9');
  const [dependencies, setDependencies] = useState('');
  const [devDependencies, setDevDependencies] = useState('');
  const [license, setLicense] = useState('MIT');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('');
      return;
    }

    const lines: string[] = [];
    lines.push('[tool.poetry]');
    lines.push(`name = "${packageName.trim()}"`);
    lines.push(`version = "${version.trim()}"`);
    lines.push(`description = "${description.trim()}"`);

    if (authors.trim()) {
      const authorList = authors.split(',').map(a => `"${a.trim()}"`).join(', ');
      lines.push(`authors = [${authorList}]`);
    } else {
      lines.push('authors = []');
    }

    if (license.trim()) {
      lines.push(`license = "${license.trim()}"`);
    }

    lines.push('');
    lines.push('[tool.poetry.dependencies]');
    lines.push(`python = "${pythonVersion.trim()}"`);

    if (dependencies.trim()) {
      dependencies.trim().split('\n').forEach(dep => {
        const parts = dep.trim().split(/[=~^]/);
        if (parts.length >= 1 && parts[0].trim()) {
          const name = parts[0].trim();
          const ver = dep.replace(name, '').trim() || '"*"';
          lines.push(`${name} = ${ver.startsWith('"') ? ver : `"${ver}"`}`);
        }
      });
    }

    lines.push('');
    lines.push('[tool.poetry.dev-dependencies]');
    if (devDependencies.trim()) {
      devDependencies.trim().split('\n').forEach(dep => {
        const parts = dep.trim().split(/[=~^]/);
        if (parts.length >= 1 && parts[0].trim()) {
          const name = parts[0].trim();
          const ver = dep.replace(name, '').trim() || '"*"';
          lines.push(`${name} = ${ver.startsWith('"') ? ver : `"${ver}"`}`);
        }
      });
    }

    lines.push('');
    lines.push('[build-system]');
    lines.push('requires = ["poetry-core"]');
    lines.push('build-backend = "poetry.core.masonry.api"');

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
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="0.1.0" aria-label="Package version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-python`} className="block text-sm font-medium text-gray-700 mb-1">Python Version</label>
            <input id={`${toolId}-python`} type="text" value={pythonVersion} onChange={(e) => setPythonVersion(e.target.value)} placeholder="^3.9" aria-label="Python version constraint" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="MIT" aria-label="License" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of the package" aria-label="Package description" className="input-field" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-authors`} className="block text-sm font-medium text-gray-700 mb-1">Authors (comma-separated)</label>
          <input id={`${toolId}-authors`} type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder='Author Name <email@example.com>' aria-label="Authors" className="input-field" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line: name = &quot;version&quot;)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder={'requests = "^2.28"\nfastapi = "^0.100"'} aria-label="Dependencies" className="input-field h-24 resize-y font-mono" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-devdeps`} className="block text-sm font-medium text-gray-700 mb-1">Dev Dependencies (one per line)</label>
          <textarea id={`${toolId}-devdeps`} value={devDependencies} onChange={(e) => setDevDependencies(e.target.value)} placeholder={'pytest = "^7.0"\nblack = "^23.0"'} aria-label="Dev dependencies" className="input-field h-24 resize-y font-mono" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate pyproject.toml</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated pyproject.toml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
