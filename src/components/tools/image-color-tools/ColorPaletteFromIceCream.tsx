'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromIceCream - Generate color palettes inspired by ice cream flavors.
 * Each flavor maps to a curated set of colors evoking that flavor's visual identity.
 */
export default function ColorPaletteFromIceCream({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedFlavor, setSelectedFlavor] = useState('vanilla');
  const [output, setOutput] = useState('');

  const flavors: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    vanilla: { name: 'Vanilla', colors: [{ hex: '#FFF8E7', name: 'Cream White' }, { hex: '#F5E6C8', name: 'Vanilla Bean' }, { hex: '#E8D5A3', name: 'Custard' }, { hex: '#C4A265', name: 'Caramel Drizzle' }, { hex: '#8B6914', name: 'Toffee' }] },
    chocolate: { name: 'Chocolate', colors: [{ hex: '#3E2723', name: 'Dark Cocoa' }, { hex: '#5D4037', name: 'Milk Chocolate' }, { hex: '#795548', name: 'Mocha' }, { hex: '#A1887F', name: 'Chocolate Swirl' }, { hex: '#D7CCC8', name: 'Cream Top' }] },
    strawberry: { name: 'Strawberry', colors: [{ hex: '#FCE4EC', name: 'Strawberry Cream' }, { hex: '#F8BBD0', name: 'Pink Sorbet' }, { hex: '#EC407A', name: 'Berry Burst' }, { hex: '#C2185B', name: 'Deep Strawberry' }, { hex: '#880E4F', name: 'Jam' }] },
    mint: { name: 'Mint Chocolate Chip', colors: [{ hex: '#E0F2F1', name: 'Mint Frost' }, { hex: '#80CBC4', name: 'Cool Mint' }, { hex: '#26A69A', name: 'Spearmint' }, { hex: '#004D40', name: 'Dark Mint' }, { hex: '#3E2723', name: 'Chocolate Chip' }] },
    pistachio: { name: 'Pistachio', colors: [{ hex: '#F1F8E9', name: 'Light Pistachio' }, { hex: '#C5E1A5', name: 'Pistachio Shell' }, { hex: '#8BC34A', name: 'Green Nut' }, { hex: '#558B2F', name: 'Deep Pistachio' }, { hex: '#33691E', name: 'Pistachio Dark' }] },
    blueberry: { name: 'Blueberry', colors: [{ hex: '#E8EAF6', name: 'Blueberry Cream' }, { hex: '#9FA8DA', name: 'Lavender Berry' }, { hex: '#5C6BC0', name: 'Blueberry' }, { hex: '#303F9F', name: 'Deep Blue' }, { hex: '#1A237E', name: 'Midnight Berry' }] },
    mango: { name: 'Mango Sorbet', colors: [{ hex: '#FFF8E1', name: 'Mango Cream' }, { hex: '#FFE082', name: 'Ripe Mango' }, { hex: '#FFB300', name: 'Golden Mango' }, { hex: '#FF8F00', name: 'Tropical Orange' }, { hex: '#E65100', name: 'Mango Skin' }] },
    lavender: { name: 'Lavender Honey', colors: [{ hex: '#F3E5F5', name: 'Lavender Mist' }, { hex: '#CE93D8', name: 'Soft Lavender' }, { hex: '#9C27B0', name: 'Lavender' }, { hex: '#6A1B9A', name: 'Deep Purple' }, { hex: '#FFD54F', name: 'Honey Drizzle' }] },
    coconut: { name: 'Coconut', colors: [{ hex: '#FFFFFF', name: 'Coconut White' }, { hex: '#F5F5F5', name: 'Coconut Milk' }, { hex: '#E0E0E0', name: 'Coconut Flesh' }, { hex: '#8D6E63', name: 'Coconut Shell' }, { hex: '#4E342E', name: 'Husk' }] },
    matcha: { name: 'Matcha Green Tea', colors: [{ hex: '#F9FBE7', name: 'Light Matcha' }, { hex: '#DCE775', name: 'Matcha Foam' }, { hex: '#9E9D24', name: 'Matcha Powder' }, { hex: '#6B6B00', name: 'Deep Matcha' }, { hex: '#33691E', name: 'Tea Leaf' }] },
  };

  const generate = () => {
    const flavor = flavors[selectedFlavor];
    if (!flavor) return;

    const lines: string[] = [];
    lines.push(`🍦 ${flavor.name} Palette`);
    lines.push(`${'─'.repeat(30)}`);
    flavor.colors.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.name}: ${c.hex}`);
    });
    lines.push(``);
    lines.push(`CSS Variables:`);
    lines.push(`:root {`);
    flavor.colors.forEach((c, i) => {
      lines.push(`  --ice-cream-${i + 1}: ${c.hex};`);
    });
    lines.push(`}`);

    setOutput(lines.join('\n'));
  };

  const currentFlavor = flavors[selectedFlavor];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label htmlFor={`${toolId}-flavor`} className="block text-sm font-medium text-gray-700 mb-1">Choose Ice Cream Flavor</label>
          <select id={`${toolId}-flavor`} value={selectedFlavor} onChange={(e) => setSelectedFlavor(e.target.value)} className="input-field" aria-label={`Flavor selection for ${toolName}`}>
            {Object.entries(flavors).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2 mb-3">
              {currentFlavor?.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: c.hex }} title={c.name} />
                  <span className="text-xs text-gray-500 mt-1">{c.hex}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
