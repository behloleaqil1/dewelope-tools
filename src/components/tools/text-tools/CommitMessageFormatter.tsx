'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CommitMessageFormatter - Format git commit messages per Conventional Commits spec.
 */
export default function CommitMessageFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [breaking, setBreaking] = useState(false);
  const [breakingDesc, setBreakingDesc] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

  const generate = () => {
    setError('');
    setResult('');
    if (!description.trim()) { setError('Please enter a commit description.'); return; }

    let message = type;
    if (scope.trim()) message += `(${scope.trim()})`;
    if (breaking) message += '!';
    message += `: ${description.trim()}`;

    if (body.trim()) {
      message += `\n\n${body.trim()}`;
    }

    if (breaking && breakingDesc.trim()) {
      message += `\n\nBREAKING CHANGE: ${breakingDesc.trim()}`;
    }

    setResult(message);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id={`${toolId}-type`} value={type} onChange={(e) => setType(e.target.value)} aria-label={`Commit type for ${toolName}`} className="input-field">
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-scope`} className="block text-sm font-medium text-gray-700 mb-1">Scope (optional)</label>
            <input id={`${toolId}-scope`} type="text" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. auth, api, ui" aria-label={`Scope for ${toolName}`} className="input-field" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. add user authentication flow" aria-label={`Description for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">Body (optional)</label>
          <textarea id={`${toolId}-body`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Detailed explanation of the change..." rows={3} aria-label={`Body for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} aria-label="Breaking change" className="rounded" />
            Breaking Change
          </label>
          {breaking && (
            <input type="text" value={breakingDesc} onChange={(e) => setBreakingDesc(e.target.value)} placeholder="Describe the breaking change" aria-label={`Breaking change description for ${toolName}`} className="input-field flex-1" />
          )}
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Format commit message">Format</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
