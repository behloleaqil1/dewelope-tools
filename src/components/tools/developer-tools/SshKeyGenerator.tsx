'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SshKeyGenerator - Display SSH key format info (educational tool).
 */
export default function SshKeyGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [keyType, setKeyType] = useState('ed25519');
  const [comment, setComment] = useState('user@host');
  const [output, setOutput] = useState('');

  function generateInfo() {
    const formats: Record<string, { bits: string; algorithm: string; example: string; command: string }> = {
      ed25519: {
        bits: '256',
        algorithm: 'EdDSA (Curve25519)',
        example: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...',
        command: `ssh-keygen -t ed25519 -C "${comment}"`,
      },
      rsa4096: {
        bits: '4096',
        algorithm: 'RSA',
        example: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ...',
        command: `ssh-keygen -t rsa -b 4096 -C "${comment}"`,
      },
      ecdsa: {
        bits: '521',
        algorithm: 'ECDSA (P-521)',
        example: 'ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTI...',
        command: `ssh-keygen -t ecdsa -b 521 -C "${comment}"`,
      },
    };

    const info = formats[keyType];
    setOutput(
      `Key Type: ${keyType.toUpperCase()}\n` +
      `Algorithm: ${info.algorithm}\n` +
      `Key Size: ${info.bits} bits\n` +
      `Comment: ${comment}\n\n` +
      `Command to generate:\n  ${info.command}\n\n` +
      `Public key format:\n  ${info.example}\n\n` +
      `Files created:\n  ~/.ssh/id_${keyType} (private)\n  ~/.ssh/id_${keyType}.pub (public)`
    );
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Key Type</label>
            <select
              id={`${toolId}-type`}
              value={keyType}
              onChange={(e) => setKeyType(e.target.value)}
              aria-label={`SSH key type for ${toolName}`}
              className="input-field"
            >
              <option value="ed25519">Ed25519 (Recommended)</option>
              <option value="rsa4096">RSA 4096-bit</option>
              <option value="ecdsa">ECDSA P-521</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-comment`} className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <input
              id={`${toolId}-comment`}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="user@host"
              aria-label="SSH key comment"
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={generateInfo} aria-label="Show SSH key info" className="btn-primary">
        Show Key Info
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SSH Key Information</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
