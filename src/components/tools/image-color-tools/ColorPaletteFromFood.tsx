'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFood - Generate color palettes inspired by foods.
 * Curated palettes based on popular foods and their natural colors.
 */
export default function ColorPaletteFromFood({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedFood, setSelectedFood] = useState('');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const foodPalettes: Record<string, { hex: string; name: string }[]> = {
    'Avocado': [
      { hex: '#2D5016', name: 'Dark Skin' },
      { hex: '#4A7C23', name: 'Outer Flesh' },
      { hex: '#8DB255', name: 'Light Flesh' },
      { hex: '#C5E17A', name: 'Inner Flesh' },
      { hex: '#3D2B1F', name: 'Pit Brown' },
    ],
    'Sushi': [
      { hex: '#1A1A1A', name: 'Nori Black' },
      { hex: '#FFFFFF', name: 'Rice White' },
      { hex: '#E8573A', name: 'Salmon Orange' },
      { hex: '#4CAF50', name: 'Wasabi Green' },
      { hex: '#F5DEB3', name: 'Ginger Beige' },
    ],
    'Pizza': [
      { hex: '#D4A017', name: 'Crust Gold' },
      { hex: '#CC3333', name: 'Tomato Red' },
      { hex: '#FFF8DC', name: 'Mozzarella Cream' },
      { hex: '#228B22', name: 'Basil Green' },
      { hex: '#8B4513', name: 'Pepperoni Brown' },
    ],
    'Blueberry Pie': [
      { hex: '#1E3A5F', name: 'Deep Berry' },
      { hex: '#4169E1', name: 'Blueberry Blue' },
      { hex: '#7B68EE', name: 'Berry Purple' },
      { hex: '#D2B48C', name: 'Pie Crust' },
      { hex: '#FFF8E7', name: 'Cream Filling' },
    ],
    'Mango': [
      { hex: '#FF8C00', name: 'Ripe Orange' },
      { hex: '#FFD700', name: 'Golden Flesh' },
      { hex: '#FFEB3B', name: 'Light Yellow' },
      { hex: '#8BC34A', name: 'Unripe Green' },
      { hex: '#E65100', name: 'Deep Orange' },
    ],
    'Matcha Latte': [
      { hex: '#4A6741', name: 'Deep Matcha' },
      { hex: '#7BA05B', name: 'Matcha Green' },
      { hex: '#A8D08D', name: 'Light Matcha' },
      { hex: '#F5F5DC', name: 'Steamed Milk' },
      { hex: '#FFFDD0', name: 'Foam White' },
    ],
    'Strawberry': [
      { hex: '#C41E3A', name: 'Deep Red' },
      { hex: '#FF4757', name: 'Strawberry Red' },
      { hex: '#FF6B81', name: 'Light Pink' },
      { hex: '#2E8B57', name: 'Leaf Green' },
      { hex: '#FFFACD', name: 'Seed Yellow' },
    ],
    'Chocolate': [
      { hex: '#1B0A00', name: 'Dark Chocolate' },
      { hex: '#3D1C02', name: 'Bittersweet' },
      { hex: '#7B3F00', name: 'Milk Chocolate' },
      { hex: '#D2691E', name: 'Caramel' },
      { hex: '#F5DEB3', name: 'White Chocolate' },
    ],
    'Watermelon': [
      { hex: '#2E8B57', name: 'Rind Green' },
      { hex: '#90EE90', name: 'Light Rind' },
      { hex: '#FF6B6B', name: 'Flesh Pink' },
      { hex: '#DC143C', name: 'Deep Red' },
      { hex: '#1A1A1A', name: 'Seed Black' },
    ],
    'Lemon Tart': [
      { hex: '#FFF44F', name: 'Bright Lemon' },
      { hex: '#FFDB58', name: 'Lemon Curd' },
      { hex: '#F0E68C', name: 'Pale Yellow' },
      { hex: '#DEB887', name: 'Pastry Crust' },
      { hex: '#FFFAF0', name: 'Meringue White' },
    ],
  };

  const foods = Object.keys(foodPalettes);

  function handleGenerate() {
    if (!selectedFood) return;
    setOutput({ name: selectedFood, colors: foodPalettes[selectedFood] });
  }

  const outputText = output ? output.colors.map(c => `${c.hex} - ${c.name}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-food`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Food
        </label>
        <select
          id={`${toolId}-food`}
          value={selectedFood}
          onChange={(e) => setSelectedFood(e.target.value)}
          aria-label={`Food selection for ${toolName}`}
          className="input-field"
        >
          <option value="">Choose a food...</option>
          {foods.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button onClick={handleGenerate} className="btn-primary mt-2" disabled={!selectedFood}>Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="flex flex-wrap gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-mono mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
