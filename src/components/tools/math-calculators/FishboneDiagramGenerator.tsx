'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FishboneDiagramGenerator - Generate Ishikawa/fishbone diagram text layout.
 * Creates a text-based cause-and-effect diagram for root cause analysis.
 */
export default function FishboneDiagramGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [problem, setProblem] = useState('');
  const [categories, setCategories] = useState([
    { name: 'People', causes: '' },
    { name: 'Process', causes: '' },
    { name: 'Equipment', causes: '' },
    { name: 'Materials', causes: '' },
    { name: 'Environment', causes: '' },
    { name: 'Management', causes: '' },
  ]);
  const [output, setOutput] = useState('');

  const updateCategory = (index: number, field: 'name' | 'causes', value: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', causes: '' }]);
  };

  const removeCategory = (index: number) => {
    if (categories.length <= 2) return;
    setCategories(categories.filter((_, i) => i !== index));
  };

  const generate = () => {
    if (!problem.trim()) return;

    const activeCats = categories.filter(c => c.name.trim());
    const spineLength = 60;

    let diagram = '';
    diagram += '╔' + '═'.repeat(spineLength + 2) + '╗\n';
    diagram += '║  FISHBONE DIAGRAM (Ishikawa / Cause-and-Effect)' + ' '.repeat(Math.max(0, spineLength - 47)) + '║\n';
    diagram += '╚' + '═'.repeat(spineLength + 2) + '╝\n\n';

    diagram += `Problem: ${problem.trim()}\n`;
    diagram += '═'.repeat(spineLength) + '►\n\n';

    const topCats = activeCats.filter((_, i) => i % 2 === 0);
    const bottomCats = activeCats.filter((_, i) => i % 2 === 1);

    // Top categories
    topCats.forEach(cat => {
      const causes = cat.causes.split('\n').map(c => c.trim()).filter(Boolean);
      diagram += `  ┌─── ${cat.name.toUpperCase()} ───┐\n`;
      diagram += `  │    ╲\n`;
      causes.forEach(cause => {
        diagram += `  │     ├── ${cause}\n`;
      });
      if (causes.length === 0) {
        diagram += `  │     ├── (add causes)\n`;
      }
      diagram += `  │    ╱\n`;
      diagram += `  └────────${'─'.repeat(cat.name.length)}──┘\n`;
    });

    diagram += '\n' + '─'.repeat(spineLength) + '► [EFFECT]\n\n';

    // Bottom categories
    bottomCats.forEach(cat => {
      const causes = cat.causes.split('\n').map(c => c.trim()).filter(Boolean);
      diagram += `  ┌─── ${cat.name.toUpperCase()} ───┐\n`;
      diagram += `  │    ╲\n`;
      causes.forEach(cause => {
        diagram += `  │     ├── ${cause}\n`;
      });
      if (causes.length === 0) {
        diagram += `  │     ├── (add causes)\n`;
      }
      diagram += `  │    ╱\n`;
      diagram += `  └────────${'─'.repeat(cat.name.length)}──┘\n`;
    });

    diagram += '\n' + '═'.repeat(spineLength) + '\n';
    diagram += `\nSummary:\n`;
    diagram += `  Problem: ${problem.trim()}\n`;
    activeCats.forEach(cat => {
      const causes = cat.causes.split('\n').map(c => c.trim()).filter(Boolean);
      diagram += `  ${cat.name}: ${causes.length} cause(s)\n`;
    });

    setOutput(diagram);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-problem`} className="block text-sm font-medium text-gray-700 mb-1">
          Problem Statement (Effect)
        </label>
        <input
          id={`${toolId}-problem`}
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g. High customer churn rate"
          aria-label={`Problem statement for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Categories &amp; Causes</label>
        {categories.map((cat, index) => (
          <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(index, 'name', e.target.value)}
                placeholder="Category name"
                aria-label={`Category ${index + 1} name`}
                className="input-field text-sm"
              />
              <textarea
                value={cat.causes}
                onChange={(e) => updateCategory(index, 'causes', e.target.value)}
                placeholder="Causes (one per line)"
                aria-label={`Causes for category ${index + 1}`}
                className="input-field text-sm h-16 resize-y font-mono"
              />
            </div>
            <button
              onClick={() => removeCategory(index)}
              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
              aria-label={`Remove category ${index + 1}`}
              disabled={categories.length <= 2}
            >
              ✕
            </button>
          </div>
        ))}
        <button onClick={addCategory} className="text-sm text-blue-600 hover:text-blue-800">
          + Add Category
        </button>
      </div>

      <button onClick={generate} aria-label="Generate fishbone diagram" className="btn-primary">
        Generate Diagram
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fishbone Diagram</label>
            <pre className="whitespace-pre text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
