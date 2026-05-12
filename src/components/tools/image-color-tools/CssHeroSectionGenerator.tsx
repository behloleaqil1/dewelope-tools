'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssHeroSectionGenerator - Generate CSS hero section styles.
 * Creates responsive hero section CSS with gradient backgrounds, overlays, and text styling.
 */
export default function CssHeroSectionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [height, setHeight] = useState('100vh');
  const [bgType, setBgType] = useState<'gradient' | 'solid' | 'image'>('gradient');
  const [color1, setColor1] = useState('#1a1a2e');
  const [color2, setColor2] = useState('#16213e');
  const [gradientDirection, setGradientDirection] = useState('to bottom right');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState('center');
  const [overlay, setOverlay] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState('0.5');
  const [output, setOutput] = useState('');

  const generate = () => {
    let css = `.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${textAlign === 'center' ? 'center' : textAlign === 'left' ? 'flex-start' : 'flex-end'};
  min-height: ${height};
  padding: 2rem;
  color: ${textColor};
  text-align: ${textAlign};`;

    if (bgType === 'gradient') {
      css += `\n  background: linear-gradient(${gradientDirection}, ${color1}, ${color2});`;
    } else if (bgType === 'solid') {
      css += `\n  background-color: ${color1};`;
    } else {
      css += `\n  background-image: url('your-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;`;
    }

    css += `\n}`;

    if (overlay) {
      css += `\n\n.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, ${overlayOpacity});
  z-index: 1;
}`;
    }

    css += `\n\n.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-cta {
  display: inline-block;
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${color1};
  background-color: ${textColor};
  border-radius: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 1.5rem;
  }
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <select id={`${toolId}-height`} value={height} onChange={(e) => setHeight(e.target.value)} aria-label={`Hero height for ${toolName}`} className="input-field">
                <option value="100vh">Full Viewport (100vh)</option>
                <option value="80vh">80vh</option>
                <option value="60vh">60vh</option>
                <option value="50vh">Half Viewport (50vh)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Type</label>
              <select id={`${toolId}-bg`} value={bgType} onChange={(e) => setBgType(e.target.value as 'gradient' | 'solid' | 'image')} aria-label="Background type" className="input-field">
                <option value="gradient">Gradient</option>
                <option value="solid">Solid Color</option>
                <option value="image">Background Image</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-c1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
              <input id={`${toolId}-c1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="Primary color" className="input-field h-10 p-1" />
            </div>
            {bgType === 'gradient' && (
              <div>
                <label htmlFor={`${toolId}-c2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
                <input id={`${toolId}-c2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="Secondary color" className="input-field h-10 p-1" />
              </div>
            )}
          </div>
          {bgType === 'gradient' && (
            <div>
              <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Gradient Direction</label>
              <select id={`${toolId}-dir`} value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)} aria-label="Gradient direction" className="input-field">
                <option value="to bottom">Top to Bottom</option>
                <option value="to right">Left to Right</option>
                <option value="to bottom right">Diagonal (↘)</option>
                <option value="to bottom left">Diagonal (↙)</option>
                <option value="135deg">135°</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="input-field h-10 p-1" />
            </div>
            <div>
              <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
              <select id={`${toolId}-align`} value={textAlign} onChange={(e) => setTextAlign(e.target.value)} aria-label="Text alignment" className="input-field">
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} className="rounded" />
              Dark Overlay
            </label>
            {overlay && (
              <input
                type="number"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(e.target.value)}
                min="0" max="1" step="0.1"
                aria-label="Overlay opacity"
                className="input-field w-20"
              />
            )}
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Hero CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
