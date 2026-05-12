'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BuckBuildGenerator - Generate Buck2 build file (TARGETS) from project configuration.
 */
export default function BuckBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [sources, setSources] = useState('main.cpp');
  const [deps, setDeps] = useState('');
  const [targetType, setTargetType] = useState('binary');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = projectName.trim() || 'my_target';
    const srcs = sources.split(',').map(s => s.trim()).filter(Boolean);
    const depsList = deps.split(',').map(d => d.trim()).filter(Boolean);

    let rule = '';
    if (language === 'cpp') {
      rule = targetType === 'binary' ? 'cxx_binary' : targetType === 'library' ? 'cxx_library' : 'cxx_test';
    } else if (language === 'rust') {
      rule = targetType === 'binary' ? 'rust_binary' : targetType === 'library' ? 'rust_library' : 'rust_test';
    } else if (language === 'python') {
      rule = targetType === 'binary' ? 'python_binary' : targetType === 'library' ? 'python_library' : 'python_test';
    } else {
      rule = targetType === 'binary' ? 'genrule' : 'filegroup';
    }

    const lines: string[] = [];
    lines.push(`${rule}(`);
    lines.push(`    name = "${name}",`);
    lines.push(`    srcs = [`);
    srcs.forEach(s => lines.push(`        "${s}",`));
    lines.push(`    ],`);
    if (depsList.length > 0) {
      lines.push(`    deps = [`);
      depsList.forEach(d => lines.push(`        "${d}",`));
      lines.push(`    ],`);
    }
    lines.push(`    visibility = ["${visibility}"],`);
    lines.push(`)`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Target Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="my_target" aria-label={`Target name for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select id={`${toolId}-lang`} value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language" className="input-field">
                <option value="cpp">C/C++</option>
                <option value="rust">Rust</option>
                <option value="python">Python</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
              <select id={`${toolId}-type`} value={targetType} onChange={e => setTargetType(e.target.value)} aria-label="Target type" className="input-field">
                <option value="binary">Binary</option>
                <option value="library">Library</option>
                <option value="test">Test</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-srcs`} className="block text-sm font-medium text-gray-700 mb-1">Sources (comma-separated)</label>
            <input id={`${toolId}-srcs`} type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="main.cpp, util.cpp" aria-label="Source files" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
            <input id={`${toolId}-deps`} type="text" value={deps} onChange={e => setDeps(e.target.value)} placeholder="//lib:mylib" aria-label="Dependencies" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vis`} className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select id={`${toolId}-vis`} value={visibility} onChange={e => setVisibility(e.target.value)} aria-label="Visibility" className="input-field">
              <option value="PUBLIC">PUBLIC</option>
              <option value="//...">{"//... (project-wide)"}</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate TARGETS File</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Buck2 TARGETS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
