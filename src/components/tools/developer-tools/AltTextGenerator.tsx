'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AltTextGenerator - Generates alt text suggestions based on image context description.
 */
export default function AltTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [context, setContext] = useState('');
  const [imageType, setImageType] = useState<'photo' | 'icon' | 'chart' | 'decorative' | 'infographic'>('photo');
  const [error, setError] = useState<string | undefined>();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generate = () => {
    setError(undefined);
    setSuggestions([]);
    if (!context.trim()) { setError('Please describe what the image shows'); return; }

    const words = context.trim().split(/\s+/);
    const subject = words.slice(0, 4).join(' ');
    const action = words.length > 4 ? words.slice(4, 8).join(' ') : '';

    const results: string[] = [];

    switch (imageType) {
      case 'photo':
        results.push(`${context.trim().charAt(0).toUpperCase() + context.trim().slice(1)}`);
        results.push(`Photo of ${context.trim().toLowerCase()}`);
        if (action) results.push(`${subject} ${action}`);
        results.push(`Image showing ${context.trim().toLowerCase()}`);
        break;
      case 'icon':
        results.push(`${subject} icon`);
        results.push(`Icon representing ${context.trim().toLowerCase()}`);
        results.push(`${context.trim()}`);
        break;
      case 'chart':
        results.push(`Chart showing ${context.trim().toLowerCase()}`);
        results.push(`Graph displaying ${context.trim().toLowerCase()}`);
        results.push(`Data visualization of ${context.trim().toLowerCase()}`);
        break;
      case 'decorative':
        results.push('""  (empty alt for decorative images)');
        results.push('Consider using role="presentation" or aria-hidden="true"');
        break;
      case 'infographic':
        results.push(`Infographic: ${context.trim()}`);
        results.push(`Visual summary of ${context.trim().toLowerCase()}`);
        results.push(`Illustrated guide showing ${context.trim().toLowerCase()}`);
        break;
    }

    // Add length guidance
    const tooLong = results.filter(r => r.length > 125);
    if (tooLong.length > 0) {
      results.push('💡 Tip: Keep alt text under 125 characters for screen reader compatibility');
    }

    setSuggestions(results);
  };

  const copyText = suggestions.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Image Type</label>
            <select id={`${toolId}-type`} value={imageType} onChange={(e) => setImageType(e.target.value as typeof imageType)} aria-label={`Image type for ${toolName}`} className="input-field">
              <option value="photo">Photograph</option>
              <option value="icon">Icon / Symbol</option>
              <option value="chart">Chart / Graph</option>
              <option value="infographic">Infographic</option>
              <option value="decorative">Decorative (no meaning)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-context`} className="block text-sm font-medium text-gray-700 mb-1">Describe what the image shows</label>
            <textarea id={`${toolId}-context`} value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. a golden retriever playing fetch in a park on a sunny day" aria-label="Image context description" className="input-field min-h-[80px]" />
          </div>
        </div>
      </InputArea>
      <button onClick={generate} aria-label="Generate alt text suggestions" className="btn-primary">Generate Suggestions</button>
      <OutputArea hasContent={suggestions.length > 0}>
        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Option {i + 1}</div>
                <div className="text-sm text-gray-800 font-mono">{s}</div>
                <div className="text-xs text-gray-400 mt-1">{s.length} characters</div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
