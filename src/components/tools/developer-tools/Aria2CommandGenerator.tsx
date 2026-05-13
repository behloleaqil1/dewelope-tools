'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Aria2CommandGenerator - Generate aria2 download commands with various options.
 * Supports configuring connections, output file, directory, headers, and more.
 */
export default function Aria2CommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('');
  const [outputFile, setOutputFile] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [connections, setConnections] = useState('16');
  const [splitCount, setSplitCount] = useState('16');
  const [userAgent, setUserAgent] = useState('');
  const [header, setHeader] = useState('');
  const [continueDownload, setContinueDownload] = useState(true);
  const [maxSpeed, setMaxSpeed] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!url.trim()) {
      setOutput('');
      return;
    }

    const parts: string[] = ['aria2c'];

    if (connections && connections !== '1') {
      parts.push(`-x ${connections}`);
    }
    if (splitCount && splitCount !== '1') {
      parts.push(`-s ${splitCount}`);
    }
    if (continueDownload) {
      parts.push('-c');
    }
    if (outputDir.trim()) {
      parts.push(`-d "${outputDir.trim()}"`);
    }
    if (outputFile.trim()) {
      parts.push(`-o "${outputFile.trim()}"`);
    }
    if (userAgent.trim()) {
      parts.push(`--user-agent="${userAgent.trim()}"`);
    }
    if (header.trim()) {
      parts.push(`--header="${header.trim()}"`);
    }
    if (maxSpeed.trim()) {
      parts.push(`--max-download-limit=${maxSpeed.trim()}`);
    }

    parts.push(`"${url.trim()}"`);
    setOutput(parts.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-out`} className="block text-sm font-medium text-gray-700 mb-1">Output Filename</label>
            <input id={`${toolId}-out`} type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} placeholder="file.zip" className="input-field" aria-label="Output filename" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Output Directory</label>
            <input id={`${toolId}-dir`} type="text" value={outputDir} onChange={(e) => setOutputDir(e.target.value)} placeholder="/downloads" className="input-field" aria-label="Output directory" />
          </div>
          <div>
            <label htmlFor={`${toolId}-conn`} className="block text-sm font-medium text-gray-700 mb-1">Max Connections (-x)</label>
            <input id={`${toolId}-conn`} type="number" min="1" max="64" value={connections} onChange={(e) => setConnections(e.target.value)} className="input-field" aria-label="Max connections" />
          </div>
          <div>
            <label htmlFor={`${toolId}-split`} className="block text-sm font-medium text-gray-700 mb-1">Split Count (-s)</label>
            <input id={`${toolId}-split`} type="number" min="1" max="64" value={splitCount} onChange={(e) => setSplitCount(e.target.value)} className="input-field" aria-label="Split count" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ua`} className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
            <input id={`${toolId}-ua`} type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="Mozilla/5.0..." className="input-field" aria-label="User agent" />
          </div>
          <div>
            <label htmlFor={`${toolId}-header`} className="block text-sm font-medium text-gray-700 mb-1">Custom Header</label>
            <input id={`${toolId}-header`} type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Authorization: Bearer token" className="input-field" aria-label="Custom header" />
          </div>
          <div>
            <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Max Speed Limit</label>
            <input id={`${toolId}-speed`} type="text" value={maxSpeed} onChange={(e) => setMaxSpeed(e.target.value)} placeholder="1M (bytes/sec)" className="input-field" aria-label="Max speed limit" />
          </div>
          <div className="flex items-center pt-5">
            <input id={`${toolId}-continue`} type="checkbox" checked={continueDownload} onChange={(e) => setContinueDownload(e.target.checked)} className="mr-2" aria-label="Continue download" />
            <label htmlFor={`${toolId}-continue`} className="text-sm font-medium text-gray-700">Continue partial download (-c)</label>
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-3">Generate Command</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated aria2 Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
