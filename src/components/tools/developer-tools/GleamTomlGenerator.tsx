'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GleamTomlGenerator - Generate Gleam gleam.toml project configuration file.
 */
export default function GleamTomlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('');
  const [licences, setLicences] = useState('Apache-2.0');
  const [repository, setRepository] = useState('');
  const [target, setTarget] = useState<'erlang' | 'javascript'>('erlang');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!projectName.trim()) {
      setOutput('Error: Project name is required.');
      return;
    }

    const lines: string[] = [];
    lines.push(`name = "${projectName.trim()}"`);
    lines.push(`version = "${version.trim() || '1.0.0'}"`);
    lines.push('');
    if (description.trim()) {
      lines.push(`description = "${description.trim()}"`);
    }
    lines.push(`licences = ["${licences.trim()}"]`);
    if (repository.trim()) {
      lines.push('');
      lines.push(`repository = { type = "github", user = "", repo = "${repository.trim()}" }`);
    }
    lines.push('');
    lines.push(`[target.${target}]`);
    if (target === 'erlang') {
      lines.push('application = { start_module = "" }');
    }
    lines.push('');
    lines.push('[dependencies]');
    lines.push('gleam_stdlib = ">= 0.34.0 and < 2.0.0"');
    if (target === 'erlang') {
      lines.push('gleam_erlang = ">= 0.25.0 and < 2.0.0"');
    } else {
      lines.push('gleam_javascript = ">= 0.8.0 and < 1.0.0"');
    }
    lines.push('');
    lines.push('[dev-dependencies]');
    lines.push('gleeunit = ">= 1.0.0 and < 2.0.0"');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="my_gleam_project" aria-label={`Project name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" aria-label="Project version" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A Gleam project" aria-label="Project description" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-licence`} className="block text-sm font-medium text-gray-700 mb-1">Licence</label>
            <input id={`${toolId}-licence`} type="text" value={licences} onChange={(e) => setLicences(e.target.value)} placeholder="Apache-2.0" aria-label="Project licence" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-repo`} className="block text-sm font-medium text-gray-700 mb-1">Repository Name (optional)</label>
            <input id={`${toolId}-repo`} type="text" value={repository} onChange={(e) => setRepository(e.target.value)} placeholder="my_gleam_project" aria-label="Repository name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target</label>
            <select id={`${toolId}-target`} value={target} onChange={(e) => setTarget(e.target.value as 'erlang' | 'javascript')} aria-label="Compilation target" className="input-field">
              <option value="erlang">Erlang</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate gleam.toml</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated gleam.toml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
