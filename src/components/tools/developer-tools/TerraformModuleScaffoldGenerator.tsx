'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TerraformModuleScaffoldGenerator - Generate Terraform module structure.
 */
export default function TerraformModuleScaffoldGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [moduleName, setModuleName] = useState('');
  const [provider, setProvider] = useState('aws');
  const [variables, setVariables] = useState('region,instance_type,name');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function generate() {
    setError('');
    setOutput('');
    if (!moduleName.trim()) { setError('Please enter a module name'); return; }

    const vars = variables.split(',').map(v => v.trim()).filter(Boolean);

    const mainTf = `# main.tf
terraform {
  required_providers {
    ${provider} = {
      source  = "hashicorp/${provider}"
      version = "~> 5.0"
    }
  }
}

provider "${provider}" {
  region = var.region
}

resource "${provider}_instance" "${moduleName}" {
  # Configure your resource here
  tags = {
    Name = var.name
  }
}`;

    const variablesTf = `# variables.tf\n` + vars.map(v =>
      `variable "${v}" {\n  description = "The ${v.replace(/_/g, ' ')} for the module"\n  type        = string\n}`
    ).join('\n\n');

    const outputsTf = `# outputs.tf
output "${moduleName}_id" {
  description = "The ID of the ${moduleName} resource"
  value       = ${provider}_instance.${moduleName}.id
}`;

    const readme = `# ${moduleName}\n\nTerraform module for ${moduleName}.\n\n## Usage\n\n\`\`\`hcl\nmodule "${moduleName}" {\n  source = "./modules/${moduleName}"\n\n${vars.map(v => `  ${v} = "value"`).join('\n')}\n}\n\`\`\``;

    setOutput(`${mainTf}\n\n---\n\n${variablesTf}\n\n---\n\n${outputsTf}\n\n---\n\n${readme}`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
            <input id={`${toolId}-name`} type="text" value={moduleName} onChange={(e) => setModuleName(e.target.value)} placeholder="my-module" aria-label={`Module name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-provider`} className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select id={`${toolId}-provider`} value={provider} onChange={(e) => setProvider(e.target.value)} aria-label="Terraform provider" className="input-field">
              <option value="aws">AWS</option>
              <option value="azurerm">Azure</option>
              <option value="google">GCP</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-vars`} className="block text-sm font-medium text-gray-700 mb-1">Variables (comma-separated)</label>
            <input id={`${toolId}-vars`} type="text" value={variables} onChange={(e) => setVariables(e.target.value)} placeholder="region,name" aria-label="Terraform variables" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Terraform module" className="btn-primary">
        Generate Module
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
