'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssFeatureCardGenerator - Generate CSS feature card grid styles.
 * Creates responsive card grid layouts with customizable styling.
 */
export default function CssFeatureCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [columns, setColumns] = useState('3');
  const [gap, setGap] = useState('24');
  const [borderRadius, setBorderRadius] = useState('12');
  const [cardPadding, setCardPadding] = useState('24');
  const [shadowSize, setShadowSize] = useState('medium');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cols = parseInt(columns) || 3;
    const gapPx = parseInt(gap) || 24;
    const radius = parseInt(borderRadius) || 12;
    const padding = parseInt(cardPadding) || 24;

    const shadows: Record<string, string> = {
      none: 'none',
      small: '0 1px 3px rgba(0, 0, 0, 0.12)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    };

    const shadow = shadows[shadowSize] || shadows.medium;

    const css = `.feature-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: ${gapPx}px;
  padding: ${gapPx}px;
}

.feature-card {
  background: #ffffff;
  border-radius: ${radius}px;
  padding: ${padding}px;
  box-shadow: ${shadow};
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
}

.feature-card__icon {
  width: 48px;
  height: 48px;
  border-radius: ${Math.round(radius * 0.67)}px;
  background: ${accentColor}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${accentColor};
}

.feature-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.feature-card__description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`;

    const html = `<!-- Feature Card Grid -->
<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-card__icon">⚡</div>
    <h3 class="feature-card__title">Feature Title</h3>
    <p class="feature-card__description">Brief description of this feature and its benefits.</p>
  </div>
  <!-- Repeat for more cards -->
</div>`;

    setOutput(`/* === CSS Feature Card Grid === */\n\n${css}\n\n/* === HTML Structure === */\n\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
              <input id={`${toolId}-cols`} type="number" min="1" max="6" value={columns} onChange={(e) => setColumns(e.target.value)} className="input-field" aria-label={`Columns for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
              <input id={`${toolId}-gap`} type="number" min="0" value={gap} onChange={(e) => setGap(e.target.value)} className="input-field" aria-label="Gap size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
              <input id={`${toolId}-radius`} type="number" min="0" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
            </div>
            <div>
              <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
              <input id={`${toolId}-padding`} type="number" min="0" value={cardPadding} onChange={(e) => setCardPadding(e.target.value)} className="input-field" aria-label="Card padding" />
            </div>
            <div>
              <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">Shadow</label>
              <select id={`${toolId}-shadow`} value={shadowSize} onChange={(e) => setShadowSize(e.target.value)} className="input-field" aria-label="Shadow size">
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
              <input id={`${toolId}-color`} type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="input-field h-10" aria-label="Accent color" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate feature card CSS">
            Generate Feature Card CSS
          </button>
        </div>
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
