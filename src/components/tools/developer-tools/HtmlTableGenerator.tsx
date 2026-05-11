'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmlTableGenerator - Generate HTML table code from rows/columns input.
 */
export default function HtmlTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rows, setRows] = useState('3');
  const [cols, setCols] = useState('3');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [addBorder, setAddBorder] = useState(true);
  const [output, setOutput] = useState('');

  function handleGenerate() {
    const numRows = Math.max(1, Math.min(50, parseInt(rows) || 1));
    const numCols = Math.max(1, Math.min(20, parseInt(cols) || 1));

    let html = '';
    const indent = '  ';
    const borderAttr = addBorder ? ' border="1" cellpadding="8" cellspacing="0"' : '';

    html += `<table${borderAttr}>\n`;

    if (includeHeader) {
      html += `${indent}<thead>\n`;
      html += `${indent}${indent}<tr>\n`;
      for (let c = 1; c <= numCols; c++) {
        html += `${indent}${indent}${indent}<th>Header ${c}</th>\n`;
      }
      html += `${indent}${indent}</tr>\n`;
      html += `${indent}</thead>\n`;
    }

    html += `${indent}<tbody>\n`;
    for (let r = 1; r <= numRows; r++) {
      html += `${indent}${indent}<tr>\n`;
      for (let c = 1; c <= numCols; c++) {
        html += `${indent}${indent}${indent}<td>Row ${r}, Col ${c}</td>\n`;
      }
      html += `${indent}${indent}</tr>\n`;
    }
    html += `${indent}</tbody>\n`;
    html += `</table>`;

    setOutput(html);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-rows`} className="block text-sm font-medium text-gray-700 mb-1">
              Rows (1-50)
            </label>
            <input
              id={`${toolId}-rows`}
              type="number"
              min="1"
              max="50"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              aria-label={`Number of rows for ${toolName}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">
              Columns (1-20)
            </label>
            <input
              id={`${toolId}-cols`}
              type="number"
              min="1"
              max="20"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              aria-label={`Number of columns for ${toolName}`}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHeader}
              onChange={(e) => setIncludeHeader(e.target.checked)}
              aria-label="Include table header"
              className="rounded border-gray-300"
            />
            Include Header
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={addBorder}
              onChange={(e) => setAddBorder(e.target.checked)}
              aria-label="Add border attribute"
              className="rounded border-gray-300"
            />
            Add Border
          </label>
        </div>
      </InputArea>

      <button
        onClick={handleGenerate}
        aria-label="Generate HTML table"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generate Table
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
