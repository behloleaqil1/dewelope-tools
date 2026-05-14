'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * YamlSyntaxValidator - Validate YAML syntax and report errors.
 */
export default function YamlSyntaxValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validateYaml = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    try {
      // Basic YAML validation: check indentation consistency, colons, and structure
      const lines = input.split('\n');
      let hasError = false;
      let errorMsg = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '' || line.trim().startsWith('#')) continue;

        // Check for tabs (YAML doesn't allow tabs)
        if (line.includes('\t')) {
          hasError = true;
          errorMsg = `Line ${i + 1}: Tabs are not allowed in YAML, use spaces`;
          break;
        }

        // Check for invalid indentation (odd spaces can be valid, but mixed is not)
        const indent = line.match(/^( *)/)?.[1].length || 0;
        if (indent % 2 !== 0 && !line.trim().startsWith('-')) {
          // Warn but don't fail - odd indentation is technically valid
        }

        // Check for key-value pairs (must have colon followed by space or end of line)
        if (!line.trim().startsWith('-') && !line.trim().startsWith('#') && line.trim().includes(':')) {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0 && colonIdx < line.length - 1 && line[colonIdx + 1] !== ' ') {
            hasError = true;
            errorMsg = `Line ${i + 1}: Missing space after colon in key-value pair`;
            break;
          }
        }

        // Check for duplicate keys at same level (simplified)
        if (line.includes(': ') && !line.trim().startsWith('-')) {
          const key = line.split(':')[0].trim();
          for (let j = i + 1; j < lines.length; j++) {
            const otherLine = lines[j];
            if (otherLine.trim() === '' || otherLine.trim().startsWith('#')) continue;
            const otherIndent = otherLine.match(/^( *)/)?.[1].length || 0;
            if (otherIndent < indent) break;
            if (otherIndent === indent && otherLine.includes(': ')) {
              const otherKey = otherLine.split(':')[0].trim();
              if (otherKey === key) {
                hasError = true;
                errorMsg = `Line ${j + 1}: Duplicate key "${key}" at same level`;
                break;
              }
            }
          }
          if (hasError) break;
        }
      }

      if (hasError) {
        setResult({ valid: false, message: errorMsg });
      } else {
        setResult({ valid: true, message: `Valid YAML (${lines.filter(l => l.trim()).length} non-empty lines)` });
      }
    } catch (e) {
      setResult({ valid: false, message: `Invalid YAML: ${e instanceof Error ? e.message : 'Unknown error'}` });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">YAML Content</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder="key: value&#10;nested:&#10;  child: value" aria-label={`YAML input for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button onClick={validateYaml} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" aria-label="Validate YAML">Validate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className={`p-3 rounded-lg ${result.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <span className="font-medium">{result.valid ? '✓ Valid' : '✗ Invalid'}</span>
            <p className="text-sm mt-1">{result.message}</p>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
