'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SchemaMarkupGenerator - Generate JSON-LD structured data from type selection and field inputs.
 */
export default function SchemaMarkupGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [schemaType, setSchemaType] = useState('Organization');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const generateSchema = (): string => {
    if (!name.trim()) return '';
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: name.trim(),
    };
    if (url.trim()) schema.url = url.trim();
    if (description.trim()) schema.description = description.trim();
    if (image.trim()) schema.image = image.trim();

    if (schemaType === 'Article') {
      schema.author = { '@type': 'Person', name: 'Author Name' };
      schema.datePublished = new Date().toISOString().split('T')[0];
    } else if (schemaType === 'Product') {
      schema.offers = { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' };
    } else if (schemaType === 'Event') {
      schema.startDate = new Date().toISOString();
      schema.location = { '@type': 'Place', name: 'Event Location' };
    }

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  };

  const result = generateSchema();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
        <select id={`${toolId}-type`} value={schemaType} onChange={(e) => setSchemaType(e.target.value)} aria-label={`Schema type for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['Organization', 'Article', 'Product', 'Event', 'Person', 'LocalBusiness', 'WebSite', 'FAQPage'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Entity name" aria-label={`Name for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input id={`${toolId}-url`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" aria-label={`URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id={`${toolId}-desc`} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description" aria-label={`Description for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" aria-label={`Image for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
