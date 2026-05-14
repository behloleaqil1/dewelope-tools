'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageWatermarkTool - Upload image, add text watermark.
 */
export default function ImageWatermarkTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState('WATERMARK');
  const [fontSize, setFontSize] = useState('48');
  const [opacity, setOpacity] = useState('50');
  const [position, setPosition] = useState('center');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const applyWatermark = () => {
    if (!imageSrc || !canvasRef.current || !text.trim()) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const size = parseInt(fontSize) || 48;
      ctx.font = `${size}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${parseInt(opacity) / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${parseInt(opacity) / 200})`;
      ctx.lineWidth = 2;

      const metrics = ctx.measureText(text);
      let x = 0, y = 0;
      switch (position) {
        case 'center': x = (img.width - metrics.width) / 2; y = img.height / 2; break;
        case 'top-left': x = 20; y = size + 20; break;
        case 'top-right': x = img.width - metrics.width - 20; y = size + 20; break;
        case 'bottom-left': x = 20; y = img.height - 20; break;
        case 'bottom-right': x = img.width - metrics.width - 20; y = img.height - 20; break;
      }
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
      setResult(canvas.toDataURL('image/png'));
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
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
        <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} aria-label={`Watermark text for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${toolId}-size`} className="block text-xs text-gray-600">Font Size</label>
          <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label={`Font size for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-opacity`} className="block text-xs text-gray-600">Opacity (%)</label>
          <input id={`${toolId}-opacity`} type="number" value={opacity} onChange={(e) => setOpacity(e.target.value)} min="10" max="100" aria-label={`Opacity for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-pos`} className="block text-xs text-gray-600">Position</label>
          <select id={`${toolId}-pos`} value={position} onChange={(e) => setPosition(e.target.value)} aria-label={`Position for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
            <option value="center">Center</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
      </div>
      <button onClick={applyWatermark} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Add watermark">Add Watermark</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Watermarked" className="max-w-full rounded-lg border" />
            <a href={result} download="watermarked.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
