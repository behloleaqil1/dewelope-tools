'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MAX_CHARS = 280;

/**
 * TwitterCharCounter - Counts characters for Twitter/X posts with a 280 character limit.
 * Shows characters used, remaining, over-limit warning, and a color-coded progress bar.
 */
export default function TwitterCharCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');

  const charsUsed = input.length;
  const charsRemaining = MAX_CHARS - charsUsed;
  const isOverLimit = charsUsed > MAX_CHARS;
  const percentage = Math.min((charsUsed / MAX_CHARS) * 100, 100);

  const getBarColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Compose your tweet
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your tweet here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y"
        />
      </InputArea>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5" aria-label="Character usage progress bar">
        <div
          className={`h-2.5 rounded-full transition-all duration-200 ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <OutputArea hasContent={charsUsed > 0}>
        {charsUsed > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{charsUsed}</div>
                <div className="text-xs text-gray-500">Characters Used</div>
              </div>
              <div className={`p-3 rounded-lg border text-center ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-2xl font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-800'}`}>
                  {charsRemaining}
                </div>
                <div className="text-xs text-gray-500">Characters Remaining</div>
              </div>
            </div>

            {isOverLimit && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700 font-medium">
                  Over limit by {Math.abs(charsRemaining)} character{Math.abs(charsRemaining) !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <CopyToClipboard text={input} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
