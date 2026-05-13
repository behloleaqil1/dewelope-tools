'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PreCommitConfigGenerator - Generate .pre-commit-config.yaml files
 * with common hooks for linting, formatting, and code quality.
 */
export default function PreCommitConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hooks, setHooks] = useState<string[]>(['trailing-whitespace', 'end-of-file-fixer', 'check-yaml']);
  const [output, setOutput] = useState('');

  const availableHooks: { id: string; repo: string; rev: string; hookId: string; name: string }[] = [
    { id: 'trailing-whitespace', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'trailing-whitespace', name: 'Trailing Whitespace' },
    { id: 'end-of-file-fixer', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'end-of-file-fixer', name: 'End of File Fixer' },
    { id: 'check-yaml', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'check-yaml', name: 'Check YAML' },
    { id: 'check-json', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'check-json', name: 'Check JSON' },
    { id: 'check-merge-conflict', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'check-merge-conflict', name: 'Check Merge Conflict' },
    { id: 'detect-private-key', repo: 'https://github.com/pre-commit/pre-commit-hooks', rev: 'v4.5.0', hookId: 'detect-private-key', name: 'Detect Private Key' },
    { id: 'black', repo: 'https://github.com/psf/black', rev: '24.3.0', hookId: 'black', name: 'Black (Python)' },
    { id: 'flake8', repo: 'https://github.com/PyCQA/flake8', rev: '7.0.0', hookId: 'flake8', name: 'Flake8 (Python)' },
    { id: 'eslint', repo: 'https://github.com/pre-commit/mirrors-eslint', rev: 'v8.56.0', hookId: 'eslint', name: 'ESLint (JS/TS)' },
    { id: 'prettier', repo: 'https://github.com/pre-commit/mirrors-prettier', rev: 'v4.0.0-alpha.8', hookId: 'prettier', name: 'Prettier' },
  ];

  const toggleHook = (id: string) => {
    setHooks(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
  };

  const generate = () => {
    const repoMap: Record<string, { repo: string; rev: string; hooks: string[] }> = {};
    hooks.forEach(hookId => {
      const hook = availableHooks.find(h => h.id === hookId);
      if (hook) {
        const key = hook.repo;
        if (!repoMap[key]) {
          repoMap[key] = { repo: hook.repo, rev: hook.rev, hooks: [] };
        }
        repoMap[key].hooks.push(hook.hookId);
      }
    });

    let yaml = 'repos:\n';
    Object.values(repoMap).forEach(entry => {
      yaml += `  - repo: ${entry.repo}\n`;
      yaml += `    rev: ${entry.rev}\n`;
      yaml += `    hooks:\n`;
      entry.hooks.forEach(h => {
        yaml += `      - id: ${h}\n`;
      });
    });

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select hooks for {toolName}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableHooks.map(hook => (
            <label key={hook.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hooks.includes(hook.id)}
                onChange={() => toggleHook(hook.id)}
                aria-label={`Toggle ${hook.name} hook`}
              />
              {hook.name}
            </label>
          ))}
        </div>
        <button
          onClick={generate}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          aria-label="Generate pre-commit config"
        >
          Generate Config
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">.pre-commit-config.yaml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
