'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NpmPackageJsonValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const pkg = JSON.parse(input);
      const issues: string[] = [];
      if (!pkg.name) issues.push('Missing required field: "name"');
      if (!pkg.version) issues.push('Missing required field: "version"');
      if (pkg.name && !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(pkg.name)) issues.push('Invalid package name format');
      if (pkg.version && !/^\d+\.\d+\.\d+/.test(pkg.version)) issues.push('Version should follow semver (x.y.z)');
      if (pkg.main && typeof pkg.main !== 'string') issues.push('"main" should be a string');
      setOutput(issues.length === 0 ? '✓ Valid package.json structure. All required fields present.' : `Found ${issues.length} issue(s):\n\n${issues.join('\n')}`);
    } catch { setOutput('Error: Invalid JSON. Cannot parse as package.json.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">package.json Content</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"name": "my-package", "version": "1.0.0"}' aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={validate} className="btn-primary">Validate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
