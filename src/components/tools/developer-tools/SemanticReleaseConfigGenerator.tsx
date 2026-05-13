'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SemanticReleaseConfigGenerator - Generate .releaserc semantic-release config.
 * Allows users to configure branches, plugins, and release options.
 */
export default function SemanticReleaseConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [branches, setBranches] = useState('main');
  const [useChangelog, setUseChangelog] = useState(true);
  const [useNpm, setUseNpm] = useState(true);
  const [useGithub, setUseGithub] = useState(true);
  const [useGit, setUseGit] = useState(true);
  const [prereleaseBranch, setPrereleaseBranch] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const branchList = branches.split(',').map(b => b.trim()).filter(Boolean);
    const branchesConfig: unknown[] = [...branchList];
    if (prereleaseBranch) {
      branchesConfig.push({ name: prereleaseBranch, prerelease: true });
    }

    const plugins: string[] = ['@semantic-release/commit-analyzer', '@semantic-release/release-notes-generator'];
    if (useChangelog) plugins.push('@semantic-release/changelog');
    if (useNpm) plugins.push('@semantic-release/npm');
    if (useGithub) plugins.push('@semantic-release/github');
    if (useGit) plugins.push('@semantic-release/git');

    const config = {
      branches: branchesConfig,
      plugins,
    };

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-branches`} className="block text-sm font-medium text-gray-700 mb-1">
              Release Branches (comma-separated)
            </label>
            <input
              id={`${toolId}-branches`}
              type="text"
              value={branches}
              onChange={(e) => setBranches(e.target.value)}
              placeholder="main,master"
              aria-label={`Release branches for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-prerelease`} className="block text-sm font-medium text-gray-700 mb-1">
              Prerelease Branch (optional)
            </label>
            <input
              id={`${toolId}-prerelease`}
              type="text"
              value={prereleaseBranch}
              onChange={(e) => setPrereleaseBranch(e.target.value)}
              placeholder="e.g. beta, next, alpha"
              aria-label={`Prerelease branch for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Plugins</p>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" checked={useChangelog} onChange={(e) => setUseChangelog(e.target.checked)} className="rounded border-gray-300" />
                Changelog
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" checked={useNpm} onChange={(e) => setUseNpm(e.target.checked)} className="rounded border-gray-300" />
                npm
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" checked={useGithub} onChange={(e) => setUseGithub(e.target.checked)} className="rounded border-gray-300" />
                GitHub
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" checked={useGit} onChange={(e) => setUseGit(e.target.checked)} className="rounded border-gray-300" />
                Git
              </label>
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Config
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">.releaserc</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
