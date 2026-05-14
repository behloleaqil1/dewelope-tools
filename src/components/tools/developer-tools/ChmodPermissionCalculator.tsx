'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChmodPermissionCalculator - Calculate chmod numeric permissions from checkbox selections.
 */
export default function ChmodPermissionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [perms, setPerms] = useState([false, false, false, false, false, false, false, false, false]);

  const labels = ['Owner Read', 'Owner Write', 'Owner Execute', 'Group Read', 'Group Write', 'Group Execute', 'Others Read', 'Others Write', 'Others Execute'];
  const values = [4, 2, 1, 4, 2, 1, 4, 2, 1];

  const toggle = (i: number) => {
    const next = [...perms];
    next[i] = !next[i];
    setPerms(next);
  };

  const owner = (perms[0] ? 4 : 0) + (perms[1] ? 2 : 0) + (perms[2] ? 1 : 0);
  const group = (perms[3] ? 4 : 0) + (perms[4] ? 2 : 0) + (perms[5] ? 1 : 0);
  const others = (perms[6] ? 4 : 0) + (perms[7] ? 2 : 0) + (perms[8] ? 1 : 0);
  const numeric = `${owner}${group}${others}`;

  const symbolic = () => {
    const r = (i: number) => perms[i] ? 'r' : '-';
    const w = (i: number) => perms[i] ? 'w' : '-';
    const x = (i: number) => perms[i] ? 'x' : '-';
    return `${r(0)}${w(1)}${x(2)}${r(3)}${w(4)}${x(5)}${r(6)}${w(7)}${x(8)}`;
  };

  const result = `chmod ${numeric}\nSymbolic: ${symbolic()}\nOwner: ${owner} | Group: ${group} | Others: ${others}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        {['Owner', 'Group', 'Others'].map((section, si) => (
          <div key={section} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">{section}</h3>
            {['Read', 'Write', 'Execute'].map((perm, pi) => {
              const idx = si * 3 + pi;
              return (
                <label key={idx} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={perms[idx]} onChange={() => toggle(idx)} aria-label={`${labels[idx]} for ${toolName}`} className="rounded border-gray-300" />
                  {perm} ({values[idx]})
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <div className="text-center">
            <span className="text-3xl font-mono font-bold text-gray-800">{numeric}</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 bg-gray-50 p-3 rounded-lg">{result}</pre>
          <CopyToClipboard text={`chmod ${numeric}`} />
        </div>
      </OutputArea>
    </div>
  );
}
