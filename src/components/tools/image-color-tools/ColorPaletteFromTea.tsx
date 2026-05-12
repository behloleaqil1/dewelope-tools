'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTea - Generate color palettes inspired by tea varieties.
 * Each tea type produces a unique 5-color palette based on its visual characteristics.
 */
export default function ColorPaletteFromTea({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedTea, setSelectedTea] = useState('');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const teaPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    'green-tea': { name: 'Green Tea (Sencha)', colors: [{ hex: '#8DB600', name: 'Fresh Leaf' }, { hex: '#C5E384', name: 'Light Brew' }, { hex: '#4A7C59', name: 'Deep Green' }, { hex: '#F5F5DC', name: 'Steam' }, { hex: '#2E5339', name: 'Tea Garden' }] },
    'matcha': { name: 'Matcha', colors: [{ hex: '#3B7A57', name: 'Ceremonial' }, { hex: '#7CFC00', name: 'Vibrant Powder' }, { hex: '#2D5A27', name: 'Stone Ground' }, { hex: '#98FB98', name: 'Froth' }, { hex: '#1B4D3E', name: 'Deep Matcha' }] },
    'black-tea': { name: 'Black Tea (Assam)', colors: [{ hex: '#3D0C02', name: 'Strong Brew' }, { hex: '#8B4513', name: 'Amber Liquor' }, { hex: '#D2691E', name: 'Golden Ring' }, { hex: '#F4A460', name: 'Milk Tea' }, { hex: '#1A0A00', name: 'Leaves' }] },
    'earl-grey': { name: 'Earl Grey', colors: [{ hex: '#4B3D60', name: 'Bergamot' }, { hex: '#8B7D9B', name: 'Lavender Mist' }, { hex: '#C8A951', name: 'Golden Brew' }, { hex: '#2C1810', name: 'Dark Leaf' }, { hex: '#E8D5B7', name: 'Cream' }] },
    'chamomile': { name: 'Chamomile', colors: [{ hex: '#FFD700', name: 'Flower Center' }, { hex: '#FFFACD', name: 'Pale Infusion' }, { hex: '#F0E68C', name: 'Honey Light' }, { hex: '#DAA520', name: 'Golden Petal' }, { hex: '#FAFAD2', name: 'Soft Bloom' }] },
    'oolong': { name: 'Oolong', colors: [{ hex: '#B8860B', name: 'Roasted' }, { hex: '#DAA520', name: 'Golden Oolong' }, { hex: '#8B6914', name: 'Dark Roast' }, { hex: '#F5DEB3', name: 'Light Cup' }, { hex: '#654321', name: 'Aged Leaf' }] },
    'white-tea': { name: 'White Tea (Silver Needle)', colors: [{ hex: '#FFFFF0', name: 'Silver Tip' }, { hex: '#FFF8DC', name: 'Pale Liquor' }, { hex: '#FAEBD7', name: 'Antique White' }, { hex: '#C4A35A', name: 'Subtle Gold' }, { hex: '#F5F5F5', name: 'Downy Bud' }] },
    'rooibos': { name: 'Rooibos', colors: [{ hex: '#C1440E', name: 'Red Bush' }, { hex: '#E25822', name: 'Sunset Orange' }, { hex: '#8B2500', name: 'Deep Red' }, { hex: '#F4A460', name: 'Sandy Brew' }, { hex: '#FF6347', name: 'Warm Glow' }] },
    'jasmine': { name: 'Jasmine Tea', colors: [{ hex: '#F8F8FF', name: 'White Petal' }, { hex: '#98FB98', name: 'Green Base' }, { hex: '#FFFDD0', name: 'Cream Blossom' }, { hex: '#7BA05B', name: 'Leaf Wrap' }, { hex: '#F0FFF0', name: 'Honeydew' }] },
    'puerh': { name: "Pu-erh", colors: [{ hex: '#1C1008', name: 'Aged Dark' }, { hex: '#3D1C02', name: 'Earthy' }, { hex: '#5C3317', name: 'Fermented' }, { hex: '#8B4513', name: 'Saddle Brown' }, { hex: '#2F1B0E', name: 'Cave Aged' }] },
  };

  const generate = () => {
    if (!selectedTea || !teaPalettes[selectedTea]) {
      setOutput(null);
      return;
    }
    setOutput(teaPalettes[selectedTea]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-tea`} className="block text-sm font-medium text-gray-700 mb-1">Select Tea Variety</label>
        <select id={`${toolId}-tea`} value={selectedTea} onChange={(e) => setSelectedTea(e.target.value)} aria-label={`Tea selection for ${toolName}`} className="input-field w-full md:w-auto">
          <option value="">-- Choose a tea --</option>
          <option value="green-tea">Green Tea (Sencha)</option>
          <option value="matcha">Matcha</option>
          <option value="black-tea">Black Tea (Assam)</option>
          <option value="earl-grey">Earl Grey</option>
          <option value="chamomile">Chamomile</option>
          <option value="oolong">Oolong</option>
          <option value="white-tea">White Tea (Silver Needle)</option>
          <option value="rooibos">Rooibos</option>
          <option value="jasmine">Jasmine Tea</option>
          <option value="puerh">Pu-erh</option>
        </select>
        <button onClick={generate} className="mt-3 ml-0 md:ml-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: color.hex }} />
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
