'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StimulusControllerGenerator - Generate Stimulus.js controller boilerplate.
 * Creates ready-to-use Stimulus controllers with targets, values, and actions.
 */
export default function StimulusControllerGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [controllerName, setControllerName] = useState('');
  const [targets, setTargets] = useState('');
  const [values, setValues] = useState('');
  const [actions, setActions] = useState('');
  const [useTypeScript, setUseTypeScript] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = controllerName.trim() || 'example';
    const targetList = targets.split(',').map(t => t.trim()).filter(Boolean);
    const valueList = values.split(',').map(v => v.trim()).filter(Boolean);
    const actionList = actions.split(',').map(a => a.trim()).filter(Boolean);

    const className = name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Controller';

    let code = '';

    if (useTypeScript) {
      code += `import { Controller } from "@hotwired/stimulus"\n\n`;
      code += `// Connects to data-controller="${name}"\n`;
      code += `export default class ${className} extends Controller {\n`;

      if (targetList.length > 0) {
        code += `  static targets: string[] = [${targetList.map(t => `"${t}"`).join(', ')}]\n\n`;
        targetList.forEach(t => {
          code += `  declare readonly ${t}Target: HTMLElement\n`;
          code += `  declare readonly has${t.charAt(0).toUpperCase() + t.slice(1)}Target: boolean\n`;
        });
        code += '\n';
      }

      if (valueList.length > 0) {
        code += `  static values = {\n`;
        valueList.forEach(v => {
          code += `    ${v}: { type: String, default: "" },\n`;
        });
        code += `  }\n\n`;
        valueList.forEach(v => {
          code += `  declare ${v}Value: string\n`;
        });
        code += '\n';
      }

      code += `  connect(): void {\n`;
      code += `    console.log("${className} connected")\n`;
      code += `  }\n\n`;

      code += `  disconnect(): void {\n`;
      code += `    // Cleanup when controller disconnects\n`;
      code += `  }\n`;

      actionList.forEach(a => {
        code += `\n  ${a}(event: Event): void {\n`;
        code += `    // Handle ${a} action\n`;
        code += `  }\n`;
      });

      code += `}\n`;
    } else {
      code += `import { Controller } from "@hotwired/stimulus"\n\n`;
      code += `// Connects to data-controller="${name}"\n`;
      code += `export default class extends Controller {\n`;

      if (targetList.length > 0) {
        code += `  static targets = [${targetList.map(t => `"${t}"`).join(', ')}]\n\n`;
      }

      if (valueList.length > 0) {
        code += `  static values = {\n`;
        valueList.forEach(v => {
          code += `    ${v}: { type: String, default: "" },\n`;
        });
        code += `  }\n\n`;
      }

      code += `  connect() {\n`;
      code += `    console.log("${className} connected")\n`;
      code += `  }\n\n`;

      code += `  disconnect() {\n`;
      code += `    // Cleanup when controller disconnects\n`;
      code += `  }\n`;

      actionList.forEach(a => {
        code += `\n  ${a}(event) {\n`;
        code += `    // Handle ${a} action\n`;
        code += `  }\n`;
      });

      code += `}\n`;
    }

    // Generate HTML usage example
    const htmlExample = generateHtmlExample(name, targetList, actionList);
    code += `\n/* --- HTML Usage Example --- */\n/*\n${htmlExample}\n*/\n`;

    setOutput(code);
  };

  const generateHtmlExample = (name: string, targetList: string[], actionList: string[]) => {
    let html = `<div data-controller="${name}">\n`;
    targetList.forEach(t => {
      html += `  <div data-${name}-target="${t}"></div>\n`;
    });
    actionList.forEach(a => {
      html += `  <button data-action="click->${name}#${a}">Trigger ${a}</button>\n`;
    });
    html += `</div>`;
    return html;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Controller Name (kebab-case)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={controllerName}
          onChange={(e) => setControllerName(e.target.value)}
          placeholder="e.g. search, dropdown-menu, modal"
          aria-label={`Controller name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-targets`} className="block text-sm font-medium text-gray-700 mb-1">
          Targets (comma-separated)
        </label>
        <input
          id={`${toolId}-targets`}
          type="text"
          value={targets}
          onChange={(e) => setTargets(e.target.value)}
          placeholder="e.g. input, output, button"
          aria-label={`Targets for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-values`} className="block text-sm font-medium text-gray-700 mb-1">
          Values (comma-separated)
        </label>
        <input
          id={`${toolId}-values`}
          type="text"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          placeholder="e.g. url, count, label"
          aria-label={`Values for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-actions`} className="block text-sm font-medium text-gray-700 mb-1">
          Actions (comma-separated)
        </label>
        <input
          id={`${toolId}-actions`}
          type="text"
          value={actions}
          onChange={(e) => setActions(e.target.value)}
          placeholder="e.g. search, toggle, submit"
          aria-label={`Actions for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex items-center gap-2">
        <input
          id={`${toolId}-ts`}
          type="checkbox"
          checked={useTypeScript}
          onChange={(e) => setUseTypeScript(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor={`${toolId}-ts`} className="text-sm font-medium text-gray-700">
          Generate TypeScript
        </label>
      </div>

      <button onClick={generate} className="btn-primary" aria-label="Generate Stimulus controller">
        Generate Controller
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Stimulus Controller</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
