'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PackageJsonGenerator - Generate package.json from form inputs (name, version, deps).
 * Creates a valid package.json structure with configurable fields.
 */
export default function PackageJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('');
  const [main, setMain] = useState('index.js');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [keywords, setKeywords] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [devDependencies, setDevDependencies] = useState('');
  const [scripts, setScripts] = useState('start: node index.js\ntest: echo "Error: no test specified" && exit 1');
  const [isPrivate, setIsPrivate] = useState(false);

  const parseDeps = (input: string): Record<string, string> => {
    const result: Record<string, string> = {};
    input.split('\n').filter(Boolean).forEach((line) => {
      const parts = line.split(/[@:]\s*/);
      if (parts.length >= 2) {
        const pkg = parts[0].trim();
        const ver = parts[parts.length - 1].trim() || '*';
        if (pkg) result[pkg] = ver.startsWith('^') || ver.startsWith('~') || ver === '*' ? ver : `^${ver}`;
      } else if (parts[0].trim()) {
        result[parts[0].trim()] = '*';
      }
    });
    return result;
  };

  const parseScripts = (input: string): Record<string, string> => {
    const result: Record<string, string> = {};
    input.split('\n').filter(Boolean).forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key && val) result[key] = val;
      }
    });
    return result;
  };

  const generatePackageJson = () => {
    const pkg: Record<string, unknown> = {};
    if (name.trim()) pkg.name = name.trim();
    pkg.version = version || '1.0.0';
    if (description.trim()) pkg.description = description.trim();
    if (main.trim()) pkg.main = main.trim();
    if (isPrivate) pkg.private = true;

    const parsedScripts = parseScripts(scripts);
    if (Object.keys(parsedScripts).length > 0) pkg.scripts = parsedScripts;

    if (keywords.trim()) {
      pkg.keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }
    if (author.trim()) pkg.author = author.trim();
    if (license.trim()) pkg.license = license.trim();

    const deps = parseDeps(dependencies);
    if (Object.keys(deps).length > 0) pkg.dependencies = deps;

    const devDeps = parseDeps(devDependencies);
    if (Object.keys(devDeps).length > 0) pkg.devDependencies = devDeps;

    return JSON.stringify(pkg, null, 2);
  };

  const output = generatePackageJson();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Package Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-package"
              aria-label={`Package name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id={`${toolId}-version`}
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              aria-label={`Version for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id={`${toolId}-desc`}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your package"
              aria-label={`Description for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-main`} className="block text-sm font-medium text-gray-700 mb-1">
              Main Entry
            </label>
            <input
              id={`${toolId}-main`}
              type="text"
              value={main}
              onChange={(e) => setMain(e.target.value)}
              placeholder="index.js"
              aria-label={`Main entry for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              id={`${toolId}-author`}
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your Name"
              aria-label={`Author for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-license`} className="block text-sm font-medium text-gray-700 mb-1">
              License
            </label>
            <select
              id={`${toolId}-license`}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              aria-label={`License for ${toolName}`}
              className="input-field"
            >
              <option value="MIT">MIT</option>
              <option value="ISC">ISC</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="BSD-2-Clause">BSD 2-Clause</option>
              <option value="BSD-3-Clause">BSD 3-Clause</option>
              <option value="UNLICENSED">UNLICENSED</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-keywords`} className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              id={`${toolId}-keywords`}
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="tool, utility, helper"
              aria-label={`Keywords for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              id={`${toolId}-private`}
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              aria-label={`Private package for ${toolName}`}
              className="w-4 h-4"
            />
            <label htmlFor={`${toolId}-private`} className="text-sm font-medium text-gray-700">
              Private package
            </label>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-scripts`} className="block text-sm font-medium text-gray-700 mb-1">
              Scripts (name: command, one per line)
            </label>
            <textarea
              id={`${toolId}-scripts`}
              value={scripts}
              onChange={(e) => setScripts(e.target.value)}
              placeholder="start: node index.js&#10;test: jest"
              aria-label={`Scripts for ${toolName}`}
              className="input-field h-20 resize-y font-mono text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dependencies (name@version, one per line)
            </label>
            <textarea
              id={`${toolId}-deps`}
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="express@4.18.2&#10;lodash@4.17.21"
              aria-label={`Dependencies for ${toolName}`}
              className="input-field h-24 resize-y font-mono text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-devdeps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dev Dependencies (name@version, one per line)
            </label>
            <textarea
              id={`${toolId}-devdeps`}
              value={devDependencies}
              onChange={(e) => setDevDependencies(e.target.value)}
              placeholder="typescript@5.0.0&#10;jest@29.0.0"
              aria-label={`Dev dependencies for ${toolName}`}
              className="input-field h-24 resize-y font-mono text-sm"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Generated package.json</label>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
          <CopyToClipboard text={output} />
        </div>
      </OutputArea>
    </div>
  );
}
