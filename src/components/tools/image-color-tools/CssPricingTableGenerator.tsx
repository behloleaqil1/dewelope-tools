'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssPricingTableGenerator - Generate CSS pricing table styles.
 */
export default function CssPricingTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [columns, setColumns] = useState('3');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [borderRadius, setBorderRadius] = useState('12');
  const [highlightColumn, setHighlightColumn] = useState('2');
  const [shadow, setShadow] = useState('medium');
  const [style, setStyle] = useState('modern');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cols = parseInt(columns) || 3;
    const radius = parseInt(borderRadius) || 12;
    const highlight = parseInt(highlightColumn) || 2;

    const shadowMap: Record<string, string> = {
      none: 'none',
      small: '0 2px 8px rgba(0,0,0,0.1)',
      medium: '0 4px 16px rgba(0,0,0,0.12)',
      large: '0 8px 32px rgba(0,0,0,0.15)',
    };

    const css = `.pricing-table {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.pricing-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: ${radius}px;
  padding: 2rem;
  text-align: center;
  box-shadow: ${shadowMap[shadow]};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
${style === 'modern' ? '  position: relative;\n  overflow: hidden;\n' : ''}}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.pricing-card--featured {
  border: 2px solid ${primaryColor};
  transform: scale(1.05);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
${style === 'modern' ? `
.pricing-card--featured::before {
  content: 'Popular';
  position: absolute;
  top: 12px;
  right: -30px;
  background: ${primaryColor};
  color: white;
  padding: 4px 40px;
  font-size: 0.75rem;
  font-weight: 600;
  transform: rotate(45deg);
}
` : ''}
.pricing-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.pricing-card__price {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  margin: 1rem 0;
}

.pricing-card__price span {
  font-size: 1rem;
  font-weight: 400;
  color: #6b7280;
}

.pricing-card__features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.pricing-card__features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 0.9rem;
}

.pricing-card__features li::before {
  content: '✓';
  color: ${primaryColor};
  font-weight: bold;
  margin-right: 0.5rem;
}

.pricing-card__button {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: ${primaryColor};
  color: white;
  border: none;
  border-radius: ${Math.round(radius / 2)}px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.pricing-card__button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .pricing-table {
    grid-template-columns: 1fr;
  }
  .pricing-card--featured {
    transform: scale(1);
  }
}`;

    const html = `<div class="pricing-table">
${Array.from({ length: cols }, (_, i) => `  <div class="pricing-card${i + 1 === highlight ? ' pricing-card--featured' : ''}">
    <h3 class="pricing-card__title">Plan ${i + 1}</h3>
    <div class="pricing-card__price">$${(i + 1) * 9}<span>/mo</span></div>
    <ul class="pricing-card__features">
      <li>Feature one</li>
      <li>Feature two</li>
      <li>Feature three</li>
    </ul>
    <button class="pricing-card__button">Get Started</button>
  </div>`).join('\n')}
</div>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
            <input id={`${toolId}-cols`} type="number" min="2" max="5" value={columns} onChange={(e) => setColumns(e.target.value)} className="input-field" aria-label={`Number of columns for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <input id={`${toolId}-color`} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field h-10" aria-label="Primary color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-highlight`} className="block text-sm font-medium text-gray-700 mb-1">Featured Column</label>
            <input id={`${toolId}-highlight`} type="number" min="1" max="5" value={highlightColumn} onChange={(e) => setHighlightColumn(e.target.value)} className="input-field" aria-label="Featured column number" />
          </div>
          <div>
            <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">Shadow</label>
            <select id={`${toolId}-shadow`} value={shadow} onChange={(e) => setShadow(e.target.value)} className="input-field" aria-label="Shadow size">
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label="Table style">
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Pricing Table CSS</button>
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
