'use client';

import { useState, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromImageUrl - Generate a color palette by analyzing pixel colors from a canvas.
 * Loads an image from a file input and extracts dominant colors.
 */
export default function ColorPaletteFromImageUrl({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
  };

  const extractColors = (imageData: ImageData, count: number): string[] => {
    const pixels: [number, number, number][] = [];
    const data = imageData.data;

    // Sample pixels at intervals
    const step = Math.max(1, Math.floor(data.length / 4 / 1000));
    for (let i = 0; i < data.length; i += 4 * step) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    // Simple k-means-like quantization by bucketing
    const bucketSize = 32;
    const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

    for (const [r, g, b] of pixels) {
      const key = `${Math.floor(r / bucketSize)}-${Math.floor(g / bucketSize)}-${Math.floor(b / bucketSize)}`;
      if (!buckets[key]) {
        buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
      }
      buckets[key].r += r;
      buckets[key].g += g;
      buckets[key].b += b;
      buckets[key].count += 1;
    }

    const sorted = Object.values(buckets)
      .sort((a, b) => b.count - a.count)
      .slice(0, count);

    return sorted.map((bucket) =>
      rgbToHex(
        Math.round(bucket.r / bucket.count),
        Math.round(bucket.g / bucket.count),
        Math.round(bucket.b / bucket.count)
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setColors([]);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const palette = extractColors(imageData, 8);
        setColors(palette);
      };
      img.onerror = () => setError('Failed to load image');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyText = colors.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">
          Upload an image to extract colors
        </label>
        <input
          id={`${toolId}-file`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label={`Image upload for ${toolName}`}
          className="input-field"
        />
        {fileName && <p className="text-xs text-gray-500 mt-1">File: {fileName}</p>}
      </InputArea>

      <canvas ref={canvasRef} className="hidden" />

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Extracted Color Palette</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
