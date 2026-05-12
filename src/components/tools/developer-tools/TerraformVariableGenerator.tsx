'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface TerraformVar {
  name: string;
  type: string;
  description: string;
  defaultValue: string;
}

/**
 * TerraformVariableGenerator - Generate Terraform variable blocks from inputs.
 */
export default function TerraformVariableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [variables, setVariables] = useState<TerraformVar[]>([
    { name: '', type: 'string', description: '', defaultValue: '' },
  ]);
  const [output, setOutput] = useState('');

  const typeOptions = ['string', 'number', 'bool', 'list(string)', 'map(string)', 'object({})', 'any'];

  const addVariable = () => {
    setVariables([...variables, { name: '', type: 'string', description: '', defaultValue: '' }]);
  };

  const removeVariable = (index: number) => {
    if (variables.length > 1) {
      setVariables(variables.filter((_, i) => i !== index));
    }
  };

  const updateVariable = (index: number, field: keyof TerraformVar, value: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const generate = () => {
    const blocks = variables
      .filter((v) => v.name.trim())
      .map((v) => {
        let block = `variable "${v.name.trim()}" {\n`;
        block += `  type        = ${v.type}\n`;
        if (v.description.trim()) {
          block += `  description = "${v.description.trim()}"\n`;
        }
        if (v.defaultValue.trim()) {
          const def = v.type === 'number' ? v.defaultValue.trim()
            : v.type === 'bool' ? v.defaultValue.trim().toLowerCase()
            : `"${v.defaultValue.trim()}"`;
          block += `  default     = ${def}\n`;
        }
        block += `}`;
        return block;
      });

    setOutput(blocks.join('\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Define Variables
        </label>
        <div className="space-y-3">
          {variables.map((v, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={v.name}
                onChange={(e) => updateVariable(i, 'name', e.target.value)}
                placeholder="Variable name"
                aria-label={`Variable ${i + 1} name for ${toolName}`}
                className="input-field text-sm"
              />
              <select
                value={v.type}
                onChange={(e) => updateVariable(i, 'type', e.target.value)}
                aria-label={`Variable ${i + 1} type`}
                className="input-field text-sm"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="text"
                value={v.description}
                onChange={(e) => updateVariable(i, 'description', e.target.value)}
                placeholder="Description"
                aria-label={`Variable ${i + 1} description`}
                className="input-field text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={v.defaultValue}
                  onChange={(e) => updateVariable(i, 'defaultValue', e.target.value)}
                  placeholder="Default value"
                  aria-label={`Variable ${i + 1} default value`}
                  className="input-field text-sm flex-1"
                />
                {variables.length > 1 && (
                  <button
                    onClick={() => removeVariable(i)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                    aria-label={`Remove variable ${i + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addVariable} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
          + Add Variable
        </button>
      </InputArea>

      <button onClick={generate} aria-label="Generate Terraform variables" className="btn-primary">
        Generate Terraform Variables
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Terraform Variables</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
