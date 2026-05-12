'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XmakeGenerator - Generate xmake.lua build file from project configuration.
 */
export default function XmakeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('myproject');
  const [projectKind, setProjectKind] = useState<'binary' | 'static' | 'shared'>('binary');
  const [language, setLanguage] = useState<'c' | 'c++' | 'c++17' | 'c++20'>('c++17');
  const [sourceFiles, setSourceFiles] = useState('src/*.cpp');
  const [headerDirs, setHeaderDirs] = useState('include');
  const [dependencies, setDependencies] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('-- xmake.lua');
    lines.push(`set_project("${projectName}")`);
    lines.push('');

    const langMap: Record<string, string> = {
      'c': 'c11',
      'c++': 'c++14',
      'c++17': 'c++17',
      'c++20': 'c++20',
    };
    lines.push(`set_languages("${langMap[language]}")`);
    lines.push('');

    lines.push(`target("${projectName}")`);
    lines.push(`    set_kind("${projectKind}")`);

    sourceFiles.split(',').map(s => s.trim()).filter(Boolean).forEach(src => {
      lines.push(`    add_files("${src}")`);
    });

    headerDirs.split(',').map(s => s.trim()).filter(Boolean).forEach(dir => {
      lines.push(`    add_includedirs("${dir}")`);
    });

    if (dependencies.trim()) {
      lines.push('');
      dependencies.split(',').map(s => s.trim()).filter(Boolean).forEach(dep => {
        lines.push(`    add_packages("${dep}")`);
      });
    }

    lines.push('');
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-kind`} className="block text-sm font-medium text-gray-700 mb-1">Target Kind</label>
              <select id={`${toolId}-kind`} value={projectKind} onChange={(e) => setProjectKind(e.target.value as 'binary' | 'static' | 'shared')} className="input-field" aria-label="Target kind">
                <option value="binary">Binary</option>
                <option value="static">Static Library</option>
                <option value="shared">Shared Library</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select id={`${toolId}-lang`} value={language} onChange={(e) => setLanguage(e.target.value as 'c' | 'c++' | 'c++17' | 'c++20')} className="input-field" aria-label="Language standard">
                <option value="c">C (C11)</option>
                <option value="c++">C++ (C++14)</option>
                <option value="c++17">C++ (C++17)</option>
                <option value="c++20">C++ (C++20)</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-src`} className="block text-sm font-medium text-gray-700 mb-1">Source Files (comma-separated globs)</label>
            <input id={`${toolId}-src`} type="text" value={sourceFiles} onChange={(e) => setSourceFiles(e.target.value)} className="input-field" aria-label="Source files" />
          </div>
          <div>
            <label htmlFor={`${toolId}-headers`} className="block text-sm font-medium text-gray-700 mb-1">Include Directories (comma-separated)</label>
            <input id={`${toolId}-headers`} type="text" value={headerDirs} onChange={(e) => setHeaderDirs(e.target.value)} className="input-field" aria-label="Include directories" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Packages/Dependencies (comma-separated)</label>
            <input id={`${toolId}-deps`} type="text" value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder="e.g. zlib, openssl" className="input-field" aria-label="Dependencies" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate xmake.lua</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated xmake.lua</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
