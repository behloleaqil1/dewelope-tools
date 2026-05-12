'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCocktail - Generate color palettes inspired by cocktails.
 * Each cocktail maps to a 5-color palette based on its visual characteristics.
 */
export default function ColorPaletteFromCocktail({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedCocktail, setSelectedCocktail] = useState('margarita');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const cocktails: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    margarita: { name: 'Margarita', colors: [{ hex: '#C8E45C', name: 'Lime Zest' }, { hex: '#F5F5DC', name: 'Salt Rim' }, { hex: '#FFD700', name: 'Tequila Gold' }, { hex: '#98FB98', name: 'Citrus Splash' }, { hex: '#2E8B57', name: 'Agave Green' }] },
    'bloody-mary': { name: 'Bloody Mary', colors: [{ hex: '#8B0000', name: 'Tomato Deep' }, { hex: '#FF4500', name: 'Tabasco Red' }, { hex: '#228B22', name: 'Celery Stalk' }, { hex: '#FFD700', name: 'Lemon Wedge' }, { hex: '#2F4F4F', name: 'Worcestershire Dark' }] },
    'pina-colada': { name: 'Piña Colada', colors: [{ hex: '#FFFDD0', name: 'Coconut Cream' }, { hex: '#FFD700', name: 'Pineapple Gold' }, { hex: '#F5F5F5', name: 'Frothy White' }, { hex: '#87CEEB', name: 'Tropical Sky' }, { hex: '#228B22', name: 'Palm Leaf' }] },
    mojito: { name: 'Mojito', colors: [{ hex: '#90EE90', name: 'Fresh Mint' }, { hex: '#F0FFF0', name: 'Soda Fizz' }, { hex: '#32CD32', name: 'Lime Green' }, { hex: '#FFFACD', name: 'Sugar Cane' }, { hex: '#006400', name: 'Muddled Leaf' }] },
    cosmopolitan: { name: 'Cosmopolitan', colors: [{ hex: '#FF69B4', name: 'Cranberry Pink' }, { hex: '#FF1493', name: 'Deep Rose' }, { hex: '#FFA07A', name: 'Citrus Blush' }, { hex: '#FFB6C1', name: 'Soft Petal' }, { hex: '#C71585', name: 'Berry Glam' }] },
    'old-fashioned': { name: 'Old Fashioned', colors: [{ hex: '#8B4513', name: 'Bourbon Brown' }, { hex: '#D2691E', name: 'Bitters Amber' }, { hex: '#FF8C00', name: 'Orange Peel' }, { hex: '#FFD700', name: 'Honey Gold' }, { hex: '#2F1B0E', name: 'Barrel Oak' }] },
    martini: { name: 'Martini', colors: [{ hex: '#F5F5F5', name: 'Crystal Clear' }, { hex: '#C0C0C0', name: 'Silver Shaker' }, { hex: '#556B2F', name: 'Olive Green' }, { hex: '#FFFFF0', name: 'Vermouth Pale' }, { hex: '#708090', name: 'Stainless Steel' }] },
    'blue-lagoon': { name: 'Blue Lagoon', colors: [{ hex: '#00BFFF', name: 'Curaçao Blue' }, { hex: '#87CEEB', name: 'Lagoon Light' }, { hex: '#FFFF00', name: 'Lemonade Yellow' }, { hex: '#00CED1', name: 'Tropical Teal' }, { hex: '#191970', name: 'Deep Ocean' }] },
    negroni: { name: 'Negroni', colors: [{ hex: '#DC143C', name: 'Campari Red' }, { hex: '#FF4500', name: 'Bitter Orange' }, { hex: '#8B4513', name: 'Vermouth Rosso' }, { hex: '#FFD700', name: 'Orange Twist' }, { hex: '#4A0000', name: 'Deep Garnet' }] },
    'espresso-martini': { name: 'Espresso Martini', colors: [{ hex: '#3C1414', name: 'Espresso Shot' }, { hex: '#6F4E37', name: 'Coffee Bean' }, { hex: '#D2B48C', name: 'Crema Foam' }, { hex: '#1C1C1C', name: 'Kahlúa Dark' }, { hex: '#F5DEB3', name: 'Vanilla Hint' }] },
    'tequila-sunrise': { name: 'Tequila Sunrise', colors: [{ hex: '#FF4500', name: 'Grenadine Red' }, { hex: '#FF8C00', name: 'Orange Juice' }, { hex: '#FFD700', name: 'Sunrise Gold' }, { hex: '#FFFF00', name: 'Tequila Light' }, { hex: '#8B0000', name: 'Sunset Deep' }] },
    daiquiri: { name: 'Daiquiri', colors: [{ hex: '#FFFACD', name: 'Rum Light' }, { hex: '#98FB98', name: 'Lime Fresh' }, { hex: '#F0FFF0', name: 'Sugar Syrup' }, { hex: '#32CD32', name: 'Citrus Bright' }, { hex: '#FAFAD2', name: 'Tropical Glow' }] },
  };

  const generate = () => {
    setOutput(cocktails[selectedCocktail]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-cocktail`} className="block text-sm font-medium text-gray-700 mb-1">Select a Cocktail</label>
        <select id={`${toolId}-cocktail`} value={selectedCocktail} onChange={(e) => setSelectedCocktail(e.target.value)} aria-label={`Cocktail selection for ${toolName}`} className="input-field">
          {Object.entries(cocktails).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-20 rounded-lg border shadow-sm" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-mono mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-600">{color.name}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output.colors.map(c => `${c.hex} - ${c.name}`).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
