'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NextraConfigGenerator - Generate Nextra next.config.js with theme configuration.
 * Supports docs and blog themes with customizable options.
 */
export default function NextraConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState<'docs' | 'blog'>('docs');
  const [siteTitle, setSiteTitle] = useState('My Nextra Site');
  const [logo, setLogo] = useState('');
  const [docsRepo, setDocsRepo] = useState('https://github.com/your-org/your-repo');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebar, setSidebar] = useState(true);
  const [toc, setToc] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const themePackage = theme === 'docs' ? 'nextra-theme-docs' : 'nextra-theme-blog';

    const themeConfig = theme === 'docs'
      ? `const themeConfig = {
  logo: ${logo ? `<span>${logo}</span>` : `<span>${siteTitle}</span>`},
  project: {
    link: '${docsRepo}'
  },
  docsRepositoryBase: '${docsRepo}',
  darkMode: ${darkMode},
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: ${sidebar}
  },
  toc: {
    float: ${toc}
  },
  footer: {
    text: '${siteTitle} © ${new Date().getFullYear()}'
  }
}`
      : `const themeConfig = {
  darkMode: ${darkMode},
  footer: <p>${siteTitle} © ${new Date().getFullYear()}</p>,
  head: ({ title, meta }) => (
    <>
      {meta.description && <meta name="description" content={meta.description} />}
    </>
  )
}`;

    const config = `const withNextra = require('nextra')({
  theme: '${themePackage}',
  themeConfig: './theme.config.jsx'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}

module.exports = withNextra(nextConfig)
`;

    const fullOutput = `// next.config.js
${config}
// ---
// theme.config.jsx
${themeConfig}

export default themeConfig
`;
    setOutput(fullOutput);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              id={`${toolId}-theme`}
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'docs' | 'blog')}
              className="input-field"
              aria-label={`Theme selection for ${toolName}`}
            >
              <option value="docs">Docs Theme</option>
              <option value="blog">Blog Theme</option>
            </select>
          </div>
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
              aria-label="Site title"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-logo`} className="block text-sm font-medium text-gray-700 mb-1">
              Logo Text (optional)
            </label>
            <input
              id={`${toolId}-logo`}
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="input-field"
              aria-label="Logo text"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-repo`} className="block text-sm font-medium text-gray-700 mb-1">
              Docs Repository URL
            </label>
            <input
              id={`${toolId}-repo`}
              type="text"
              value={docsRepo}
              onChange={(e) => setDocsRepo(e.target.value)}
              className="input-field"
              aria-label="Docs repository URL"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            Dark Mode
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sidebar} onChange={(e) => setSidebar(e.target.checked)} />
            Sidebar Toggle
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={toc} onChange={(e) => setToc(e.target.checked)} />
            Table of Contents
          </label>
        </div>
        <button onClick={generate} className="btn-primary mt-4">
          Generate Config
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
