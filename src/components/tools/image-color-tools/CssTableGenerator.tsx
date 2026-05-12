'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTableGenerator - Generate CSS table styles (striped, bordered, hover).
 */
export default function CssTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [striped, setStriped] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [hover, setHover] = useState(true);
  const [rounded, setRounded] = useState(false);
  const [compact, setCompact] = useState(false);
  const [headerBg, setHeaderBg] = useState('#1a73e8');
  const [headerText, setHeaderText] = useState('#ffffff');
  const [stripedColor, setStripedColor] = useState('#f8f9fa');
  const [borderColor, setBorderColor] = useState('#dee2e6');
  const [hoverColor, setHoverColor] = useState('#e9ecef');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    const padding = compact ? '6px 10px' : '12px 16px';

    lines.push('.styled-table {');
    lines.push('  width: 100%;');
    lines.push('  border-collapse: collapse;');
    lines.push('  font-family: sans-serif;');
    lines.push('  font-size: 14px;');
    if (rounded) {
      lines.push('  border-radius: 8px;');
      lines.push('  overflow: hidden;');
    }
    lines.push('}');
    lines.push('');

    lines.push('.styled-table thead th {');
    lines.push(`  background-color: ${headerBg};`);
    lines.push(`  color: ${headerText};`);
    lines.push(`  padding: ${padding};`);
    lines.push('  text-align: left;');
    lines.push('  font-weight: 600;');
    lines.push('}');
    lines.push('');

    lines.push('.styled-table tbody td {');
    lines.push(`  padding: ${padding};`);
    if (bordered) {
      lines.push(`  border-bottom: 1px solid ${borderColor};`);
    }
    lines.push('}');
    lines.push('');

    if (bordered) {
      lines.push('.styled-table {');
      lines.push(`  border: 1px solid ${borderColor};`);
      lines.push('}');
      lines.push('');
      lines.push('.styled-table th,');
      lines.push('.styled-table td {');
      lines.push(`  border: 1px solid ${borderColor};`);
      lines.push('}');
      lines.push('');
    }

    if (striped) {
      lines.push('.styled-table tbody tr:nth-child(even) {');
      lines.push(`  background-color: ${stripedColor};`);
      lines.push('}');
      lines.push('');
    }

    if (hover) {
      lines.push('.styled-table tbody tr:hover {');
      lines.push(`  background-color: ${hoverColor};`);
      lines.push('  transition: background-color 0.2s ease;');
      lines.push('}');
      lines.push('');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={striped} onChange={(e) => setStriped(e.target.checked)} aria-label="Striped rows" />
            Striped Rows
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={bordered} onChange={(e) => setBordered(e.target.checked)} aria-label="Bordered" />
            Bordered
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hover} onChange={(e) => setHover(e.target.checked)} aria-label="Hover effect" />
            Hover Effect
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} aria-label="Rounded corners" />
            Rounded Corners
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} aria-label="Compact" />
            Compact
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-headerbg`} className="block text-sm font-medium text-gray-700 mb-1">Header Background</label>
            <input id={`${toolId}-headerbg`} type="color" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className="input-field h-10 w-full" aria-label={`Header background for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-headertext`} className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
            <input id={`${toolId}-headertext`} type="color" value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="input-field h-10 w-full" aria-label="Header text color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-stripe`} className="block text-sm font-medium text-gray-700 mb-1">Stripe Color</label>
            <input id={`${toolId}-stripe`} type="color" value={stripedColor} onChange={(e) => setStripedColor(e.target.value)} className="input-field h-10 w-full" aria-label="Stripe color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
            <input id={`${toolId}-border`} type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="input-field h-10 w-full" aria-label="Border color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">Hover Color</label>
            <input id={`${toolId}-hover`} type="color" value={hoverColor} onChange={(e) => setHoverColor(e.target.value)} className="input-field h-10 w-full" aria-label="Hover color" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS Table Styles</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
