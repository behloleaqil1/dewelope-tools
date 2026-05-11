'use client';

import { useState, useCallback, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PasswordGenerator - Generate random passwords with configurable length and character sets.
 * Includes a strength indicator and auto-generates on option change.
 */
export default function PasswordGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const generatePassword = useCallback(() => {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    if (!charset) {
      setError('Please select at least one character type');
      setPassword('');
      return;
    }

    setError(undefined);
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array)
      .map((val) => charset[val % charset.length])
      .join('');
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  // Auto-generate on option change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  function getStrength(): { label: string; color: string; width: string } {
    if (!password) return { label: '', color: 'bg-gray-200', width: 'w-0' };

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 20) score++;
    if (password.length >= 32) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
    if (score <= 5) return { label: 'Strong', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Very Strong', color: 'bg-emerald-500', width: 'w-full' };
  }

  const strength = getStrength();

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-2">
              Password Length: <span className="font-bold text-indigo-600">{length}</span>
            </label>
            <input
              id={`${toolId}-length`}
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              aria-label="Password length slider"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                aria-label="Include uppercase letters"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Uppercase (A-Z)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                aria-label="Include lowercase letters"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Lowercase (a-z)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                aria-label="Include numbers"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Numbers (0-9)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                aria-label="Include symbols"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Symbols (!@#$...)
            </label>
          </div>

          <button
            onClick={generatePassword}
            aria-label="Generate password"
            className="btn-primary"
          >
            Generate Password
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!password}>
        {password && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Generated Password</h3>
              <CopyToClipboard text={password} />
            </div>
            <code className="block text-lg font-mono text-gray-800 break-all select-all p-4 bg-gray-50 rounded-lg border border-gray-100">
              {password}
            </code>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Strength</span>
                <span className="font-medium text-gray-700">{strength.label}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                  role="progressbar"
                  aria-label={`Password strength: ${strength.label}`}
                  aria-valuenow={strength.label === 'Weak' ? 25 : strength.label === 'Fair' ? 50 : strength.label === 'Strong' ? 75 : 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
