'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GithubActionsYamlGenerator - Generate GitHub Actions workflow YAML files.
 */
export default function GithubActionsYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [workflowName, setWorkflowName] = useState('CI');
  const [trigger, setTrigger] = useState('push');
  const [branches, setBranches] = useState('main');
  const [nodeVersion, setNodeVersion] = useState('18');
  const [steps, setSteps] = useState<string[]>(['checkout', 'setup-node', 'install', 'build', 'test']);
  const [output, setOutput] = useState('');

  const availableSteps = [
    { id: 'checkout', label: 'Checkout code' },
    { id: 'setup-node', label: 'Setup Node.js' },
    { id: 'setup-python', label: 'Setup Python' },
    { id: 'install', label: 'Install dependencies (npm)' },
    { id: 'build', label: 'Build' },
    { id: 'test', label: 'Run tests' },
    { id: 'lint', label: 'Lint' },
    { id: 'deploy', label: 'Deploy' },
    { id: 'cache', label: 'Cache dependencies' },
  ];

  const toggleStep = (stepId: string) => {
    setSteps((prev) =>
      prev.includes(stepId) ? prev.filter((s) => s !== stepId) : [...prev, stepId]
    );
  };

  const generate = () => {
    const branchList = branches.split(',').map((b) => b.trim()).filter(Boolean);
    let yaml = `name: ${workflowName}\n\n`;
    yaml += `on:\n`;
    yaml += `  ${trigger}:\n`;
    yaml += `    branches:\n`;
    branchList.forEach((b) => { yaml += `      - ${b}\n`; });
    yaml += `\njobs:\n`;
    yaml += `  build:\n`;
    yaml += `    runs-on: ubuntu-latest\n`;
    yaml += `    steps:\n`;

    steps.forEach((step) => {
      switch (step) {
        case 'checkout':
          yaml += `      - uses: actions/checkout@v4\n`;
          break;
        case 'setup-node':
          yaml += `      - uses: actions/setup-node@v4\n`;
          yaml += `        with:\n`;
          yaml += `          node-version: '${nodeVersion}'\n`;
          break;
        case 'setup-python':
          yaml += `      - uses: actions/setup-python@v5\n`;
          yaml += `        with:\n`;
          yaml += `          python-version: '3.x'\n`;
          break;
        case 'install':
          yaml += `      - run: npm ci\n`;
          break;
        case 'build':
          yaml += `      - run: npm run build\n`;
          break;
        case 'test':
          yaml += `      - run: npm test\n`;
          break;
        case 'lint':
          yaml += `      - run: npm run lint\n`;
          break;
        case 'deploy':
          yaml += `      - name: Deploy\n`;
          yaml += `        run: echo "Deploy step - customize as needed"\n`;
          break;
        case 'cache':
          yaml += `      - uses: actions/cache@v4\n`;
          yaml += `        with:\n`;
          yaml += `          path: ~/.npm\n`;
          yaml += `          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}\n`;
          break;
      }
    });

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Workflow Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="CI"
              aria-label={`Workflow name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-trigger`} className="block text-sm font-medium text-gray-700 mb-1">
                Trigger
              </label>
              <select
                id={`${toolId}-trigger`}
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                aria-label="Workflow trigger"
                className="input-field"
              >
                <option value="push">push</option>
                <option value="pull_request">pull_request</option>
                <option value="workflow_dispatch">workflow_dispatch</option>
                <option value="schedule">schedule</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-branches`} className="block text-sm font-medium text-gray-700 mb-1">
                Branches (comma-separated)
              </label>
              <input
                id={`${toolId}-branches`}
                type="text"
                value={branches}
                onChange={(e) => setBranches(e.target.value)}
                placeholder="main, develop"
                aria-label="Branches"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-node`} className="block text-sm font-medium text-gray-700 mb-1">
                Node.js Version
              </label>
              <input
                id={`${toolId}-node`}
                type="text"
                value={nodeVersion}
                onChange={(e) => setNodeVersion(e.target.value)}
                placeholder="18"
                aria-label="Node.js version"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
            <div className="flex flex-wrap gap-2">
              {availableSteps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleStep(s.id)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    steps.includes(s.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                  aria-label={`Toggle ${s.label} step`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate workflow YAML" className="btn-primary">
        Generate Workflow YAML
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Workflow</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
