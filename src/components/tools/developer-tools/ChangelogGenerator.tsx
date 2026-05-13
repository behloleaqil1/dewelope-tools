'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChangelogGenerator - Generate CHANGELOG.md entries from version, date, and changes.
 */
export default function ChangelogGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [version, setVersion] = useState('');
  const [date, setDate] = useState('');
  const [added, setAdded] = useState('');
  const [changed, setChanged] = useState('');
  const [fixed, setFixed] = useState('');
  const [removed, setRemoved] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!version.trim()) return;
    const d = date || new Date().toISOString().split('T')[0];
    let result = `## [${version.trim()}] - ${d}\n`;

    const formatSection = (title: string, items: string) => {
      const lines = items.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return '';
      return `\n### ${title}\n${lines.map(l => `- ${l}`).join('\n')}\n`;
    };

    result += formatSection('Added', added);
    result += formatSection('Changed', changed);
    result += formatSection('Fixed', fixed);
    result += formatSection('Removed', removed);

    setOutput(result.trim());
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" aria-label={`Version for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date (YYYY-MM-DD)</label>
            <input id={`${toolId}-date`} type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder={new Date().toISOString().split('T')[0]} aria-label="Release date" className="input-field" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor={`${toolId}-added`} className="block text-sm font-medium text-gray-700 mb-1">Added (one per line)</label>
            <textarea id={`${toolId}-added`} value={added} onChange={(e) => setAdded(e.target.value)} placeholder="New feature..." aria-label="Added items" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-changed`} className="block text-sm font-medium text-gray-700 mb-1">Changed (one per line)</label>
            <textarea id={`${toolId}-changed`} value={changed} onChange={(e) => setChanged(e.target.value)} placeholder="Updated behavior..." aria-label="Changed items" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-fixed`} className="block text-sm font-medium text-gray-700 mb-1">Fixed (one per line)</label>
            <textarea id={`${toolId}-fixed`} value={fixed} onChange={(e) => setFixed(e.target.value)} placeholder="Bug fix..." aria-label="Fixed items" className="input-field h-20 resize-y" />
          </div>
          <div>
            <label htmlFor={`${toolId}-removed`} className="block text-sm font-medium text-gray-700 mb-1">Removed (one per line)</label>
            <textarea id={`${toolId}-removed`} value={removed} onChange={(e) => setRemoved(e.target.value)} placeholder="Deprecated feature..." aria-label="Removed items" className="input-field h-20 resize-y" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate Changelog Entry</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CHANGELOG.md Entry</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
