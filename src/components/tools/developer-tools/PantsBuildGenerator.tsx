'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PantsBuildGenerator - Generate Pants BUILD file from project configuration.
 */
export default function PantsBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [targetName, setTargetName] = useState('');
  const [language, setLanguage] = useState('python');
  const [sources, setSources] = useState('**/*.py');
  const [deps, setDeps] = useState('');
  const [targetType, setTargetType] = useState('binary');
  const [entryPoint, setEntryPoint] = useState('main.py');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = targetName.trim() || 'app';
    const depsList = deps.split(',').map(d => d.trim()).filter(Boolean);

    let rule = '';
    if (language === 'python') {
      rule = targetType === 'binary' ? 'pex_binary' : targetType === 'library' ? 'python_sources' : 'python_tests';
    } else if (language === 'java') {
      rule = targetType === 'binary' ? 'java_sources' : targetType === 'library' ? 'java_sources' : 'junit_tests';
    } else if (language === 'go') {
      rule = targetType === 'binary' ? 'go_binary' : targetType === 'library' ? 'go_package' : 'go_test';
    } else {
      rule = 'target';
    }

    const lines: string[] = [];
    lines.push(`${rule}(`);
    lines.push(`    name="${name}",`);

    if (targetType === 'binary' && language === 'python') {
      lines.push(`    entry_point="${entryPoint}",`);
    }

    if (targetType !== 'binary' || language !== 'python') {
      lines.push(`    sources=["${sources}"],`);
    }

    if (depsList.length > 0) {
      lines.push(`    dependencies=[`);
      depsList.forEach(d => lines.push(`        "${d}",`));
      lines.push(`    ],`);
    }

    lines.push(`)`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Target Name</label>
            <input id={`${toolId}-name`} type="text" value={targetName} onChange={e => setTargetName(e.target.value)} placeholder="app" aria-label={`Target name for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select id={`${toolId}-lang`} value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language" className="input-field">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
              <select id={`${toolId}-type`} value={targetType} onChange={e => setTargetType(e.target.value)} aria-label="Target type" className="input-field">
                <option value="binary">Binary</option>
                <option value="library">Library/Sources</option>
                <option value="test">Test</option>
              </select>
            </div>
          </div>
          {targetType === 'binary' && language === 'python' && (
            <div>
              <label htmlFor={`${toolId}-entry`} className="block text-sm font-medium text-gray-700 mb-1">Entry Point</label>
              <input id={`${toolId}-entry`} type="text" value={entryPoint} onChange={e => setEntryPoint(e.target.value)} placeholder="main.py" aria-label="Entry point" className="input-field" />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-srcs`} className="block text-sm font-medium text-gray-700 mb-1">Sources Pattern</label>
            <input id={`${toolId}-srcs`} type="text" value={sources} onChange={e => setSources(e.target.value)} placeholder="**/*.py" aria-label="Source pattern" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
            <input id={`${toolId}-deps`} type="text" value={deps} onChange={e => setDeps(e.target.value)} placeholder="src/lib:utils" aria-label="Dependencies" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate BUILD File</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Pants BUILD</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
