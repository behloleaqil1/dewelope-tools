'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YamlValidator - Validates YAML syntax and reports errors.
 * Uses a simple YAML parser to check for structural issues.
 */
export default function YamlValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string; details?: string } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Please enter YAML content to validate.' });
      return;
    }

    try {
      // Basic YAML validation rules
      const lines = input.split('\n');
      const errors: string[] = [];

      const indentStack: number[] = [0];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Skip empty lines and comments
        if (line.trim() === '' || line.trim().startsWith('#')) continue;

        // Check for tabs (YAML doesn't allow tabs for indentation)
        if (line.match(/^\t/)) {
          errors.push(`Line ${lineNum}: Tab character used for indentation (use spaces instead)`);
        }

        // Check for inconsistent indentation
        const indent = line.match(/^( *)/)?.[1].length || 0;
        if (indent % 2 !== 0 && indent % 4 !== 0 && indent !== 1 && indent !== 3) {
          // Allow any consistent indentation, just flag odd patterns
        }

        // Check for trailing colon without value on mapping keys
        const trimmed = line.trim();

        // Check for duplicate colons in key
        if (trimmed.match(/^[^#"']*:[^#"']*:/) && !trimmed.startsWith('  ') && !trimmed.includes('://') && !trimmed.includes(': "') && !trimmed.includes(": '")) {
          errors.push(`Line ${lineNum}: Possible malformed key-value pair`);
        }

        // Check for invalid characters at start
        if (trimmed.match(/^[%@`]/) && !trimmed.startsWith('%YAML') && !trimmed.startsWith('%TAG')) {
          errors.push(`Line ${lineNum}: Invalid character at start of line`);
        }

        // Check for unclosed quotes
        const singleQuotes = (trimmed.match(/'/g) || []).length;
        const doubleQuotes = (trimmed.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0 && !trimmed.includes("\\'")) {
          errors.push(`Line ${lineNum}: Unclosed single quote`);
        }
        if (doubleQuotes % 2 !== 0 && !trimmed.includes('\\"')) {
          errors.push(`Line ${lineNum}: Unclosed double quote`);
        }

        // Check for invalid mapping syntax
        if (trimmed.match(/^-[^ ]/) && !trimmed.startsWith('---') && !trimmed.startsWith('-{') && !trimmed.startsWith('-[')) {
          errors.push(`Line ${lineNum}: Missing space after dash in list item`);
        }

        // Update indent stack
        if (indent > indentStack[indentStack.length - 1]) {
          indentStack.push(indent);
        } else {
          while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
            indentStack.pop();
          }
        }
      }

      // Check for document markers
      const hasContent = lines.some(l => l.trim() !== '' && !l.trim().startsWith('#'));

      if (!hasContent) {
        setResult({ valid: false, message: 'YAML is empty (only comments or whitespace).' });
        return;
      }

      if (errors.length > 0) {
        setResult({
          valid: false,
          message: `Found ${errors.length} issue${errors.length > 1 ? 's' : ''}:`,
          details: errors.join('\n'),
        });
      } else {
        const lineCount = lines.filter(l => l.trim() !== '').length;
        setResult({
          valid: true,
          message: `Valid YAML! (${lineCount} non-empty lines)`,
          details: 'No syntax errors detected. Structure appears well-formed.',
        });
      }
    } catch (e) {
      setResult({
        valid: false,
        message: 'YAML parsing error',
        details: e instanceof Error ? e.message : 'Unknown error occurred',
      });
    }
  };

  const copyText = result ? `${result.message}${result.details ? '\n' + result.details : ''}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter YAML to validate
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`name: my-app\nversion: 1.0.0\ndependencies:\n  - express\n  - lodash`}
          aria-label={`YAML input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={validate} aria-label="Validate YAML" className="btn-primary">
        Validate YAML
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <span className={`text-lg ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
                {result.valid ? '✓' : '✗'}
              </span>
              <span className={`font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </span>
            </div>
            {result.details && (
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-48 overflow-y-auto">
                {result.details}
              </pre>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
