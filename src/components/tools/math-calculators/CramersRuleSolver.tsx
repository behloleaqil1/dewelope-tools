'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CramersRuleSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState<'2' | '3'>('2');
  const [matrix, setMatrix] = useState('');
  const [constants, setConstants] = useState('');
  const [output, setOutput] = useState('');

  const det2 = (m: number[][]): number => m[0][0] * m[1][1] - m[0][1] * m[1][0];

  const det3 = (m: number[][]): number =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const calculate = () => {
    const n = parseInt(size);
    const rows = matrix.trim().split('\n').map(row => row.split(/[,\s]+/).map(Number));
    const b = constants.split(/[,\s]+/).map(Number);

    if (rows.length !== n || rows.some(r => r.length !== n || r.some(isNaN))) {
      setOutput(`Enter a valid ${n}x${n} matrix (one row per line).`); return;
    }
    if (b.length !== n || b.some(isNaN)) { setOutput(`Enter ${n} constant values.`); return; }

    const detFn = n === 2 ? det2 : det3;
    const D = detFn(rows);
    if (D === 0) { setOutput('System has no unique solution (determinant = 0).'); return; }

    const solutions: number[] = [];
    for (let col = 0; col < n; col++) {
      const modified = rows.map((row, i) => row.map((val, j) => j === col ? b[i] : val));
      solutions.push(detFn(modified) / D);
    }

    const vars = ['x', 'y', 'z'];
    const result = solutions.map((s, i) => `${vars[i]} = ${s.toFixed(6)}`).join('\n');
    setOutput(`Determinant D = ${D}\n\nSolutions:\n${result}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">System Size</label>
        <select id={`${toolId}-size`} value={size} onChange={(e) => setSize(e.target.value as '2' | '3')} aria-label={`System size for ${toolName}`} className="input-field">
          <option value="2">2×2</option>
          <option value="3">3×3</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-matrix`} className="block text-sm font-medium text-gray-700 mb-1">Coefficient Matrix (one row per line)</label>
        <textarea id={`${toolId}-matrix`} value={matrix} onChange={(e) => setMatrix(e.target.value)} placeholder={size === '2' ? '2, 1\n5, 7' : '2, 1, -1\n-3, -1, 2\n-2, 1, 2'} aria-label={`Coefficient matrix for ${toolName}`} className="input-field h-24 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-constants`} className="block text-sm font-medium text-gray-700 mb-1">Constants (comma separated)</label>
        <input id={`${toolId}-constants`} type="text" value={constants} onChange={(e) => setConstants(e.target.value)} placeholder={size === '2' ? '11, 13' : '8, -11, -3'} aria-label={`Constants for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Solve System</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
