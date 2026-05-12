'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TerraformOutputGenerator - Generate Terraform output blocks from resource definitions.
 * Users specify output name, value expression, description, and sensitivity.
 */
export default function TerraformOutputGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [outputs, setOutputs] = useState([
    { name: '', value: '', description: '', sensitive: false },
  ]);
  const [result, setResult] = useState('');

  const addOutput = () => {
    setOutputs([...outputs, { name: '', value: '', description: '', sensitive: false }]);
  };

  const removeOutput = (index: number) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((_, i) => i !== index));
    }
  };

  const updateOutput = (index: number, field: string, val: string | boolean) => {
    const updated = [...outputs];
    updated[index] = { ...updated[index], [field]: val };
    setOutputs(updated);
  };

  const generate = () => {
    const blocks = outputs
      .filter((o) => o.name.trim() && o.value.trim())
      .map((o) => {
        const lines: string[] = [];
        lines.push(`output "${o.name.trim()}" {`);
        if (o.description.trim()) {
          lines.push(`  description = "${o.description.trim()}"`);
        }
        lines.push(`  value       = ${o.value.trim()}`);
        if (o.sensitive) {
          lines.push(`  sensitive   = true`);
        }
        lines.push(`}`);
        return lines.join('\n');
      });

    if (blocks.length === 0) {
      setResult('');
      return;
    }

    setResult(blocks.join('\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Define Terraform Outputs
        </label>
        {outputs.map((o, i) => (
          <div key={i} className="border border-gray-200 rounded p-3 mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Output #{i + 1}</span>
              {outputs.length > 1 && (
                <button onClick={() => removeOutput(i)} className="text-red-500 text-xs hover:underline">Remove</button>
              )}
            </div>
            <input
              type="text"
              value={o.name}
              onChange={(e) => updateOutput(i, 'name', e.target.value)}
              placeholder="Output name (e.g., instance_ip)"
              aria-label={`Output name ${i + 1} for ${toolName}`}
              className="input-field"
            />
            <input
              type="text"
              value={o.value}
              onChange={(e) => updateOutput(i, 'value', e.target.value)}
              placeholder="Value expression (e.g., aws_instance.main.public_ip)"
              aria-label={`Output value ${i + 1}`}
              className="input-field font-mono"
            />
            <input
              type="text"
              value={o.description}
              onChange={(e) => updateOutput(i, 'description', e.target.value)}
              placeholder="Description (optional)"
              aria-label={`Output description ${i + 1}`}
              className="input-field"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={o.sensitive}
                onChange={(e) => updateOutput(i, 'sensitive', e.target.checked)}
              />
              Sensitive
            </label>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={addOutput} className="btn-secondary">Add Output</button>
          <button onClick={generate} className="btn-primary">Generate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Terraform Output Blocks</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
