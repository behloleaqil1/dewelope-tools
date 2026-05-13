'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssParticleEffectGenerator - Generate CSS particle animation effects.
 * Creates pure CSS particle animations with configurable count, size, color, and movement.
 */
export default function CssParticleEffectGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [particleCount, setParticleCount] = useState('20');
  const [particleSize, setParticleSize] = useState('8');
  const [color, setColor] = useState('#6366f1');
  const [duration, setDuration] = useState('3');
  const [spread, setSpread] = useState('200');
  const [shape, setShape] = useState('circle');
  const [output, setOutput] = useState('');

  const generate = () => {
    const count = parseInt(particleCount);
    const size = parseInt(particleSize);
    const dur = parseFloat(duration);
    const sp = parseInt(spread);

    if (isNaN(count) || isNaN(size) || isNaN(dur) || isNaN(sp)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const borderRadius = shape === 'circle' ? '50%' : shape === 'square' ? '0' : '50% 0 50% 0';

    let css = `.particle-container {
  position: relative;
  width: ${sp * 2}px;
  height: ${sp * 2}px;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  border-radius: ${borderRadius};
  opacity: 0;
  animation: particleFloat ${dur}s ease-in-out infinite;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) scale(0.2);
  }
}

`;

    for (let i = 1; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const tx = Math.round(Math.cos(angle) * sp);
      const ty = Math.round(Math.sin(angle) * sp);
      const delay = ((i / count) * dur).toFixed(2);
      const left = 50 + (Math.random() - 0.5) * 20;
      const top = 50 + (Math.random() - 0.5) * 20;
      css += `.particle:nth-child(${i}) {
  left: ${left.toFixed(0)}%;
  top: ${top.toFixed(0)}%;
  --tx: ${tx}px;
  --ty: ${ty}px;
  animation-delay: ${delay}s;
}

`;
    }

    const html = `<div class="particle-container">
${Array.from({ length: count }, () => `  <div class="particle"></div>`).join('\n')}
</div>`;

    setOutput(`/* CSS */\n${css}\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Particle Count</label>
            <input id={`${toolId}-count`} type="number" min="1" max="50" value={particleCount} onChange={(e) => setParticleCount(e.target.value)} aria-label="Number of particles" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input id={`${toolId}-size`} type="number" min="2" max="50" value={particleSize} onChange={(e) => setParticleSize(e.target.value)} aria-label="Particle size" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Particle color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
            <input id={`${toolId}-duration`} type="number" step="0.5" min="0.5" max="10" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spread`} className="block text-sm font-medium text-gray-700 mb-1">Spread (px)</label>
            <input id={`${toolId}-spread`} type="number" min="50" max="500" value={spread} onChange={(e) => setSpread(e.target.value)} aria-label="Particle spread distance" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
            <select id={`${toolId}-shape`} value={shape} onChange={(e) => setShape(e.target.value)} aria-label="Particle shape" className="input-field">
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3" aria-label="Generate CSS particle effect">
          Generate Particle Effect
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Particle Animation Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
