'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DependabotConfigGenerator - Generate Dependabot .github/dependabot.yml configuration files.
 * Supports multiple package ecosystems, update schedules, and assignees.
 */
export default function DependabotConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ecosystem, setEcosystem] = useState('npm');
  const [directory, setDirectory] = useState('/');
  const [schedule, setSchedule] = useState('weekly');
  const [openPullRequestsLimit, setOpenPullRequestsLimit] = useState('5');
  const [assignees, setAssignees] = useState('');
  const [labels, setLabels] = useState('dependencies');
  const [output, setOutput] = useState('');

  const ecosystems = [
    { value: 'npm', label: 'npm (JavaScript/Node.js)' },
    { value: 'pip', label: 'pip (Python)' },
    { value: 'maven', label: 'Maven (Java)' },
    { value: 'gradle', label: 'Gradle (Java/Kotlin)' },
    { value: 'nuget', label: 'NuGet (.NET)' },
    { value: 'bundler', label: 'Bundler (Ruby)' },
    { value: 'composer', label: 'Composer (PHP)' },
    { value: 'cargo', label: 'Cargo (Rust)' },
    { value: 'gomod', label: 'Go Modules' },
    { value: 'docker', label: 'Docker' },
    { value: 'github-actions', label: 'GitHub Actions' },
    { value: 'terraform', label: 'Terraform' },
  ];

  const schedules = ['daily', 'weekly', 'monthly'];

  const generate = () => {
    const assigneeList = assignees.trim() ? assignees.split(',').map(a => a.trim()).filter(Boolean) : [];
    const labelList = labels.trim() ? labels.split(',').map(l => l.trim()).filter(Boolean) : [];

    let yml = `version: 2\nupdates:\n`;
    yml += `  - package-ecosystem: "${ecosystem}"\n`;
    yml += `    directory: "${directory}"\n`;
    yml += `    schedule:\n`;
    yml += `      interval: "${schedule}"\n`;
    yml += `    open-pull-requests-limit: ${openPullRequestsLimit}\n`;

    if (assigneeList.length > 0) {
      yml += `    assignees:\n`;
      assigneeList.forEach(a => { yml += `      - "${a}"\n`; });
    }

    if (labelList.length > 0) {
      yml += `    labels:\n`;
      labelList.forEach(l => { yml += `      - "${l}"\n`; });
    }

    setOutput(yml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-ecosystem`} className="block text-sm font-medium text-gray-700 mb-1">Package Ecosystem</label>
            <select id={`${toolId}-ecosystem`} value={ecosystem} onChange={(e) => setEcosystem(e.target.value)} aria-label={`Package ecosystem for ${toolName}`} className="input-field">
              {ecosystems.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-directory`} className="block text-sm font-medium text-gray-700 mb-1">Directory</label>
            <input id={`${toolId}-directory`} type="text" value={directory} onChange={(e) => setDirectory(e.target.value)} placeholder="/" aria-label="Package manifest directory" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-schedule`} className="block text-sm font-medium text-gray-700 mb-1">Schedule Interval</label>
            <select id={`${toolId}-schedule`} value={schedule} onChange={(e) => setSchedule(e.target.value)} aria-label="Update schedule interval" className="input-field">
              {schedules.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-limit`} className="block text-sm font-medium text-gray-700 mb-1">Open Pull Requests Limit</label>
            <input id={`${toolId}-limit`} type="number" min="1" max="100" value={openPullRequestsLimit} onChange={(e) => setOpenPullRequestsLimit(e.target.value)} aria-label="Open pull requests limit" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-assignees`} className="block text-sm font-medium text-gray-700 mb-1">Assignees (comma-separated)</label>
            <input id={`${toolId}-assignees`} type="text" value={assignees} onChange={(e) => setAssignees(e.target.value)} placeholder="username1, username2" aria-label="PR assignees" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-labels`} className="block text-sm font-medium text-gray-700 mb-1">Labels (comma-separated)</label>
            <input id={`${toolId}-labels`} type="text" value={labels} onChange={(e) => setLabels(e.target.value)} placeholder="dependencies, automated" aria-label="PR labels" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate dependabot.yml</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated dependabot.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
