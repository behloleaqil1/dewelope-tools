'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssStatsCardGenerator - Generate CSS statistics card styles.
 * Creates ready-to-use CSS for stats/metrics display cards.
 */
export default function CssStatsCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [columns, setColumns] = useState('3');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cols = parseInt(columns) || 3;

    const styles: Record<string, string> = {
      modern: `/* Modern Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}

.stat-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-card__label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__change {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-card__change--up { color: #10b981; }
.stat-card__change--down { color: #ef4444; }`,

      glassmorphism: `/* Glassmorphism Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: background 0.3s;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.25);
}

.stat-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  line-height: 1;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.stat-card__label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__change {
  font-size: 0.75rem;
  margin-top: 0.5rem;
}`,

      gradient: `/* Gradient Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, ${primaryColor}22, ${primaryColor}08);
  border: 1px solid ${primaryColor}33;
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: ${primaryColor};
  border-radius: 4px 0 0 4px;
}

.stat-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-card__label {
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0.15;
  font-size: 3rem;
  color: ${primaryColor};
}`,

      minimal: `/* Minimal Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.stat-card {
  padding: 1.25rem;
  border-bottom: 2px solid ${primaryColor};
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-card__label {
  font-size: 0.8rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}`,

      dark: `/* Dark Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  background: #0f172a;
}

.stat-card {
  background: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #334155;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: ${primaryColor};
}

.stat-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${primaryColor};
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-card__label {
  font-size: 0.875rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__change--up { color: #34d399; }
.stat-card__change--down { color: #f87171; }`,
    };

    setOutput(styles[style] || styles.modern);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Card Style</label>
              <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label={`Card style for ${toolName}`}>
                <option value="modern">Modern</option>
                <option value="glassmorphism">Glassmorphism</option>
                <option value="gradient">Gradient</option>
                <option value="minimal">Minimal</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <input id={`${toolId}-color`} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field h-10" aria-label="Primary color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
              <select id={`${toolId}-cols`} value={columns} onChange={(e) => setColumns(e.target.value)} className="input-field" aria-label="Number of columns">
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate stats card CSS">
            Generate Stats Card CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
