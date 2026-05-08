'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateUUID } from '@/lib/developer-tools';

/**
 * UuidGenerator - Generate v4 UUIDs with instant copy.
 * Provides a generate button and count input for batch generation.
 * Requirements: 6.2, 6.6
 */
export default function UuidGenerator({ toolId }: ToolEngineProps) {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleGenerate() {
    const validCount = Math.max(1, Math.min(100, count));
    const generated: string[] = [];
    for (let i = 0; i < validCount; i++) {
      generated.push(generateUUID());
    }
    setUuids(generated);
  }

  async function handleCopySingle(uuid: string, index: number) {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 3000);
    } catch {
      // Graceful fallback
    }
  }

  const allUuidsText = uuids.join('\n');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
            Count (1-100)
          </label>
          <input
            id={`${toolId}-count`}
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            aria-label="Number of UUIDs to generate"
            className="w-24 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </div>
        <button
          onClick={handleGenerate}
          aria-label="Generate UUIDs"
          className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate
        </button>
      </div>

      <OutputArea hasContent={uuids.length > 0}>
        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <code className="text-sm font-mono text-gray-800 select-all">{uuid}</code>
                  <button
                    onClick={() => handleCopySingle(uuid, i)}
                    aria-label={copiedIndex === i ? 'Copied' : `Copy UUID ${i + 1}`}
                    className={`shrink-0 px-2 py-1 text-xs font-medium rounded min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                      copiedIndex === i
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copiedIndex === i ? '✓' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
            {uuids.length > 1 && (
              <CopyToClipboard text={allUuidsText} className="mt-2" />
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
