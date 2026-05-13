'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssRippleEffectGenerator - Generate CSS material design ripple effect
 * with configurable color, duration, and size.
 */
export default function CssRippleEffectGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rippleColor, setRippleColor] = useState('rgba(255, 255, 255, 0.7)');
  const [duration, setDuration] = useState('600');
  const [bgColor, setBgColor] = useState('#6200ea');
  const [borderRadius, setBorderRadius] = useState('4');
  const [output, setOutput] = useState('');

  const generate = () => {
    const dur = parseInt(duration, 10) || 600;
    const radius = parseInt(borderRadius, 10) || 4;

    const css = `.ripple-button {
  position: relative;
  overflow: hidden;
  background-color: ${bgColor};
  color: #ffffff;
  border: none;
  border-radius: ${radius}px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease;
}

.ripple-button:hover {
  background-color: ${adjustBrightness(bgColor, -20)};
}

.ripple-button .ripple {
  position: absolute;
  border-radius: 50%;
  background-color: ${rippleColor};
  transform: scale(0);
  animation: ripple-animation ${dur}ms linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}`;

    const html = `<button class="ripple-button" onclick="createRipple(event)">
  Click Me
</button>

<script>
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = \`\${diameter}px\`;
  circle.style.left = \`\${event.clientX - button.offsetLeft - radius}px\`;
  circle.style.top = \`\${event.clientY - button.offsetTop - radius}px\`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
}
</script>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML + JS */\n${html}`);
  };

  function adjustBrightness(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Ripple Color</label>
            <input id={`${toolId}-color`} type="text" value={rippleColor} onChange={(e) => setRippleColor(e.target.value)} placeholder="rgba(255, 255, 255, 0.7)" aria-label={`Ripple color for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Button Background</label>
            <input id={`${toolId}-bg`} type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#6200ea" aria-label="Button background color" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (ms)</label>
            <input id={`${toolId}-dur`} type="number" min="100" max="3000" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} aria-label="Border radius" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Ripple Effect</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
