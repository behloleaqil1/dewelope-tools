'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MakefileGenerator - Generate Makefile with targets from form inputs.
 */
export default function MakefileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [defaultTarget, setDefaultTarget] = useState('all');
  const [targets, setTargets] = useState([{ name: '', deps: '', commands: '' }]);
  const [includePhony, setIncludePhony] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const addTarget = () => {
    setTargets([...targets, { name: '', deps: '', commands: '' }]);
  };

  const removeTarget = (index: number) => {
    if (targets.length > 1) {
      setTargets(targets.filter((_, i) => i !== index));
    }
  };

  const updateTarget = (index: number, field: string, value: string) => {
    const updated = [...targets];
    updated[index] = { ...updated[index], [field]: value };
    setTargets(updated);
  };

  const generate = () => {
    setError('');
    setOutput('');

    const validTargets = targets.filter((t) => t.name.trim());
    if (validTargets.length === 0) {
      setError('Please add at least one target with a name.');
      return;
    }

    let makefile = '';

    if (projectName.trim()) {
      makefile += `# Makefile for ${projectName}\n\n`;
    }

    if (defaultTarget.trim()) {
      makefile += `.DEFAULT_GOAL := ${defaultTarget}\n\n`;
    }

    if (includePhony) {
      const phonyTargets = validTargets.map((t) => t.name.trim()).join(' ');
      makefile += `.PHONY: ${phonyTargets}\n\n`;
    }

    validTargets.forEach((target) => {
      const deps = target.deps.trim() ? ` ${target.deps.trim()}` : '';
      makefile += `${target.name.trim()}:${deps}\n`;
      const commands = target.commands.split('\n').filter((c) => c.trim());
      if (commands.length > 0) {
        commands.forEach((cmd) => {
          makefile += `\t${cmd.trim()}\n`;
        });
      } else {
        makefile += `\t@echo "Running ${target.name.trim()}"\n`;
      }
      makefile += '\n';
    });

    setOutput(makefile.trimEnd());
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">Project Name (optional)</label>
              <input id={`${toolId}-project`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. My Project" aria-label={`Project name for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-default`} className="block text-sm font-medium text-gray-700 mb-1">Default Target</label>
              <input id={`${toolId}-default`} type="text" value={defaultTarget} onChange={(e) => setDefaultTarget(e.target.value)} placeholder="all" aria-label="Default target" className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includePhony} onChange={(e) => setIncludePhony(e.target.checked)} className="rounded" />
            Include .PHONY declaration
          </label>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Targets</label>
            {targets.map((target, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">Target {i + 1}</span>
                  {targets.length > 1 && (
                    <button onClick={() => removeTarget(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" value={target.name} onChange={(e) => updateTarget(i, 'name', e.target.value)} placeholder="Target name (e.g. build)" aria-label={`Target ${i + 1} name`} className="input-field" />
                  <input type="text" value={target.deps} onChange={(e) => updateTarget(i, 'deps', e.target.value)} placeholder="Dependencies (e.g. clean compile)" aria-label={`Target ${i + 1} dependencies`} className="input-field" />
                </div>
                <textarea value={target.commands} onChange={(e) => updateTarget(i, 'commands', e.target.value)} placeholder="Commands (one per line)" aria-label={`Target ${i + 1} commands`} className="input-field h-20 resize-y font-mono text-sm" />
              </div>
            ))}
            <button onClick={addTarget} className="text-sm text-blue-600 hover:text-blue-800">+ Add Target</button>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Makefile">Generate Makefile</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Makefile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
