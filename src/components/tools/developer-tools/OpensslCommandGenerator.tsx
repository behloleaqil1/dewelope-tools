'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpensslCommandGenerator - Generate OpenSSL certificate and key commands.
 * Supports generating keys, CSRs, self-signed certs, and certificate inspection.
 */
export default function OpensslCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [operation, setOperation] = useState('generate-key');
  const [keyType, setKeyType] = useState('rsa');
  const [keySize, setKeySize] = useState('2048');
  const [days, setDays] = useState('365');
  const [commonName, setCommonName] = useState('example.com');
  const [fileName, setFileName] = useState('server');
  const [output, setOutput] = useState('');

  const generate = () => {
    let cmd = '';

    switch (operation) {
      case 'generate-key':
        if (keyType === 'rsa') {
          cmd = `openssl genrsa -out ${fileName}.key ${keySize}`;
        } else if (keyType === 'ec') {
          cmd = `openssl ecparam -genkey -name prime256v1 -out ${fileName}.key`;
        } else {
          cmd = `openssl genpkey -algorithm ed25519 -out ${fileName}.key`;
        }
        break;
      case 'generate-csr':
        cmd = `openssl req -new -key ${fileName}.key -out ${fileName}.csr -subj "/CN=${commonName}/O=Organization/C=US"`;
        break;
      case 'self-signed':
        cmd = `openssl req -x509 -newkey rsa:${keySize} -keyout ${fileName}.key -out ${fileName}.crt -days ${days} -nodes -subj "/CN=${commonName}"`;
        break;
      case 'inspect-cert':
        cmd = `openssl x509 -in ${fileName}.crt -text -noout`;
        break;
      case 'inspect-csr':
        cmd = `openssl req -in ${fileName}.csr -text -noout`;
        break;
      case 'verify-key-cert':
        cmd = `# Check if key matches certificate\nopenssl x509 -noout -modulus -in ${fileName}.crt | openssl md5\nopenssl rsa -noout -modulus -in ${fileName}.key | openssl md5`;
        break;
      case 'convert-pem-pfx':
        cmd = `openssl pkcs12 -export -out ${fileName}.pfx -inkey ${fileName}.key -in ${fileName}.crt -certfile ca.crt`;
        break;
      case 'convert-pfx-pem':
        cmd = `openssl pkcs12 -in ${fileName}.pfx -out ${fileName}.pem -nodes`;
        break;
      default:
        cmd = '';
    }

    setOutput(cmd);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-operation`} className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
            <select id={`${toolId}-operation`} value={operation} onChange={(e) => setOperation(e.target.value)} aria-label={`Operation for ${toolName}`} className="input-field">
              <option value="generate-key">Generate Private Key</option>
              <option value="generate-csr">Generate CSR</option>
              <option value="self-signed">Self-Signed Certificate</option>
              <option value="inspect-cert">Inspect Certificate</option>
              <option value="inspect-csr">Inspect CSR</option>
              <option value="verify-key-cert">Verify Key Matches Cert</option>
              <option value="convert-pem-pfx">Convert PEM to PFX</option>
              <option value="convert-pfx-pem">Convert PFX to PEM</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-filename`} className="block text-sm font-medium text-gray-700 mb-1">Base Filename</label>
            <input id={`${toolId}-filename`} type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="input-field" aria-label="Base filename" />
          </div>
          {(operation === 'generate-key' || operation === 'self-signed') && (
            <div>
              <label htmlFor={`${toolId}-keytype`} className="block text-sm font-medium text-gray-700 mb-1">Key Type</label>
              <select id={`${toolId}-keytype`} value={keyType} onChange={(e) => setKeyType(e.target.value)} className="input-field" aria-label="Key type">
                <option value="rsa">RSA</option>
                <option value="ec">EC (P-256)</option>
                <option value="ed25519">Ed25519</option>
              </select>
            </div>
          )}
          {(operation === 'generate-key' || operation === 'self-signed') && keyType === 'rsa' && (
            <div>
              <label htmlFor={`${toolId}-keysize`} className="block text-sm font-medium text-gray-700 mb-1">Key Size (bits)</label>
              <select id={`${toolId}-keysize`} value={keySize} onChange={(e) => setKeySize(e.target.value)} className="input-field" aria-label="Key size">
                <option value="2048">2048</option>
                <option value="3072">3072</option>
                <option value="4096">4096</option>
              </select>
            </div>
          )}
          {(operation === 'generate-csr' || operation === 'self-signed') && (
            <div>
              <label htmlFor={`${toolId}-cn`} className="block text-sm font-medium text-gray-700 mb-1">Common Name (Domain)</label>
              <input id={`${toolId}-cn`} type="text" value={commonName} onChange={(e) => setCommonName(e.target.value)} className="input-field" aria-label="Common name" />
            </div>
          )}
          {operation === 'self-signed' && (
            <div>
              <label htmlFor={`${toolId}-days`} className="block text-sm font-medium text-gray-700 mb-1">Validity (days)</label>
              <input id={`${toolId}-days`} type="number" value={days} onChange={(e) => setDays(e.target.value)} className="input-field" aria-label="Validity in days" />
            </div>
          )}
          <button onClick={generate} className="btn-primary w-full">Generate Command</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
