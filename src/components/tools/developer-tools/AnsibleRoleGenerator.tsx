'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnsibleRoleGenerator - Generate Ansible role directory structure as YAML.
 * Creates a complete role scaffold with tasks, handlers, templates, files,
 * vars, defaults, and meta directories.
 */
export default function AnsibleRoleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [roleName, setRoleName] = useState('');
  const [includeHandlers, setIncludeHandlers] = useState(true);
  const [includeTemplates, setIncludeTemplates] = useState(true);
  const [includeFiles, setIncludeFiles] = useState(true);
  const [includeVars, setIncludeVars] = useState(true);
  const [includeDefaults, setIncludeDefaults] = useState(true);
  const [includeMeta, setIncludeMeta] = useState(true);
  const [includeTests, setIncludeTests] = useState(false);
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = roleName.trim() || 'my_role';
    const lines: string[] = [];

    lines.push(`# Ansible Role: ${name}`);
    lines.push(`# Generated directory structure and boilerplate files`);
    lines.push('');
    lines.push('---');
    lines.push(`# Directory structure for roles/${name}/`);
    lines.push('');

    // tasks/main.yml
    lines.push(`# roles/${name}/tasks/main.yml`);
    lines.push('---');
    lines.push(`# Tasks for ${name}`);
    lines.push(`- name: Include ${name} tasks`);
    lines.push('  ansible.builtin.debug:');
    lines.push(`    msg: "Running ${name} role"`);
    lines.push('');

    // handlers/main.yml
    if (includeHandlers) {
      lines.push(`# roles/${name}/handlers/main.yml`);
      lines.push('---');
      lines.push(`# Handlers for ${name}`);
      lines.push(`- name: Restart ${name} service`);
      lines.push('  ansible.builtin.service:');
      lines.push(`    name: ${name}`);
      lines.push('    state: restarted');
      lines.push('');
    }

    // templates
    if (includeTemplates) {
      lines.push(`# roles/${name}/templates/`);
      lines.push(`# Place Jinja2 templates (.j2) here`);
      lines.push(`# Example: roles/${name}/templates/${name}.conf.j2`);
      lines.push('');
    }

    // files
    if (includeFiles) {
      lines.push(`# roles/${name}/files/`);
      lines.push('# Place static files to be deployed here');
      lines.push('');
    }

    // vars/main.yml
    if (includeVars) {
      lines.push(`# roles/${name}/vars/main.yml`);
      lines.push('---');
      lines.push(`# Role-specific variables for ${name}`);
      lines.push(`${name}_version: "1.0.0"`);
      lines.push(`${name}_port: 8080`);
      lines.push('');
    }

    // defaults/main.yml
    if (includeDefaults) {
      lines.push(`# roles/${name}/defaults/main.yml`);
      lines.push('---');
      lines.push(`# Default variables (lowest priority) for ${name}`);
      lines.push(`${name}_enabled: true`);
      lines.push(`${name}_user: "${name}"`);
      lines.push(`${name}_group: "${name}"`);
      lines.push('');
    }

    // meta/main.yml
    if (includeMeta) {
      lines.push(`# roles/${name}/meta/main.yml`);
      lines.push('---');
      lines.push('galaxy_info:');
      lines.push(`  author: ${author || 'Your Name'}`);
      lines.push(`  description: ${description || `Ansible role for ${name}`}`);
      lines.push('  license: MIT');
      lines.push('  min_ansible_version: "2.9"');
      lines.push('  platforms:');
      lines.push('    - name: Ubuntu');
      lines.push('      versions:');
      lines.push('        - focal');
      lines.push('        - jammy');
      lines.push('    - name: EL');
      lines.push('      versions:');
      lines.push('        - "8"');
      lines.push('        - "9"');
      lines.push('  galaxy_tags:');
      lines.push(`    - ${name}`);
      lines.push('dependencies: []');
      lines.push('');
    }

    // tests
    if (includeTests) {
      lines.push(`# roles/${name}/tests/test.yml`);
      lines.push('---');
      lines.push('- hosts: localhost');
      lines.push('  remote_user: root');
      lines.push('  roles:');
      lines.push(`    - ${name}`);
      lines.push('');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., nginx, postgresql, app_deploy"
              aria-label={`Role name for ${toolName}`}
              className="input-field w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              aria-label="Author name"
              className="input-field"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Role description"
              aria-label="Role description"
              className="input-field"
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeHandlers} onChange={(e) => setIncludeHandlers(e.target.checked)} /> Handlers
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeTemplates} onChange={(e) => setIncludeTemplates(e.target.checked)} /> Templates
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeFiles} onChange={(e) => setIncludeFiles(e.target.checked)} /> Files
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeVars} onChange={(e) => setIncludeVars(e.target.checked)} /> Vars
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeDefaults} onChange={(e) => setIncludeDefaults(e.target.checked)} /> Defaults
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeMeta} onChange={(e) => setIncludeMeta(e.target.checked)} /> Meta
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={includeTests} onChange={(e) => setIncludeTests(e.target.checked)} /> Tests
            </label>
          </div>
          <button onClick={generate} className="btn-primary text-sm">
            Generate Ansible Role
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Role Structure</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
