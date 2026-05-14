'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CiCdPipelineVisualizer - Visualize CI/CD pipeline stages.
 */
export default function CiCdPipelineVisualizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [stages, setStages] = useState('Build,Test,Deploy Staging,Deploy Production');
  const [result, setResult] = useState<{ stages: string[]; diagram: string } | null>(null);
  const [error, setError] = useState('');

  function visualize() {
    setError('');
    setResult(null);
    const stageList = stages.split(',').map(s => s.trim()).filter(Boolean);
    if (stageList.length === 0) {
      setError('Please enter at least one stage');
      return;
    }

    // Build ASCII pipeline diagram
    const maxLen = Math.max(...stageList.map(s => s.length));
    const boxWidth = maxLen + 4;

    const lines: string[] = [];
    stageList.forEach((stage, i) => {
      const padded = stage.padStart(Math.floor((boxWidth - 2 + stage.length) / 2)).padEnd(boxWidth - 2);
      lines.push('┌' + '─'.repeat(boxWidth - 2) + '┐');
      lines.push('│' + padded + '│');
      lines.push('└' + '─'.repeat(boxWidth - 2) + '┘');
      if (i < stageList.length - 1) {
        const arrow = ' '.repeat(Math.floor(boxWidth / 2) - 1) + '│';
        const arrowHead = ' '.repeat(Math.floor(boxWidth / 2) - 1) + '▼';
        lines.push(arrow);
        lines.push(arrowHead);
      }
    });

    setResult({ stages: stageList, diagram: lines.join('\n') });
  }

  const copyText = result ? result.diagram : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-stages`} className="block text-sm font-medium text-gray-700 mb-1">
          Pipeline Stages (comma-separated)
        </label>
        <input
          id={`${toolId}-stages`}
          type="text"
          value={stages}
          onChange={(e) => setStages(e.target.value)}
          placeholder="Build, Test, Deploy"
          aria-label={`Pipeline stages for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={visualize} aria-label="Visualize pipeline" className="btn-primary">
        Visualize Pipeline
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {result.stages.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {i + 1}. {s}
                </span>
              ))}
            </div>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{result.diagram}</pre>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
