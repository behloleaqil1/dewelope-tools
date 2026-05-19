'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChangelogGenerator - Generate CHANGELOG.md entries from version info and changes.
 */
export default function ChangelogGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [version, setVersion] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [added, setAdded] = useState('');
  const [changed, setChanged] = useState('');
  const [fixed, setFixed] = useState('');
  const [removed, setRemoved] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!version.trim()) { setError('Please enter a version number.'); return; }

    const sections: string[] = [];
    sections.push(`## [${version.trim()}] - ${date}`);
    sections.push('');

    const formatSection = (title: string, items: string) => {
      const lines = items.split('\n').filter((l) => l.trim());
      if (lines.length === 0) return '';
      return `### ${title}\n\n${lines.map((l) => `- ${l.trim().replace(/^[-*]\s*/, '')}`).join('\n')}\n`;
    };

    const addedSection = formatSection('Added', added);
    const changedSection = formatSection('Changed', changed);
    const fixedSection = formatSection('Fixed', fixed);
    const removedSection = formatSection('Removed', removed);

    if (!addedSection && !changedSection && !fixedSection && !removedSection) {
      setError('Please enter at least one change.');
      return;
    }

    if (addedSection) sections.push(addedSection);
    if (changedSection) sections.push(changedSection);
    if (fixedSection) sections.push(fixedSection);
    if (removedSection) sections.push(removedSection);

    setResult(sections.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 1.2.0" aria-label={`Version for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-added`} className="block text-sm font-medium text-gray-700 mb-1">Added (one per line)</label>
          <textarea id={`${toolId}-added`} value={added} onChange={(e) => setAdded(e.target.value)} placeholder="New feature X\nNew API endpoint" rows={2} aria-label={`Added items for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-changed`} className="block text-sm font-medium text-gray-700 mb-1">Changed (one per line)</label>
          <textarea id={`${toolId}-changed`} value={changed} onChange={(e) => setChanged(e.target.value)} placeholder="Updated dependency Y\nImproved performance" rows={2} aria-label={`Changed items for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-fixed`} className="block text-sm font-medium text-gray-700 mb-1">Fixed (one per line)</label>
          <textarea id={`${toolId}-fixed`} value={fixed} onChange={(e) => setFixed(e.target.value)} placeholder="Bug in login flow\nMemory leak in worker" rows={2} aria-label={`Fixed items for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-removed`} className="block text-sm font-medium text-gray-700 mb-1">Removed (one per line)</label>
          <textarea id={`${toolId}-removed`} value={removed} onChange={(e) => setRemoved(e.target.value)} placeholder="Deprecated API v1" rows={2} aria-label={`Removed items for ${toolName}`} className="input-field" />
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate changelog">Generate</button>

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
