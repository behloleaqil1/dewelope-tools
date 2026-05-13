'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssNeonTextGenerator - Generate CSS neon glow text effects.
 */
export default function CssNeonTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('NEON');
  const [color, setColor] = useState('#00ff41');
  const [fontSize, setFontSize] = useState('48');
  const [glowIntensity, setGlowIntensity] = useState('medium');
  const [animated, setAnimated] = useState(false);
  const [bgColor, setBgColor] = useState('#0a0a0a');
  const [output, setOutput] = useState('');

  const generate = () => {
    const intensityMap: Record<string, number[]> = {
      subtle: [2, 4, 8],
      medium: [2, 4, 8, 16, 32],
      strong: [2, 4, 8, 16, 32, 64, 100],
    };

    const spreads = intensityMap[glowIntensity] || intensityMap.medium;
    const shadows = spreads.map(s => `0 0 ${s}px ${color}`).join(',\n    ');

    let css = `.neon-text {
  font-size: ${fontSize}px;
  color: ${color};
  text-shadow:
    ${shadows};
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 2px;
}

.neon-container {
  background-color: ${bgColor};
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}`;

    if (animated) {
      css += `

@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      ${shadows};
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

.neon-text--animated {
  animation: neon-flicker 1.5s infinite alternate;
}`;
    }

    const html = `<div class="neon-container">
  <span class="neon-text${animated ? ' neon-text--animated' : ''}">${text}</span>
</div>`;

    setOutput(`/* CSS */\n${css}\n\n<!-- HTML -->\n${html}`);
  };

  const previewShadows = (() => {
    const intensityMap: Record<string, number[]> = {
      subtle: [2, 4, 8],
      medium: [2, 4, 8, 16, 32],
      strong: [2, 4, 8, 16, 32, 64, 100],
    };
    const spreads = intensityMap[glowIntensity] || intensityMap.medium;
    return spreads.map(s => `0 0 ${s}px ${color}`).join(', ');
  })();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)} className="input-field" aria-label="Neon text content" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Glow Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" aria-label="Glow color" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
              <select value={glowIntensity} onChange={e => setGlowIntensity(e.target.value)} className="input-field" aria-label="Glow intensity">
                <option value="subtle">Subtle</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" aria-label="Background color" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm pb-2">
                <input type="checkbox" checked={animated} onChange={e => setAnimated(e.target.checked)} aria-label="Enable flicker animation" />
                Flicker Animation
              </label>
            </div>
          </div>

          <div className="p-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: bgColor }}>
            <span
              style={{
                fontSize: `${Math.min(parseInt(fontSize) || 48, 72)}px`,
                color: color,
                textShadow: previewShadows,
                fontFamily: "'Courier New', monospace",
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
            >
              {text || 'NEON'}
            </span>
          </div>

          <button onClick={generate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Generate ${toolName}`}>
            Generate CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
