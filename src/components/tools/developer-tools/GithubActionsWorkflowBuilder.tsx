'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GithubActionsWorkflowBuilder - Build GitHub Actions YAML workflow.
 */
export default function GithubActionsWorkflowBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [workflowName, setWorkflowName] = useState('CI');
  const [trigger, setTrigger] = useState('push');
  const [nodeVersion, setNodeVersion] = useState('20');
  const [runTests, setRunTests] = useState(true);
  const [runLint, setRunLint] = useState(true);
  const [runBuild, setRunBuild] = useState(true);
  const [output, setOutput] = useState('');

  function generate() {
    const steps: string[] = [];
    steps.push(`      - uses: actions/checkout@v4`);
    steps.push(`      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '${nodeVersion}'\n          cache: 'npm'`);
    steps.push(`      - name: Install dependencies\n        run: npm ci`);
    if (runLint) steps.push(`      - name: Lint\n        run: npm run lint`);
    if (runTests) steps.push(`      - name: Test\n        run: npm test`);
    if (runBuild) steps.push(`      - name: Build\n        run: npm run build`);

    const triggerYaml = trigger === 'push'
      ? `on:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]`
      : trigger === 'pr'
        ? `on:\n  pull_request:\n    branches: [main]`
        : `on:\n  workflow_dispatch:`;

    const yaml = `name: ${workflowName}

${triggerYaml}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
${steps.join('\n')}`;

    setOutput(yaml);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
            <input id={`${toolId}-name`} type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} aria-label={`Workflow name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-trigger`} className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
            <select id={`${toolId}-trigger`} value={trigger} onChange={(e) => setTrigger(e.target.value)} aria-label="Workflow trigger" className="input-field">
              <option value="push">Push + PR</option>
              <option value="pr">Pull Request only</option>
              <option value="manual">Manual dispatch</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-node`} className="block text-sm font-medium text-gray-700 mb-1">Node.js Version</label>
            <select id={`${toolId}-node`} value={nodeVersion} onChange={(e) => setNodeVersion(e.target.value)} aria-label="Node.js version" className="input-field">
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="22">22</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input type="checkbox" checked={runLint} onChange={(e) => setRunLint(e.target.checked)} aria-label="Include lint step" className="rounded border-gray-300" /> Lint
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input type="checkbox" checked={runTests} onChange={(e) => setRunTests(e.target.checked)} aria-label="Include test step" className="rounded border-gray-300" /> Test
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input type="checkbox" checked={runBuild} onChange={(e) => setRunBuild(e.target.checked)} aria-label="Include build step" className="rounded border-gray-300" /> Build
          </label>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate GitHub Actions workflow" className="btn-primary">
        Generate Workflow
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">.github/workflows/ci.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
