'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnsiblePlaybookGenerator - Generate Ansible playbook YAML from form inputs.
 */
export default function AnsiblePlaybookGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [playbookName, setPlaybookName] = useState('');
  const [hosts, setHosts] = useState('all');
  const [becomeRoot, setBecomeRoot] = useState(true);
  const [tasks, setTasks] = useState([{ name: '', module: 'shell', args: '' }]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const modules = ['shell', 'command', 'copy', 'template', 'apt', 'yum', 'service', 'file', 'lineinfile', 'git', 'pip', 'docker_container'];

  const addTask = () => {
    setTasks([...tasks, { name: '', module: 'shell', args: '' }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, field: string, value: string) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!playbookName.trim()) {
      setError('Please enter a playbook name.');
      return;
    }

    const validTasks = tasks.filter((t) => t.name.trim() && t.args.trim());
    if (validTasks.length === 0) {
      setError('Please add at least one task with a name and arguments.');
      return;
    }

    let yaml = '---\n';
    yaml += `- name: ${playbookName}\n`;
    yaml += `  hosts: ${hosts}\n`;
    if (becomeRoot) {
      yaml += '  become: yes\n';
    }
    yaml += '  tasks:\n';

    validTasks.forEach((task) => {
      yaml += `    - name: ${task.name}\n`;
      yaml += `      ${task.module}:\n`;
      const args = task.args.split('\n').filter((a) => a.trim());
      args.forEach((arg) => {
        yaml += `        ${arg.trim()}\n`;
      });
    });

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Playbook Name</label>
            <input id={`${toolId}-name`} type="text" value={playbookName} onChange={(e) => setPlaybookName(e.target.value)} placeholder="e.g. Deploy Web Application" aria-label={`Playbook name for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-hosts`} className="block text-sm font-medium text-gray-700 mb-1">Hosts</label>
              <input id={`${toolId}-hosts`} type="text" value={hosts} onChange={(e) => setHosts(e.target.value)} placeholder="all" aria-label="Target hosts" className="input-field" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={becomeRoot} onChange={(e) => setBecomeRoot(e.target.checked)} className="rounded" />
                Become root (sudo)
              </label>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Tasks</label>
            {tasks.map((task, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500">Task {i + 1}</span>
                  {tasks.length > 1 && (
                    <button onClick={() => removeTask(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
                <input type="text" value={task.name} onChange={(e) => updateTask(i, 'name', e.target.value)} placeholder="Task name" aria-label={`Task ${i + 1} name`} className="input-field" />
                <select value={task.module} onChange={(e) => updateTask(i, 'module', e.target.value)} aria-label={`Task ${i + 1} module`} className="input-field">
                  {modules.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <textarea value={task.args} onChange={(e) => updateTask(i, 'args', e.target.value)} placeholder="key: value (one per line)" aria-label={`Task ${i + 1} arguments`} className="input-field h-20 resize-y font-mono text-sm" />
              </div>
            ))}
            <button onClick={addTask} className="text-sm text-blue-600 hover:text-blue-800">+ Add Task</button>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Ansible playbook">Generate Playbook</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Playbook YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
