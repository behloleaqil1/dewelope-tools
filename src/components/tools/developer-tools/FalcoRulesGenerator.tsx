'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FalcoRulesGenerator - Generate Falco runtime security rules YAML.
 */
export default function FalcoRulesGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ruleName, setRuleName] = useState('Detect Suspicious Process');
  const [description, setDescription] = useState('Detects suspicious process execution in containers');
  const [condition, setCondition] = useState('spawned_process and container and proc.name in (bash, sh, curl, wget)');
  const [priority, setPriority] = useState('WARNING');
  const [outputMsg, setOutputMsg] = useState('Suspicious process started (user=%user.name command=%proc.cmdline container=%container.name)');
  const [tags, setTags] = useState('container, process, security');
  const [enabled, setEnabled] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const yaml = `- rule: ${ruleName}
  desc: ${description}
  condition: ${condition}
  output: "${outputMsg}"
  priority: ${priority}
  enabled: ${enabled}
  tags: [${tagList.join(', ')}]
`;
    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input id={`${toolId}-name`} type="text" value={ruleName} onChange={(e) => setRuleName(e.target.value)} className="input-field" aria-label={`Rule name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" aria-label="Rule description" />
          </div>
          <div>
            <label htmlFor={`${toolId}-condition`} className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <textarea id={`${toolId}-condition`} value={condition} onChange={(e) => setCondition(e.target.value)} className="input-field h-20 resize-y font-mono" aria-label="Falco condition expression" />
          </div>
          <div>
            <label htmlFor={`${toolId}-output`} className="block text-sm font-medium text-gray-700 mb-1">Output Message</label>
            <input id={`${toolId}-output`} type="text" value={outputMsg} onChange={(e) => setOutputMsg(e.target.value)} className="input-field font-mono" aria-label="Output message template" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-priority`} className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select id={`${toolId}-priority`} value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field" aria-label="Rule priority">
                <option value="EMERGENCY">EMERGENCY</option>
                <option value="ALERT">ALERT</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="ERROR">ERROR</option>
                <option value="WARNING">WARNING</option>
                <option value="NOTICE">NOTICE</option>
                <option value="INFORMATIONAL">INFORMATIONAL</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-enabled`} className="block text-sm font-medium text-gray-700 mb-1">Enabled</label>
              <select id={`${toolId}-enabled`} value={enabled ? 'true' : 'false'} onChange={(e) => setEnabled(e.target.value === 'true')} className="input-field" aria-label="Rule enabled state">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-tags`} className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input id={`${toolId}-tags`} type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input-field" aria-label="Rule tags" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Falco Rule YAML</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Falco Rule</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
