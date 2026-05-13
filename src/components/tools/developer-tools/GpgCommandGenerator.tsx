'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GpgCommandGenerator - Generate GPG encryption/signing commands.
 * Supports key generation, encryption, decryption, signing, and verification.
 */
export default function GpgCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [operation, setOperation] = useState('encrypt');
  const [keyType, setKeyType] = useState('RSA');
  const [keySize, setKeySize] = useState('4096');
  const [recipient, setRecipient] = useState('');
  const [inputFile, setInputFile] = useState('');
  const [outputFile, setOutputFile] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [armor, setArmor] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    let cmd = '';
    const armorFlag = armor ? ' --armor' : '';

    switch (operation) {
      case 'generate-key':
        cmd = `gpg --full-generate-key --key-type ${keyType} --key-length ${keySize}`;
        if (userName || userEmail) {
          cmd = `gpg --batch --gen-key <<EOF\nKey-Type: ${keyType}\nKey-Length: ${keySize}\nSubkey-Type: ${keyType}\nSubkey-Length: ${keySize}${userName ? `\nName-Real: ${userName}` : ''}${userEmail ? `\nName-Email: ${userEmail}` : ''}\nExpire-Date: 0\n%no-protection\n%commit\nEOF`;
        }
        break;
      case 'encrypt':
        cmd = `gpg${armorFlag} --encrypt${recipient ? ` --recipient "${recipient}"` : ''}${outputFile ? ` --output "${outputFile}"` : ''} "${inputFile || 'file.txt'}"`;
        break;
      case 'decrypt':
        cmd = `gpg${armorFlag}${outputFile ? ` --output "${outputFile}"` : ''} --decrypt "${inputFile || 'file.txt.gpg'}"`;
        break;
      case 'sign':
        cmd = `gpg${armorFlag} --sign${outputFile ? ` --output "${outputFile}"` : ''} "${inputFile || 'file.txt'}"`;
        break;
      case 'detach-sign':
        cmd = `gpg${armorFlag} --detach-sign${outputFile ? ` --output "${outputFile}"` : ''} "${inputFile || 'file.txt'}"`;
        break;
      case 'clearsign':
        cmd = `gpg --clearsign${outputFile ? ` --output "${outputFile}"` : ''} "${inputFile || 'file.txt'}"`;
        break;
      case 'verify':
        cmd = `gpg --verify "${inputFile || 'file.txt.sig'}"${outputFile ? ` "${outputFile}"` : ''}`;
        break;
      case 'encrypt-sign':
        cmd = `gpg${armorFlag} --encrypt --sign${recipient ? ` --recipient "${recipient}"` : ''}${outputFile ? ` --output "${outputFile}"` : ''} "${inputFile || 'file.txt'}"`;
        break;
      case 'list-keys':
        cmd = `gpg --list-keys${recipient ? ` "${recipient}"` : ''}`;
        break;
      case 'export-public':
        cmd = `gpg${armorFlag} --export${recipient ? ` "${recipient}"` : ''}${outputFile ? ` > "${outputFile}"` : ''}`;
        break;
      case 'import-key':
        cmd = `gpg --import "${inputFile || 'publickey.asc'}"`;
        break;
      default:
        cmd = '# Select an operation';
    }

    setOutput(cmd);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-operation`} className="block text-sm font-medium text-gray-700 mb-1">
          Operation
        </label>
        <select
          id={`${toolId}-operation`}
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          aria-label={`Operation for ${toolName}`}
          className="input-field"
        >
          <option value="generate-key">Generate Key Pair</option>
          <option value="encrypt">Encrypt File</option>
          <option value="decrypt">Decrypt File</option>
          <option value="sign">Sign File</option>
          <option value="detach-sign">Detach Sign</option>
          <option value="clearsign">Clear Sign</option>
          <option value="verify">Verify Signature</option>
          <option value="encrypt-sign">Encrypt &amp; Sign</option>
          <option value="list-keys">List Keys</option>
          <option value="export-public">Export Public Key</option>
          <option value="import-key">Import Key</option>
        </select>

        {operation === 'generate-key' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-sm text-gray-600">Key Type</label>
              <select value={keyType} onChange={(e) => setKeyType(e.target.value)} className="input-field">
                <option value="RSA">RSA</option>
                <option value="DSA">DSA</option>
                <option value="ECDSA">ECDSA</option>
                <option value="EDDSA">EdDSA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Key Size</label>
              <select value={keySize} onChange={(e) => setKeySize(e.target.value)} className="input-field">
                <option value="2048">2048</option>
                <option value="3072">3072</option>
                <option value="4096">4096</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
          </div>
        )}

        {operation !== 'generate-key' && operation !== 'list-keys' && (
          <div className="mt-2 space-y-2">
            {(operation === 'encrypt' || operation === 'encrypt-sign' || operation === 'list-keys' || operation === 'export-public') && (
              <div>
                <label className="block text-sm text-gray-600">Recipient (email or key ID)</label>
                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="recipient@example.com" className="input-field" />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600">Input File</label>
              <input type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} placeholder="file.txt" className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Output File (optional)</label>
              <input type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} placeholder="output.gpg" className="input-field" />
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <input type="checkbox" id={`${toolId}-armor`} checked={armor} onChange={(e) => setArmor(e.target.checked)} />
          <label htmlFor={`${toolId}-armor`} className="text-sm text-gray-600">ASCII armor output (--armor)</label>
        </div>

        <button onClick={generate} className="btn-primary mt-3">Generate Command</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated GPG Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
