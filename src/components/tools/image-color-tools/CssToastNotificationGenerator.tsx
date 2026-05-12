'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssToastNotificationGenerator - Generate CSS toast notification styles.
 */
export default function CssToastNotificationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [position, setPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('top-right');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [borderRadius, setBorderRadius] = useState('8');
  const [animation, setAnimation] = useState<'slide' | 'fade' | 'bounce'>('slide');
  const [duration, setDuration] = useState('300');
  const [output, setOutput] = useState('');

  const typeColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', icon: '✓' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '✕' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '⚠' },
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: 'ℹ' },
  };

  const positionStyles: Record<string, string> = {
    'top-right': 'top: 1rem; right: 1rem;',
    'top-left': 'top: 1rem; left: 1rem;',
    'bottom-right': 'bottom: 1rem; right: 1rem;',
    'bottom-left': 'bottom: 1rem; left: 1rem;',
    'top-center': 'top: 1rem; left: 50%; transform: translateX(-50%);',
    'bottom-center': 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
  };

  const generate = () => {
    const colors = typeColors[toastType];
    const animName = animation === 'slide' ? 'slideIn' : animation === 'fade' ? 'fadeIn' : 'bounceIn';

    let keyframes = '';
    if (animation === 'slide') {
      keyframes = `@keyframes slideIn {\n  from { transform: translateX(100%); opacity: 0; }\n  to { transform: translateX(0); opacity: 1; }\n}`;
    } else if (animation === 'fade') {
      keyframes = `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}`;
    } else {
      keyframes = `@keyframes bounceIn {\n  0% { transform: scale(0.3); opacity: 0; }\n  50% { transform: scale(1.05); }\n  70% { transform: scale(0.9); }\n  100% { transform: scale(1); opacity: 1; }\n}`;
    }

    const css = `.toast-container {
  position: fixed;
  ${positionStyles[position]}
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: ${borderRadius}px;
  background-color: ${colors.bg};
  border-left: 4px solid ${colors.border};
  color: ${colors.text};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  animation: ${animName} ${duration}ms ease-out;
  min-width: 300px;
  max-width: 420px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.875rem;
  line-height: 1.4;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  color: ${colors.text};
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 150ms;
}

.toast-close:hover {
  opacity: 1;
}

${keyframes}`;

    const html = `<!-- HTML Example -->
<div class="toast-container">
  <div class="toast">
    <span class="toast-icon">${colors.icon}</span>
    <span class="toast-message">This is a ${toastType} notification message.</span>
    <button class="toast-close">&times;</button>
  </div>
</div>`;

    setOutput(`${css}\n\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-position`} className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select id={`${toolId}-position`} value={position} onChange={(e) => setPosition(e.target.value as typeof position)} aria-label={`Position for ${toolName}`} className="input-field">
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-center">Bottom Center</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Toast Type</label>
              <select id={`${toolId}-type`} value={toastType} onChange={(e) => setToastType(e.target.value as typeof toastType)} aria-label="Toast notification type" className="input-field">
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
              <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} placeholder="8" aria-label="Border radius" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-animation`} className="block text-sm font-medium text-gray-700 mb-1">Animation</label>
              <select id={`${toolId}-animation`} value={animation} onChange={(e) => setAnimation(e.target.value as typeof animation)} aria-label="Animation type" className="input-field">
                <option value="slide">Slide</option>
                <option value="fade">Fade</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Animation Duration (ms)</label>
            <input id={`${toolId}-duration`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="300" aria-label="Animation duration" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Toast CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
