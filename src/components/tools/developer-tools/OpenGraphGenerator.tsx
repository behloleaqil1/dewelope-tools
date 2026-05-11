'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpenGraphGenerator - Generates Open Graph meta tags for social media sharing.
 * Supports og:title, og:description, og:image, og:url, and og:type.
 */
export default function OpenGraphGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [output, setOutput] = useState('');

  const ogTypes = ['website', 'article', 'book', 'profile', 'music.song', 'video.movie'];

  const generate = () => {
    const tags: string[] = [];

    if (ogTitle.trim()) {
      tags.push(`<meta property="og:title" content="${escapeHtml(ogTitle.trim())}" />`);
    }
    if (ogDescription.trim()) {
      tags.push(`<meta property="og:description" content="${escapeHtml(ogDescription.trim())}" />`);
    }
    if (ogImage.trim()) {
      tags.push(`<meta property="og:image" content="${escapeHtml(ogImage.trim())}" />`);
    }
    if (ogUrl.trim()) {
      tags.push(`<meta property="og:url" content="${escapeHtml(ogUrl.trim())}" />`);
    }
    if (ogType.trim()) {
      tags.push(`<meta property="og:type" content="${escapeHtml(ogType.trim())}" />`);
    }

    setOutput(tags.join('\n'));
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-og-title`} className="block text-sm font-medium text-gray-700">
            og:title
          </label>
          <input
            id={`${toolId}-og-title`}
            type="text"
            value={ogTitle}
            onChange={(e) => setOgTitle(e.target.value)}
            placeholder="Your Page Title"
            aria-label={`Open Graph title for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-og-description`} className="block text-sm font-medium text-gray-700">
            og:description
          </label>
          <textarea
            id={`${toolId}-og-description`}
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            placeholder="A brief description for social media previews"
            aria-label={`Open Graph description for ${toolName}`}
            className="input-field h-20 resize-y"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-og-image`} className="block text-sm font-medium text-gray-700">
            og:image URL
          </label>
          <input
            id={`${toolId}-og-image`}
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            aria-label={`Open Graph image URL for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-og-url`} className="block text-sm font-medium text-gray-700">
            og:url
          </label>
          <input
            id={`${toolId}-og-url`}
            type="text"
            value={ogUrl}
            onChange={(e) => setOgUrl(e.target.value)}
            placeholder="https://example.com/page"
            aria-label={`Open Graph URL for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-og-type`} className="block text-sm font-medium text-gray-700">
            og:type
          </label>
          <select
            id={`${toolId}-og-type`}
            value={ogType}
            onChange={(e) => setOgType(e.target.value)}
            aria-label={`Open Graph type for ${toolName}`}
            className="input-field"
          >
            {ogTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </InputArea>

        <button onClick={generate} className="btn-primary" aria-label="Generate Open Graph tags">
          Generate OG Tags
        </button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Generated Open Graph Tags</h3>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
