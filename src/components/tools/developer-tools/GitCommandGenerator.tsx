'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type GitOperation = 'merge' | 'rebase' | 'cherry-pick' | 'reset' | 'stash' | 'branch' | 'tag' | 'remote';

interface FormState {
  operation: GitOperation;
  branch: string;
  commitHash: string;
  message: string;
  flags: string[];
}

/**
 * GitCommandGenerator - Generate common git commands from form inputs.
 * Supports merge, rebase, cherry-pick, reset, stash, branch, tag, and remote operations.
 */
export default function GitCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [form, setForm] = useState<FormState>({
    operation: 'merge',
    branch: '',
    commitHash: '',
    message: '',
    flags: [],
  });
  const [output, setOutput] = useState('');

  const operations: { value: GitOperation; label: string }[] = [
    { value: 'merge', label: 'Merge' },
    { value: 'rebase', label: 'Rebase' },
    { value: 'cherry-pick', label: 'Cherry-pick' },
    { value: 'reset', label: 'Reset' },
    { value: 'stash', label: 'Stash' },
    { value: 'branch', label: 'Branch' },
    { value: 'tag', label: 'Tag' },
    { value: 'remote', label: 'Remote' },
  ];

  const flagOptions: Record<GitOperation, { value: string; label: string }[]> = {
    merge: [
      { value: '--no-ff', label: 'No fast-forward (--no-ff)' },
      { value: '--squash', label: 'Squash (--squash)' },
      { value: '--abort', label: 'Abort (--abort)' },
    ],
    rebase: [
      { value: '-i', label: 'Interactive (-i)' },
      { value: '--onto', label: 'Onto (--onto)' },
      { value: '--abort', label: 'Abort (--abort)' },
      { value: '--continue', label: 'Continue (--continue)' },
    ],
    'cherry-pick': [
      { value: '--no-commit', label: 'No commit (--no-commit)' },
      { value: '-x', label: 'Append reference (-x)' },
      { value: '--abort', label: 'Abort (--abort)' },
    ],
    reset: [
      { value: '--soft', label: 'Soft (--soft)' },
      { value: '--mixed', label: 'Mixed (--mixed)' },
      { value: '--hard', label: 'Hard (--hard)' },
    ],
    stash: [
      { value: 'push', label: 'Push (save)' },
      { value: 'pop', label: 'Pop' },
      { value: 'list', label: 'List' },
      { value: 'drop', label: 'Drop' },
    ],
    branch: [
      { value: '-d', label: 'Delete (-d)' },
      { value: '-D', label: 'Force delete (-D)' },
      { value: '-m', label: 'Rename (-m)' },
      { value: '-a', label: 'List all (-a)' },
    ],
    tag: [
      { value: '-a', label: 'Annotated (-a)' },
      { value: '-d', label: 'Delete (-d)' },
      { value: '-l', label: 'List (-l)' },
    ],
    remote: [
      { value: 'add', label: 'Add' },
      { value: 'remove', label: 'Remove' },
      { value: '-v', label: 'Verbose (-v)' },
    ],
  };

  const generate = () => {
    let cmd = 'git ';
    const { operation, branch, commitHash, message, flags } = form;

    switch (operation) {
      case 'merge':
        cmd += `merge ${flags.join(' ')} ${branch}`.trim();
        break;
      case 'rebase':
        cmd += `rebase ${flags.join(' ')} ${branch}`.trim();
        break;
      case 'cherry-pick':
        cmd += `cherry-pick ${flags.join(' ')} ${commitHash || branch}`.trim();
        break;
      case 'reset':
        cmd += `reset ${flags.join(' ')} ${commitHash || 'HEAD'}`.trim();
        break;
      case 'stash':
        cmd += `stash ${flags.join(' ')}${message ? ` -m "${message}"` : ''}`.trim();
        break;
      case 'branch':
        cmd += `branch ${flags.join(' ')} ${branch}`.trim();
        break;
      case 'tag':
        cmd += `tag ${flags.join(' ')} ${branch}${message ? ` -m "${message}"` : ''}`.trim();
        break;
      case 'remote':
        cmd += `remote ${flags.join(' ')} ${branch}`.trim();
        break;
    }

    setOutput(cmd.replace(/\s+/g, ' ').trim());
  };

  const toggleFlag = (flag: string) => {
    setForm((prev) => ({
      ...prev,
      flags: prev.flags.includes(flag) ? prev.flags.filter((f) => f !== flag) : [...prev.flags, flag],
    }));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-operation`} className="block text-sm font-medium text-gray-700 mb-1">
          Git Operation
        </label>
        <select
          id={`${toolId}-operation`}
          value={form.operation}
          onChange={(e) => setForm({ ...form, operation: e.target.value as GitOperation, flags: [] })}
          aria-label={`Git operation for ${toolName}`}
          className="input-field"
        >
          {operations.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-branch`} className="block text-sm font-medium text-gray-700 mb-1">
          Branch / Reference Name
        </label>
        <input
          id={`${toolId}-branch`}
          type="text"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder="e.g. main, feature/login, origin/main"
          aria-label="Branch or reference name"
          className="input-field"
        />
      </InputArea>

      {(form.operation === 'cherry-pick' || form.operation === 'reset') && (
        <InputArea>
          <label htmlFor={`${toolId}-commit`} className="block text-sm font-medium text-gray-700 mb-1">
            Commit Hash
          </label>
          <input
            id={`${toolId}-commit`}
            type="text"
            value={form.commitHash}
            onChange={(e) => setForm({ ...form, commitHash: e.target.value })}
            placeholder="e.g. abc1234"
            aria-label="Commit hash"
            className="input-field"
          />
        </InputArea>
      )}

      {(form.operation === 'stash' || form.operation === 'tag') && (
        <InputArea>
          <label htmlFor={`${toolId}-message`} className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <input
            id={`${toolId}-message`}
            type="text"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Optional message"
            aria-label="Message for git command"
            className="input-field"
          />
        </InputArea>
      )}

      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-700">Flags / Options</span>
        <div className="flex flex-wrap gap-2">
          {flagOptions[form.operation].map((flag) => (
            <label key={flag.value} className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.flags.includes(flag.value)}
                onChange={() => toggleFlag(flag.value)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">{flag.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={generate} aria-label="Generate git command" className="btn-primary">
        Generate Command
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-900 text-green-400 p-4 rounded-lg break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
