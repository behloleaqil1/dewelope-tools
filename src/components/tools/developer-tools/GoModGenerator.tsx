'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GoModGenerator - Generate Go go.mod file from module settings.
 * Allows users to configure module path, Go version, and dependencies.
 */
export default function GoModGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [modulePath, setModulePath] = useState('');
  const [goVersion, setGoVersion] = useState('1.22');
  const [dependencies, setDependencies] = useState('');
  const [indirectDeps, setIndirectDeps] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!modulePath.trim()) {
      setOutput('');
      return;
    }

    let mod = `module ${modulePath.trim()}\n\ngo ${goVersion.trim()}\n`;

    const directLines = dependencies.split('\n').filter(l => l.trim());
    const indirectLines = indirectDeps.split('\n').filter(l => l.trim());

    if (directLines.length > 0 || indirectLines.length > 0) {
      mod += '\nrequire (\n';
      directLines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          mod += `\t${parts[0]} ${parts[1]}\n`;
        } else if (parts.length === 1 && parts[0]) {
          mod += `\t${parts[0]} v0.0.0\n`;
        }
      });
      indirectLines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          mod += `\t${parts[0]} ${parts[1]} // indirect\n`;
        } else if (parts.length === 1 && parts[0]) {
          mod += `\t${parts[0]} v0.0.0 // indirect\n`;
        }
      });
      mod += ')\n';
    }

    setOutput(mod);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-module`} className="block text-sm font-medium text-gray-700 mb-1">Module Path *</label>
            <input id={`${toolId}-module`} type="text" value={modulePath} onChange={(e) => setModulePath(e.target.value)} placeholder="github.com/username/project" aria-label={`Module path for ${toolName}`} className="input-field font-mono" />
          </div>
          <div>
            <label htmlFor={`${toolId}-goversion`} className="block text-sm font-medium text-gray-700 mb-1">Go Version</label>
            <select id={`${toolId}-goversion`} value={goVersion} onChange={(e) => setGoVersion(e.target.value)} aria-label="Go version" className="input-field">
              <option value="1.23">1.23</option>
              <option value="1.22">1.22</option>
              <option value="1.21">1.21</option>
              <option value="1.20">1.20</option>
              <option value="1.19">1.19</option>
              <option value="1.18">1.18</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line: module version)</label>
            <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="github.com/gin-gonic/gin v1.9.1&#10;github.com/go-sql-driver/mysql v1.7.1" aria-label="Direct dependencies" className="input-field h-24 resize-y font-mono" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-indirect`} className="block text-sm font-medium text-gray-700 mb-1">Indirect Dependencies (one per line: module version)</label>
            <textarea id={`${toolId}-indirect`} value={indirectDeps} onChange={(e) => setIndirectDeps(e.target.value)} placeholder="golang.org/x/sys v0.15.0" aria-label="Indirect dependencies" className="input-field h-20 resize-y font-mono" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Generate go.mod</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated go.mod</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
