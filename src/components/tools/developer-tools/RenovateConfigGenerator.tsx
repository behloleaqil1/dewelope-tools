'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RenovateConfigGenerator - Generate Renovate renovate.json configuration files.
 * Supports presets, schedule, automerge, and package rules.
 */
export default function RenovateConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [preset, setPreset] = useState('config:base');
  const [schedule, setSchedule] = useState('before 5am on monday');
  const [automerge, setAutomerge] = useState(false);
  const [automergeType, setAutomergeType] = useState('pr');
  const [labels, setLabels] = useState('renovate');
  const [assignees, setAssignees] = useState('');
  const [rangeStrategy, setRangeStrategy] = useState('auto');
  const [pinDigests, setPinDigests] = useState(true);
  const [output, setOutput] = useState('');

  const presets = [
    'config:base',
    'config:recommended',
    ':semanticCommits',
    ':preserveSemverRanges',
    ':pinAllExceptPeerDependencies',
    'group:allNonMajor',
  ];

  const rangeStrategies = ['auto', 'pin', 'bump', 'replace', 'widen'];

  const generate = () => {
    const config: Record<string, unknown> = {
      $schema: 'https://docs.renovatebot.com/renovate-schema.json',
      extends: [preset],
    };

    if (schedule) config.schedule = [schedule];
    if (labels.trim()) config.labels = labels.split(',').map(l => l.trim()).filter(Boolean);
    if (assignees.trim()) config.assignees = assignees.split(',').map(a => a.trim()).filter(Boolean);
    if (rangeStrategy !== 'auto') config.rangeStrategy = rangeStrategy;
    if (pinDigests) config.pinDigests = true;

    if (automerge) {
      config.packageRules = [
        {
          matchUpdateTypes: ['minor', 'patch'],
          automerge: true,
          automergeType: automergeType,
        },
      ];
    }

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-preset`} className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
            <select id={`${toolId}-preset`} value={preset} onChange={(e) => setPreset(e.target.value)} aria-label={`Renovate preset for ${toolName}`} className="input-field">
              {presets.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-schedule`} className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <input id={`${toolId}-schedule`} type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="before 5am on monday" aria-label="Renovate schedule" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-range`} className="block text-sm font-medium text-gray-700 mb-1">Range Strategy</label>
            <select id={`${toolId}-range`} value={rangeStrategy} onChange={(e) => setRangeStrategy(e.target.value)} aria-label="Range strategy" className="input-field">
              {rangeStrategies.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-automerge`} type="checkbox" checked={automerge} onChange={(e) => setAutomerge(e.target.checked)} aria-label="Enable automerge" className="rounded" />
            <label htmlFor={`${toolId}-automerge`} className="text-sm font-medium text-gray-700">Enable Automerge (minor/patch)</label>
          </div>
          {automerge && (
            <div>
              <label htmlFor={`${toolId}-automerge-type`} className="block text-sm font-medium text-gray-700 mb-1">Automerge Type</label>
              <select id={`${toolId}-automerge-type`} value={automergeType} onChange={(e) => setAutomergeType(e.target.value)} aria-label="Automerge type" className="input-field">
                <option value="pr">PR</option>
                <option value="branch">Branch</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input id={`${toolId}-pin-digests`} type="checkbox" checked={pinDigests} onChange={(e) => setPinDigests(e.target.checked)} aria-label="Pin digests" className="rounded" />
            <label htmlFor={`${toolId}-pin-digests`} className="text-sm font-medium text-gray-700">Pin Digests</label>
          </div>
          <div>
            <label htmlFor={`${toolId}-labels`} className="block text-sm font-medium text-gray-700 mb-1">Labels (comma-separated)</label>
            <input id={`${toolId}-labels`} type="text" value={labels} onChange={(e) => setLabels(e.target.value)} placeholder="renovate, dependencies" aria-label="PR labels" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-assignees`} className="block text-sm font-medium text-gray-700 mb-1">Assignees (comma-separated)</label>
            <input id={`${toolId}-assignees`} type="text" value={assignees} onChange={(e) => setAssignees(e.target.value)} placeholder="username1" aria-label="PR assignees" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate renovate.json</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated renovate.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
