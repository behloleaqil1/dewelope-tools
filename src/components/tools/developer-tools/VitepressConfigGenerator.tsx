'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VitepressConfigGenerator - Generate VitePress config.ts configuration files.
 * Allows users to set site title, description, theme, nav, and sidebar options.
 */
export default function VitepressConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [siteTitle, setSiteTitle] = useState('My Docs');
  const [siteDescription, setSiteDescription] = useState('A VitePress site');
  const [baseUrl, setBaseUrl] = useState('/');
  const [themeColor, setThemeColor] = useState('default');
  const [navItems, setNavItems] = useState('Home:/\nGuide:/guide/');
  const [sidebarItems, setSidebarItems] = useState('Getting Started:/guide/getting-started\nConfiguration:/guide/configuration');
  const [output, setOutput] = useState('');

  const generate = () => {
    const navParsed = navItems
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => {
        const [text, link] = l.split(':');
        return `      { text: '${(text || '').trim()}', link: '${(link || '/').trim()}' }`;
      });

    const sidebarParsed = sidebarItems
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => {
        const [text, link] = l.split(':');
        return `        { text: '${(text || '').trim()}', link: '${(link || '/').trim()}' }`;
      });

    const config = `import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '${siteTitle}',
  description: '${siteDescription}',
  base: '${baseUrl}',
  themeConfig: {
    nav: [
${navParsed.join(',\n')}
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
${sidebarParsed.join(',\n')}
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ]
  }${themeColor !== 'default' ? `,\n  appearance: '${themeColor}'` : ''}
})
`;
    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">
              Site Title
            </label>
            <input
              id={`${toolId}-title`}
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="input-field"
              aria-label={`Site title for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">
              Site Description
            </label>
            <input
              id={`${toolId}-desc`}
              type="text"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="input-field"
              aria-label="Site description"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
              Base URL
            </label>
            <input
              id={`${toolId}-base`}
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="input-field"
              aria-label="Base URL"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">
              Appearance
            </label>
            <select
              id={`${toolId}-theme`}
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="input-field"
              aria-label="Theme appearance"
            >
              <option value="default">Default (auto)</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-nav`} className="block text-sm font-medium text-gray-700 mb-1">
            Nav Items (Text:Link per line)
          </label>
          <textarea
            id={`${toolId}-nav`}
            value={navItems}
            onChange={(e) => setNavItems(e.target.value)}
            className="input-field h-20 resize-y font-mono text-sm"
            aria-label="Navigation items"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-sidebar`} className="block text-sm font-medium text-gray-700 mb-1">
            Sidebar Items (Text:Link per line)
          </label>
          <textarea
            id={`${toolId}-sidebar`}
            value={sidebarItems}
            onChange={(e) => setSidebarItems(e.target.value)}
            className="input-field h-20 resize-y font-mono text-sm"
            aria-label="Sidebar items"
          />
        </div>
        <button onClick={generate} className="btn-primary mt-4">
          Generate Config
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">config.ts</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
