'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssFlexboxGenerator - Generate CSS flexbox layout code with visual controls.
 * Provides interactive controls for all flexbox properties with live preview.
 */
export default function CssFlexboxGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState('10');
  const [itemCount, setItemCount] = useState(4);

  const cssCode = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: flexDirection as React.CSSProperties['flexDirection'],
    justifyContent,
    alignItems,
    flexWrap: flexWrap as React.CSSProperties['flexWrap'],
    gap: `${gap}px`,
    minHeight: '200px',
    padding: '16px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">
            flex-direction
          </label>
          <select
            id={`${toolId}-direction`}
            value={flexDirection}
            onChange={(e) => setFlexDirection(e.target.value)}
            aria-label={`Flex direction for ${toolName}`}
            className="input-field"
          >
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-justify`} className="block text-sm font-medium text-gray-700 mb-1">
            justify-content
          </label>
          <select
            id={`${toolId}-justify`}
            value={justifyContent}
            onChange={(e) => setJustifyContent(e.target.value)}
            aria-label={`Justify content for ${toolName}`}
            className="input-field"
          >
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
            <option value="center">center</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">
            align-items
          </label>
          <select
            id={`${toolId}-align`}
            value={alignItems}
            onChange={(e) => setAlignItems(e.target.value)}
            aria-label={`Align items for ${toolName}`}
            className="input-field"
          >
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
            <option value="center">center</option>
            <option value="baseline">baseline</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-wrap`} className="block text-sm font-medium text-gray-700 mb-1">
            flex-wrap
          </label>
          <select
            id={`${toolId}-wrap`}
            value={flexWrap}
            onChange={(e) => setFlexWrap(e.target.value)}
            aria-label={`Flex wrap for ${toolName}`}
            className="input-field"
          >
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">
            gap (px)
          </label>
          <input
            id={`${toolId}-gap`}
            type="number"
            min="0"
            max="100"
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            aria-label={`Gap value for ${toolName}`}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor={`${toolId}-items`} className="block text-sm font-medium text-gray-700 mb-1">
            Items
          </label>
          <input
            id={`${toolId}-items`}
            type="number"
            min="1"
            max="12"
            value={itemCount}
            onChange={(e) => setItemCount(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
            aria-label={`Number of items for ${toolName}`}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
        <div style={containerStyle}>
          {Array.from({ length: itemCount }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-sm font-medium text-white rounded"
              style={{
                backgroundColor: `hsl(${(i * 360) / itemCount}, 60%, 50%)`,
                padding: '12px 20px',
                minWidth: '60px',
                minHeight: '40px',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{cssCode}</pre>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
