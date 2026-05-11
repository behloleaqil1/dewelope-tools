'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FaviconGeneratorCode - Generates HTML link tags for favicons in all sizes and formats.
 * Produces standard favicon, Apple touch icons, Android icons, and MS tile meta tags.
 */
export default function FaviconGeneratorCode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [basePath, setBasePath] = useState('/');
  const [fileName, setFileName] = useState('favicon');
  const [includeApple, setIncludeApple] = useState(true);
  const [includeAndroid, setIncludeAndroid] = useState(true);
  const [includeMsTile, setIncludeMsTile] = useState(true);
  const [themeColor, setThemeColor] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const generate = () => {
    const path = basePath.endsWith('/') ? basePath : basePath + '/';
    const lines: string[] = [];

    // Standard favicons
    lines.push(`<link rel="icon" type="image/x-icon" href="${path}${fileName}.ico" />`);
    lines.push(`<link rel="icon" type="image/png" sizes="16x16" href="${path}${fileName}-16x16.png" />`);
    lines.push(`<link rel="icon" type="image/png" sizes="32x32" href="${path}${fileName}-32x32.png" />`);
    lines.push(`<link rel="icon" type="image/svg+xml" href="${path}${fileName}.svg" />`);

    // Apple Touch Icons
    if (includeApple) {
      lines.push('');
      lines.push('<!-- Apple Touch Icons -->');
      lines.push(`<link rel="apple-touch-icon" sizes="180x180" href="${path}apple-touch-icon.png" />`);
      lines.push(`<link rel="apple-touch-icon" sizes="152x152" href="${path}apple-touch-icon-152x152.png" />`);
      lines.push(`<link rel="apple-touch-icon" sizes="120x120" href="${path}apple-touch-icon-120x120.png" />`);
    }

    // Android / Web App Manifest
    if (includeAndroid) {
      lines.push('');
      lines.push('<!-- Android / Web App -->');
      lines.push(`<link rel="icon" type="image/png" sizes="192x192" href="${path}android-chrome-192x192.png" />`);
      lines.push(`<link rel="icon" type="image/png" sizes="512x512" href="${path}android-chrome-512x512.png" />`);
      lines.push(`<link rel="manifest" href="${path}site.webmanifest" />`);
    }

    // MS Tile
    if (includeMsTile) {
      lines.push('');
      lines.push('<!-- MS Tile -->');
      lines.push(`<meta name="msapplication-TileColor" content="${themeColor}" />`);
      lines.push(`<meta name="msapplication-TileImage" content="${path}mstile-144x144.png" />`);
    }

    // Theme color
    lines.push('');
    lines.push(`<meta name="theme-color" content="${themeColor}" />`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">
            Base Path
          </label>
          <input
            id={`${toolId}-path`}
            type="text"
            value={basePath}
            onChange={(e) => setBasePath(e.target.value)}
            placeholder="/"
            aria-label={`Base path for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
            File Name Prefix
          </label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="favicon"
            aria-label={`File name prefix for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Theme Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${toolId}-color`}
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            aria-label="Theme color"
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="input-field flex-1"
            aria-label="Theme color hex value"
          />
        </div>
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeApple} onChange={(e) => setIncludeApple(e.target.checked)} className="rounded" />
          Apple Touch Icons
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeAndroid} onChange={(e) => setIncludeAndroid(e.target.checked)} className="rounded" />
          Android / Manifest
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeMsTile} onChange={(e) => setIncludeMsTile(e.target.checked)} className="rounded" />
          MS Tile
        </label>
      </div>

      <button onClick={generate} aria-label="Generate favicon code" className="btn-primary">
        Generate Code
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">HTML Favicon Tags</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
