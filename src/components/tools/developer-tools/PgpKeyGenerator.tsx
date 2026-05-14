'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PgpKeyGenerator - Display PGP key format info (educational tool).
 */
export default function PgpKeyGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [keySize, setKeySize] = useState('4096');
  const [output, setOutput] = useState('');

  function generateInfo() {
    const uid = name && email ? `${name} <${email}>` : name || email || 'User <user@example.com>';

    const info = [
      `PGP Key Configuration`,
      `═══════════════════════`,
      `User ID: ${uid}`,
      `Key Size: ${keySize} bits`,
      `Algorithm: RSA`,
      `Subkey: RSA ${keySize} (encryption)`,
      ``,
      `GPG Command:`,
      `  gpg --full-generate-key`,
      `  # Select: (1) RSA and RSA`,
      `  # Key size: ${keySize}`,
      `  # Expiry: 1y (recommended)`,
      `  # Name: ${name || 'Your Name'}`,
      `  # Email: ${email || 'your@email.com'}`,
      ``,
      `Quick Generate:`,
      `  gpg --quick-gen-key "${uid}" rsa${keySize} default 1y`,
      ``,
      `Export Public Key:`,
      `  gpg --armor --export "${email || 'your@email.com'}"`,
      ``,
      `Key Format:`,
      `  -----BEGIN PGP PUBLIC KEY BLOCK-----`,
      `  [Base64 encoded key data]`,
      `  -----END PGP PUBLIC KEY BLOCK-----`,
    ].join('\n');

    setOutput(info);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              aria-label={`Name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-email`} className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id={`${toolId}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email for PGP key"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Key Size</label>
            <select
              id={`${toolId}-size`}
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
              aria-label="PGP key size"
              className="input-field"
            >
              <option value="2048">2048 bits</option>
              <option value="4096">4096 bits (Recommended)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generateInfo} aria-label="Show PGP key info" className="btn-primary">
        Show PGP Key Info
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
