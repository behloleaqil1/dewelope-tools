'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CargoTomlGenerator - Generate Rust Cargo.toml from project settings.
 * Allows users to configure package name, version, edition, dependencies, and features.
 */
export default function CargoTomlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('0.1.0');
  const [edition, setEdition] = useState('2021');
  const [authors, setAuthors] = useState('');
  const [description, setDescription] = useState('');
  const [license, setLicense] = useState('MIT');
  const [dependencies, setDependencies] = useState('');
  const [devDependencies, setDevDependencies] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('');
      return;
    }

    let toml = `[package]\nname = "${packageName.trim()}"\nversion = "${version.trim()}"\nedition = "${edition}"`;

    if (authors.trim()) {
      const authorList = authors.split(',').map(a => `"${a.trim()}"`).join(', ');
      toml += `\nauthors = [${authorList}]`;
    }

    if (description.trim()) {
      toml += `\ndescription = "${description.trim()}"`;
    }

    if (license.trim()) {
      toml += `\nlicense = "${license.trim()}"`;
    }

    if (dependencies.trim()) {
      toml += '\n\n[dependencies]';
      dependencies.split('\n').filter(l => l.trim()).forEach(line => {
        const parts = line.split('=').map(p => p.trim());
        if (parts.length === 2) {
          toml += `\n${parts[0]} = "${parts[1]}"`;
        } else if (parts.length === 1 && parts[0]) {
          toml += `\n${parts[0]} = "*"`;
        }
      });
    }

    if (devDependencies.trim()) {
      toml += '\n\n[dev-dependencies]';
      devDependencies.split('\n').filter(l => l.trim()).forEach(line => {
        const parts = line.split('=').map(p => p.trim());
        if (parts.length === 2) {
          toml += `\n${parts[0]} = "${parts[1]}"`;
        } else if (parts.length === 1 && parts[0]) {
          toml += `\n${parts[0]} = "*"`;
        }
      });
    }

    toml += '\n';
    setOutput(toml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="my-project" aria-label={`Package name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="0.1.0" aria-label="Package version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-edition`} className="block text-sm font-medium text-gray-700 mb-1">Edition</label>
            <select id={`${toolId}-edition`} value={edition} onChange={(e) => setEdition(e.target.value)} aria-label="Rust edition" className="input-field">
              <option value="2021">2021</option>
              <option value="2024">2024</option>
              <option value="2018">2018</option>
              <option value="2015">2015</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="MIT" aria-label="License" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-authors`} className="block text-sm font-medium text-gray-700 mb-1">Authors (comma-separated)</label>
            <input id={`${toolId}-authors`} type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Your Name <email@example.com>" aria-label="Authors" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the project" aria-label="Description" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line: name = version)</label>
            <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="serde = 1.0&#10;tokio = 1" aria-label="Dependencies" className="input-field h-24 resize-y font-mono" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-devdeps`} className="block text-sm font-medium text-gray-700 mb-1">Dev Dependencies (one per line: name = version)</label>
            <textarea id={`${toolId}-devdeps`} value={devDependencies} onChange={(e) => setDevDependencies(e.target.value)} placeholder="criterion = 0.5" aria-label="Dev dependencies" className="input-field h-20 resize-y font-mono" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Generate Cargo.toml</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Cargo.toml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
