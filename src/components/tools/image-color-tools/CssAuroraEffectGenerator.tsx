'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssAuroraEffectGenerator - Generate CSS aurora/northern lights animation
 * with configurable colors, speed, and intensity.
 */
export default function CssAuroraEffectGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#00ff87');
  const [color2, setColor2] = useState('#60efff');
  const [color3, setColor3] = useState('#7b2ff7');
  const [duration, setDuration] = useState('8');
  const [blur, setBlur] = useState('60');
  const [output, setOutput] = useState('');

  const generate = () => {
    const dur = parseInt(duration, 10) || 8;
    const blurPx = parseInt(blur, 10) || 60;

    const css = `.aurora-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #0a0a0a;
  overflow: hidden;
  border-radius: 12px;
}

.aurora {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(ellipse at 20% 50%, ${color1}40 0%, transparent 50%),
    radial-gradient(ellipse at 60% 30%, ${color2}40 0%, transparent 50%),
    radial-gradient(ellipse at 80% 60%, ${color3}40 0%, transparent 50%);
  filter: blur(${blurPx}px);
  animation: aurora-shift ${dur}s ease-in-out infinite alternate;
}

.aurora::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 40% 70%, ${color2}30 0%, transparent 40%),
    radial-gradient(ellipse at 70% 20%, ${color1}30 0%, transparent 40%);
  filter: blur(${Math.round(blurPx * 0.8)}px);
  animation: aurora-shift ${dur * 1.3}s ease-in-out infinite alternate-reverse;
}

@keyframes aurora-shift {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 0.8;
  }
  33% {
    transform: translate(5%, -3%) rotate(2deg) scale(1.05);
    opacity: 1;
  }
  66% {
    transform: translate(-3%, 5%) rotate(-1deg) scale(0.95);
    opacity: 0.9;
  }
  100% {
    transform: translate(2%, 2%) rotate(1deg) scale(1.02);
    opacity: 0.85;
  }
}`;

    const html = `<div class="aurora-container">
  <div class="aurora"></div>
  <!-- Your content here -->
</div>`;

    setOutput(`/* CSS Aurora / Northern Lights Effect */\n\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-c1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
            <input id={`${toolId}-c1`} type="text" value={color1} onChange={(e) => setColor1(e.target.value)} placeholder="#00ff87" aria-label={`Primary color for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-c2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
            <input id={`${toolId}-c2`} type="text" value={color2} onChange={(e) => setColor2(e.target.value)} placeholder="#60efff" aria-label="Secondary color" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-c3`} className="block text-sm font-medium text-gray-700 mb-1">Color 3</label>
            <input id={`${toolId}-c3`} type="text" value={color3} onChange={(e) => setColor3(e.target.value)} placeholder="#7b2ff7" aria-label="Tertiary color" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input id={`${toolId}-dur`} type="number" min="2" max="30" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">Blur (px)</label>
            <input id={`${toolId}-blur`} type="number" min="10" max="200" value={blur} onChange={(e) => setBlur(e.target.value)} aria-label="Blur amount" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Aurora Effect</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Aurora CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
