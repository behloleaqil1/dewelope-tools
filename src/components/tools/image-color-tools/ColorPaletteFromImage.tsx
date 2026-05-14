'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromImage - Upload image, extract dominant color palette.
 */
export default function ColorPaletteFromImage({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [paletteSize, setPaletteSize] = useState('6');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const extractColors = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const size = 100; // Sample at reduced size for performance
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      // Simple color quantization using bucket approach
      const colorMap = new Map<string, number>();
      for (let i = 0; i < data.length; i += 4) {
        // Quantize to reduce color space
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and take top N
      const n = parseInt(paletteSize) || 6;
      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([key]) => {
          const [r, g, b] = key.split(',').map(Number);
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        });

      setColors(sorted);
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input id={`${toolId}-file`} type="file" accept="image/*" onChange={handleFile} aria-label={`Upload image for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Palette Size</label>
        <select id={`${toolId}-size`} value={paletteSize} onChange={(e) => setPaletteSize(e.target.value)} aria-label={`Palette size for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['4', '5', '6', '8', '10'].map(n => <option key={n} value={n}>{n} colors</option>)}
        </select>
      </div>
      <button onClick={extractColors} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Extract palette">Extract Palette</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-1 rounded-lg overflow-hidden">
              {colors.map((color, i) => (
                <div key={i} className="flex-1 h-20" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded border" style={{ backgroundColor: color }} />
                  <code className="font-mono text-xs">{color}</code>
                </div>
              ))}
            </div>
            <CopyToClipboard text={colors.join(', ')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
