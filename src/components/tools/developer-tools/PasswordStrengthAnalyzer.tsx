'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PasswordStrengthAnalyzer - Analyze password strength (length, complexity, entropy).
 */
export default function PasswordStrengthAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{ score: number; entropy: number; length: number; hasUpper: boolean; hasLower: boolean; hasDigit: boolean; hasSpecial: boolean; strength: string; suggestions: string[] } | null>(null);

  function analyze() {
    if (!password) return;

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Calculate character pool size
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigit) poolSize += 10;
    if (hasSpecial) poolSize += 33;

    const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize) * 100) / 100 : 0;

    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (hasUpper && hasLower) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;
    if (entropy >= 60) score++;

    const strengths = ['Very Weak', 'Weak', 'Fair', 'Moderate', 'Strong', 'Very Strong', 'Excellent'];
    const strength = strengths[Math.min(score, strengths.length - 1)];

    const suggestions: string[] = [];
    if (length < 12) suggestions.push('Use at least 12 characters');
    if (!hasUpper) suggestions.push('Add uppercase letters');
    if (!hasLower) suggestions.push('Add lowercase letters');
    if (!hasDigit) suggestions.push('Add numbers');
    if (!hasSpecial) suggestions.push('Add special characters');

    setResult({ score, entropy, length, hasUpper, hasLower, hasDigit, hasSpecial, strength, suggestions });
  }

  const copyText = result
    ? `Password Length: ${result.length}\nEntropy: ${result.entropy} bits\nStrength: ${result.strength}\nScore: ${result.score}/7`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to analyze"
          aria-label={`Password input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={analyze} aria-label="Analyze password strength" className="btn-primary">
        Analyze Strength
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.strength}</div>
              <div className="text-sm text-gray-500 mt-1">Score: {result.score}/7 | Entropy: {result.entropy} bits</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-medium">Length:</span> {result.length}
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-medium">Uppercase:</span> {result.hasUpper ? '✓' : '✗'}
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-medium">Lowercase:</span> {result.hasLower ? '✓' : '✗'}
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-medium">Digits:</span> {result.hasDigit ? '✓' : '✗'}
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-medium">Special:</span> {result.hasSpecial ? '✓' : '✗'}
              </div>
            </div>
            {result.suggestions.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
                <div className="font-medium text-yellow-800 mb-1">Suggestions:</div>
                <ul className="list-disc list-inside text-yellow-700 space-y-0.5">
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
