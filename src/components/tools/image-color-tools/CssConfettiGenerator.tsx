'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssConfettiGenerator - Generate CSS confetti animation effect code.
 */
export default function CssConfettiGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [particleCount, setParticleCount] = useState('30');
  const [duration, setDuration] = useState('3');
  const [colors, setColors] = useState('#ff0000,#00ff00,#0000ff,#ffff00,#ff00ff');
  const [spread, setSpread] = useState('400');
  const [output, setOutput] = useState('');

  const generate = () => {
    const count = Math.min(50, Math.max(5, parseInt(particleCount) || 30));
    const dur = parseFloat(duration) || 3;
    const colorList = colors.split(',').map(c => c.trim()).filter(Boolean);
    const spreadPx = parseInt(spread) || 400;

    let css = `.confetti-container {\n  position: relative;\n  width: 100%;\n  height: ${spreadPx}px;\n  overflow: hidden;\n}\n\n.confetti {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  top: -10px;\n  opacity: 0;\n}\n\n`;

    for (let i = 0; i < count; i++) {
      const color = colorList[i % colorList.length];
      const left = Math.random() * 100;
      const delay = (Math.random() * dur).toFixed(2);
      const rotEnd = Math.floor(Math.random() * 720);
      css += `.confetti:nth-child(${i + 1}) {\n  left: ${left.toFixed(1)}%;\n  background-color: ${color};\n  animation: confetti-fall-${i} ${dur}s ease-in ${delay}s infinite;\n}\n\n`;
      css += `@keyframes confetti-fall-${i} {\n  0% { transform: translateY(0) rotate(0deg); opacity: 1; }\n  100% { transform: translateY(${spreadPx}px) rotate(${rotEnd}deg); opacity: 0; }\n}\n\n`;
    }

    let html = '<div class="confetti-container">\n';
    for (let i = 0; i < count; i++) {
      html += `  <div class="confetti"></div>\n`;
    }
    html += '</div>';

    setOutput(`/* CSS Confetti Animation */\n${css}\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Particle Count (5-50)</label>
            <input id={`${toolId}-count`} type="number" min="5" max="50" value={particleCount} onChange={(e) => setParticleCount(e.target.value)} className="input-field" aria-label={`Particle count for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input id={`${toolId}-duration`} type="number" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
          </div>
          <div>
            <label htmlFor={`${toolId}-colors`} className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated hex)</label>
            <input id={`${toolId}-colors`} type="text" value={colors} onChange={(e) => setColors(e.target.value)} className="input-field" aria-label="Confetti colors" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spread`} className="block text-sm font-medium text-gray-700 mb-1">Spread Height (px)</label>
            <input id={`${toolId}-spread`} type="number" value={spread} onChange={(e) => setSpread(e.target.value)} className="input-field" aria-label="Spread height in pixels" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Confetti</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Confetti Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
