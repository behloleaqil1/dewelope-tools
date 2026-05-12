'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DecisionMatrixCalculator - Weighted decision matrix scoring tool.
 * Helps compare options by scoring them against weighted criteria.
 */
export default function DecisionMatrixCalculator({ toolId }: { toolId: string; toolName: string }) {
  const [criteria, setCriteria] = useState([
    { name: '', weight: 5 },
    { name: '', weight: 5 },
    { name: '', weight: 5 },
  ]);
  const [options, setOptions] = useState([
    { name: '', scores: [5, 5, 5] },
    { name: '', scores: [5, 5, 5] },
  ]);
  const [result, setResult] = useState<{ rankings: { name: string; total: number; normalized: number }[]; details: string } | null>(null);

  const addCriterion = () => {
    setCriteria([...criteria, { name: '', weight: 5 }]);
    setOptions(options.map(opt => ({ ...opt, scores: [...opt.scores, 5] })));
  };

  const removeCriterion = (index: number) => {
    if (criteria.length <= 2) return;
    setCriteria(criteria.filter((_, i) => i !== index));
    setOptions(options.map(opt => ({ ...opt, scores: opt.scores.filter((_, i) => i !== index) })));
  };

  const addOption = () => {
    setOptions([...options, { name: '', scores: new Array(criteria.length).fill(5) }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateScore = (optIndex: number, critIndex: number, value: number) => {
    const updated = [...options];
    updated[optIndex] = { ...updated[optIndex], scores: [...updated[optIndex].scores] };
    updated[optIndex].scores[critIndex] = value;
    setOptions(updated);
  };

  const calculate = () => {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight === 0) return;

    const rankings = options.map(opt => {
      const total = opt.scores.reduce((sum, score, i) => {
        return sum + (score * criteria[i].weight);
      }, 0);
      const maxPossible = criteria.reduce((sum, c) => sum + (10 * c.weight), 0);
      const normalized = (total / maxPossible) * 100;
      return { name: opt.name || 'Unnamed', total, normalized };
    }).sort((a, b) => b.total - a.total);

    let details = 'Decision Matrix Results\n';
    details += '═'.repeat(50) + '\n\n';
    details += 'Criteria & Weights:\n';
    criteria.forEach(c => {
      details += `  • ${c.name || 'Unnamed'}: ${c.weight}/10\n`;
    });
    details += '\nRankings:\n';
    rankings.forEach((r, i) => {
      details += `  ${i + 1}. ${r.name}: ${r.total.toFixed(1)} pts (${r.normalized.toFixed(1)}%)\n`;
    });

    setResult({ rankings, details });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Criteria &amp; Weights (1-10)</label>
        {criteria.map((crit, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={crit.name}
              onChange={(e) => {
                const updated = [...criteria];
                updated[index] = { ...updated[index], name: e.target.value };
                setCriteria(updated);
              }}
              placeholder={`Criterion ${index + 1}`}
              aria-label={`Criterion ${index + 1} name`}
              className="input-field flex-1"
            />
            <input
              type="number"
              min={1}
              max={10}
              value={crit.weight}
              onChange={(e) => {
                const updated = [...criteria];
                updated[index] = { ...updated[index], weight: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) };
                setCriteria(updated);
              }}
              aria-label={`Weight for criterion ${index + 1}`}
              className="input-field w-20 text-center"
            />
            <button onClick={() => removeCriterion(index)} className="text-red-500 hover:text-red-700 px-2" disabled={criteria.length <= 2} aria-label={`Remove criterion ${index + 1}`}>✕</button>
          </div>
        ))}
        <button onClick={addCriterion} className="text-sm text-blue-600 hover:text-blue-800">+ Add Criterion</button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Options &amp; Scores (1-10)</label>
        {options.map((opt, optIndex) => (
          <div key={optIndex} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={opt.name}
                onChange={(e) => {
                  const updated = [...options];
                  updated[optIndex] = { ...updated[optIndex], name: e.target.value };
                  setOptions(updated);
                }}
                placeholder={`Option ${optIndex + 1}`}
                aria-label={`Option ${optIndex + 1} name`}
                className="input-field flex-1"
              />
              <button onClick={() => removeOption(optIndex)} className="text-red-500 hover:text-red-700 px-2" disabled={options.length <= 2} aria-label={`Remove option ${optIndex + 1}`}>✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {criteria.map((crit, critIndex) => (
                <div key={critIndex} className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 truncate max-w-[80px]">{crit.name || `C${critIndex + 1}`}:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={opt.scores[critIndex]}
                    onChange={(e) => updateScore(optIndex, critIndex, Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    aria-label={`Score for option ${optIndex + 1} criterion ${critIndex + 1}`}
                    className="input-field w-14 text-center text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addOption} className="text-sm text-blue-600 hover:text-blue-800">+ Add Option</button>
      </div>

      <button onClick={calculate} aria-label="Calculate decision matrix" className="btn-primary">
        Calculate Rankings
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Rankings</label>
            <div className="space-y-2">
              {result.rankings.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className={`text-lg font-bold ${i === 0 ? 'text-green-600' : 'text-gray-500'}`}>#{i + 1}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{r.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-blue-400'}`} style={{ width: `${r.normalized}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-gray-600">{r.total.toFixed(1)} ({r.normalized.toFixed(0)}%)</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={result.details} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
