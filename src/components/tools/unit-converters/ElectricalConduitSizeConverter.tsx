'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricalConduitSizeConverter - Convert electrical conduit sizes between trade size, metric, and actual dimensions.
 * Covers common conduit types: EMT, IMC, RMC/GRC with inner and outer diameters.
 */

interface ConduitEntry {
  tradeSize: string;
  metric: number;
  emt: { od: number; id: number };
  imc: { od: number; id: number };
  rmc: { od: number; id: number };
}

const CONDUIT_DATA: ConduitEntry[] = [
  { tradeSize: '1/2"', metric: 16, emt: { od: 0.706, id: 0.622 }, imc: { od: 0.815, id: 0.660 }, rmc: { od: 0.840, id: 0.632 } },
  { tradeSize: '3/4"', metric: 21, emt: { od: 0.922, id: 0.824 }, imc: { od: 1.029, id: 0.864 }, rmc: { od: 1.050, id: 0.836 } },
  { tradeSize: '1"', metric: 27, emt: { od: 1.163, id: 1.049 }, imc: { od: 1.290, id: 1.105 }, rmc: { od: 1.315, id: 1.063 } },
  { tradeSize: '1-1/4"', metric: 35, emt: { od: 1.510, id: 1.380 }, imc: { od: 1.638, id: 1.453 }, rmc: { od: 1.660, id: 1.394 } },
  { tradeSize: '1-1/2"', metric: 41, emt: { od: 1.740, id: 1.610 }, imc: { od: 1.883, id: 1.698 }, rmc: { od: 1.900, id: 1.624 } },
  { tradeSize: '2"', metric: 53, emt: { od: 2.197, id: 2.067 }, imc: { od: 2.360, id: 2.150 }, rmc: { od: 2.375, id: 2.083 } },
  { tradeSize: '2-1/2"', metric: 63, emt: { od: 2.875, id: 2.731 }, imc: { od: 2.857, id: 2.597 }, rmc: { od: 2.875, id: 2.489 } },
  { tradeSize: '3"', metric: 78, emt: { od: 3.500, id: 3.356 }, imc: { od: 3.476, id: 3.216 }, rmc: { od: 3.500, id: 3.090 } },
  { tradeSize: '3-1/2"', metric: 91, emt: { od: 4.000, id: 3.834 }, imc: { od: 3.971, id: 3.711 }, rmc: { od: 4.000, id: 3.570 } },
  { tradeSize: '4"', metric: 103, emt: { od: 4.500, id: 4.334 }, imc: { od: 4.466, id: 4.206 }, rmc: { od: 4.500, id: 4.050 } },
];

export default function ElectricalConduitSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedSize, setSelectedSize] = useState('all');
  const [conduitType, setConduitType] = useState<'all' | 'emt' | 'imc' | 'rmc'>('all');

  const filteredData = selectedSize === 'all'
    ? CONDUIT_DATA
    : CONDUIT_DATA.filter((d) => d.tradeSize === selectedSize);

  const copyText = filteredData.map((d) => {
    let line = `Trade Size: ${d.tradeSize} | Metric: ${d.metric}mm`;
    if (conduitType === 'all' || conduitType === 'emt') line += ` | EMT OD: ${d.emt.od}" ID: ${d.emt.id}"`;
    if (conduitType === 'all' || conduitType === 'imc') line += ` | IMC OD: ${d.imc.od}" ID: ${d.imc.id}"`;
    if (conduitType === 'all' || conduitType === 'rmc') line += ` | RMC OD: ${d.rmc.od}" ID: ${d.rmc.id}"`;
    return line;
  }).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
              Trade Size
            </label>
            <select
              id={`${toolId}-size`}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              aria-label={`Trade size for ${toolName}`}
              className="input-field"
            >
              <option value="all">All Sizes</option>
              {CONDUIT_DATA.map((d) => (
                <option key={d.tradeSize} value={d.tradeSize}>{d.tradeSize} (Metric {d.metric})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Conduit Type
            </label>
            <select
              id={`${toolId}-type`}
              value={conduitType}
              onChange={(e) => setConduitType(e.target.value as 'all' | 'emt' | 'imc' | 'rmc')}
              aria-label={`Conduit type for ${toolName}`}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="emt">EMT (Electrical Metallic Tubing)</option>
              <option value="imc">IMC (Intermediate Metal Conduit)</option>
              <option value="rmc">RMC (Rigid Metal Conduit)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-200 text-left">Trade Size</th>
                  <th className="p-2 border border-gray-200 text-center">Metric (mm)</th>
                  {(conduitType === 'all' || conduitType === 'emt') && (
                    <>
                      <th className="p-2 border border-gray-200 text-center">EMT OD&quot;</th>
                      <th className="p-2 border border-gray-200 text-center">EMT ID&quot;</th>
                    </>
                  )}
                  {(conduitType === 'all' || conduitType === 'imc') && (
                    <>
                      <th className="p-2 border border-gray-200 text-center">IMC OD&quot;</th>
                      <th className="p-2 border border-gray-200 text-center">IMC ID&quot;</th>
                    </>
                  )}
                  {(conduitType === 'all' || conduitType === 'rmc') && (
                    <>
                      <th className="p-2 border border-gray-200 text-center">RMC OD&quot;</th>
                      <th className="p-2 border border-gray-200 text-center">RMC ID&quot;</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{d.tradeSize}</td>
                    <td className="p-2 border border-gray-200 text-center">{d.metric}</td>
                    {(conduitType === 'all' || conduitType === 'emt') && (
                      <>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.emt.od}</td>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.emt.id}</td>
                      </>
                    )}
                    {(conduitType === 'all' || conduitType === 'imc') && (
                      <>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.imc.od}</td>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.imc.id}</td>
                      </>
                    )}
                    {(conduitType === 'all' || conduitType === 'rmc') && (
                      <>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.rmc.od}</td>
                        <td className="p-2 border border-gray-200 text-center font-mono">{d.rmc.id}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p><strong>EMT</strong> = Electrical Metallic Tubing (thin wall) | <strong>IMC</strong> = Intermediate Metal Conduit | <strong>RMC</strong> = Rigid Metal Conduit (thick wall)</p>
            <p className="mt-1">OD = Outer Diameter | ID = Inner Diameter | All dimensions in inches unless noted</p>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
