'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CertbotCommandGenerator - Generate Certbot/Let's Encrypt SSL certificate commands.
 * Supports various plugins (standalone, webroot, nginx, apache) and options.
 */
export default function CertbotCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [plugin, setPlugin] = useState('standalone');
  const [webroot, setWebroot] = useState('/var/www/html');
  const [action, setAction] = useState('certonly');
  const [dryRun, setDryRun] = useState(false);
  const [staging, setStaging] = useState(false);
  const [expandDomains, setExpandDomains] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!domain.trim()) {
      setOutput('');
      return;
    }

    const domains = domain.split(',').map(d => d.trim()).filter(Boolean);
    const parts: string[] = ['sudo certbot'];

    parts.push(action);

    if (plugin === 'webroot') {
      parts.push(`--webroot -w ${webroot}`);
    } else if (plugin === 'nginx') {
      parts.push('--nginx');
    } else if (plugin === 'apache') {
      parts.push('--apache');
    } else if (plugin === 'dns-cloudflare') {
      parts.push('--dns-cloudflare');
    } else {
      parts.push('--standalone');
    }

    domains.forEach(d => {
      parts.push(`-d ${d}`);
    });

    if (expandDomains.trim()) {
      expandDomains.split(',').map(d => d.trim()).filter(Boolean).forEach(d => {
        parts.push(`-d ${d}`);
      });
    }

    if (email.trim()) {
      parts.push(`--email ${email.trim()}`);
    } else {
      parts.push('--register-unsafely-without-email');
    }

    parts.push('--agree-tos');

    if (dryRun) parts.push('--dry-run');
    if (staging) parts.push('--staging');

    const command = parts.join(' \\\n  ');

    let result = `# ${action === 'certonly' ? 'Obtain' : action === 'renew' ? 'Renew' : 'Revoke'} SSL Certificate\n`;
    result += `# Domains: ${domains.join(', ')}\n`;
    result += `# Plugin: ${plugin}\n\n`;
    result += command;

    if (action === 'certonly') {
      result += '\n\n# After obtaining the certificate:\n';
      result += `# Certificate: /etc/letsencrypt/live/${domains[0]}/fullchain.pem\n`;
      result += `# Private Key: /etc/letsencrypt/live/${domains[0]}/privkey.pem\n`;
      result += '\n# Auto-renewal (add to crontab):\n';
      result += '# 0 0,12 * * * certbot renew --quiet';
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-domain`} className="block text-sm font-medium text-gray-700 mb-1">
              Domain(s) (comma-separated)
            </label>
            <input
              id={`${toolId}-domain`}
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com, www.example.com"
              aria-label={`Domain input for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-email`} className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
              id={`${toolId}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              aria-label="Email for certificate notifications"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-action`} className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select id={`${toolId}-action`} value={action} onChange={(e) => setAction(e.target.value)} className="input-field">
                <option value="certonly">Obtain Certificate</option>
                <option value="renew">Renew</option>
                <option value="revoke">Revoke</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-plugin`} className="block text-sm font-medium text-gray-700 mb-1">Plugin</label>
              <select id={`${toolId}-plugin`} value={plugin} onChange={(e) => setPlugin(e.target.value)} className="input-field">
                <option value="standalone">Standalone</option>
                <option value="webroot">Webroot</option>
                <option value="nginx">Nginx</option>
                <option value="apache">Apache</option>
                <option value="dns-cloudflare">DNS Cloudflare</option>
              </select>
            </div>
          </div>
          {plugin === 'webroot' && (
            <div>
              <label htmlFor={`${toolId}-webroot`} className="block text-sm font-medium text-gray-700 mb-1">Webroot Path</label>
              <input id={`${toolId}-webroot`} type="text" value={webroot} onChange={(e) => setWebroot(e.target.value)} className="input-field" />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-expand`} className="block text-sm font-medium text-gray-700 mb-1">
              Additional Domains (comma-separated, optional)
            </label>
            <input
              id={`${toolId}-expand`}
              type="text"
              value={expandDomains}
              onChange={(e) => setExpandDomains(e.target.value)}
              placeholder="mail.example.com, api.example.com"
              className="input-field"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
              Dry Run
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={staging} onChange={(e) => setStaging(e.target.checked)} />
              Staging Server
            </label>
          </div>
          <button onClick={generate} className="btn-primary">Generate Command</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Certbot Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
