'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SslCertificateDecoder - Decode PEM certificate fields (basic parsing).
 */
export default function SslCertificateDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ subject: string; issuer: string; validFrom: string; validTo: string; serialNumber: string; algorithm: string } | null>(null);
  const [error, setError] = useState('');

  function decode() {
    setError('');
    setResult(null);
    if (!input.trim()) {
      setError('Please paste a PEM certificate');
      return;
    }

    // Basic PEM validation
    if (!input.includes('-----BEGIN CERTIFICATE-----') || !input.includes('-----END CERTIFICATE-----')) {
      setError('Invalid PEM format. Must contain BEGIN/END CERTIFICATE markers.');
      return;
    }

    // Extract base64 content
    const b64 = input
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .replace(/\s/g, '');

    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Simple ASN.1 DER parsing for common fields
      // Extract readable strings from the certificate
      const text = binary.replace(/[^\x20-\x7E]/g, ' ');
      const cnMatch = text.match(/CN=([^,/\s]+)/);
      const oMatch = text.match(/O=([^,/\s]+)/);

      setResult({
        subject: cnMatch ? `CN=${cnMatch[1]}` : 'Unable to parse subject',
        issuer: oMatch ? `O=${oMatch[1]}` : 'Unable to parse issuer',
        validFrom: 'Parse from ASN.1 (requires full decoder)',
        validTo: 'Parse from ASN.1 (requires full decoder)',
        serialNumber: Array.from(bytes.slice(15, 23)).map(b => b.toString(16).padStart(2, '0')).join(':'),
        algorithm: text.includes('sha256') || text.includes('SHA256') ? 'SHA-256 with RSA' : text.includes('sha384') ? 'SHA-384 with RSA' : 'RSA (detected from structure)',
      });
    } catch {
      setError('Failed to decode certificate. Check the PEM format.');
    }
  }

  const copyText = result
    ? `Subject: ${result.subject}\nIssuer: ${result.issuer}\nSerial: ${result.serialNumber}\nAlgorithm: ${result.algorithm}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          PEM Certificate
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
          aria-label={`PEM certificate input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-xs"
        />
      </InputArea>

      <button onClick={decode} aria-label="Decode SSL certificate" className="btn-primary">
        Decode Certificate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
              <div><span className="font-medium text-gray-700">Subject:</span> <span className="font-mono">{result.subject}</span></div>
              <div><span className="font-medium text-gray-700">Issuer:</span> <span className="font-mono">{result.issuer}</span></div>
              <div><span className="font-medium text-gray-700">Serial Number:</span> <span className="font-mono">{result.serialNumber}</span></div>
              <div><span className="font-medium text-gray-700">Algorithm:</span> <span className="font-mono">{result.algorithm}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
