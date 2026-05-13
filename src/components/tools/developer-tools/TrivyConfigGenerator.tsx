'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TrivyConfigGenerator - Generate Trivy vulnerability scanner configuration.
 */
export default function TrivyConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [scanType, setScanType] = useState('image');
  const [severity, setSeverity] = useState('CRITICAL,HIGH');
  const [format, setFormat] = useState('table');
  const [ignoreUnfixed, setIgnoreUnfixed] = useState(true);
  const [vulnType, setVulnType] = useState('os,library');
  const [timeout, setTimeout] = useState('5m');
  const [skipDirs, setSkipDirs] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const config: Record<string, unknown> = {
      scan: {
        type: scanType,
        severity: severity,
        'vuln-type': vulnType,
      },
      format: format,
      'ignore-unfixed': ignoreUnfixed,
      timeout: timeout,
    };

    if (skipDirs.trim()) {
      config['skip-dirs'] = skipDirs.split(',').map(d => d.trim()).filter(Boolean);
    }

    const yaml = `# Trivy configuration file (trivy.yaml)
scan:
  type: ${scanType}
  severity: ${severity}
  vuln-type: ${vulnType}

format: ${format}
ignore-unfixed: ${ignoreUnfixed}
timeout: ${timeout}${skipDirs.trim() ? `\nskip-dirs:\n${skipDirs.split(',').map(d => `  - ${d.trim()}`).join('\n')}` : ''}
`;
    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
              <select id={`${toolId}-type`} value={scanType} onChange={(e) => setScanType(e.target.value)} className="input-field" aria-label={`Scan type for ${toolName}`}>
                <option value="image">Image</option>
                <option value="filesystem">Filesystem</option>
                <option value="repository">Repository</option>
                <option value="config">Config</option>
                <option value="kubernetes">Kubernetes</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
              <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value)} className="input-field" aria-label="Output format">
                <option value="table">Table</option>
                <option value="json">JSON</option>
                <option value="sarif">SARIF</option>
                <option value="cyclonedx">CycloneDX</option>
                <option value="spdx">SPDX</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-severity`} className="block text-sm font-medium text-gray-700 mb-1">Severity (comma-separated)</label>
            <input id={`${toolId}-severity`} type="text" value={severity} onChange={(e) => setSeverity(e.target.value)} className="input-field" aria-label="Severity levels" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vulntype`} className="block text-sm font-medium text-gray-700 mb-1">Vulnerability Type</label>
            <input id={`${toolId}-vulntype`} type="text" value={vulnType} onChange={(e) => setVulnType(e.target.value)} className="input-field" aria-label="Vulnerability types" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-timeout`} className="block text-sm font-medium text-gray-700 mb-1">Timeout</label>
              <input id={`${toolId}-timeout`} type="text" value={timeout} onChange={(e) => setTimeout(e.target.value)} className="input-field" aria-label="Scan timeout" />
            </div>
            <div>
              <label htmlFor={`${toolId}-unfixed`} className="block text-sm font-medium text-gray-700 mb-1">Ignore Unfixed</label>
              <select id={`${toolId}-unfixed`} value={ignoreUnfixed ? 'true' : 'false'} onChange={(e) => setIgnoreUnfixed(e.target.value === 'true')} className="input-field" aria-label="Ignore unfixed vulnerabilities">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-skip`} className="block text-sm font-medium text-gray-700 mb-1">Skip Directories (comma-separated)</label>
            <input id={`${toolId}-skip`} type="text" value={skipDirs} onChange={(e) => setSkipDirs(e.target.value)} placeholder="node_modules, .git, vendor" className="input-field" aria-label="Directories to skip" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Trivy Config</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Trivy Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
