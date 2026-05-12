'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PipenvGenerator - Generate Pipfile from a package list.
 * Allows users to specify Python version, packages, dev packages, and source URL.
 */
export default function PipenvGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pythonVersion, setPythonVersion] = useState('3.11');
  const [packages, setPackages] = useState('');
  const [devPackages, setDevPackages] = useState('');
  const [sourceUrl, setSourceUrl] = useState('https://pypi.org/simple');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];

    lines.push('[[source]]');
    lines.push(`url = "${sourceUrl.trim()}"`);
    lines.push('verify_ssl = true');
    lines.push('name = "pypi"');
    lines.push('');

    lines.push('[packages]');
    if (packages.trim()) {
      packages.trim().split('\n').forEach(pkg => {
        const trimmed = pkg.trim();
        if (!trimmed) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const name = trimmed.substring(0, eqIdx).trim();
          const ver = trimmed.substring(eqIdx + 1).trim();
          lines.push(`${name} = "${ver}"`);
        } else {
          lines.push(`${trimmed} = "*"`);
        }
      });
    }
    lines.push('');

    lines.push('[dev-packages]');
    if (devPackages.trim()) {
      devPackages.trim().split('\n').forEach(pkg => {
        const trimmed = pkg.trim();
        if (!trimmed) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const name = trimmed.substring(0, eqIdx).trim();
          const ver = trimmed.substring(eqIdx + 1).trim();
          lines.push(`${name} = "${ver}"`);
        } else {
          lines.push(`${trimmed} = "*"`);
        }
      });
    }
    lines.push('');

    lines.push('[requires]');
    lines.push(`python_version = "${pythonVersion.trim()}"`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-python`} className="block text-sm font-medium text-gray-700 mb-1">Python Version</label>
            <input id={`${toolId}-python`} type="text" value={pythonVersion} onChange={(e) => setPythonVersion(e.target.value)} placeholder="3.11" aria-label={`Python version for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
            <input id={`${toolId}-source`} type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://pypi.org/simple" aria-label="PyPI source URL" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-packages`} className="block text-sm font-medium text-gray-700 mb-1">Packages (one per line, optionally: name=version)</label>
          <textarea id={`${toolId}-packages`} value={packages} onChange={(e) => setPackages(e.target.value)} placeholder={'requests=~=2.28\nflask\nnumpy'} aria-label="Packages list" className="input-field h-28 resize-y font-mono" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-devpkgs`} className="block text-sm font-medium text-gray-700 mb-1">Dev Packages (one per line)</label>
          <textarea id={`${toolId}-devpkgs`} value={devPackages} onChange={(e) => setDevPackages(e.target.value)} placeholder={'pytest\nflake8\nmypy'} aria-label="Dev packages list" className="input-field h-24 resize-y font-mono" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Pipfile</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Pipfile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
