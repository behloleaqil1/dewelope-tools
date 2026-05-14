'use client';

import { useState, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HalftonePatternGenerator - Halftone dot pattern generator.
 */
export default function HalftonePatternGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dotSize, setDotSize] = useState('8');
  const [spacing, setSpacing] = useState('12');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 256, h = 256;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    const size = parseFloat(dotSize) || 8;
    const space = parseFloat(spacing) || 12;
    ctx.fillStyle = color;

    for (let y = space / 2; y < h; y += space) {
      for (let x = space / 2; x < w; x += space) {
        // Vary dot size based on position for visual interest
        const distFromCenter = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2) / (w / 2);
        const radius = (size / 2) * (1 - distFromCenter * 0.5);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    setGenerated(true);
  }

  const cssSnippet = `background: radial-gradient(circle, ${color} ${parseInt(dotSize) / 2}px, transparent ${parseInt(dotSize) / 2}px);\nbackground-size: ${spacing}px ${spacing}px;\nbackground-color: ${bgColor};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Dot Size</label>
            <input id={`${toolId}-size`} type="number" min="2" max="30" value={dotSize} onChange={(e) => setDotSize(e.target.value)} aria-label={`Dot size for ${toolName}`} className="input-field w-20" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mb-1">Spacing</label>
            <input id={`${toolId}-spacing`} type="number" min="4" max="50" value={spacing} onChange={(e) => setSpacing(e.target.value)} aria-label="Dot spacing" className="input-field w-20" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Dot Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Dot color" className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate halftone pattern" className="btn-primary">Generate Pattern</button>

      <OutputArea hasContent={generated}>
        <div className="space-y-3">
          <canvas ref={canvasRef} className="w-64 h-64 rounded-lg border border-gray-200" />
          {generated && (
            <>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{cssSnippet}</pre>
              <CopyToClipboard text={cssSnippet} />
            </>
          )}
        </div>
      </OutputArea>
    </div>
  );
}
