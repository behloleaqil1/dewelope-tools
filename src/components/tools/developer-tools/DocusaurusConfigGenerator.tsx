'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DocusaurusConfigGenerator - Generate Docusaurus docusaurus.config.js configuration.
 * Allows users to configure site title, URL, theme, navbar, and footer settings.
 */
export default function DocusaurusConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [url, setUrl] = useState('https://example.com');
  const [baseUrl, setBaseUrl] = useState('/');
  const [orgName, setOrgName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [navbarItems, setNavbarItems] = useState('Docs:docs/intro\nBlog:blog\nGitHub:https://github.com/example');
  const [footerLinks, setFooterLinks] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const navbar = navbarItems
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [label, to] = line.split(':').map((s) => s.trim());
        if (to?.startsWith('http')) {
          return `        { label: '${label}', href: '${to}', position: 'right' }`;
        }
        return `        { label: '${label}', to: '${to || '/'}', position: 'left' }`;
      });

    const footer = footerLinks
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [label, href] = line.split(':').map((s) => s.trim());
        return `          { label: '${label}', href: '${href || '#'}' }`;
      });

    const config = `// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '${title || 'My Site'}',
  tagline: '${tagline || 'Dinosaurs are cool'}',
  favicon: 'img/favicon.ico',
  url: '${url}',
  baseUrl: '${baseUrl}',
  organizationName: '${orgName || 'my-org'}',
  projectName: '${projectName || 'my-project'}',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '${title || 'My Site'}',
        logo: {
          alt: '${title || 'My Site'} Logo',
          src: 'img/logo.svg',
        },
        items: [
${navbar.join(',\n')}
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
${footer.length > 0 ? footer.join(',\n') : "              { label: 'Docs', to: '/docs/intro' }"}
            ],
          },
        ],
        copyright: \`Copyright © \${new Date().getFullYear()} ${orgName || 'My Organization'}.\`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;`;

    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                id={`${toolId}-title`}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Site"
                aria-label={`Site title for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-tagline`} className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                id={`${toolId}-tagline`}
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Dinosaurs are cool"
                aria-label="Site tagline"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">
                Site URL
              </label>
              <input
                id={`${toolId}-url`}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                aria-label="Site URL"
                className="input-field"
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
                placeholder="/"
                aria-label="Base URL"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-org`} className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                id={`${toolId}-org`}
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="my-org"
                aria-label="Organization name"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-project`} className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                id={`${toolId}-project`}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-project"
                aria-label="Project name"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-navbar`} className="block text-sm font-medium text-gray-700 mb-1">
              Navbar Items (label:path per line)
            </label>
            <textarea
              id={`${toolId}-navbar`}
              value={navbarItems}
              onChange={(e) => setNavbarItems(e.target.value)}
              placeholder="Docs:docs/intro&#10;Blog:blog"
              aria-label="Navbar items"
              className="input-field h-20 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-footer`} className="block text-sm font-medium text-gray-700 mb-1">
              Footer Links (label:url per line, optional)
            </label>
            <textarea
              id={`${toolId}-footer`}
              value={footerLinks}
              onChange={(e) => setFooterLinks(e.target.value)}
              placeholder="GitHub:https://github.com/example"
              aria-label="Footer links"
              className="input-field h-16 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate docusaurus.config.js
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated docusaurus.config.js</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
