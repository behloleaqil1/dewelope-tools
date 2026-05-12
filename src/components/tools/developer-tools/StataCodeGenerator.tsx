'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StataCodeGenerator - Generate Stata code from variable definitions.
 * Users define variables with names, types, labels, and value labels,
 * and the tool generates corresponding Stata .do file code.
 */
export default function StataCodeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [variables, setVariables] = useState([
    { name: 'age', type: 'int', label: 'Age in years', values: '' },
    { name: 'gender', type: 'byte', label: 'Gender', values: '0 "Male" 1 "Female"' },
  ]);
  const [datasetName, setDatasetName] = useState('mydata');
  const [output, setOutput] = useState('');

  const stataTypes = ['byte', 'int', 'long', 'float', 'double', 'str1', 'str5', 'str10', 'str20', 'str50', 'str100', 'str244'];

  const addVariable = () => {
    setVariables([...variables, { name: '', type: 'float', label: '', values: '' }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: string, value: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const generate = () => {
    if (variables.length === 0 || variables.every(v => !v.name.trim())) {
      setOutput('// Please define at least one variable with a name.');
      return;
    }

    const lines: string[] = [];
    lines.push(`* Stata code generated for dataset: ${datasetName}`);
    lines.push(`* Generated on: ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push('clear all');
    lines.push('set more off');
    lines.push('');

    // Generate input statement
    lines.push(`* Define variables`);
    const validVars = variables.filter(v => v.name.trim());

    // Generate variable type declarations
    validVars.forEach(v => {
      if (v.type.startsWith('str')) {
        lines.push(`gen ${v.type} ${v.name} = ""`);
      } else {
        lines.push(`gen ${v.type} ${v.name} = .`);
      }
    });

    lines.push('');

    // Generate labels
    const labeledVars = validVars.filter(v => v.label.trim());
    if (labeledVars.length > 0) {
      lines.push('* Variable labels');
      labeledVars.forEach(v => {
        lines.push(`label variable ${v.name} "${v.label}"`);
      });
      lines.push('');
    }

    // Generate value labels
    const valueLabelVars = validVars.filter(v => v.values.trim());
    if (valueLabelVars.length > 0) {
      lines.push('* Value labels');
      valueLabelVars.forEach(v => {
        const labelName = `${v.name}_lbl`;
        lines.push(`label define ${labelName} ${v.values}`);
        lines.push(`label values ${v.name} ${labelName}`);
      });
      lines.push('');
    }

    lines.push(`* Save dataset`);
    lines.push(`save "${datasetName}.dta", replace`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-dataset`} className="block text-sm font-medium text-gray-700 mb-1">
          Dataset Name
        </label>
        <input
          id={`${toolId}-dataset`}
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          placeholder="Enter dataset name"
          aria-label={`Dataset name for ${toolName}`}
          className="input-field mb-4"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Variable Definitions</label>
          {variables.map((v, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={v.name}
                onChange={(e) => updateVariable(i, 'name', e.target.value)}
                placeholder="Variable name"
                aria-label={`Variable ${i + 1} name`}
                className="input-field text-sm"
              />
              <select
                value={v.type}
                onChange={(e) => updateVariable(i, 'type', e.target.value)}
                aria-label={`Variable ${i + 1} type`}
                className="input-field text-sm"
              >
                {stataTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="text"
                value={v.label}
                onChange={(e) => updateVariable(i, 'label', e.target.value)}
                placeholder="Label"
                aria-label={`Variable ${i + 1} label`}
                className="input-field text-sm"
              />
              <input
                type="text"
                value={v.values}
                onChange={(e) => updateVariable(i, 'values', e.target.value)}
                placeholder='Value labels: 0 "No" 1 "Yes"'
                aria-label={`Variable ${i + 1} value labels`}
                className="input-field text-sm"
              />
              <button
                onClick={() => removeVariable(i)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
                aria-label={`Remove variable ${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-3">
          <button
            onClick={addVariable}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            + Add Variable
          </button>
          <button
            onClick={generate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Generate Stata Code
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Stata Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
