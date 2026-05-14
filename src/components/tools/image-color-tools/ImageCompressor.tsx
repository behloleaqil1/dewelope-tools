'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageCompressor - Upload image, set quality level, output compressed image.
 */
export default function ImageCompressor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState('70');
  const [originalSize, setOriginalSize] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const q = parseInt(quality) / 100;
      const dataUrl = canvas.toDataURL('image/jpeg', q);
      setResult(dataUrl);
      // Estimate compressed size from base64
      const base64Length = dataUrl.split(',')[1]?.length || 0;
      setCompressedSize(Math.floor(base64Length * 0.75));
    };
    img.src = imageSrc;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input id={`${toolId}-file`} type="file" accept="image/*" onChange={handleFile} aria-label={`Upload image for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        {originalSize > 0 && <p className="text-xs text-gray-500 mt-1">Original: {formatSize(originalSize)}</p>}
      </div>
      <div>
        <label htmlFor={`${toolId}-quality`} className="block text-sm font-medium text-gray-700 mb-1">Quality ({quality}%)</label>
        <input id={`${toolId}-quality`} type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} aria-label={`Compression quality for ${toolName}`} className="w-full" />
      </div>
      <button onClick={compress} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Compress image">Compress</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <p>Compressed: {formatSize(compressedSize)} ({savings > 0 ? `${savings}% smaller` : 'no reduction'})</p>
            </div>
            <img src={result} alt="Compressed" className="max-w-full rounded-lg border" />
            <a href={result} download="compressed.jpg" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
