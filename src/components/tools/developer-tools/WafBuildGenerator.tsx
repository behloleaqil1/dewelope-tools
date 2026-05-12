'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WafBuildGenerator - Generate Waf wscript build files from project configuration.
 */
export default function WafBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('myproject');
  const [version, setVersion] = useState('1.0.0');
  const [language, setLanguage] = useState<'c' | 'cxx' | 'python'>('cxx');
  const [targetType, setTargetType] = useState<'program' | 'shlib' | 'stlib'>('program');
  const [sources, setSources] = useState('src/main.cpp');
  const [includes, setIncludes] = useState('include');
  const [libs, setLibs] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const srcList = sources.split('\n').filter(s => s.trim()).map(s => `'${s.trim()}'`).join(', ');
    const includeList = includes.split('\n').filter(s => s.trim()).map(s => `'${s.trim()}'`).join(', ');
    const libList = libs.split('\n').filter(s => s.trim()).map(s => `'${s.trim()}'`).join(', ');

    const toolName = language === 'c' ? 'c' : language === 'cxx' ? 'cxx' : 'python';
    const featureName = language === 'python' ? 'py' : `${toolName} ${targetType === 'program' ? 'cprogram' : targetType === 'shlib' ? 'cshlib' : 'cstlib'}`;

    let script = `#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Waf wscript build file
# Generated for: ${projectName} v${version}

APPNAME = '${projectName}'
VERSION = '${version}'

top = '.'
out = 'build'


def options(opt):
    opt.load('${toolName}')


def configure(conf):
    conf.load('${toolName}')
`;

    if (libs.trim()) {
      script += `    conf.check(lib=[${libList}], uselib_store='DEPS')\n`;
    }

    script += `

def build(bld):
    bld(
        features='${featureName}',
        source=[${srcList}],
        target='${projectName}',
        includes=[${includeList}],`;

    if (libs.trim()) {
      script += `\n        use='DEPS',`;
    }

    script += `
    )
`;

    setOutput(script);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input id={`${toolId}-name`} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="input-field" aria-label={`Project name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Project version" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select id={`${toolId}-lang`} value={language} onChange={(e) => setLanguage(e.target.value as 'c' | 'cxx' | 'python')} className="input-field" aria-label="Programming language">
              <option value="c">C</option>
              <option value="cxx">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
            <select id={`${toolId}-type`} value={targetType} onChange={(e) => setTargetType(e.target.value as 'program' | 'shlib' | 'stlib')} className="input-field" aria-label="Target type">
              <option value="program">Program (executable)</option>
              <option value="shlib">Shared Library</option>
              <option value="stlib">Static Library</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-sources`} className="block text-sm font-medium text-gray-700 mb-1">Source Files (one per line)</label>
          <textarea id={`${toolId}-sources`} value={sources} onChange={(e) => setSources(e.target.value)} className="input-field h-24 resize-y font-mono" aria-label="Source files" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-includes`} className="block text-sm font-medium text-gray-700 mb-1">Include Directories (one per line)</label>
          <textarea id={`${toolId}-includes`} value={includes} onChange={(e) => setIncludes(e.target.value)} className="input-field h-20 resize-y font-mono" aria-label="Include directories" />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-libs`} className="block text-sm font-medium text-gray-700 mb-1">Libraries (one per line, optional)</label>
          <textarea id={`${toolId}-libs`} value={libs} onChange={(e) => setLibs(e.target.value)} className="input-field h-20 resize-y font-mono" aria-label="Libraries" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate wscript</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated wscript</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
