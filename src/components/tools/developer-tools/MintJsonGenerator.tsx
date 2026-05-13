'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MintJsonGenerator - Generate Mintlify docs mint.json configuration file.
 * Allows users to configure project name, navigation, colors, and other settings.
 */
export default function MintJsonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('/favicon.svg');
  const [primaryColor, setPrimaryColor] = useState('#0D9373');
  const [darkColor, setDarkColor] = useState('#07C983');
  const [navItems, setNavItems] = useState('Introduction:introduction\nQuickstart:quickstart');
  const [topbarLinks, setTopbarLinks] = useState('');
  const [footerSocials, setFooterSocials] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const navigation = navItems
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const [label, path] = line.split(':').map((s) => s.trim());
        return { group: label || 'Getting Started', pages: [path || label?.toLowerCase().replace(/\s+/g, '-')] };
      });

    const config: Record<string, unknown> = {
      $schema: 'https://mintlify.com/schema.json',
      name: projectName || 'My Documentation',
      logo: logo ? { dark: logo, light: logo } : undefined,
      favicon: favicon || '/favicon.svg',
      colors: {
        primary: primaryColor,
        light: primaryColor,
        dark: darkColor,
      },
      topbarLinks: topbarLinks
        ? topbarLinks.split('\n').filter(Boolean).map((l) => {
            const [name, url] = l.split(':').map((s) => s.trim());
            return { name, url };
          })
        : [],
      navigation,
      footerSocials: footerSocials
        ? Object.fromEntries(
            footerSocials.split('\n').filter(Boolean).map((l) => {
              const [platform, url] = l.split(':').map((s) => s.trim());
              return [platform, url];
            })
          )
        : undefined,
    };

    // Remove undefined values
    const cleaned = JSON.parse(JSON.stringify(config));
    setOutput(JSON.stringify(cleaned, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Documentation"
              aria-label={`Project name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-primary`} className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                id={`${toolId}-primary`}
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0D9373"
                aria-label="Primary color hex"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-dark`} className="block text-sm font-medium text-gray-700 mb-1">
                Dark Color
              </label>
              <input
                id={`${toolId}-dark`}
                type="text"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                placeholder="#07C983"
                aria-label="Dark color hex"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-logo`} className="block text-sm font-medium text-gray-700 mb-1">
              Logo Path (optional)
            </label>
            <input
              id={`${toolId}-logo`}
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="/logo.svg"
              aria-label="Logo file path"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-favicon`} className="block text-sm font-medium text-gray-700 mb-1">
              Favicon Path
            </label>
            <input
              id={`${toolId}-favicon`}
              type="text"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              placeholder="/favicon.svg"
              aria-label="Favicon file path"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-nav`} className="block text-sm font-medium text-gray-700 mb-1">
              Navigation (Group:page per line)
            </label>
            <textarea
              id={`${toolId}-nav`}
              value={navItems}
              onChange={(e) => setNavItems(e.target.value)}
              placeholder="Introduction:introduction&#10;Quickstart:quickstart"
              aria-label="Navigation items"
              className="input-field h-24 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-topbar`} className="block text-sm font-medium text-gray-700 mb-1">
              Topbar Links (name:url per line, optional)
            </label>
            <textarea
              id={`${toolId}-topbar`}
              value={topbarLinks}
              onChange={(e) => setTopbarLinks(e.target.value)}
              placeholder="Documentation:https://docs.example.com"
              aria-label="Topbar links"
              className="input-field h-16 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-socials`} className="block text-sm font-medium text-gray-700 mb-1">
              Footer Socials (platform:url per line, optional)
            </label>
            <textarea
              id={`${toolId}-socials`}
              value={footerSocials}
              onChange={(e) => setFooterSocials(e.target.value)}
              placeholder="twitter:https://twitter.com/example&#10;github:https://github.com/example"
              aria-label="Footer social links"
              className="input-field h-16 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate mint.json
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated mint.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
