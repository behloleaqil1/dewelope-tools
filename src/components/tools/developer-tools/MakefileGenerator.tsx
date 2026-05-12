'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MakefileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lang, setLang] = useState('node');
  const [output, setOutput] = useState('');

  const templates: Record<string, string> = {
    node: '.PHONY: install dev build test clean\n\ninstall:\n\tnpm install\n\ndev:\n\tnpm run dev\n\nbuild:\n\tnpm run build\n\ntest:\n\tnpm test\n\nclean:\n\trm -rf node_modules dist',
    python: '.PHONY: install run test lint clean\n\ninstall:\n\tpip install -r requirements.txt\n\nrun:\n\tpython main.py\n\ntest:\n\tpytest\n\nlint:\n\tflake8 .\n\nclean:\n\tfind . -type d -name __pycache__ -exec rm -rf {} +',
    go: '.PHONY: build run test clean\n\nBINARY=app\n\nbuild:\n\tgo build -o $(BINARY) .\n\nrun:\n\tgo run .\n\ntest:\n\tgo test ./...\n\nclean:\n\trm -f $(BINARY)',
    c: 'CC=gcc\nCFLAGS=-Wall -g\nTARGET=main\n\nall: $(TARGET)\n\n$(TARGET): main.c\n\t$(CC) $(CFLAGS) -o $(TARGET) main.c\n\nclean:\n\trm -f $(TARGET)',
  };

  const generate = () => setOutput(templates[lang] || '');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
        <select id={`${toolId}-lang`} value={lang} onChange={(e) => setLang(e.target.value)} className="input-field" aria-label={`Project type for ${toolName}`}>
          <option value="node">Node.js</option><option value="python">Python</option><option value="go">Go</option><option value="c">C</option>
        </select>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Makefile</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
