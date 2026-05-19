'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReleaseNotesFormatter - Format release notes into structured sections.
 */
export default function ReleaseNotesFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [version, setVersion] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const format = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter release notes.'); return; }

    const lines = input.split('\n').filter((l) => l.trim());
    const features: string[] = [];
    const fixes: string[] = [];
    const breaking: string[] = [];
    const other: string[] = [];

    for (const line of lines) {
      const clean = line.trim().replace(/^[-*•]\s*/, '');
      const lower = clean.toLowerCase();
      if (lower.startsWith('feat') || lower.startsWith('add') || lower.startsWith('new') || lower.includes('feature')) {
        features.push(clean);
      } else if (lower.startsWith('fix') || lower.startsWith('bug') || lower.includes('resolve') || lower.includes('patch')) {
        fixes.push(clean);
      } else if (lower.startsWith('break') || lower.includes('breaking') || lower.includes('removed') || lower.includes('deprecat')) {
        breaking.push(clean);
      } else {
        other.push(clean);
      }
    }

    const ver = version.trim() || '0.0.0';
    const date = new Date().toISOString().split('T')[0];
    const sections: string[] = [`# Release ${ver} (${date})\n`];

    if (features.length > 0) sections.push(`## ✨ Features\n\n${features.map((f) => `- ${f}`).join('\n')}\n`);
    if (fixes.length > 0) sections.push(`## 🐛 Bug Fixes\n\n${fixes.map((f) => `- ${f}`).join('\n')}\n`);
    if (breaking.length > 0) sections.push(`## ⚠️ Breaking Changes\n\n${breaking.map((f) => `- ${f}`).join('\n')}\n`);
    if (other.length > 0) sections.push(`## 📝 Other Changes\n\n${other.map((f) => `- ${f}`).join('\n')}\n`);

    setResult(sections.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="mb-3">
          <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
          <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 2.1.0" aria-label={`Version for ${toolName}`} className="input-field w-40" />
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Raw Notes (one per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"- Added dark mode\n- Fixed login bug\n- Breaking: removed v1 API\n- Updated dependencies"} rows={8} aria-label={`Release notes for ${toolName}`} className="input-field" />
      </InputArea>

      <button onClick={format} className="btn-primary" aria-label="Format release notes">Format</button>

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
