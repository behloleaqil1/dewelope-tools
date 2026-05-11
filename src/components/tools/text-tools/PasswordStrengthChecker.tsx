'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import { checkPasswordStrength } from '@/lib/text-tools';

/**
 * PasswordStrengthChecker - Analyze password strength in real-time.
 */
export default function PasswordStrengthChecker({ toolId }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ score: number; level: string; feedback: string[] } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setResult(checkPasswordStrength(input));
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const getColorClass = (score: number) => {
    if (score < 20) return 'bg-red-500';
    if (score < 40) return 'bg-orange-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-4">
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Password
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a password to check its strength..."
          aria-label="Password to check strength"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Strength: {result.level}</span>
              <span className="text-sm text-gray-500">{result.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getColorClass(result.score)}`}
                style={{ width: `${result.score}%` }}
                role="progressbar"
                aria-valuenow={result.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Password strength score"
              />
            </div>
            {result.feedback.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Suggestions:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                  {result.feedback.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
