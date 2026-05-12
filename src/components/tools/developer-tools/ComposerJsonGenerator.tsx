'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ComposerJsonGenerator - Generate PHP Composer composer.json configuration files.
 * Configure package name, description, type, license, authors, and dependencies.
 */
export default function ComposerJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('vendor/package');
  const [description, setDescription] = useState('');
  const [packageType, setPackageType] = useState('library');
  const [license, setLicense] = useState('MIT');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [phpVersion, setPhpVersion] = useState('>=8.1');
  const [dependencies, setDependencies] = useState('');
  const [devDependencies, setDevDependencies] = useState('');
  const [autoloadNamespace, setAutoloadNamespace] = useState('');
  const [autoloadPath, setAutoloadPath] = useState('src/');
  const [output, setOutput] = useState('');

  const generate = () => {
    const composerObj: Record<string, unknown> = {
      name: packageName,
      description: description || 'A PHP package',
      type: packageType,
      license: license,
    };

    if (authorName || authorEmail) {
      const author: Record<string, string> = {};
      if (authorName) author.name = authorName;
      if (authorEmail) author.email = authorEmail;
      composerObj.authors = [author];
    }

    const require: Record<string, string> = { php: phpVersion };
    if (dependencies.trim()) {
      dependencies.trim().split('\n').forEach(line => {
        const parts = line.trim().split(/[=:@\s]+/);
        if (parts.length >= 2) {
          require[parts[0]] = parts.slice(1).join('');
        } else if (parts[0]) {
          require[parts[0]] = '*';
        }
      });
    }
    composerObj.require = require;

    if (devDependencies.trim()) {
      const requireDev: Record<string, string> = {};
      devDependencies.trim().split('\n').forEach(line => {
        const parts = line.trim().split(/[=:@\s]+/);
        if (parts.length >= 2) {
          requireDev[parts[0]] = parts.slice(1).join('');
        } else if (parts[0]) {
          requireDev[parts[0]] = '*';
        }
      });
      composerObj['require-dev'] = requireDev;
    }

    if (autoloadNamespace) {
      composerObj.autoload = {
        'psr-4': {
          [`${autoloadNamespace}\\`]: autoloadPath,
        },
      };
    }

    composerObj.config = { 'sort-packages': true };

    setOutput(JSON.stringify(composerObj, null, 4));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} className="input-field" aria-label={`Package name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id={`${toolId}-type`} value={packageType} onChange={(e) => setPackageType(e.target.value)} className="input-field" aria-label="Package type">
              <option value="library">library</option>
              <option value="project">project</option>
              <option value="metapackage">metapackage</option>
              <option value="composer-plugin">composer-plugin</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">License</label>
            <input id={`${toolId}-license`} type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="input-field" aria-label="License" />
          </div>
          <div>
            <label htmlFor={`${toolId}-php`} className="block text-sm font-medium text-gray-700 mb-1">PHP Version</label>
            <input id={`${toolId}-php`} type="text" value={phpVersion} onChange={(e) => setPhpVersion(e.target.value)} className="input-field" aria-label="PHP version constraint" />
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input id={`${toolId}-author`} type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="input-field" aria-label="Author name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-email`} className="block text-sm font-medium text-gray-700 mb-1">Author Email</label>
            <input id={`${toolId}-email`} type="text" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} className="input-field" aria-label="Author email" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Autoload Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={autoloadNamespace} onChange={(e) => setAutoloadNamespace(e.target.value)} placeholder="App" className="input-field" aria-label="PSR-4 namespace" />
          </div>
          <div>
            <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Autoload Path</label>
            <input id={`${toolId}-path`} type="text" value={autoloadPath} onChange={(e) => setAutoloadPath(e.target.value)} className="input-field" aria-label="Autoload path" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of the package" className="input-field" aria-label="Package description" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line: name version)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="laravel/framework ^10.0&#10;guzzlehttp/guzzle ^7.0" className="input-field h-24 resize-y font-mono" aria-label="Dependencies" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-devdeps`} className="block text-sm font-medium text-gray-700 mb-1">Dev Dependencies (one per line: name version)</label>
          <textarea id={`${toolId}-devdeps`} value={devDependencies} onChange={(e) => setDevDependencies(e.target.value)} placeholder="phpunit/phpunit ^10.0" className="input-field h-24 resize-y font-mono" aria-label="Dev dependencies" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate composer.json</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">composer.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
