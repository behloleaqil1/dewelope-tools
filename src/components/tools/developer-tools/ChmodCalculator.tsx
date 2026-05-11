'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChmodCalculator - Calculate Unix file permissions in numeric and symbolic notation.
 * Converts between octal (e.g., 755) and symbolic (e.g., rwxr-xr-x) formats.
 */
export default function ChmodCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [owner, setOwner] = useState({ read: true, write: true, execute: true });
  const [group, setGroup] = useState({ read: true, write: false, execute: true });
  const [others, setOthers] = useState({ read: true, write: false, execute: true });

  function getOctal(perms: { read: boolean; write: boolean; execute: boolean }): number {
    return (perms.read ? 4 : 0) + (perms.write ? 2 : 0) + (perms.execute ? 1 : 0);
  }

  function getSymbolic(perms: { read: boolean; write: boolean; execute: boolean }): string {
    return (perms.read ? 'r' : '-') + (perms.write ? 'w' : '-') + (perms.execute ? 'x' : '-');
  }

  const octalValue = `${getOctal(owner)}${getOctal(group)}${getOctal(others)}`;
  const symbolicValue = `${getSymbolic(owner)}${getSymbolic(group)}${getSymbolic(others)}`;
  const chmodCommand = `chmod ${octalValue} filename`;

  const copyText = `Octal: ${octalValue}\nSymbolic: ${symbolicValue}\nCommand: ${chmodCommand}`;

  function PermissionGroup({ label, perms, setPerms }: {
    label: string;
    perms: { read: boolean; write: boolean; execute: boolean };
    setPerms: (p: { read: boolean; write: boolean; execute: boolean }) => void;
  }) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{label}</h3>
        <div className="flex gap-4">
          {(['read', 'write', 'execute'] as const).map((perm) => (
            <label key={perm} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={perms[perm]}
                onChange={(e) => setPerms({ ...perms, [perm]: e.target.checked })}
                className="rounded border-gray-300"
                aria-label={`${label} ${perm} permission`}
              />
              {perm.charAt(0).toUpperCase() + perm.slice(1)}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Set file permissions for {toolName}
        </label>
        <div className="space-y-3" aria-labelledby={`${toolId}-label`}>
          <PermissionGroup label="Owner" perms={owner} setPerms={setOwner} />
          <PermissionGroup label="Group" perms={group} setPerms={setGroup} />
          <PermissionGroup label="Others" perms={others} setPerms={setOthers} />
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600 font-mono">{octalValue}</div>
              <div className="text-xs text-gray-500 mt-1">Octal</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600 font-mono">{symbolicValue}</div>
              <div className="text-xs text-gray-500 mt-1">Symbolic</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm font-bold text-gray-700 font-mono break-all">{chmodCommand}</div>
              <div className="text-xs text-gray-500 mt-1">Command</div>
            </div>
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
