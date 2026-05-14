'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';

export default function FontWeightVisualizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontFamily, setFontFamily] = useState('system-ui');

  const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const weightNames: Record<number, string> = {
    100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular',
    500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Sample Text</label>
        <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} aria-label={`Sample text for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
        <select id={`${toolId}-font`} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} aria-label={`Font family for ${toolName}`} className="input-field">
          <option value="system-ui">System UI</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
      </InputArea>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          {weights.map(w => (
            <div key={w} className="flex items-baseline gap-4 border-b border-gray-100 pb-2">
              <span className="text-xs text-gray-500 w-24 shrink-0">{w} - {weightNames[w]}</span>
              <p style={{ fontWeight: w, fontFamily }} className="text-lg">{text}</p>
            </div>
          ))}
        </div>
      </OutputArea>
    </div>
  );
}
