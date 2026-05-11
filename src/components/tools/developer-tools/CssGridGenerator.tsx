'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGridGenerator - Generate CSS Grid layout code with visual row/column controls.
 * Allows configuring columns, rows, gap, and alignment with live preview.
 */
export default function CssGridGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [columns, setColumns] = useState('3');
  const [rows, setRows] = useState('2');
  const [columnTemplate, setColumnTemplate] = useState('1fr 1fr 1fr');
  const [rowTemplate, setRowTemplate] = useState('auto auto');
  const [gap, setGap] = useState('16');
  const [justifyItems, setJustifyItems] = useState('stretch');
  const [alignItems, setAlignItems] = useState('stretch');
  const [itemCount, setItemCount] = useState('6');

  const updateColumnTemplate = (cols: string) => {
    setColumns(cols);
    const n = parseInt(cols) || 1;
    setColumnTemplate(Array(n).fill('1fr').join(' '));
  };

  const updateRowTemplate = (r: string) => {
    setRows(r);
    const n = parseInt(r) || 1;
    setRowTemplate(Array(n).fill('auto').join(' '));
  };

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: ${columnTemplate};
  grid-template-rows: ${rowTemplate};
  gap: ${gap}px;
  justify-items: ${justifyItems};
  align-items: ${alignItems};
}`;

  const items = Array.from({ length: parseInt(itemCount) || 1 }, (_, i) => i + 1);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">
              Columns
            </label>
            <input
              id={`${toolId}-cols`}
              type="number"
              min="1"
              max="12"
              value={columns}
              onChange={(e) => updateColumnTemplate(e.target.value)}
              aria-label={`Number of columns for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-rows`} className="block text-sm font-medium text-gray-700 mb-1">
              Rows
            </label>
            <input
              id={`${toolId}-rows`}
              type="number"
              min="1"
              max="12"
              value={rows}
              onChange={(e) => updateRowTemplate(e.target.value)}
              aria-label={`Number of rows for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">
              Gap (px)
            </label>
            <input
              id={`${toolId}-gap`}
              type="number"
              min="0"
              max="100"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              aria-label={`Gap size for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-justify`} className="block text-sm font-medium text-gray-700 mb-1">
              Justify Items
            </label>
            <select
              id={`${toolId}-justify`}
              value={justifyItems}
              onChange={(e) => setJustifyItems(e.target.value)}
              aria-label={`Justify items for ${toolName}`}
              className="input-field"
            >
              <option value="stretch">stretch</option>
              <option value="start">start</option>
              <option value="center">center</option>
              <option value="end">end</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">
              Align Items
            </label>
            <select
              id={`${toolId}-align`}
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value)}
              aria-label={`Align items for ${toolName}`}
              className="input-field"
            >
              <option value="stretch">stretch</option>
              <option value="start">start</option>
              <option value="center">center</option>
              <option value="end">end</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-items`} className="block text-sm font-medium text-gray-700 mb-1">
              Items
            </label>
            <input
              id={`${toolId}-items`}
              type="number"
              min="1"
              max="24"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
              aria-label={`Number of items for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-col-template`} className="block text-sm font-medium text-gray-700 mb-1">
              Column Template
            </label>
            <input
              id={`${toolId}-col-template`}
              type="text"
              value={columnTemplate}
              onChange={(e) => setColumnTemplate(e.target.value)}
              aria-label={`Column template for ${toolName}`}
              className="input-field font-mono"
              placeholder="e.g. 1fr 2fr 1fr"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-row-template`} className="block text-sm font-medium text-gray-700 mb-1">
              Row Template
            </label>
            <input
              id={`${toolId}-row-template`}
              type="text"
              value={rowTemplate}
              onChange={(e) => setRowTemplate(e.target.value)}
              aria-label={`Row template for ${toolName}`}
              className="input-field font-mono"
              placeholder="e.g. auto 200px auto"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-auto"
              style={{
                display: 'grid',
                gridTemplateColumns: columnTemplate,
                gridTemplateRows: rowTemplate,
                gap: `${gap}px`,
                justifyItems: justifyItems as React.CSSProperties['justifyItems'],
                alignItems: alignItems as React.CSSProperties['alignItems'],
              }}
            >
              {items.map((item) => (
                <div
                  key={item}
                  className="bg-blue-100 border border-blue-300 rounded p-3 text-center text-sm font-medium text-blue-700 min-h-[40px] flex items-center justify-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{cssCode}</pre>
          </div>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
