'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTestimonialCardGenerator - Generate CSS testimonial card styles.
 */
export default function CssTestimonialCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [borderRadius, setBorderRadius] = useState('12');
  const [shadow, setShadow] = useState('medium');
  const [showAvatar, setShowAvatar] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const radius = `${borderRadius}px`;
    const shadowMap: Record<string, string> = {
      none: 'none',
      small: '0 2px 4px rgba(0,0,0,0.1)',
      medium: '0 4px 12px rgba(0,0,0,0.1)',
      large: '0 8px 24px rgba(0,0,0,0.15)',
    };

    const css = `.testimonial-card {
  background: ${style === 'dark' ? '#1F2937' : '#FFFFFF'};
  border-radius: ${radius};
  padding: 24px;
  box-shadow: ${shadowMap[shadow]};
  ${style === 'bordered' ? `border: 2px solid ${primaryColor};` : ''}
  ${style === 'gradient' ? `border-top: 4px solid ${primaryColor};` : ''}
  max-width: 400px;
  position: relative;
}

.testimonial-card::before {
  content: '"';
  font-size: 48px;
  color: ${primaryColor};
  opacity: 0.3;
  position: absolute;
  top: 12px;
  left: 16px;
  font-family: Georgia, serif;
}

.testimonial-text {
  color: ${style === 'dark' ? '#E5E7EB' : '#374151'};
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  padding-top: 24px;
}
${showAvatar ? `
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${primaryColor};
}

.testimonial-name {
  font-weight: 600;
  color: ${style === 'dark' ? '#F9FAFB' : '#111827'};
  font-size: 14px;
}

.testimonial-role {
  color: ${style === 'dark' ? '#9CA3AF' : '#6B7280'};
  font-size: 13px;
}` : ''}
${showRating ? `
.testimonial-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.testimonial-star {
  color: #FBBF24;
  font-size: 16px;
}` : ''}`;

    const html = `<div class="testimonial-card">
${showRating ? '  <div class="testimonial-rating">\n    <span class="testimonial-star">★</span>\n    <span class="testimonial-star">★</span>\n    <span class="testimonial-star">★</span>\n    <span class="testimonial-star">★</span>\n    <span class="testimonial-star">★</span>\n  </div>' : ''}
  <p class="testimonial-text">This product changed my workflow completely. Highly recommended!</p>
${showAvatar ? '  <div class="testimonial-author">\n    <img class="testimonial-avatar" src="avatar.jpg" alt="Author" />\n    <div>\n      <div class="testimonial-name">Jane Smith</div>\n      <div class="testimonial-role">Product Designer</div>\n    </div>\n  </div>' : ''}
</div>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
                Card Style
              </label>
              <select
                id={`${toolId}-style`}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="input-field"
                aria-label={`Card style for ${toolName}`}
              >
                <option value="modern">Modern</option>
                <option value="bordered">Bordered</option>
                <option value="gradient">Gradient Top</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                id={`${toolId}-color`}
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="input-field h-10"
                aria-label="Primary color"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius (px)
              </label>
              <input
                id={`${toolId}-radius`}
                type="number"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="input-field"
                aria-label="Border radius"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">
                Shadow
              </label>
              <select
                id={`${toolId}-shadow`}
                value={shadow}
                onChange={(e) => setShadow(e.target.value)}
                className="input-field"
                aria-label="Shadow size"
              >
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showAvatar} onChange={(e) => setShowAvatar(e.target.checked)} />
              Show Avatar
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showRating} onChange={(e) => setShowRating(e.target.checked)} />
              Show Rating
            </label>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate testimonial card CSS">
            Generate Testimonial Card CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
