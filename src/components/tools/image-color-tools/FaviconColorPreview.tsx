'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FaviconColorPreview({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#4f46e5');
  const [letter, setLetter] = useState('A');

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${color}"/><text x="16" y="24" font-size="20" font-family="Arial,sans-serif" font-weight="bold" fill="white" text-anchor="middle">${letter.charAt(0)}</text></svg>`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Favicon Color</label>
        <div className="flex gap-2 items-center">
          <input type="color" id={`${toolId}-color`} value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 rounded border" aria-label={`Color for ${toolName}`} />
          <input value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1" />
        </div>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-letter`} className="block text-sm font-medium text-gray-700 mb-1">Letter</label>
        <input id={`${toolId}-letter`} value={letter} onChange={(e) => setLetter(e.target.value)} maxLength={1} className="input-field w-20" aria-label={`Letter for ${toolName}`} />
      </InputArea>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 rounded-lg p-3 flex items-center gap-2">
              <div dangerouslySetInnerHTML={{ __html: svgCode.replace('viewBox', 'width="16" height="16" viewBox') }} />
              <span className="text-sm text-gray-600">Tab Preview</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: svgCode.replace('viewBox', 'width="64" height="64" viewBox') }} />
          </div>
          <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">{svgCode}</pre>
          <CopyToClipboard text={svgCode} />
        </div>
      </OutputArea>
    </div>
  );
}
