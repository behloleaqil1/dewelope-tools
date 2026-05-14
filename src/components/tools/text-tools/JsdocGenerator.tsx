'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsdocGenerator - Parse function signature and generate JSDoc comment block.
 */
export default function JsdocGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    const sig = signature.trim();
    if (!sig) { setError('Please enter a function signature.'); return; }

    // Parse function signature
    const funcMatch = sig.match(/(?:(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*[=(]\s*(?:async\s*)?\()/);
    const funcName = funcMatch ? (funcMatch[1] || funcMatch[2] || funcMatch[3]) : 'myFunction';

    // Extract parameters
    const paramMatch = sig.match(/\(([^)]*)\)/);
    const params: { name: string; type: string; optional: boolean; defaultVal?: string }[] = [];

    if (paramMatch && paramMatch[1].trim()) {
      const paramStr = paramMatch[1];
      const paramParts = paramStr.split(',');
      for (const part of paramParts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        const optionalMatch = trimmed.match(/(\w+)\??\s*(?::\s*([^=]+))?\s*(?:=\s*(.+))?/);
        if (optionalMatch) {
          params.push({
            name: optionalMatch[1],
            type: optionalMatch[2]?.trim() || '*',
            optional: trimmed.includes('?') || !!optionalMatch[3],
            defaultVal: optionalMatch[3]?.trim(),
          });
        }
      }
    }

    // Extract return type
    const returnMatch = sig.match(/\)\s*:\s*([^{=]+)/);
    const returnType = returnMatch ? returnMatch[1].trim() : 'void';

    // Build JSDoc
    let output = '/**\n';
    output += ` * Description for ${funcName}\n`;
    if (params.length > 0) {
      output += ' *\n';
      for (const p of params) {
        const typeStr = p.type === '*' ? '*' : p.type;
        const optStr = p.optional ? `[${p.name}${p.defaultVal ? '=' + p.defaultVal : ''}]` : p.name;
        output += ` * @param {${typeStr}} ${optStr} - Description\n`;
      }
    }
    if (returnType !== 'void') {
      output += ` * @returns {${returnType}} Description\n`;
    }
    output += ' */';

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-sig`} className="block text-sm font-medium text-gray-700 mb-1">Function Signature</label>
        <textarea id={`${toolId}-sig`} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={"function calculateTotal(price: number, taxRate: number = 0.1): number {"} rows={3} aria-label={`Function signature for ${toolName}`} className="input-field font-mono" />
        <p className="text-xs text-gray-500 mt-1">Paste a TypeScript/JavaScript function signature to generate JSDoc.</p>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate JSDoc">Generate JSDoc</button>

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
