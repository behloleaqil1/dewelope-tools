'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StarlightConfigGenerator - Generate Astro Starlight docs configuration files.
 * Creates astro.config.mjs with Starlight integration settings.
 */
export default function StarlightConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [siteTitle, setSiteTitle] = useState('My Docs');
  const [description, setDescription] = useState('Documentation built with Starlight');
  const [defaultLocale, setDefaultLocale] = useState('en');
  const [sidebar, setSidebar] = useState('Getting Started:/getting-started\nGuides:/guides\nReference:/reference');
  const [socialGithub, setSocialGithub] = useState('');
  const [editLink, setEditLink] = useState('');
  const [customCss, setCustomCss] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const sidebarItems = sidebar
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const [label, link] = line.split(':').map((s) => s.trim());
        return `      { label: '${label || 'Page'}', link: '${link || '/'}' }`;
      });

    const socialLines: string[] = [];
    if (socialGithub.trim()) {
      socialLines.push(`      social: { github: '${socialGithub.trim()}' },`);
    }

    const editLinkLine = editLink.trim()
      ? `      editLink: { baseUrl: '${editLink.trim()}' },`
      : '';

    const customCssLine = customCss
      ? `      customCss: ['./src/assets/custom.css'],`
      : '';

    const config = `import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '${siteTitle}',
      description: '${description}',
      defaultLocale: '${defaultLocale}',
${socialLines.join('\n')}
${editLinkLine}
${customCssLine}
      sidebar: [
${sidebarItems.join(',\n')}
      ],
    }),
  ],
});`;

    setOutput(config.replace(/\n{3,}/g, '\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
            <input id={`${toolId}-title`} type="text" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="input-field" aria-label={`Site title for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" aria-label="Site description" />
          </div>
          <div>
            <label htmlFor={`${toolId}-locale`} className="block text-sm font-medium text-gray-700 mb-1">Default Locale</label>
            <input id={`${toolId}-locale`} type="text" value={defaultLocale} onChange={(e) => setDefaultLocale(e.target.value)} className="input-field" aria-label="Default locale" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sidebar`} className="block text-sm font-medium text-gray-700 mb-1">Sidebar Items (Label:Link per line)</label>
            <textarea id={`${toolId}-sidebar`} value={sidebar} onChange={(e) => setSidebar(e.target.value)} className="input-field h-24 resize-y font-mono" aria-label="Sidebar items" />
          </div>
          <div>
            <label htmlFor={`${toolId}-github`} className="block text-sm font-medium text-gray-700 mb-1">GitHub URL (optional)</label>
            <input id={`${toolId}-github`} type="text" value={socialGithub} onChange={(e) => setSocialGithub(e.target.value)} className="input-field" aria-label="GitHub URL" />
          </div>
          <div>
            <label htmlFor={`${toolId}-edit`} className="block text-sm font-medium text-gray-700 mb-1">Edit Link Base URL (optional)</label>
            <input id={`${toolId}-edit`} type="text" value={editLink} onChange={(e) => setEditLink(e.target.value)} className="input-field" aria-label="Edit link base URL" />
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-css`} type="checkbox" checked={customCss} onChange={(e) => setCustomCss(e.target.checked)} aria-label="Include custom CSS" />
            <label htmlFor={`${toolId}-css`} className="text-sm text-gray-700">Include custom CSS file</label>
          </div>
          <button onClick={generate} className="btn-primary">Generate Config</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">astro.config.mjs</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
