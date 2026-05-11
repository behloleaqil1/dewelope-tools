'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConsonantClusterFinder - Finds and highlights consonant clusters in text.
 * A consonant cluster is two or more consecutive consonants.
 */
export default function ConsonantClusterFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [clusters, setClusters] = useState<{ cluster: string; count: number }[]>([]);
  const [totalClusters, setTotalClusters] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setClusters([]); setTotalClusters(0); return; }

    debounceRef.current = setTimeout(() => {
      const consonantPattern = /[bcdfghjklmnpqrstvwxyz]{2,}/gi;
      const matches = input.match(consonantPattern) || [];
      setTotalClusters(matches.length);

      const freq: Record<string, number> = {};
      matches.forEach((m) => {
        const lower = m.toLowerCase();
        freq[lower] = (freq[lower] || 0) + 1;
      });

      const sorted = Object.entries(freq)
        .map(([cluster, count]) => ({ cluster, count }))
        .sort((a, b) => b.count - a.count || b.cluster.length - a.cluster.length);

      setClusters(sorted);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const highlightedText = input.replace(/[bcdfghjklmnpqrstvwxyz]{2,}/gi, (match) => `【${match}】`);

  const copyText = clusters.length > 0
    ? `Total clusters: ${totalClusters}\n\n${clusters.map((c) => `${c.cluster} (×${c.count})`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to find consonant clusters (e.g., 'strengths' has 'str' and 'ngths')..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={clusters.length > 0}>
        {clusters.length > 0 && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalClusters}</div>
              <div className="text-xs text-gray-500">Consonant Clusters Found</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Text</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{highlightedText}</pre>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clusters by Frequency</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {clusters.slice(0, 15).map((c, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                    <span className="font-mono font-bold text-blue-600">{c.cluster}</span>
                    <span className="text-xs text-gray-500 ml-1">×{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
