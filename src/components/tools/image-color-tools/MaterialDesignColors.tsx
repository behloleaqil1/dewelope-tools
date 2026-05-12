'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MaterialDesignColors - Browse Material Design color palette.
 * Displays the full Material Design color system with shades.
 */
export default function MaterialDesignColors({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedColor, setSelectedColor] = useState('red');
  const [copiedColor, setCopiedColor] = useState('');

  const materialColors: Record<string, Record<string, string>> = {
    red: { '50': '#FFEBEE', '100': '#FFCDD2', '200': '#EF9A9A', '300': '#E57373', '400': '#EF5350', '500': '#F44336', '600': '#E53935', '700': '#D32F2F', '800': '#C62828', '900': '#B71C1C' },
    pink: { '50': '#FCE4EC', '100': '#F8BBD0', '200': '#F48FB1', '300': '#F06292', '400': '#EC407A', '500': '#E91E63', '600': '#D81B60', '700': '#C2185B', '800': '#AD1457', '900': '#880E4F' },
    purple: { '50': '#F3E5F5', '100': '#E1BEE7', '200': '#CE93D8', '300': '#BA68C8', '400': '#AB47BC', '500': '#9C27B0', '600': '#8E24AA', '700': '#7B1FA2', '800': '#6A1B9A', '900': '#4A148C' },
    'deep-purple': { '50': '#EDE7F6', '100': '#D1C4E9', '200': '#B39DDB', '300': '#9575CD', '400': '#7E57C2', '500': '#673AB7', '600': '#5E35B1', '700': '#512DA8', '800': '#4527A0', '900': '#311B92' },
    indigo: { '50': '#E8EAF6', '100': '#C5CAE9', '200': '#9FA8DA', '300': '#7986CB', '400': '#5C6BC0', '500': '#3F51B5', '600': '#3949AB', '700': '#303F9F', '800': '#283593', '900': '#1A237E' },
    blue: { '50': '#E3F2FD', '100': '#BBDEFB', '200': '#90CAF9', '300': '#64B5F6', '400': '#42A5F5', '500': '#2196F3', '600': '#1E88E5', '700': '#1976D2', '800': '#1565C0', '900': '#0D47A1' },
    teal: { '50': '#E0F2F1', '100': '#B2DFDB', '200': '#80CBC4', '300': '#4DB6AC', '400': '#26A69A', '500': '#009688', '600': '#00897B', '700': '#00796B', '800': '#00695C', '900': '#004D40' },
    green: { '50': '#E8F5E9', '100': '#C8E6C9', '200': '#A5D6A7', '300': '#81C784', '400': '#66BB6A', '500': '#4CAF50', '600': '#43A047', '700': '#388E3C', '800': '#2E7D32', '900': '#1B5E20' },
    orange: { '50': '#FFF3E0', '100': '#FFE0B2', '200': '#FFCC80', '300': '#FFB74D', '400': '#FFA726', '500': '#FF9800', '600': '#FB8C00', '700': '#F57C00', '800': '#EF6C00', '900': '#E65100' },
    brown: { '50': '#EFEBE9', '100': '#D7CCC8', '200': '#BCAAA4', '300': '#A1887F', '400': '#8D6E63', '500': '#795548', '600': '#6D4C41', '700': '#5D4037', '800': '#4E342E', '900': '#3E2723' },
    grey: { '50': '#FAFAFA', '100': '#F5F5F5', '200': '#EEEEEE', '300': '#E0E0E0', '400': '#BDBDBD', '500': '#9E9E9E', '600': '#757575', '700': '#616161', '800': '#424242', '900': '#212121' },
  };

  const colorNames = Object.keys(materialColors);
  const shades = materialColors[selectedColor] || {};

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(''), 1500);
  };

  const allShades = Object.entries(shades).map(([shade, hex]) => `${shade}: ${hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-2">
          Select Color Family
        </label>
        <div className="flex flex-wrap gap-2">
          {colorNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedColor(name)}
              className={`px-3 py-1 rounded-full text-sm border capitalize ${
                selectedColor === name
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
              aria-label={`Select ${name} color family for ${toolName}`}
            >
              {name}
            </button>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={Object.keys(shades).length > 0}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {selectedColor} - Material Design Shades
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(shades).map(([shade, hex]) => (
              <button
                key={shade}
                onClick={() => handleCopy(hex)}
                className="text-center group cursor-pointer"
                aria-label={`Copy ${hex}`}
              >
                <div
                  className="w-full h-14 rounded-lg border border-gray-200 shadow-sm group-hover:ring-2 group-hover:ring-blue-400 transition-all"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-xs font-mono text-gray-600 mt-1 block">
                  {copiedColor === hex ? '✓ Copied' : `${shade}: ${hex}`}
                </span>
              </button>
            ))}
          </div>
          <CopyToClipboard text={allShades} />
        </div>
      </OutputArea>
    </div>
  );
}
