'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JwtExpiryChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [expired, setExpired] = useState<boolean | null>(null);

  const check = () => {
    if (!input.trim()) { setOutput(''); setExpired(null); return; }
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload.exp) { setOutput('No "exp" claim found in token'); setExpired(null); return; }
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now > expDate;
      setExpired(isExpired);
      const diff = Math.abs(expDate.getTime() - now.getTime());
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setOutput(`Status: ${isExpired ? '❌ EXPIRED' : '✓ VALID'}\nExpires: ${expDate.toISOString()}\n${isExpired ? `Expired ${hours}h ${mins}m ago` : `Expires in ${hours}h ${mins}m`}\nIssued: ${payload.iat ? new Date(payload.iat * 1000).toISOString() : 'N/A'}`);
    } catch { setOutput('Error: Invalid JWT token'); setExpired(null); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JWT Token</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." aria-label={`Input for ${toolName}`} className="input-field h-24 resize-y font-mono" />
      </InputArea>
      <button onClick={check} className="btn-primary">Check Expiry</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className={`whitespace-pre-wrap text-sm font-mono p-4 rounded-lg border ${expired === true ? 'text-red-700 bg-red-50 border-red-200' : expired === false ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-800 bg-gray-50 border-gray-200'}`}>{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
