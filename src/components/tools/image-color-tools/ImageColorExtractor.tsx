'use client';

import { useState, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ImageColorExtractor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColors = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size).data;
        const colorMap: Record<string, number> = {};

        for (let i = 0; i < imageData.length; i += 16) {
          const r = Math.round(imageData[i] / 32) * 32;
          const g = Math.round(imageData[i + 1] / 32) * 32;
          const b = Math.round(imageData[i + 2] / 32) * 32;
          const hex = '#' + [r, g, b].map(c => Math.min(255, c).toString(16).padStart(2, '0')).join('');
          colorMap[hex] = (colorMap[hex] || 0) + 1;
        }

        const sorted = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([color]) => color);

        setColors(sorted);
        setOutput(sorted.join('\n'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <canvas ref={canvasRef} className="hidden" />
      <InputArea>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input id={`${toolId}-file`} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && extractColors(e.target.files[0])} aria-label={`Image upload for ${toolName}`} className="input-field" />
      </InputArea>
      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Dominant Colors:</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2 border rounded px-2 py-1">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono">{color}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
