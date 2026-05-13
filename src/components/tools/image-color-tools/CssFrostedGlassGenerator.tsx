'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssFrostedGlassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [blurAmount, setBlurAmount] = useState('10');
  const [bgOpacity, setBgOpacity] = useState('0.25');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState('0.18');
  const [borderRadius, setBorderRadius] = useState('16');
  const [shadowOpacity, setShadowOpacity] = useState('0.1');
  const [saturation, setSaturation] = useState('180');
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const blur = parseFloat(blurAmount);
    const opacity = parseFloat(bgOpacity);
    const bOpacity = parseFloat(borderOpacity);
    const radius = parseFloat(borderRadius);
    const sOpacity = parseFloat(shadowOpacity);
    const sat = parseFloat(saturation);
    const { r, g, b } = hexToRgb(bgColor);

    const css = `.frosted-glass {
  /* Frosted glass effect */
  background: rgba(${r}, ${g}, ${b}, ${opacity});
  backdrop-filter: blur(${blur}px) saturate(${sat}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
  border-radius: ${radius}px;
  border: 1px solid rgba(${r}, ${g}, ${b}, ${bOpacity});
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, ${sOpacity});
}`;

    const html = `<div class="frosted-glass">
  <h2>Frosted Glass Card</h2>
  <p>Content goes here</p>
</div>

<!-- Tip: Place over a colorful background or image for best effect -->
<style>
  .frosted-glass-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
  }
</style>`;

    setOutput(`/* CSS Frosted Glass Effect */\n${css}\n\n/* HTML Example */\n${html}`);
  };

  const { r, g, b } = hexToRgb(bgColor);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">Blur Amount (px)</label>
            <input id={`${toolId}-blur`} type="number" min="0" max="50" value={blurAmount} onChange={(e) => setBlurAmount(e.target.value)} className="input-field" aria-label={`Blur amount for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Background Opacity</label>
            <input id={`${toolId}-opacity`} type="number" min="0" max="1" step="0.05" value={bgOpacity} onChange={(e) => setBgOpacity(e.target.value)} className="input-field" aria-label="Background opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input id={`${toolId}-color`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label="Background color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">Border Opacity</label>
            <input id={`${toolId}-border`} type="number" min="0" max="1" step="0.05" value={borderOpacity} onChange={(e) => setBorderOpacity(e.target.value)} className="input-field" aria-label="Border opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Opacity</label>
            <input id={`${toolId}-shadow`} type="number" min="0" max="1" step="0.05" value={shadowOpacity} onChange={(e) => setShadowOpacity(e.target.value)} className="input-field" aria-label="Shadow opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sat`} className="block text-sm font-medium text-gray-700 mb-1">Saturation (%)</label>
            <input id={`${toolId}-sat`} type="number" min="100" max="300" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="input-field" aria-label="Saturation" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Frosted Glass CSS</button>

        <div className="mt-4 p-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div
            className="p-6 text-center"
            style={{
              background: `rgba(${r}, ${g}, ${b}, ${parseFloat(bgOpacity)})`,
              backdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
              WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
              borderRadius: `${borderRadius}px`,
              border: `1px solid rgba(${r}, ${g}, ${b}, ${parseFloat(borderOpacity)})`,
              boxShadow: `0 8px 32px 0 rgba(31, 38, 135, ${parseFloat(shadowOpacity)})`,
            }}
          >
            <p className="text-white font-medium">Live Preview</p>
            <p className="text-white/80 text-sm">Frosted glass effect</p>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
