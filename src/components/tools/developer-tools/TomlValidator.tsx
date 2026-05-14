'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * TomlValidator - Validate TOML syntax and report errors.
 */
export default function TomlValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validateToml = () => {
    if (!input.trim()) { setResult(null); return; }
    try {
      const lines = input.split('\n');
      let hasError = false;
      let errorMsg = '';
      const seenKeys = new Set<string>();
      let currentSection = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '' || line.startsWith('#')) continue;

        // Section headers [section]
        if (line.startsWith('[')) {
          if (!line.endsWith(']')) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Unclosed section header`;
            break;
          }
          currentSection = line.slice(1, -1);
          if (!/^[a-zA-Z0-9_.-]+$/.test(currentSection) && !currentSection.startsWith('[')) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Invalid section name "${currentSection}"`;
            break;
          }
          continue;
        }

        // Key-value pairs
        if (line.includes('=')) {
          const eqIdx = line.indexOf('=');
          const key = line.slice(0, eqIdx).trim();
          const value = line.slice(eqIdx + 1).trim();

          if (!key) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Empty key`;
            break;
          }

          const fullKey = currentSection ? `${currentSection}.${key}` : key;
          if (seenKeys.has(fullKey)) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Duplicate key "${fullKey}"`;
            break;
          }
          seenKeys.add(fullKey);

          // Basic value validation
          if (!value) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Missing value for key "${key}"`;
            break;
          }

          // Check unclosed strings
          if (value.startsWith('"') && !value.endsWith('"')) {
            hasError = true;
            errorMsg = `Line ${i + 1}: Unclosed string value`;
            break;
          }
        } else {
          hasError = true;
          errorMsg = `Line ${i + 1}: Expected key = value pair`;
          break;
        }
      }

      if (hasError) {
        setResult({ valid: false, message: errorMsg });
      } else {
        setResult({ valid: true, message: `Valid TOML (${seenKeys.size} keys in ${currentSection ? 'multiple sections' : 'root'})` });
      }
    } catch (e) {
      setResult({ valid: false, message: `Error: ${e instanceof Error ? e.message : 'Unknown'}` });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">TOML Content</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder='[package]&#10;name = "my-app"&#10;version = "1.0.0"' aria-label={`TOML input for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button onClick={validateToml} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" aria-label="Validate TOML">Validate</button>
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
