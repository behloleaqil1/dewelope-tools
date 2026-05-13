'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGlitchTextGenerator - Generate CSS glitch/distortion text effects.
 * Creates ready-to-use HTML and CSS code for glitch animations.
 */
export default function CssGlitchTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('GLITCH');
  const [color, setColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0a0a0a');
  const [glitchColor1, setGlitchColor1] = useState('#ff0000');
  const [glitchColor2, setGlitchColor2] = useState('#00ffff');
  const [fontSize, setFontSize] = useState('72');
  const [intensity, setIntensity] = useState('medium');
  const [duration, setDuration] = useState('3');
  const [output, setOutput] = useState('');

  const intensities: Record<string, { clip: number; skew: number }> = {
    low: { clip: 3, skew: 0.2 },
    medium: { clip: 5, skew: 0.5 },
    high: { clip: 8, skew: 1.0 },
    extreme: { clip: 12, skew: 2.0 },
  };

  const generate = () => {
    const config = intensities[intensity];
    const dur = parseFloat(duration);

    const css = `/* Glitch Text Effect */
.glitch-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: ${bgColor};
}

.glitch {
  position: relative;
  font-size: ${fontSize}px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: ${color};
  letter-spacing: 3px;
  animation: glitch-skew ${dur}s infinite linear alternate-reverse;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: ${glitchColor1};
  animation: glitch-effect ${dur * 0.8}s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% ${45 - config.clip}%, 0 ${45 + config.clip}%);
  transform: translate(-${config.clip / 2}px);
}

.glitch::after {
  color: ${glitchColor2};
  animation: glitch-effect ${dur * 1.2}s infinite linear alternate-reverse;
  clip-path: polygon(0 ${55 - config.clip}%, 100% ${55 + config.clip}%, 100% 100%, 0 100%);
  transform: translate(${config.clip / 2}px);
}

@keyframes glitch-effect {
  0% { transform: translate(0); }
  20% { transform: translate(-${config.clip}px, ${config.clip / 2}px); }
  40% { transform: translate(${config.clip}px, -${config.clip / 2}px); }
  60% { transform: translate(-${config.clip / 2}px, ${config.clip}px); }
  80% { transform: translate(${config.clip}px, -${config.clip}px); }
  100% { transform: translate(0); }
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(${config.skew}deg); }
  40% { transform: skew(-${config.skew}deg); }
  60% { transform: skew(${config.skew / 2}deg); }
  80% { transform: skew(-${config.skew / 2}deg); }
  100% { transform: skew(0deg); }
}`;

    const html = `<div class="glitch-wrapper">
  <div class="glitch" data-text="${text}">${text}</div>
</div>`;

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="GLITCH" aria-label={`Text for ${toolName}`} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Text color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-g1`} className="block text-sm font-medium text-gray-700 mb-1">Glitch Color 1</label>
              <input id={`${toolId}-g1`} type="color" value={glitchColor1} onChange={(e) => setGlitchColor1(e.target.value)} aria-label="Glitch color 1" className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-g2`} className="block text-sm font-medium text-gray-700 mb-1">Glitch Color 2</label>
              <input id={`${toolId}-g2`} type="color" value={glitchColor2} onChange={(e) => setGlitchColor2(e.target.value)} aria-label="Glitch color 2" className="input-field h-10" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label="Font size" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-intensity`} className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
            <select id={`${toolId}-intensity`} value={intensity} onChange={(e) => setIntensity(e.target.value)} aria-label="Glitch intensity" className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Animation Duration (s)</label>
            <input id={`${toolId}-duration`} type="number" min="0.5" max="10" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Glitch Text CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
