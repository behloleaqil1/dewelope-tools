'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RaidCapacityCalculator - Calculate RAID array usable capacity from disk count,
 * disk size, and RAID level.
 */
export default function RaidCapacityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [diskCount, setDiskCount] = useState('4');
  const [diskSize, setDiskSize] = useState('1');
  const [diskUnit, setDiskUnit] = useState('TB');
  const [raidLevel, setRaidLevel] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const count = parseInt(diskCount, 10);
    const size = parseFloat(diskSize);

    if (!count || count < 1 || !size || size <= 0) {
      setOutput('Error: Please enter valid disk count and size.');
      return;
    }

    const totalRaw = count * size;
    let usable = 0;
    let faultTolerance = '';
    let minDisks = 1;
    let description = '';

    switch (raidLevel) {
      case '0':
        usable = totalRaw;
        faultTolerance = 'None (0 disk failures)';
        minDisks = 2;
        description = 'Striping only - no redundancy';
        break;
      case '1':
        usable = totalRaw / 2;
        faultTolerance = '1 disk failure per mirrored pair';
        minDisks = 2;
        description = 'Mirroring - 50% capacity used for redundancy';
        break;
      case '5':
        usable = (count - 1) * size;
        faultTolerance = '1 disk failure';
        minDisks = 3;
        description = 'Striping with distributed parity';
        break;
      case '6':
        usable = (count - 2) * size;
        faultTolerance = '2 disk failures';
        minDisks = 4;
        description = 'Striping with double distributed parity';
        break;
      case '10':
        usable = totalRaw / 2;
        faultTolerance = '1 disk per mirrored pair';
        minDisks = 4;
        description = 'Mirrored stripes (RAID 1+0)';
        break;
      default:
        setOutput('Error: Unknown RAID level.');
        return;
    }

    if (count < minDisks) {
      setOutput(`Error: RAID ${raidLevel} requires at least ${minDisks} disks.`);
      return;
    }

    const efficiency = ((usable / totalRaw) * 100).toFixed(1);

    const result = `RAID Capacity Calculation
═══════════════════════════════════════
RAID Level: RAID ${raidLevel}
Description: ${description}
Number of Disks: ${count}
Disk Size: ${size} ${diskUnit} each

Total Raw Capacity: ${totalRaw.toFixed(2)} ${diskUnit}
Usable Capacity: ${usable.toFixed(2)} ${diskUnit}
Parity/Mirror Overhead: ${(totalRaw - usable).toFixed(2)} ${diskUnit}
Storage Efficiency: ${efficiency}%
Fault Tolerance: ${faultTolerance}
Minimum Disks Required: ${minDisks}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Disks</label>
            <input id={`${toolId}-count`} type="number" min="1" value={diskCount} onChange={(e) => setDiskCount(e.target.value)} aria-label={`Disk count for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Disk Size</label>
            <div className="flex gap-2">
              <input id={`${toolId}-size`} type="number" min="0.1" step="0.1" value={diskSize} onChange={(e) => setDiskSize(e.target.value)} aria-label="Disk size" className="input-field flex-1" />
              <select value={diskUnit} onChange={(e) => setDiskUnit(e.target.value)} aria-label="Disk size unit" className="input-field w-24">
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-raid`} className="block text-sm font-medium text-gray-700 mb-1">RAID Level</label>
            <select id={`${toolId}-raid`} value={raidLevel} onChange={(e) => setRaidLevel(e.target.value)} aria-label="RAID level" className="input-field">
              <option value="0">RAID 0 (Striping)</option>
              <option value="1">RAID 1 (Mirroring)</option>
              <option value="5">RAID 5 (Single Parity)</option>
              <option value="6">RAID 6 (Double Parity)</option>
              <option value="10">RAID 10 (Mirrored Stripes)</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Capacity</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">RAID Capacity Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
