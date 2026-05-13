'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WgetCommandGenerator - Generate wget download commands with various options.
 */
export default function WgetCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('');
  const [outputFile, setOutputFile] = useState('');
  const [continueDownload, setContinueDownload] = useState(false);
  const [recursive, setRecursive] = useState(false);
  const [depth, setDepth] = useState('2');
  const [limitRate, setLimitRate] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [quiet, setQuiet] = useState(false);
  const [noCheckCert, setNoCheckCert] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!url.trim()) {
      setOutput('');
      return;
    }

    const parts: string[] = ['wget'];

    if (continueDownload) parts.push('-c');
    if (quiet) parts.push('-q');
    if (noCheckCert) parts.push('--no-check-certificate');
    if (recursive) {
      parts.push('-r');
      parts.push(`-l ${depth}`);
    }
    if (limitRate.trim()) parts.push(`--limit-rate=${limitRate.trim()}`);
    if (userAgent.trim()) parts.push(`--user-agent="${userAgent.trim()}"`);
    if (outputFile.trim()) parts.push(`-O "${outputFile.trim()}"`);

    parts.push(`"${url.trim()}"`);

    setOutput(parts.join(' \\\n  '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">
              Download URL
            </label>
            <input
              id={`${toolId}-url`}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/file.zip"
              aria-label={`Download URL for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-output`} className="block text-sm font-medium text-gray-700 mb-1">
              Output filename (optional)
            </label>
            <input
              id={`${toolId}-output`}
              type="text"
              value={outputFile}
              onChange={(e) => setOutputFile(e.target.value)}
              placeholder="downloaded-file.zip"
              aria-label={`Output filename for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
              Rate limit (e.g. 200k, 2m)
            </label>
            <input
              id={`${toolId}-rate`}
              type="text"
              value={limitRate}
              onChange={(e) => setLimitRate(e.target.value)}
              placeholder="200k"
              aria-label={`Rate limit for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ua`} className="block text-sm font-medium text-gray-700 mb-1">
              User Agent (optional)
            </label>
            <input
              id={`${toolId}-ua`}
              type="text"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              placeholder="Mozilla/5.0..."
              aria-label={`User agent for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={continueDownload} onChange={(e) => setContinueDownload(e.target.checked)} />
              Continue partial download (-c)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={recursive} onChange={(e) => setRecursive(e.target.checked)} />
              Recursive (-r)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={quiet} onChange={(e) => setQuiet(e.target.checked)} />
              Quiet mode (-q)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={noCheckCert} onChange={(e) => setNoCheckCert(e.target.checked)} />
              Skip certificate check
            </label>
          </div>
          {recursive && (
            <div>
              <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">
                Recursion depth
              </label>
              <input
                id={`${toolId}-depth`}
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                min="1"
                max="10"
                aria-label={`Recursion depth for ${toolName}`}
                className="input-field w-24"
              />
            </div>
          )}
          <button onClick={generate} className="btn-primary">
            Generate wget Command
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated wget Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
