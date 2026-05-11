'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnixPermissionConverter - Convert between numeric and symbolic Unix permissions.
 * Supports both directions: numeric (e.g. 755) to symbolic (rwxr-xr-x) and vice versa.
 */

const PERMS = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];

function numericToSymbolic(numeric: string): string | null {
  const clean = numeric.trim();
  if (!/^[0-7]{3,4}$/.test(clean)) return null;
  const digits = clean.length === 4 ? clean.slice(1) : clean;
  return digits.split('').map((d) => PERMS[parseInt(d)]).join('');
}

function symbolicToNumeric(symbolic: string): string | null {
  const clean = symbolic.trim().replace(/^-/, ''); // Remove leading dash if present (like -rwxr-xr-x)
  if (clean.length !== 9) return null;
  if (!/^[rwx-]{9}$/.test(clean)) return null;

  let result = '';
  for (let i = 0; i < 3; i++) {
    const triplet = clean.slice(i * 3, i * 3 + 3);
    let val = 0;
    if (triplet[0] === 'r') val += 4;
    if (triplet[1] === 'w') val += 2;
    if (triplet[2] === 'x') val += 1;
    result += val;
  }
  return result;
}

function describePermissions(symbolic: string): { owner: string; group: string; others: string } {
  const parts = [symbolic.slice(0, 3), symbolic.slice(3, 6), symbolic.slice(6, 9)];
  const describe = (p: string) => {
    const perms: string[] = [];
    if (p[0] === 'r') perms.push('read');
    if (p[1] === 'w') perms.push('write');
    if (p[2] === 'x') perms.push('execute');
    return perms.length > 0 ? perms.join(', ') : 'none';
  };
  return { owner: describe(parts[0]), group: describe(parts[1]), others: describe(parts[2]) };
}

export default function UnixPermissionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ numeric: string; symbolic: string; description: { owner: string; group: string; others: string } } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim();

      // Try numeric first
      const symbolic = numericToSymbolic(trimmed);
      if (symbolic) {
        setOutput({ numeric: trimmed.length === 4 ? trimmed.slice(1) : trimmed, symbolic, description: describePermissions(symbolic) });
        return;
      }

      // Try symbolic
      const clean = trimmed.replace(/^-/, '');
      const numeric = symbolicToNumeric(trimmed);
      if (numeric) {
        setOutput({ numeric, symbolic: clean, description: describePermissions(clean) });
        return;
      }

      setOutput(null);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const copyText = output
    ? `Numeric: ${output.numeric}\nSymbolic: ${output.symbolic}\nOwner: ${output.description.owner}\nGroup: ${output.description.group}\nOthers: ${output.description.others}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numeric (e.g. 755) or symbolic (e.g. rwxr-xr-x) permissions
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 755 or rwxr-xr-x"
          aria-label={`Permission input for ${toolName}`}
          className="input-field font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Accepts: 3-4 digit octal (755, 0644) or symbolic (rwxr-xr-x, -rw-r--r--)</p>
      </InputArea>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono">{output.numeric}</div>
                <div className="text-xs text-gray-500 mt-1">Numeric (Octal)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600 font-mono">{output.symbolic}</div>
                <div className="text-xs text-gray-500 mt-1">Symbolic</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm space-y-1">
                <div><span className="font-medium text-gray-700">Owner:</span> <span className="text-gray-600">{output.description.owner}</span></div>
                <div><span className="font-medium text-gray-700">Group:</span> <span className="text-gray-600">{output.description.group}</span></div>
                <div><span className="font-medium text-gray-700">Others:</span> <span className="text-gray-600">{output.description.others}</span></div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
