'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AlpineJsSnippetGenerator - Generate Alpine.js component snippets.
 * Produces ready-to-use Alpine.js boilerplate for common UI patterns.
 */
export default function AlpineJsSnippetGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentType, setComponentType] = useState('dropdown');
  const [componentName, setComponentName] = useState('');
  const [output, setOutput] = useState('');

  const templates: Record<string, (name: string) => string> = {
    dropdown: (name) => `<!-- Alpine.js Dropdown: ${name || 'Menu'} -->
<div x-data="{ open: false }" class="relative">
  <button @click="open = !open" @click.outside="open = false"
    class="px-4 py-2 bg-blue-600 text-white rounded">
    ${name || 'Menu'} <span x-text="open ? '▲' : '▼'"></span>
  </button>
  <div x-show="open" x-transition class="absolute mt-2 w-48 bg-white border rounded shadow-lg z-10">
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Item 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Item 2</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100">Item 3</a>
  </div>
</div>`,
    modal: (name) => `<!-- Alpine.js Modal: ${name || 'Dialog'} -->
<div x-data="{ showModal: false }">
  <button @click="showModal = true" class="px-4 py-2 bg-blue-600 text-white rounded">
    Open ${name || 'Dialog'}
  </button>
  <div x-show="showModal" x-transition.opacity class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div @click.outside="showModal = false" x-transition
      class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <h2 class="text-xl font-bold mb-4">${name || 'Dialog'}</h2>
      <p class="text-gray-600 mb-4">Your content goes here.</p>
      <button @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">Close</button>
    </div>
  </div>
</div>`,
    tabs: (name) => `<!-- Alpine.js Tabs: ${name || 'Tabs'} -->
<div x-data="{ activeTab: 'tab1' }">
  <div class="flex border-b">
    <button @click="activeTab = 'tab1'" :class="activeTab === 'tab1' ? 'border-blue-500 text-blue-600' : 'border-transparent'"
      class="px-4 py-2 border-b-2 font-medium">Tab 1</button>
    <button @click="activeTab = 'tab2'" :class="activeTab === 'tab2' ? 'border-blue-500 text-blue-600' : 'border-transparent'"
      class="px-4 py-2 border-b-2 font-medium">Tab 2</button>
    <button @click="activeTab = 'tab3'" :class="activeTab === 'tab3' ? 'border-blue-500 text-blue-600' : 'border-transparent'"
      class="px-4 py-2 border-b-2 font-medium">Tab 3</button>
  </div>
  <div class="p-4">
    <div x-show="activeTab === 'tab1'">Content for Tab 1</div>
    <div x-show="activeTab === 'tab2'">Content for Tab 2</div>
    <div x-show="activeTab === 'tab3'">Content for Tab 3</div>
  </div>
</div>`,
    accordion: (name) => `<!-- Alpine.js Accordion: ${name || 'Accordion'} -->
<div x-data="{ active: null }" class="space-y-2">
  <template x-for="(item, index) in [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' }
  ]" :key="index">
    <div class="border rounded">
      <button @click="active = active === index ? null : index"
        class="w-full px-4 py-3 text-left font-medium flex justify-between items-center">
        <span x-text="item.title"></span>
        <span x-text="active === index ? '−' : '+'"></span>
      </button>
      <div x-show="active === index" x-collapse class="px-4 pb-3">
        <p x-text="item.content" class="text-gray-600"></p>
      </div>
    </div>
  </template>
</div>`,
    toggle: (name) => `<!-- Alpine.js Toggle: ${name || 'Switch'} -->
<div x-data="{ enabled: false }">
  <label class="flex items-center cursor-pointer gap-3">
    <span class="text-sm font-medium" x-text="enabled ? 'Enabled' : 'Disabled'"></span>
    <button @click="enabled = !enabled" :class="enabled ? 'bg-blue-600' : 'bg-gray-300'"
      class="relative w-12 h-6 rounded-full transition-colors">
      <span :class="enabled ? 'translate-x-6' : 'translate-x-1'"
        class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
    </button>
  </label>
</div>`,
    toast: (name) => `<!-- Alpine.js Toast Notification: ${name || 'Toast'} -->
<div x-data="{ show: false, message: '' }" @notify.window="message = $event.detail; show = true; setTimeout(() => show = false, 3000)">
  <button @click="$dispatch('notify', '${name || 'Toast'} notification!')"
    class="px-4 py-2 bg-green-600 text-white rounded">
    Show ${name || 'Toast'}
  </button>
  <div x-show="show" x-transition class="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
    <span x-text="message"></span>
  </div>
</div>`,
  };

  const generate = () => {
    const template = templates[componentType];
    if (template) {
      setOutput(template(componentName));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Type
        </label>
        <select
          id={`${toolId}-type`}
          value={componentType}
          onChange={(e) => setComponentType(e.target.value)}
          aria-label={`Component type for ${toolName}`}
          className="input-field"
        >
          <option value="dropdown">Dropdown Menu</option>
          <option value="modal">Modal Dialog</option>
          <option value="tabs">Tabs</option>
          <option value="accordion">Accordion</option>
          <option value="toggle">Toggle Switch</option>
          <option value="toast">Toast Notification</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Name (optional)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="e.g. Settings, Navigation..."
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Alpine.js snippet">
        Generate Snippet
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Alpine.js Snippet</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
