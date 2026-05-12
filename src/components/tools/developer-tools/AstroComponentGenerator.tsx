'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AstroComponentGenerator - Generate Astro component boilerplate code.
 * Supports frontmatter props, slots, client directives, and TypeScript.
 */
export default function AstroComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [props, setProps] = useState('');
  const [hasSlot, setHasSlot] = useState(false);
  const [hasNamedSlots, setHasNamedSlots] = useState(false);
  const [namedSlots, setNamedSlots] = useState('');
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [hasStyles, setHasStyles] = useState(false);
  const [hasScript, setHasScript] = useState(false);
  const [clientDirective, setClientDirective] = useState('none');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!componentName.trim()) return;

    const name = componentName.trim();
    const propsList = props.trim() ? props.split(',').map((p) => p.trim()).filter(Boolean) : [];

    let code = '---\n';

    if (useTypeScript && propsList.length > 0) {
      code += `interface Props {\n`;
      propsList.forEach((prop) => {
        const [propName, propType] = prop.includes(':') ? prop.split(':').map((s) => s.trim()) : [prop, 'string'];
        code += `  ${propName}: ${propType};\n`;
      });
      code += `}\n\n`;
      code += `const { ${propsList.map((p) => p.split(':')[0].trim()).join(', ')} } = Astro.props as Props;\n`;
    } else if (propsList.length > 0) {
      code += `const { ${propsList.map((p) => p.split(':')[0].trim()).join(', ')} } = Astro.props;\n`;
    }

    code += '---\n\n';

    code += `<div class="${name.toLowerCase()}">\n`;
    code += `  <h2>{${propsList.length > 0 ? propsList[0].split(':')[0].trim() : `"${name}"`}}</h2>\n`;

    if (hasSlot) {
      code += `  <slot />\n`;
    }

    if (hasNamedSlots && namedSlots.trim()) {
      namedSlots.split(',').map((s) => s.trim()).filter(Boolean).forEach((slot) => {
        code += `  <slot name="${slot}" />\n`;
      });
    }

    if (hasScript) {
      code += `  <${name.toLowerCase()}-counter>\n`;
      code += `    <button>Count: 0</button>\n`;
      code += `  </${name.toLowerCase()}-counter>\n`;
    }

    code += `</div>\n`;

    if (hasStyles) {
      code += `\n<style>\n  .${name.toLowerCase()} {\n    padding: 1rem;\n  }\n\n  h2 {\n    margin-bottom: 0.5rem;\n  }\n</style>\n`;
    }

    if (hasScript) {
      code += `\n<script>\n  class ${name}Counter extends HTMLElement {\n    connectedCallback() {\n      let count = 0;\n      const btn = this.querySelector('button')!;\n      btn.addEventListener('click', () => {\n        count++;\n        btn.textContent = \`Count: \${count}\`;\n      });\n    }\n  }\n  customElements.define('${name.toLowerCase()}-counter', ${name}Counter);\n</script>\n`;
    }

    // Usage example
    code += `\n<!-- Usage Example -->\n`;
    code += `<!-- import ${name} from '../components/${name}.astro'; -->\n`;

    if (clientDirective !== 'none' && hasScript) {
      code += `<!-- <${name} ${propsList.map((p) => `${p.split(':')[0].trim()}="value"`).join(' ')} client:${clientDirective} /> -->\n`;
    } else {
      code += `<!-- <${name} ${propsList.map((p) => `${p.split(':')[0].trim()}="value"`).join(' ')} /> -->\n`;
    }

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
          <input id={`${toolId}-name`} type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} placeholder="e.g. HeroSection" aria-label={`Component name for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-props`} className="block text-sm font-medium text-gray-700 mb-1">Props (comma-separated, name:type)</label>
          <input id={`${toolId}-props`} type="text" value={props} onChange={(e) => setProps(e.target.value)} placeholder="e.g. title:string, count:number" aria-label={`Props for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-directive`} className="block text-sm font-medium text-gray-700 mb-1">Client Directive</label>
        <select id={`${toolId}-directive`} value={clientDirective} onChange={(e) => setClientDirective(e.target.value)} aria-label={`Client directive for ${toolName}`} className="input-field w-48">
          <option value="none">None (static)</option>
          <option value="load">client:load</option>
          <option value="idle">client:idle</option>
          <option value="visible">client:visible</option>
          <option value="media">client:media</option>
          <option value="only">client:only</option>
        </select>
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypeScript} onChange={(e) => setUseTypeScript(e.target.checked)} className="rounded" />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hasSlot} onChange={(e) => setHasSlot(e.target.checked)} className="rounded" />
          Default Slot
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hasStyles} onChange={(e) => setHasStyles(e.target.checked)} className="rounded" />
          Scoped Styles
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hasScript} onChange={(e) => setHasScript(e.target.checked)} className="rounded" />
          Client Script
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hasNamedSlots} onChange={(e) => setHasNamedSlots(e.target.checked)} className="rounded" />
          Named Slots
        </label>
      </div>

      {hasNamedSlots && (
        <InputArea>
          <label htmlFor={`${toolId}-named-slots`} className="block text-sm font-medium text-gray-700 mb-1">Named Slots (comma-separated)</label>
          <input id={`${toolId}-named-slots`} type="text" value={namedSlots} onChange={(e) => setNamedSlots(e.target.value)} placeholder="e.g. header, footer, sidebar" aria-label={`Named slots for ${toolName}`} className="input-field" />
        </InputArea>
      )}

      <button onClick={generate} aria-label="Generate Astro component" className="btn-primary">Generate Component</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Astro Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
