'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EmberComponentGenerator - Generate Ember.js component boilerplate.
 * Creates Glimmer components with tracked properties, actions, and template code.
 */
export default function EmberComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [style, setStyle] = useState<'glimmer' | 'classic'>('glimmer');
  const [includeTracked, setIncludeTracked] = useState(true);
  const [includeActions, setIncludeActions] = useState(true);
  const [includeTemplate, setIncludeTemplate] = useState(true);
  const [useTypeScript, setUseTypeScript] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';
    const parts: string[] = [];

    if (style === 'glimmer') {
      const ext = useTypeScript ? 'ts' : 'js';
      let jsCode = `// app/components/${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}.${ext}\n`;
      jsCode += `import Component from '@glimmer/component';\n`;

      if (includeTracked) {
        jsCode += `import { tracked } from '@glimmer/tracking';\n`;
      }
      if (includeActions) {
        jsCode += `import { action } from '@ember/object';\n`;
      }

      if (useTypeScript) {
        jsCode += `\ninterface ${name}Args {\n  // Define arguments here\n}\n`;
        jsCode += `\nexport default class ${name} extends Component<{ Args: ${name}Args }> {\n`;
      } else {
        jsCode += `\nexport default class ${name} extends Component {\n`;
      }

      if (includeTracked) {
        jsCode += `  @tracked count = 0;\n  @tracked message = '';\n\n`;
      }

      if (includeActions) {
        jsCode += `  @action\n  increment() {\n    this.count++;\n  }\n\n`;
        jsCode += `  @action\n  updateMessage(event${useTypeScript ? ': Event' : ''}) {\n    this.message = (event.target${useTypeScript ? ' as HTMLInputElement' : ''}).value;\n  }\n`;
      }

      jsCode += `}`;
      parts.push(jsCode);

      if (includeTemplate) {
        const kebabName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        let template = `\n\n// app/components/${kebabName}.hbs\n`;
        template += `<div class="${kebabName}">\n`;
        template += `  <h2>${name}</h2>\n`;
        if (includeTracked && includeActions) {
          template += `  <p>Count: {{this.count}}</p>\n`;
          template += `  <button type="button" {{on "click" this.increment}}>Increment</button>\n`;
          template += `  <input value={{this.message}} {{on "input" this.updateMessage}} />\n`;
        } else {
          template += `  <p>Hello from ${name}</p>\n`;
          template += `  {{yield}}\n`;
        }
        template += `</div>`;
        parts.push(template);
      }
    } else {
      const ext = useTypeScript ? 'ts' : 'js';
      let jsCode = `// app/components/${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}.${ext}\n`;
      jsCode += `import Component from '@ember/component';\n`;
      jsCode += `import { computed } from '@ember/object';\n`;

      if (includeActions) {
        jsCode += `import { action } from '@ember/object';\n`;
      }

      jsCode += `\nexport default Component.extend({\n`;
      jsCode += `  tagName: 'div',\n`;
      jsCode += `  classNames: ['${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}'],\n\n`;

      if (includeTracked) {
        jsCode += `  count: 0,\n  message: '',\n\n`;
        jsCode += `  doubleCount: computed('count', function() {\n    return this.count * 2;\n  }),\n\n`;
      }

      if (includeActions) {
        jsCode += `  actions: {\n    increment() {\n      this.incrementProperty('count');\n    },\n  },\n`;
      }

      jsCode += `});`;
      parts.push(jsCode);

      if (includeTemplate) {
        const kebabName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        let template = `\n\n// app/templates/components/${kebabName}.hbs\n`;
        template += `<h2>${name}</h2>\n`;
        if (includeTracked && includeActions) {
          template += `<p>Count: {{this.count}}</p>\n`;
          template += `<button type="button" {{action "increment"}}>Increment</button>\n`;
        } else {
          template += `<p>Hello from ${name}</p>\n`;
        }
        template += `{{yield}}`;
        parts.push(template);
      }
    }

    setOutput(parts.join(''));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="MyComponent"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Component Style</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'glimmer'} onChange={() => setStyle('glimmer')} className="text-blue-600" />
            <span className="text-sm">Glimmer Component (Modern)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'classic'} onChange={() => setStyle('classic')} className="text-blue-600" />
            <span className="text-sm">Classic Component</span>
          </label>
        </div>
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeTracked} onChange={(e) => setIncludeTracked(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Tracked Properties</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeActions} onChange={(e) => setIncludeActions(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Actions</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeTemplate} onChange={(e) => setIncludeTemplate(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Template</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={useTypeScript} onChange={(e) => setUseTypeScript(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">TypeScript</span>
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Ember component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Ember.js Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
