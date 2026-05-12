'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssModalGenerator - Generate CSS modal/dialog styles.
 * Configurable overlay, modal size, border radius, animation, and colors.
 */
export default function CssModalGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [maxWidth, setMaxWidth] = useState('500');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState('0.5');
  const [borderRadius, setBorderRadius] = useState('12');
  const [padding, setPadding] = useState('24');
  const [animation, setAnimation] = useState<'fade' | 'scale' | 'slide'>('scale');
  const [showCloseBtn, setShowCloseBtn] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const overlayRgba = hexToRgba(overlayColor, parseFloat(overlayOpacity));

    let animationCSS = '';
    let modalTransform = '';
    if (animation === 'fade') {
      animationCSS = `  animation: modalFadeIn 0.3s ease-out;\n`;
      modalTransform = `\n@keyframes modalFadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}`;
    } else if (animation === 'scale') {
      animationCSS = `  animation: modalScaleIn 0.3s ease-out;\n`;
      modalTransform = `\n@keyframes modalScaleIn {\n  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }\n  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }\n}`;
    } else if (animation === 'slide') {
      animationCSS = `  animation: modalSlideIn 0.3s ease-out;\n`;
      modalTransform = `\n@keyframes modalSlideIn {\n  from { opacity: 0; transform: translate(-50%, -40%); }\n  to { opacity: 1; transform: translate(-50%, -50%); }\n}`;
    }

    const css = `.modal-overlay {
  position: fixed;
  inset: 0;
  background: ${overlayRgba};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${bgColor};
  max-width: ${maxWidth}px;
  width: 90%;
  border-radius: ${borderRadius}px;
  padding: ${padding}px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1001;
${animationCSS}}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

${showCloseBtn ? `.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
}

.modal-close:hover {
  background: #f3f4f6;
}

` : ''}.modal-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}
${modalTransform}`;

    const html = `<!-- Modal Overlay -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>${showCloseBtn ? '\n      <button class="modal-close" aria-label="Close modal">&times;</button>' : ''}
    </div>
    <div class="modal-body">
      <p>Your modal content goes here.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>`;

    setOutput(`/* === CSS Modal Styles === */\n\n${css}\n\n/* === HTML Template === */\n\n${html}`);
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Max Width (px)</label>
            <input id={`${toolId}-width`} type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className="input-field" aria-label={`Max width for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
            <input id={`${toolId}-padding`} type="number" value={padding} onChange={(e) => setPadding(e.target.value)} className="input-field" aria-label="Modal padding" />
          </div>
          <div>
            <label htmlFor={`${toolId}-animation`} className="block text-sm font-medium text-gray-700 mb-1">Animation</label>
            <select id={`${toolId}-animation`} value={animation} onChange={(e) => setAnimation(e.target.value as 'fade' | 'scale' | 'slide')} className="input-field" aria-label="Animation type">
              <option value="fade">Fade In</option>
              <option value="scale">Scale In</option>
              <option value="slide">Slide In</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2 items-center">
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Background color" />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-overlay`} className="block text-sm font-medium text-gray-700 mb-1">Overlay Color</label>
            <div className="flex gap-2 items-center">
              <input id={`${toolId}-overlay`} type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Overlay color" />
              <input type="text" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity</label>
            <input id={`${toolId}-opacity`} type="number" step="0.1" min="0" max="1" value={overlayOpacity} onChange={(e) => setOverlayOpacity(e.target.value)} className="input-field" aria-label="Overlay opacity" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={showCloseBtn} onChange={(e) => setShowCloseBtn(e.target.checked)} className="rounded" />
              Include Close Button
            </label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Modal CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
