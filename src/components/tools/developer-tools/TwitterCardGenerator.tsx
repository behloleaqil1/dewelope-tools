'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TwitterCardGenerator - Generate Twitter Card meta tags from card type, title, description, and image.
 */
export default function TwitterCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cardType, setCardType] = useState('summary_large_image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [site, setSite] = useState('');
  const [creator, setCreator] = useState('');

  const generateTags = (): string => {
    if (!title.trim()) return '';
    const tags: string[] = [];
    tags.push(`<meta name="twitter:card" content="${cardType}" />`);
    tags.push(`<meta name="twitter:title" content="${title.trim()}" />`);
    if (description.trim()) tags.push(`<meta name="twitter:description" content="${description.trim()}" />`);
    if (image.trim()) tags.push(`<meta name="twitter:image" content="${image.trim()}" />`);
    if (site.trim()) tags.push(`<meta name="twitter:site" content="${site.trim().startsWith('@') ? site.trim() : '@' + site.trim()}" />`);
    if (creator.trim()) tags.push(`<meta name="twitter:creator" content="${creator.trim().startsWith('@') ? creator.trim() : '@' + creator.trim()}" />`);
    return tags.join('\n');
  };

  const result = generateTags();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
        <select id={`${toolId}-type`} value={cardType} onChange={(e) => setCardType(e.target.value)} aria-label={`Card type for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="summary">Summary</option>
          <option value="summary_large_image">Summary Large Image</option>
          <option value="app">App</option>
          <option value="player">Player</option>
        </select>
      </div>
      <div>
        <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input id={`${toolId}-title`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title" aria-label={`Title for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description" aria-label={`Description for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" aria-label={`Image URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-site`} className="block text-sm font-medium text-gray-700 mb-1">Site Handle</label>
        <input id={`${toolId}-site`} type="text" value={site} onChange={(e) => setSite(e.target.value)} placeholder="@yoursite" aria-label={`Site handle for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-creator`} className="block text-sm font-medium text-gray-700 mb-1">Creator Handle</label>
        <input id={`${toolId}-creator`} type="text" value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="@creator" aria-label={`Creator handle for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
