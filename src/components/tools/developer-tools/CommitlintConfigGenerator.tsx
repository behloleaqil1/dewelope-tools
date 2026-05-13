'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CommitlintConfigGenerator - Generate commitlint.config.js for conventional commits.
 * Allows users to configure commit types, scopes, and rules for commitlint.
 */
export default function CommitlintConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [types, setTypes] = useState('feat,fix,docs,style,refactor,perf,test,build,ci,chore,revert');
  const [scopes, setScopes] = useState('');
  const [maxHeaderLength, setMaxHeaderLength] = useState('100');
  const [maxBodyLineLength, setMaxBodyLineLength] = useState('100');
  const [enforceScope, setEnforceScope] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const typeList = types.split(',').map(t => t.trim()).filter(Boolean);
    const scopeList = scopes ? scopes.split(',').map(s => s.trim()).filter(Boolean) : [];

    const config: string[] = [];
    config.push('module.exports = {');
    config.push("  extends: ['@commitlint/config-conventional'],");
    config.push('  rules: {');
    config.push(`    'header-max-length': [2, 'always', ${parseInt(maxHeaderLength) || 100}],`);
    config.push(`    'body-max-line-length': [2, 'always', ${parseInt(maxBodyLineLength) || 100}],`);
    config.push(`    'type-enum': [2, 'always', [${typeList.map(t => `'${t}'`).join(', ')}]],`);
    if (scopeList.length > 0) {
      config.push(`    'scope-enum': [2, 'always', [${scopeList.map(s => `'${s}'`).join(', ')}]],`);
    }
    config.push(`    'scope-empty': [${enforceScope ? '2' : '0'}, '${enforceScope ? 'never' : 'always'}'],`);
    config.push(`    'subject-empty': [2, 'never'],`);
    config.push(`    'type-empty': [2, 'never'],`);
    config.push('  },');
    config.push('};');

    setOutput(config.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-types`} className="block text-sm font-medium text-gray-700 mb-1">
              Commit Types (comma-separated)
            </label>
            <input
              id={`${toolId}-types`}
              type="text"
              value={types}
              onChange={(e) => setTypes(e.target.value)}
              aria-label={`Commit types for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-scopes`} className="block text-sm font-medium text-gray-700 mb-1">
              Scopes (comma-separated, optional)
            </label>
            <input
              id={`${toolId}-scopes`}
              type="text"
              value={scopes}
              onChange={(e) => setScopes(e.target.value)}
              placeholder="e.g. core,ui,api,docs"
              aria-label={`Commit scopes for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-header`} className="block text-sm font-medium text-gray-700 mb-1">
                Max Header Length
              </label>
              <input
                id={`${toolId}-header`}
                type="number"
                value={maxHeaderLength}
                onChange={(e) => setMaxHeaderLength(e.target.value)}
                aria-label="Max header length"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">
                Max Body Line Length
              </label>
              <input
                id={`${toolId}-body`}
                type="number"
                value={maxBodyLineLength}
                onChange={(e) => setMaxBodyLineLength(e.target.value)}
                aria-label="Max body line length"
                className="input-field"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id={`${toolId}-enforce-scope`}
              type="checkbox"
              checked={enforceScope}
              onChange={(e) => setEnforceScope(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor={`${toolId}-enforce-scope`} className="text-sm text-gray-700">
              Require scope in commits
            </label>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Config
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">commitlint.config.js</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
