'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SasDatasetGenerator - Generate SAS dataset definition (DATA step) from JSON input.
 * Parses JSON array of objects and produces a SAS DATA step with INFORMAT/FORMAT statements.
 */
export default function SasDatasetGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [datasetName, setDatasetName] = useState('work.mydata');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON data.');
      return;
    }

    try {
      const parsed = JSON.parse(input.trim());
      const rows = Array.isArray(parsed) ? parsed : [parsed];

      if (rows.length === 0) {
        setError('JSON array is empty.');
        return;
      }

      const firstRow = rows[0];
      const columns = Object.keys(firstRow);

      // Determine column types and max lengths
      const colMeta: Record<string, { type: 'num' | 'char'; maxLen: number }> = {};
      columns.forEach((col) => {
        let isNum = true;
        let maxLen = 1;
        rows.forEach((row) => {
          const val = row[col];
          if (val !== null && val !== undefined) {
            const strVal = String(val);
            if (strVal.length > maxLen) maxLen = strVal.length;
            if (typeof val !== 'number' && isNaN(Number(val))) {
              isNum = false;
            }
          }
        });
        colMeta[col] = { type: isNum ? 'num' : 'char', maxLen };
      });

      // Build SAS DATA step
      const lines: string[] = [];
      const safeName = datasetName.trim() || 'work.mydata';
      lines.push(`DATA ${safeName};`);

      // LENGTH statement
      const lengthParts = columns.map((col) => {
        const meta = colMeta[col];
        const sasName = col.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 32);
        if (meta.type === 'char') {
          return `  ${sasName} $${Math.max(meta.maxLen, 1)}`;
        }
        return `  ${sasName} 8`;
      });
      lines.push('  LENGTH');
      lengthParts.forEach((p) => lines.push(p));
      lines.push('  ;');
      lines.push('');

      // INPUT statement
      lines.push('  INPUT');
      columns.forEach((col) => {
        const meta = colMeta[col];
        const sasName = col.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 32);
        if (meta.type === 'char') {
          lines.push(`    ${sasName} $`);
        } else {
          lines.push(`    ${sasName}`);
        }
      });
      lines.push('  ;');
      lines.push('');

      // DATALINES
      lines.push('  DATALINES;');
      rows.forEach((row) => {
        const vals = columns.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return '.';
          return String(val);
        });
        lines.push(vals.join(' '));
      });
      lines.push(';');
      lines.push('RUN;');

      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON. Please enter a valid JSON array of objects.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Dataset Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          placeholder="work.mydata"
          aria-label="SAS dataset name"
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Data (array of objects)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={generate}
          className="btn-primary mt-2"
        >
          Generate SAS Dataset
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SAS DATA Step</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
