'use client';

import { useState, useMemo } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GitCommandReference - Searchable reference of common git commands with descriptions.
 */
export default function GitCommandReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');

  const commands = useMemo(() => [
    { cmd: 'git init', desc: 'Initialize a new git repository' },
    { cmd: 'git clone <url>', desc: 'Clone a remote repository' },
    { cmd: 'git add .', desc: 'Stage all changes' },
    { cmd: 'git add <file>', desc: 'Stage a specific file' },
    { cmd: 'git commit -m "<msg>"', desc: 'Commit staged changes with a message' },
    { cmd: 'git status', desc: 'Show working tree status' },
    { cmd: 'git log --oneline', desc: 'Show commit history (compact)' },
    { cmd: 'git diff', desc: 'Show unstaged changes' },
    { cmd: 'git diff --staged', desc: 'Show staged changes' },
    { cmd: 'git branch', desc: 'List local branches' },
    { cmd: 'git branch <name>', desc: 'Create a new branch' },
    { cmd: 'git checkout <branch>', desc: 'Switch to a branch' },
    { cmd: 'git checkout -b <branch>', desc: 'Create and switch to a new branch' },
    { cmd: 'git merge <branch>', desc: 'Merge a branch into current branch' },
    { cmd: 'git rebase <branch>', desc: 'Rebase current branch onto another' },
    { cmd: 'git pull', desc: 'Fetch and merge from remote' },
    { cmd: 'git push', desc: 'Push commits to remote' },
    { cmd: 'git push -u origin <branch>', desc: 'Push and set upstream tracking' },
    { cmd: 'git fetch', desc: 'Download objects from remote' },
    { cmd: 'git stash', desc: 'Stash working directory changes' },
    { cmd: 'git stash pop', desc: 'Apply and remove latest stash' },
    { cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit, keep changes staged' },
    { cmd: 'git reset --hard HEAD~1', desc: 'Undo last commit, discard changes' },
    { cmd: 'git cherry-pick <hash>', desc: 'Apply a specific commit' },
    { cmd: 'git tag <name>', desc: 'Create a lightweight tag' },
    { cmd: 'git remote -v', desc: 'Show remote repositories' },
    { cmd: 'git log --graph --all', desc: 'Show branch graph' },
    { cmd: 'git blame <file>', desc: 'Show who changed each line' },
    { cmd: 'git reflog', desc: 'Show reference log (recovery)' },
    { cmd: 'git clean -fd', desc: 'Remove untracked files and directories' },
  ], []);

  const filtered = useMemo(() => {
    if (!search.trim()) return commands;
    const q = search.toLowerCase();
    return commands.filter(c => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  }, [search, commands]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">Search Commands</label>
        <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. branch, merge, stash..." aria-label={`Search for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((c, i) => (
            <div key={i} className="flex items-start justify-between gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <code className="text-sm font-mono text-blue-700">{c.cmd}</code>
                <p className="text-xs text-gray-600 mt-0.5">{c.desc}</p>
              </div>
              <CopyToClipboard text={c.cmd} />
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-500">No commands found.</p>}
        </div>
      </OutputArea>
    </div>
  );
}
