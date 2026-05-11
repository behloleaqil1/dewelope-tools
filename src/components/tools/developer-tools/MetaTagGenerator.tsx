'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MetaTagGenerator - Generates HTML meta tags from user inputs.
 * Supports page title, description, keywords, author, viewport, and robots directives.
 */
export default function MetaTagGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [robots, setRobots] = useState('index, follow');
  const [output, setOutput] = useState('');

  const generate = () => {
    const tags: string[] = [];

    if (title.trim()) {
      tags.push(`<title>${escapeHtml(title.trim())}</title>`);
    }
    if (description.trim()) {
      tags.push(`<meta name="description" content="${escapeHtml(description.trim())}" />`);
    }
    if (keywords.trim()) {
      tags.push(`<meta name="keywords" content="${escapeHtml(keywords.trim())}" />`);
    }
    if (author.trim()) {
      tags.push(`<meta name="author" content="${escapeHtml(author.trim())}" />`);
    }
    if (viewport.trim()) {
      tags.push(`<meta name="viewport" content="${escapeHtml(viewport.trim())}" />`);
    }
    if (robots.trim()) {
      tags.push(`<meta name="robots" content="${escapeHtml(robots.trim())}" />`);
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
          <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700">
            Page Title
          </label>
          <input
            id={`${toolId}-title`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Page"
            aria-label={`Page title for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-description`} className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id={`${toolId}-description`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your page (50-160 characters recommended)"
            aria-label={`Meta description for ${toolName}`}
            className="input-field h-20 resize-y"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-keywords`} className="block text-sm font-medium text-gray-700">
            Keywords
          </label>
          <input
            id={`${toolId}-keywords`}
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            aria-label={`Meta keywords for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-author`} className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            id={`${toolId}-author`}
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="John Doe"
            aria-label={`Author name for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-viewport`} className="block text-sm font-medium text-gray-700">
            Viewport
          </label>
          <input
            id={`${toolId}-viewport`}
            type="text"
            value={viewport}
            onChange={(e) => setViewport(e.target.value)}
            placeholder="width=device-width, initial-scale=1.0"
            aria-label={`Viewport setting for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-robots`} className="block text-sm font-medium text-gray-700">
            Robots
          </label>
          <input
            id={`${toolId}-robots`}
            type="text"
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            placeholder="index, follow"
            aria-label={`Robots directive for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <button onClick={generate} className="btn-primary" aria-label="Generate meta tags">
          Generate Meta Tags
        </button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Generated Meta Tags</h3>
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
