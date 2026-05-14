'use client';

import { useState, useMemo } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IngredientSubstitutionCalculator - Find ingredient substitutions with adjusted amounts.
 */
export default function IngredientSubstitutionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ingredient, setIngredient] = useState('');
  const [amount, setAmount] = useState('1');

  const substitutions = useMemo(() => ({
    'butter': [
      { sub: 'coconut oil', ratio: 1, note: 'Same amount, solid at room temp' },
      { sub: 'applesauce', ratio: 0.5, note: 'Use half the amount, reduces fat' },
      { sub: 'Greek yogurt', ratio: 0.5, note: 'Use half, adds moisture' },
      { sub: 'avocado', ratio: 1, note: 'Same amount, mashed' },
    ],
    'egg': [
      { sub: 'flax egg (1 tbsp ground flax + 3 tbsp water)', ratio: 1, note: 'Let sit 5 min' },
      { sub: 'mashed banana', ratio: 0.25, note: '1/4 cup per egg, adds sweetness' },
      { sub: 'applesauce', ratio: 0.25, note: '1/4 cup per egg' },
      { sub: 'silken tofu', ratio: 0.25, note: '1/4 cup blended per egg' },
    ],
    'milk': [
      { sub: 'almond milk', ratio: 1, note: 'Same amount, lighter flavor' },
      { sub: 'oat milk', ratio: 1, note: 'Same amount, creamy texture' },
      { sub: 'coconut milk', ratio: 1, note: 'Same amount, richer' },
      { sub: 'soy milk', ratio: 1, note: 'Same amount, high protein' },
    ],
    'flour': [
      { sub: 'almond flour', ratio: 1, note: 'Same amount, gluten-free, denser' },
      { sub: 'oat flour', ratio: 1, note: 'Same amount, blend oats' },
      { sub: 'coconut flour', ratio: 0.25, note: 'Use 1/4 amount, very absorbent' },
      { sub: 'rice flour', ratio: 1, note: 'Same amount, lighter texture' },
    ],
    'sugar': [
      { sub: 'honey', ratio: 0.75, note: 'Use 3/4 amount, reduce liquid by 1/4 cup' },
      { sub: 'maple syrup', ratio: 0.75, note: 'Use 3/4 amount, reduce liquid' },
      { sub: 'stevia', ratio: 0.005, note: 'Very concentrated, tiny amount' },
      { sub: 'coconut sugar', ratio: 1, note: 'Same amount, lower glycemic' },
    ],
    'cream': [
      { sub: 'coconut cream', ratio: 1, note: 'Same amount, dairy-free' },
      { sub: 'cashew cream', ratio: 1, note: 'Blend soaked cashews with water' },
      { sub: 'evaporated milk', ratio: 1, note: 'Same amount, lighter' },
    ],
  }), []);

  const findSubstitutions = (): string => {
    const search = ingredient.toLowerCase().trim();
    if (!search) return '';
    const num = parseFloat(amount) || 1;

    const key = Object.keys(substitutions).find(k => search.includes(k));
    if (!key) return `No substitutions found for "${ingredient}". Try: butter, egg, milk, flour, sugar, cream`;

    const subs = substitutions[key as keyof typeof substitutions];
    const lines = subs.map(s => {
      const adjusted = (num * s.ratio).toFixed(2).replace(/\.?0+$/, '');
      return `• ${adjusted} ${s.sub}\n  ${s.note}`;
    });

    return `Substitutions for ${num} ${key}:\n\n${lines.join('\n\n')}`;
  };

  const result = findSubstitutions();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-ing`} className="block text-sm font-medium text-gray-700 mb-1">Ingredient</label>
        <input id={`${toolId}-ing`} type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="e.g. butter, egg, milk, flour, sugar" aria-label={`Ingredient for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-amt`} className="block text-sm font-medium text-gray-700 mb-1">Amount (cups/units)</label>
        <input id={`${toolId}-amt`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.1" step="0.25" aria-label={`Amount for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
