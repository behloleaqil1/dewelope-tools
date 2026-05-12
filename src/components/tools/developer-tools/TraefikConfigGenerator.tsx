'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TraefikConfigGenerator - Generate Traefik router and service configuration.
 */
export default function TraefikConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routerName, setRouterName] = useState('');
  const [domain, setDomain] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [enableTls, setEnableTls] = useState(true);
  const [pathPrefix, setPathPrefix] = useState('');
  const [format, setFormat] = useState<'yaml' | 'toml'>('yaml');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = routerName.trim() || 'my-router';
    const host = domain.trim() || 'example.com';
    const backend = serviceUrl.trim() || 'http://localhost:8080';
    const prefix = pathPrefix.trim();

    let rule = `Host(\`${host}\`)`;
    if (prefix) {
      rule += ` && PathPrefix(\`${prefix}\`)`;
    }

    if (format === 'yaml') {
      let yaml = `http:\n  routers:\n    ${name}:\n      rule: "${rule}"\n      service: "${name}-service"\n      entryPoints:\n        - "web"`;
      if (enableTls) {
        yaml += `\n        - "websecure"\n      tls:\n        certResolver: "letsencrypt"`;
      }
      yaml += `\n\n  services:\n    ${name}-service:\n      loadBalancer:\n        servers:\n          - url: "${backend}"`;
      setOutput(yaml);
    } else {
      let toml = `[http.routers.${name}]\n  rule = "${rule}"\n  service = "${name}-service"\n  entryPoints = ["web"`;
      if (enableTls) {
        toml += `, "websecure"]\n  [http.routers.${name}.tls]\n    certResolver = "letsencrypt"`;
      } else {
        toml += `]`;
      }
      toml += `\n\n[http.services.${name}-service.loadBalancer]\n  [[http.services.${name}-service.loadBalancer.servers]]\n    url = "${backend}"`;
      setOutput(toml);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Router Name</label>
              <input id={`${toolId}-name`} type="text" value={routerName} onChange={(e) => setRouterName(e.target.value)} placeholder="my-router" aria-label={`Router name for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-domain`} className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input id={`${toolId}-domain`} type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" aria-label="Domain" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">Backend Service URL</label>
              <input id={`${toolId}-url`} type="text" value={serviceUrl} onChange={(e) => setServiceUrl(e.target.value)} placeholder="http://localhost:8080" aria-label="Backend service URL" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Path Prefix (optional)</label>
              <input id={`${toolId}-path`} type="text" value={pathPrefix} onChange={(e) => setPathPrefix(e.target.value)} placeholder="/api" aria-label="Path prefix" className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={enableTls} onChange={(e) => setEnableTls(e.target.checked)} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Enable TLS (Let&apos;s Encrypt)</span>
            </label>
            <div className="flex items-center gap-2">
              <label htmlFor={`${toolId}-format`} className="text-sm text-gray-700">Format:</label>
              <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value as 'yaml' | 'toml')} aria-label="Output format" className="input-field w-24">
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Traefik config">Generate Config</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Traefik Configuration ({format.toUpperCase()})</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
