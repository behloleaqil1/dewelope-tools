'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const TEMPLATES: Record<string, string[]> = {
  Node: ['node_modules/', 'dist/', '.env', '.env.local', '*.log', 'coverage/', '.next/', 'out/'],
  Python: ['__pycache__/', '*.py[cod]', '.env', 'venv/', '.venv/', 'dist/', '*.egg-info/'],
  Java: ['*.class', '*.jar', 'target/', '.idea/', '*.iml', 'build/'],
  React: ['node_modules/', 'build/', '.env', '.env.local', '*.log', 'coverage/'],
  Go: ['bin/', '*.exe', '*.test', 'vendor/', '.env'],
  Rust: ['target/', 'Cargo.lock', '*.pdb'],
  General: ['.DS_Store', 'Thumbs.db', '.vscode/', '.idea/', '*.swp', '*.swo'],
};

export default function GitignoreGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const toggle = (key: string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const generate = () => {
    const lines = selected.flatMap(key => [`# ${key}`, ...TEMPLATES[key], '']);
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select frameworks/languages</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TEMPLATES).map(key => (
            <button key={key} onClick={() => toggle(key)} className={`px-3 py-1 rounded border text-sm ${selected.includes(key) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} aria-label={`Toggle ${key} for ${toolName}`}>{key}</button>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary" aria-label="Generate .gitignore">Generate .gitignore</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
