'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MkdocsYamlGenerator - Generate MkDocs mkdocs.yml configuration files.
 * Creates complete mkdocs.yml with theme, navigation, and plugin settings.
 */
export default function MkdocsYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [siteName, setSiteName] = useState('My Documentation');
  const [siteUrl, setSiteUrl] = useState('https://example.com');
  const [siteDescription, setSiteDescription] = useState('Project documentation');
  const [repoUrl, setRepoUrl] = useState('');
  const [theme, setTheme] = useState<'material' | 'readthedocs' | 'mkdocs'>('material');
  const [nav, setNav] = useState('Home:index.md\nGetting Started:getting-started.md\nAPI Reference:api.md');
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableDarkMode, setEnableDarkMode] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const navItems = nav
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const [label, file] = line.split(':').map((s) => s.trim());
        return `  - ${label || 'Page'}: ${file || 'index.md'}`;
      });

    let config = `site_name: ${siteName}\nsite_url: ${siteUrl}\nsite_description: ${siteDescription}\n`;

    if (repoUrl.trim()) {
      config += `repo_url: ${repoUrl.trim()}\n`;
    }

    config += `\ntheme:\n  name: ${theme}\n`;

    if (theme === 'material') {
      config += `  palette:\n`;
      if (enableDarkMode) {
        config += `    - scheme: default\n      toggle:\n        icon: material/brightness-7\n        name: Switch to dark mode\n    - scheme: slate\n      toggle:\n        icon: material/brightness-4\n        name: Switch to light mode\n`;
      } else {
        config += `    - scheme: default\n`;
      }
      config += `  features:\n    - navigation.tabs\n    - navigation.sections\n    - search.suggest\n    - search.highlight\n`;
    }

    config += `\nnav:\n${navItems.join('\n')}\n`;

    if (enableSearch) {
      config += `\nplugins:\n  - search\n`;
    }

    config += `\nmarkdown_extensions:\n  - admonition\n  - codehilite\n  - toc:\n      permalink: true\n`;

    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input id={`${toolId}-name`} type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input-field" aria-label={`Site name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
            <input id={`${toolId}-url`} type="text" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="input-field" aria-label="Site URL" />
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <input id={`${toolId}-desc`} type="text" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} className="input-field" aria-label="Site description" />
          </div>
          <div>
            <label htmlFor={`${toolId}-repo`} className="block text-sm font-medium text-gray-700 mb-1">Repository URL (optional)</label>
            <input id={`${toolId}-repo`} type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="input-field" aria-label="Repository URL" />
          </div>
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value as 'material' | 'readthedocs' | 'mkdocs')} className="input-field" aria-label="Theme selection">
              <option value="material">Material</option>
              <option value="readthedocs">Read the Docs</option>
              <option value="mkdocs">MkDocs Default</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-nav`} className="block text-sm font-medium text-gray-700 mb-1">Navigation (Label:File per line)</label>
            <textarea id={`${toolId}-nav`} value={nav} onChange={(e) => setNav(e.target.value)} className="input-field h-24 resize-y font-mono" aria-label="Navigation items" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input id={`${toolId}-search`} type="checkbox" checked={enableSearch} onChange={(e) => setEnableSearch(e.target.checked)} aria-label="Enable search plugin" />
              <label htmlFor={`${toolId}-search`} className="text-sm text-gray-700">Search plugin</label>
            </div>
            <div className="flex items-center gap-2">
              <input id={`${toolId}-dark`} type="checkbox" checked={enableDarkMode} onChange={(e) => setEnableDarkMode(e.target.checked)} aria-label="Enable dark mode toggle" />
              <label htmlFor={`${toolId}-dark`} className="text-sm text-gray-700">Dark mode toggle</label>
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Config</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">mkdocs.yml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
