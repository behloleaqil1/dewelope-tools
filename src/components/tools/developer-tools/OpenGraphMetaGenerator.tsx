'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpenGraphMetaGenerator - Generate Open Graph meta tags from title, description, image URL, and type.
 */
export default function OpenGraphMetaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('website');
  const [siteName, setSiteName] = useState('');

  const generateTags = (): string => {
    if (!title.trim()) return '';
    const tags: string[] = [];
    tags.push(`<meta property="og:title" content="${title.trim()}" />`);
    if (description.trim()) tags.push(`<meta property="og:description" content="${description.trim()}" />`);
    if (image.trim()) tags.push(`<meta property="og:image" content="${image.trim()}" />`);
    if (url.trim()) tags.push(`<meta property="og:url" content="${url.trim()}" />`);
    tags.push(`<meta property="og:type" content="${type}" />`);
    if (siteName.trim()) tags.push(`<meta property="og:site_name" content="${siteName.trim()}" />`);
    return tags.join('\n');
  };

  const result = generateTags();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input id={`${toolId}-title`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Page Title" aria-label={`Title for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="A brief description of the page" aria-label={`Description for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" aria-label={`Image URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
        <input id={`${toolId}-url`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" aria-label={`Page URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select id={`${toolId}-type`} value={type} onChange={(e) => setType(e.target.value)} aria-label={`OG type for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['website', 'article', 'product', 'profile', 'video.movie', 'music.song'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${toolId}-site`} className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
        <input id={`${toolId}-site`} type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="My Website" aria-label={`Site name for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
