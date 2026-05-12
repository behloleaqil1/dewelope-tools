'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YarnWeightConverter - Convert yarn weights between US, UK, and metric systems.
 * Maps yarn weight categories and provides gauge/needle size equivalents.
 */

interface YarnWeight {
  us: string;
  uk: string;
  metric: string;
  wpi: string;
  needleUS: string;
  needleMM: string;
  gauge: string;
  category: number;
}

const YARN_WEIGHTS: YarnWeight[] = [
  { us: 'Lace (0)', uk: '1 ply', metric: 'Cobweb', wpi: '30-40', needleUS: '000-1', needleMM: '1.5-2.25', gauge: '32-34 sts', category: 0 },
  { us: 'Super Fine (1)', uk: '2 ply / 3 ply', metric: 'Fingering', wpi: '14-30', needleUS: '1-3', needleMM: '2.25-3.25', gauge: '27-32 sts', category: 1 },
  { us: 'Fine (2)', uk: '4 ply', metric: 'Sport', wpi: '12-14', needleUS: '3-5', needleMM: '3.25-3.75', gauge: '23-26 sts', category: 2 },
  { us: 'Light (3)', uk: 'DK / 5 ply', metric: 'DK', wpi: '11-12', needleUS: '5-7', needleMM: '3.75-4.5', gauge: '21-24 sts', category: 3 },
  { us: 'Medium (4)', uk: 'Aran / 8 ply', metric: 'Worsted', wpi: '9-11', needleUS: '7-9', needleMM: '4.5-5.5', gauge: '16-20 sts', category: 4 },
  { us: 'Bulky (5)', uk: 'Chunky / 12 ply', metric: 'Bulky', wpi: '6-8', needleUS: '9-11', needleMM: '5.5-8', gauge: '12-15 sts', category: 5 },
  { us: 'Super Bulky (6)', uk: 'Super Chunky', metric: 'Roving', wpi: '4-5', needleUS: '11-17', needleMM: '8-12.75', gauge: '7-11 sts', category: 6 },
  { us: 'Jumbo (7)', uk: 'Jumbo', metric: 'Jumbo', wpi: '1-3', needleUS: '17+', needleMM: '12.75+', gauge: '1-6 sts', category: 7 },
];

export default function YarnWeightConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedWeight, setSelectedWeight] = useState(4);
  const [searchSystem, setSearchSystem] = useState<'us' | 'uk' | 'metric'>('us');

  const current = YARN_WEIGHTS[selectedWeight];

  const getLabel = (w: YarnWeight) => {
    if (searchSystem === 'us') return w.us;
    if (searchSystem === 'uk') return w.uk;
    return w.metric;
  };

  const copyText = `Yarn Weight Conversion\n\nUS: ${current.us}\nUK: ${current.uk}\nMetric: ${current.metric}\n\nWraps Per Inch (WPI): ${current.wpi}\nNeedle Size (US): ${current.needleUS}\nNeedle Size (mm): ${current.needleMM}\nGauge (4" / 10cm): ${current.gauge}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
          Select By System
        </label>
        <select
          id={`${toolId}-system`}
          value={searchSystem}
          onChange={(e) => setSearchSystem(e.target.value as typeof searchSystem)}
          aria-label={`System for ${toolName}`}
          className="input-field"
        >
          <option value="us">US (Craft Yarn Council)</option>
          <option value="uk">UK / Australian</option>
          <option value="metric">Metric / Generic</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">
          Yarn Weight
        </label>
        <select
          id={`${toolId}-weight`}
          value={selectedWeight}
          onChange={(e) => setSelectedWeight(Number(e.target.value))}
          aria-label={`Yarn weight for ${toolName}`}
          className="input-field"
        >
          {YARN_WEIGHTS.map((w, i) => (
            <option key={i} value={i}>{getLabel(w)}</option>
          ))}
        </select>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Equivalent Weights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-sm font-bold text-blue-700">{current.us}</div>
              <div className="text-xs text-blue-500 mt-1">US (CYC)</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <div className="text-sm font-bold text-green-700">{current.uk}</div>
              <div className="text-xs text-green-500 mt-1">UK / Australian</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
              <div className="text-sm font-bold text-purple-700">{current.metric}</div>
              <div className="text-xs text-purple-500 mt-1">Metric</div>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-700 mt-4">Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-bold text-gray-700">{current.wpi}</div>
              <div className="text-xs text-gray-500">Wraps Per Inch</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-bold text-gray-700">{current.gauge}</div>
              <div className="text-xs text-gray-500">Gauge (4&quot; / 10cm)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-bold text-gray-700">US {current.needleUS}</div>
              <div className="text-xs text-gray-500">Needle Size (US)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-bold text-gray-700">{current.needleMM} mm</div>
              <div className="text-xs text-gray-500">Needle Size (mm)</div>
            </div>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
