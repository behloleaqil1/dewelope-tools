'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GemfileGenerator - Generate Ruby Gemfile from a gem list.
 * Configure Ruby version, source, gems with version constraints, and groups.
 */
export default function GemfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rubyVersion, setRubyVersion] = useState('3.2.0');
  const [source, setSource] = useState('https://rubygems.org');
  const [gems, setGems] = useState('');
  const [devGems, setDevGems] = useState('');
  const [testGems, setTestGems] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push(`source "${source}"`);
    lines.push('');
    lines.push(`ruby "${rubyVersion}"`);
    lines.push('');

    if (gems.trim()) {
      gems.trim().split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/[\s,]+/);
        const name = parts[0];
        const version = parts.slice(1).join(', ');
        if (version) {
          lines.push(`gem "${name}", "${version}"`);
        } else {
          lines.push(`gem "${name}"`);
        }
      });
      lines.push('');
    }

    if (devGems.trim()) {
      lines.push('group :development do');
      devGems.trim().split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/[\s,]+/);
        const name = parts[0];
        const version = parts.slice(1).join(', ');
        if (version) {
          lines.push(`  gem "${name}", "${version}"`);
        } else {
          lines.push(`  gem "${name}"`);
        }
      });
      lines.push('end');
      lines.push('');
    }

    if (testGems.trim()) {
      lines.push('group :test do');
      testGems.trim().split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/[\s,]+/);
        const name = parts[0];
        const version = parts.slice(1).join(', ');
        if (version) {
          lines.push(`  gem "${name}", "${version}"`);
        } else {
          lines.push(`  gem "${name}"`);
        }
      });
      lines.push('end');
      lines.push('');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-ruby`} className="block text-sm font-medium text-gray-700 mb-1">Ruby Version</label>
            <input id={`${toolId}-ruby`} type="text" value={rubyVersion} onChange={(e) => setRubyVersion(e.target.value)} className="input-field" aria-label={`Ruby version for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input id={`${toolId}-source`} type="text" value={source} onChange={(e) => setSource(e.target.value)} className="input-field" aria-label="Gem source URL" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-gems`} className="block text-sm font-medium text-gray-700 mb-1">Gems (one per line: name version)</label>
          <textarea id={`${toolId}-gems`} value={gems} onChange={(e) => setGems(e.target.value)} placeholder="rails ~> 7.0&#10;pg ~> 1.5&#10;puma ~> 6.0" className="input-field h-28 resize-y font-mono" aria-label="Gems list" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-dev`} className="block text-sm font-medium text-gray-700 mb-1">Development Gems (one per line)</label>
          <textarea id={`${toolId}-dev`} value={devGems} onChange={(e) => setDevGems(e.target.value)} placeholder="rubocop ~> 1.50&#10;pry" className="input-field h-24 resize-y font-mono" aria-label="Development gems" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-test`} className="block text-sm font-medium text-gray-700 mb-1">Test Gems (one per line)</label>
          <textarea id={`${toolId}-test`} value={testGems} onChange={(e) => setTestGems(e.target.value)} placeholder="rspec ~> 3.12&#10;factory_bot" className="input-field h-24 resize-y font-mono" aria-label="Test gems" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Gemfile</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gemfile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
