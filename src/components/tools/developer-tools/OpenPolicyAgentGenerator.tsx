'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpenPolicyAgentGenerator - Generate OPA Rego policy rules
 * with configurable package name, rule name, conditions, and default values.
 */
export default function OpenPolicyAgentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('authz');
  const [ruleName, setRuleName] = useState('allow');
  const [defaultValue, setDefaultValue] = useState('false');
  const [inputField, setInputField] = useState('input.user.role');
  const [expectedValue, setExpectedValue] = useState('admin');
  const [additionalCondition, setAdditionalCondition] = useState('input.request.method == "GET"');
  const [output, setOutput] = useState('');

  const generate = () => {
    const rego = `package ${packageName}

import rego.v1

# Default deny all requests
default ${ruleName} := ${defaultValue}

# Allow if conditions are met
${ruleName} if {
    ${inputField} == "${expectedValue}"
    ${additionalCondition}
}

# Allow read access for authenticated users
${ruleName} if {
    input.user.authenticated == true
    input.request.method == "GET"
}

# Deny if token is expired
deny if {
    now := time.now_ns()
    token_exp := input.user.token_exp * 1000000000
    now > token_exp
}`;
    setOutput(rego);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-pkg`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-pkg`} type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} className="input-field" aria-label={`Package name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-rule`} className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input id={`${toolId}-rule`} type="text" value={ruleName} onChange={(e) => setRuleName(e.target.value)} className="input-field" aria-label="Rule name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-default`} className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
            <select id={`${toolId}-default`} value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)} className="input-field" aria-label="Default value">
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-field`} className="block text-sm font-medium text-gray-700 mb-1">Input Field Path</label>
            <input id={`${toolId}-field`} type="text" value={inputField} onChange={(e) => setInputField(e.target.value)} className="input-field" aria-label="Input field path" />
          </div>
          <div>
            <label htmlFor={`${toolId}-expected`} className="block text-sm font-medium text-gray-700 mb-1">Expected Value</label>
            <input id={`${toolId}-expected`} type="text" value={expectedValue} onChange={(e) => setExpectedValue(e.target.value)} className="input-field" aria-label="Expected value" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cond`} className="block text-sm font-medium text-gray-700 mb-1">Additional Condition</label>
            <input id={`${toolId}-cond`} type="text" value={additionalCondition} onChange={(e) => setAdditionalCondition(e.target.value)} className="input-field" aria-label="Additional condition" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate OPA Rego Policy</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated OPA Rego Policy</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
