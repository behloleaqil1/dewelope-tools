'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const TEMPLATES: Record<string, string> = {
  Node: 'node_modules/\ndist/\n.env\n.env.local\ncoverage/\n*.log',
  Python: '__pycache__/\n*.py[cod]\n.env\nvenv/\n*.egg-info/\ndist/',
  React: 'node_modules/\nbuild/\n.env\n.env.local\ncoverage/',
  Java: '*.class\n*.jar\ntarget/\n.idea/\n*.iml',
  Go: 'bin/\n*.exe\n*.test\nvendor/',
  Rust: 'target/\nCargo.lock\n**/*.rs.bk',
};

export default function GitignoreGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const output = selected.map(s => `# ${s}\n${TEMPLATES[s]}`).join('\n\n');

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select frameworks/languages</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TEMPLATES).map(name => (
            <button key={name} onClick={() => toggle(name)} aria-label={`Toggle ${name} for ${toolName}`} className={`px-3 py-1 rounded text-sm border ${selected.includes(name) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>{name}</button>
          ))}
        </div>
      </div>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
