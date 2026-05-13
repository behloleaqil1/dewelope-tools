'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSocialIconsGenerator - Generate CSS social media icon button styles.
 * Creates styled button CSS for popular social platforms with hover effects.
 */

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2', hoverColor: '#166FE5' },
  { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2', hoverColor: '#1A91DA' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', hoverColor: '#D63150' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', hoverColor: '#004182' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', hoverColor: '#CC0000' },
  { id: 'github', name: 'GitHub', color: '#333333', hoverColor: '#24292E' },
  { id: 'tiktok', name: 'TikTok', color: '#000000', hoverColor: '#25F4EE' },
  { id: 'pinterest', name: 'Pinterest', color: '#E60023', hoverColor: '#AD081B' },
  { id: 'reddit', name: 'Reddit', color: '#FF4500', hoverColor: '#CC3700' },
  { id: 'discord', name: 'Discord', color: '#5865F2', hoverColor: '#4752C4' },
];

export default function CssSocialIconsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState<string[]>(['facebook', 'twitter', 'instagram', 'linkedin']);
  const [shape, setShape] = useState<'rounded' | 'circle' | 'square'>('rounded');
  const [size, setSize] = useState('40');
  const [output, setOutput] = useState('');

  const togglePlatform = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const generate = () => {
    if (selected.length === 0) {
      setOutput('Please select at least one platform.');
      return;
    }

    const sizeVal = parseInt(size) || 40;
    const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0';

    let css = `/* Social Media Icon Buttons */\n.social-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: ${sizeVal}px;\n  height: ${sizeVal}px;\n  border: none;\n  border-radius: ${borderRadius};\n  cursor: pointer;\n  transition: background-color 0.2s ease, transform 0.1s ease;\n  color: #ffffff;\n  font-size: ${Math.round(sizeVal * 0.45)}px;\n  text-decoration: none;\n}\n\n.social-btn:hover {\n  transform: scale(1.05);\n}\n\n.social-btn:active {\n  transform: scale(0.95);\n}\n\n`;

    const platforms = SOCIAL_PLATFORMS.filter(p => selected.includes(p.id));
    platforms.forEach(p => {
      css += `.social-btn--${p.id} {\n  background-color: ${p.color};\n}\n\n.social-btn--${p.id}:hover {\n  background-color: ${p.hoverColor};\n}\n\n`;
    });

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Platforms</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
          {SOCIAL_PLATFORMS.map(p => (
            <label key={p.id} className="flex items-center text-sm">
              <input type="checkbox" checked={selected.includes(p.id)} onChange={() => togglePlatform(p.id)} className="mr-2" aria-label={`Select ${p.name}`} />
              {p.name}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Button Shape</label>
            <select id={`${toolId}-shape`} value={shape} onChange={(e) => setShape(e.target.value as 'rounded' | 'circle' | 'square')} className="input-field" aria-label={`Button shape for ${toolName}`}>
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Button Size (px)</label>
            <input id={`${toolId}-size`} type="number" min="24" max="96" value={size} onChange={(e) => setSize(e.target.value)} className="input-field" aria-label="Button size" />
          </div>
        </div>

        <button onClick={generate} className="btn-primary mt-3">Generate CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
