'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ReplacementRule {
  from: string;
  to: string;
}

/**
 * TextCharacterReplacer - Replaces specific characters with other characters.
 * Supports batch character mapping with multiple replacement rules.
 */
export default function TextCharacterReplacer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rules, setRules] = useState<ReplacementRule[]>([{ from: '', to: '' }]);
  const [output, setOutput] = useState('');

  const addRule = () => {
    setRules([...rules, { from: '', to: '' }]);
  };

  const removeRule = (index: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((_, i) => i !== index));
    }
  };

  const updateRule = (index: number, field: 'from' | 'to', value: string) => {
    const updated = [...rules];
    updated[index][field] = value;
    setRules(updated);
  };

  const replace = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = input;
    for (const rule of rules) {
      if (rule.from) {
        // Escape special regex characters
        const escaped = rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'g'), rule.to);
      }
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to perform character replacements..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Replacement Rules</label>
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={rule.from}
              onChange={(e) => updateRule(index, 'from', e.target.value)}
              placeholder="Find"
              aria-label={`Character to find rule ${index + 1}`}
              className="input-field flex-1"
            />
            <span className="text-gray-500 text-sm">→</span>
            <input
              type="text"
              value={rule.to}
              onChange={(e) => updateRule(index, 'to', e.target.value)}
              placeholder="Replace with"
              aria-label={`Replacement character rule ${index + 1}`}
              className="input-field flex-1"
            />
            {rules.length > 1 && (
              <button
                onClick={() => removeRule(index)}
                aria-label={`Remove rule ${index + 1}`}
                className="text-red-500 hover:text-red-700 px-2 py-1 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button onClick={addRule} className="text-sm text-blue-600 hover:text-blue-800">
          + Add Rule
        </button>
      </div>

      <button onClick={replace} aria-label="Apply replacements" className="btn-primary">
        Replace Characters
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
