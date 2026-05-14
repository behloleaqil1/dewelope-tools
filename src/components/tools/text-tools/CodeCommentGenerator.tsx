'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CodeCommentGenerator - Generate JSDoc, Python docstring, and C-style comments.
 */
export default function CodeCommentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState<'jsdoc' | 'python' | 'cstyle'>('jsdoc');
  const [funcName, setFuncName] = useState('');
  const [description, setDescription] = useState('');
  const [params, setParams] = useState('');
  const [returnType, setReturnType] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    if (!funcName.trim() && !description.trim()) { setError('Enter at least a function name or description.'); return; }

    const desc = description.trim() || `Description for ${funcName.trim()}`;
    const paramList = params.split('\n').filter((p) => p.trim()).map((p) => {
      const parts = p.split(/[:\-]/).map((s) => s.trim());
      return { name: parts[0] || 'param', type: parts[1] || 'any', desc: parts[2] || '' };
    });
    const ret = returnType.trim() || 'void';

    if (style === 'jsdoc') {
      let output = '/**\n';
      output += ` * ${desc}\n`;
      if (paramList.length > 0) {
        output += ' *\n';
        paramList.forEach((p) => { output += ` * @param {${p.type}} ${p.name}${p.desc ? ' - ' + p.desc : ''}\n`; });
      }
      output += ` * @returns {${ret}}\n`;
      output += ' */';
      setResult(output);
    } else if (style === 'python') {
      let output = '"""\n';
      output += `${desc}\n\n`;
      if (paramList.length > 0) {
        output += 'Args:\n';
        paramList.forEach((p) => { output += `    ${p.name} (${p.type}): ${p.desc || 'Description'}\n`; });
        output += '\n';
      }
      output += `Returns:\n    ${ret}: Description\n`;
      output += '"""';
      setResult(output);
    } else {
      let output = '/*\n';
      output += ` * ${desc}\n`;
      if (paramList.length > 0) {
        output += ' *\n';
        paramList.forEach((p) => { output += ` * ${p.name} (${p.type}): ${p.desc || ''}\n`; });
      }
      output += ` * Returns: ${ret}\n`;
      output += ' */';
      setResult(output);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setStyle('jsdoc')} className={`px-4 py-2 rounded text-sm font-medium ${style === 'jsdoc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="JSDoc style">JSDoc</button>
        <button onClick={() => setStyle('python')} className={`px-4 py-2 rounded text-sm font-medium ${style === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Python docstring style">Python</button>
        <button onClick={() => setStyle('cstyle')} className={`px-4 py-2 rounded text-sm font-medium ${style === 'cstyle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="C-style comment">C-Style</button>
      </div>

      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-func`} className="block text-sm font-medium text-gray-700 mb-1">Function Name</label>
            <input id={`${toolId}-func`} type="text" value={funcName} onChange={(e) => setFuncName(e.target.value)} placeholder="e.g. calculateTotal" aria-label={`Function name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Calculates the total price with tax" aria-label={`Description for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-params`} className="block text-sm font-medium text-gray-700 mb-1">Parameters (name:type:description per line)</label>
            <textarea id={`${toolId}-params`} value={params} onChange={(e) => setParams(e.target.value)} placeholder={"price:number:The base price\ntaxRate:number:Tax rate as decimal"} rows={3} aria-label={`Parameters for ${toolName}`} className="input-field font-mono" />
          </div>
          <div>
            <label htmlFor={`${toolId}-return`} className="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
            <input id={`${toolId}-return`} type="text" value={returnType} onChange={(e) => setReturnType(e.target.value)} placeholder="e.g. number" aria-label={`Return type for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate code comment">Generate</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
