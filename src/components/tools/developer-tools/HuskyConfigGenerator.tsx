'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HuskyConfigGenerator - Generate Husky git hooks configuration
 * for pre-commit, commit-msg, and pre-push hooks.
 */
export default function HuskyConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageManager, setPackageManager] = useState('npm');
  const [hooks, setHooks] = useState<string[]>(['pre-commit']);
  const [lintStaged, setLintStaged] = useState(true);
  const [commitlint, setCommitlint] = useState(false);
  const [output, setOutput] = useState('');

  const availableHooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-merge'];

  const toggleHook = (hook: string) => {
    setHooks(prev => prev.includes(hook) ? prev.filter(h => h !== hook) : [...prev, hook]);
  };

  const generate = () => {
    const pm = packageManager;
    const runCmd = pm === 'npm' ? 'npx' : pm === 'yarn' ? 'yarn' : 'pnpm exec';
    let result = `# Husky Git Hooks Configuration\n\n`;
    result += `## Installation\n\n`;
    result += `\`\`\`bash\n`;
    result += pm === 'npm' ? `npm install --save-dev husky\n` : pm === 'yarn' ? `yarn add --dev husky\n` : `pnpm add --save-dev husky\n`;
    if (lintStaged) {
      result += pm === 'npm' ? `npm install --save-dev lint-staged\n` : pm === 'yarn' ? `yarn add --dev lint-staged\n` : `pnpm add --save-dev lint-staged\n`;
    }
    if (commitlint) {
      result += pm === 'npm' ? `npm install --save-dev @commitlint/cli @commitlint/config-conventional\n` : pm === 'yarn' ? `yarn add --dev @commitlint/cli @commitlint/config-conventional\n` : `pnpm add --save-dev @commitlint/cli @commitlint/config-conventional\n`;
    }
    result += `${runCmd} husky init\n`;
    result += `\`\`\`\n\n`;

    hooks.forEach(hook => {
      result += `## .husky/${hook}\n\n\`\`\`bash\n#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\n`;
      if (hook === 'pre-commit' && lintStaged) {
        result += `${runCmd} lint-staged\n`;
      } else if (hook === 'commit-msg' && commitlint) {
        result += `${runCmd} --no -- commitlint --edit "$1"\n`;
      } else if (hook === 'pre-push') {
        result += `${pm === 'npm' ? 'npm run' : pm === 'yarn' ? 'yarn' : 'pnpm'} test\n`;
      } else if (hook === 'post-merge') {
        result += `${pm === 'npm' ? 'npm install' : pm === 'yarn' ? 'yarn install' : 'pnpm install'}\n`;
      } else {
        result += `# Add your ${hook} commands here\n`;
      }
      result += `\`\`\`\n\n`;
    });

    if (lintStaged) {
      result += `## lint-staged config (package.json)\n\n\`\`\`json\n{\n  "lint-staged": {\n    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],\n    "*.{css,scss}": ["prettier --write"],\n    "*.{json,md}": ["prettier --write"]\n  }\n}\n\`\`\`\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Configure {toolName}
        </label>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-pm`} className="block text-sm text-gray-600 mb-1">Package Manager</label>
            <select
              id={`${toolId}-pm`}
              value={packageManager}
              onChange={(e) => setPackageManager(e.target.value)}
              className="input-field"
              aria-label="Select package manager"
            >
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
              <option value="pnpm">pnpm</option>
            </select>
          </div>
          <div>
            <span className="block text-sm text-gray-600 mb-1">Git Hooks</span>
            <div className="flex flex-wrap gap-3">
              {availableHooks.map(hook => (
                <label key={hook} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={hooks.includes(hook)} onChange={() => toggleHook(hook)} aria-label={`Toggle ${hook} hook`} />
                  {hook}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={lintStaged} onChange={() => setLintStaged(!lintStaged)} aria-label="Include lint-staged" />
              lint-staged
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={commitlint} onChange={() => setCommitlint(!commitlint)} aria-label="Include commitlint" />
              commitlint
            </label>
          </div>
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Generate Husky config">
            Generate Config
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Husky Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
