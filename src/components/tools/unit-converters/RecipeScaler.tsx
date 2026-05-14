'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RecipeScaler - Scale recipe ingredients by a multiplier.
 */
export default function RecipeScaler({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ingredients, setIngredients] = useState('');
  const [originalServings, setOriginalServings] = useState('4');
  const [desiredServings, setDesiredServings] = useState('8');

  const scaleRecipe = (): string => {
    if (!ingredients.trim()) return '';
    const original = parseFloat(originalServings) || 4;
    const desired = parseFloat(desiredServings) || 4;
    const factor = desired / original;

    const lines = ingredients.split('\n').filter(l => l.trim());
    const scaled = lines.map(line => {
      // Try to find a number at the start of the line
      const match = line.match(/^([\d./]+)\s*(.*)/);
      if (match) {
        let num: number;
        if (match[1].includes('/')) {
          const [n, d] = match[1].split('/');
          num = parseInt(n) / parseInt(d);
        } else {
          num = parseFloat(match[1]);
        }
        const scaled = num * factor;
        const display = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(2);
        return `${display} ${match[2]}`;
      }
      return line;
    });

    return `Scaled for ${desired} servings (×${factor.toFixed(2)}):\n\n${scaled.join('\n')}`;
  };

  const result = scaleRecipe();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-ingredients`} className="block text-sm font-medium text-gray-700 mb-1">Ingredients (one per line, start with amount)</label>
        <textarea id={`${toolId}-ingredients`} value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={6} placeholder="2 cups flour&#10;1/2 cup sugar&#10;3 eggs&#10;1.5 tsp vanilla" aria-label={`Ingredients for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-orig`} className="block text-sm font-medium text-gray-700 mb-1">Original Servings</label>
          <input id={`${toolId}-orig`} type="number" value={originalServings} onChange={(e) => setOriginalServings(e.target.value)} min="1" aria-label={`Original servings for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-desired`} className="block text-sm font-medium text-gray-700 mb-1">Desired Servings</label>
          <input id={`${toolId}-desired`} type="number" value={desiredServings} onChange={(e) => setDesiredServings(e.target.value)} min="1" aria-label={`Desired servings for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
