'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MesonBuildGenerator - Generate Meson build file from project config.
 */
export default function MesonBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState('c');
  const [version, setVersion] = useState('0.1.0');
  const [sources, setSources] = useState('');
  const [targetType, setTargetType] = useState('executable');
  const [dependencies, setDependencies] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!projectName.trim()) {
      setOutput('Error: Project name is required.');
      return;
    }

    const lines: string[] = [];
    lines.push(`project('${projectName.trim()}', '${language}',`);
    lines.push(`  version : '${version}',`);
    lines.push(`  default_options : ['warning_level=3']`);
    lines.push(`)`);
    lines.push('');

    const deps = dependencies.trim().split(/[,\n]+/).map(d => d.trim()).filter(Boolean);
    if (deps.length > 0) {
      deps.forEach(dep => {
        lines.push(`${dep}_dep = dependency('${dep}')`);
      });
      lines.push('');
    }

    const srcList = sources.trim().split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    const srcStr = srcList.length > 0
      ? srcList.map(s => `  '${s}'`).join(',\n')
      : `  'src/main.${language === 'cpp' ? 'cpp' : 'c'}'`;

    const depStr = deps.length > 0
      ? `,\n  dependencies : [${deps.map(d => `${d}_dep`).join(', ')}]`
      : '';

    if (targetType === 'executable') {
      lines.push(`exe = executable('${projectName.trim()}',`);
      lines.push(srcStr);
      lines.push(`${depStr ? depStr : ''}`);
      lines.push(`)`)
    } else if (targetType === 'shared_library') {
      lines.push(`lib = shared_library('${projectName.trim()}',`);
      lines.push(srcStr);
      lines.push(`${depStr ? depStr : ''}`);
      lines.push(`)`)
    } else {
      lines.push(`lib = static_library('${projectName.trim()}',`);
      lines.push(srcStr);
      lines.push(`${depStr ? depStr : ''}`);
      lines.push(`)`)
    }

    lines.push('');
    if (targetType === 'executable') {
      lines.push(`test('basic', exe)`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="my_project" aria-label={`Project name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select id={`${toolId}-lang`} value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field" aria-label="Programming language">
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="d">D</option>
              <option value="rust">Rust</option>
              <option value="fortran">Fortran</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="0.1.0" className="input-field" aria-label="Project version" />
          </div>
          <div>
            <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
            <select id={`${toolId}-target`} value={targetType} onChange={(e) => setTargetType(e.target.value)} className="input-field" aria-label="Target type">
              <option value="executable">Executable</option>
              <option value="shared_library">Shared Library</option>
              <option value="static_library">Static Library</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-sources`} className="block text-sm font-medium text-gray-700 mb-1">Source Files (comma or newline separated)</label>
          <textarea id={`${toolId}-sources`} value={sources} onChange={(e) => setSources(e.target.value)} placeholder="src/main.c, src/utils.c" className="input-field h-20 resize-y font-mono" aria-label="Source files" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma or newline separated)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="glib-2.0, gtk+-3.0" className="input-field h-20 resize-y font-mono" aria-label="Dependencies" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Meson Build File</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">meson.build</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
