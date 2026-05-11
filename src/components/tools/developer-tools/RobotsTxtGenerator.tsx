'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RobotsTxtGenerator - Generates robots.txt file content with allow/disallow rules and sitemap.
 */
interface Rule {
  id: number;
  type: 'allow' | 'disallow';
  path: string;
}

export default function RobotsTxtGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [userAgent, setUserAgent] = useState('*');
  const [rules, setRules] = useState<Rule[]>([{ id: 1, type: 'disallow', path: '/admin/' }]);
  const [sitemap, setSitemap] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [output, setOutput] = useState('');
  const [nextId, setNextId] = useState(2);

  const addRule = () => {
    setRules([...rules, { id: nextId, type: 'disallow', path: '' }]);
    setNextId(nextId + 1);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: number, field: 'type' | 'path', value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const generate = () => {
    let result = `User-agent: ${userAgent}\n`;

    for (const rule of rules) {
      if (rule.path.trim()) {
        result += `${rule.type === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path.trim()}\n`;
      }
    }

    if (crawlDelay.trim() && !isNaN(Number(crawlDelay))) {
      result += `Crawl-delay: ${crawlDelay.trim()}\n`;
    }

    if (sitemap.trim()) {
      result += `\nSitemap: ${sitemap.trim()}\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-useragent`} className="block text-sm font-medium text-gray-700 mb-1">
          User-Agent
        </label>
        <input
          id={`${toolId}-useragent`}
          type="text"
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          placeholder="* (all bots)"
          aria-label={`User agent for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rules</label>
        {rules.map((rule) => (
          <div key={rule.id} className="flex gap-2 items-center">
            <select
              value={rule.type}
              onChange={(e) => updateRule(rule.id, 'type', e.target.value)}
              aria-label="Rule type"
              className="input-field w-32"
            >
              <option value="allow">Allow</option>
              <option value="disallow">Disallow</option>
            </select>
            <input
              type="text"
              value={rule.path}
              onChange={(e) => updateRule(rule.id, 'path', e.target.value)}
              placeholder="/path/"
              aria-label="Rule path"
              className="input-field flex-1"
            />
            <button onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 px-2" aria-label="Remove rule">✕</button>
          </div>
        ))}
        <button onClick={addRule} className="text-sm text-blue-600 hover:text-blue-800">+ Add Rule</button>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-sitemap`} className="block text-sm font-medium text-gray-700 mb-1">
          Sitemap URL (optional)
        </label>
        <input
          id={`${toolId}-sitemap`}
          type="text"
          value={sitemap}
          onChange={(e) => setSitemap(e.target.value)}
          placeholder="https://example.com/sitemap.xml"
          aria-label={`Sitemap URL for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-crawldelay`} className="block text-sm font-medium text-gray-700 mb-1">
          Crawl Delay (seconds, optional)
        </label>
        <input
          id={`${toolId}-crawldelay`}
          type="text"
          inputMode="numeric"
          value={crawlDelay}
          onChange={(e) => setCrawlDelay(e.target.value)}
          placeholder="10"
          aria-label={`Crawl delay for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate robots.txt" className="btn-primary">
        Generate robots.txt
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated robots.txt</label>
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
