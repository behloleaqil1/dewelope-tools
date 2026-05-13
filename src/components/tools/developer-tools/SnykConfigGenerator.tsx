'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SnykConfigGenerator - Generate Snyk .snyk policy file with ignore rules,
 * patch configurations, and severity settings.
 */
export default function SnykConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [version, setVersion] = useState('v1.25.0');
  const [ignoreVulnId, setIgnoreVulnId] = useState('');
  const [ignoreReason, setIgnoreReason] = useState('Not applicable to this project');
  const [ignoreExpiry, setIgnoreExpiry] = useState('2025-12-31');
  const [language, setLanguage] = useState('node');
  const [severityThreshold, setSeverityThreshold] = useState('high');
  const [excludePatterns, setExcludePatterns] = useState('node_modules\ntest\ndist');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push(`# Snyk (https://snyk.io) policy file, patches or ignores known vulnerabilities.`);
    lines.push(`version: ${version}`);
    lines.push('');
    lines.push('# ignores vulnerabilities until expiry date; change duration by modifying expiry date');
    lines.push('ignore:');

    if (ignoreVulnId.trim()) {
      const vulnIds = ignoreVulnId.split('\n').filter(v => v.trim());
      vulnIds.forEach(vulnId => {
        lines.push(`  ${vulnId.trim()}:`);
        lines.push(`    - '*':`);
        lines.push(`        reason: ${ignoreReason}`);
        lines.push(`        expires: ${ignoreExpiry}T00:00:00.000Z`);
        lines.push(`        created: ${new Date().toISOString().split('T')[0]}T00:00:00.000Z`);
      });
    } else {
      lines.push('  {}');
    }

    lines.push('');
    lines.push('# patches apply the minimum changes required to fix a vulnerability');
    lines.push('patch: {}');
    lines.push('');
    lines.push(`# language settings`);
    lines.push(`language-settings:`);
    lines.push(`  ${language}:`);
    lines.push(`    severity-threshold: ${severityThreshold}`);
    lines.push('');

    const excludes = excludePatterns.split('\n').filter(p => p.trim());
    if (excludes.length > 0) {
      lines.push('exclude:');
      lines.push('  global:');
      excludes.forEach(pattern => {
        lines.push(`    - ${pattern.trim()}`);
      });
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
              Policy Version
            </label>
            <input
              id={`${toolId}-version`}
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="input-field"
              aria-label={`Policy version for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-language`} className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id={`${toolId}-language`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              aria-label="Language setting"
            >
              <option value="node">Node.js</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="ruby">Ruby</option>
              <option value="golang">Go</option>
              <option value="dotnet">.NET</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-severity`} className="block text-sm font-medium text-gray-700 mb-1">
              Severity Threshold
            </label>
            <select
              id={`${toolId}-severity`}
              value={severityThreshold}
              onChange={(e) => setSeverityThreshold(e.target.value)}
              className="input-field"
              aria-label="Severity threshold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-expiry`} className="block text-sm font-medium text-gray-700 mb-1">
              Ignore Expiry Date
            </label>
            <input
              id={`${toolId}-expiry`}
              type="date"
              value={ignoreExpiry}
              onChange={(e) => setIgnoreExpiry(e.target.value)}
              className="input-field"
              aria-label="Ignore expiry date"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-vulnids`} className="block text-sm font-medium text-gray-700 mb-1">
            Vulnerability IDs to Ignore (one per line)
          </label>
          <textarea
            id={`${toolId}-vulnids`}
            value={ignoreVulnId}
            onChange={(e) => setIgnoreVulnId(e.target.value)}
            placeholder="SNYK-JS-LODASH-590103&#10;SNYK-PYTHON-REQUESTS-123456"
            className="input-field h-24 resize-y font-mono"
            aria-label="Vulnerability IDs to ignore"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-reason`} className="block text-sm font-medium text-gray-700 mb-1">
            Ignore Reason
          </label>
          <input
            id={`${toolId}-reason`}
            type="text"
            value={ignoreReason}
            onChange={(e) => setIgnoreReason(e.target.value)}
            className="input-field"
            aria-label="Reason for ignoring vulnerabilities"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-excludes`} className="block text-sm font-medium text-gray-700 mb-1">
            Exclude Patterns (one per line)
          </label>
          <textarea
            id={`${toolId}-excludes`}
            value={excludePatterns}
            onChange={(e) => setExcludePatterns(e.target.value)}
            className="input-field h-24 resize-y font-mono"
            aria-label="Exclude patterns"
          />
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate .snyk Policy
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated .snyk Policy File</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
