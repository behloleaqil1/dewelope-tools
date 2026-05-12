'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SewingNeedleSizeConverter - Convert sewing needle sizes between US, UK, and metric systems.
 */
export default function SewingNeedleSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [fromSystem, setFromSystem] = useState<'us' | 'uk' | 'metric'>('us');
  const [result, setResult] = useState<{ us: string; uk: string; metric: string; type: string } | null>(null);

  // Sewing machine needle size chart
  const needleSizes = [
    { us: '8', uk: '60', metric: '60', type: 'Lightweight (silk, chiffon)' },
    { us: '9', uk: '65', metric: '65', type: 'Lightweight (organza, voile)' },
    { us: '10', uk: '70', metric: '70', type: 'Light (cotton lawn, batiste)' },
    { us: '11', uk: '75', metric: '75', type: 'Light-Medium (lining, taffeta)' },
    { us: '12', uk: '80', metric: '80', type: 'Medium (cotton, linen, satin)' },
    { us: '14', uk: '90', metric: '90', type: 'Medium-Heavy (wool, velvet)' },
    { us: '16', uk: '100', metric: '100', type: 'Heavy (denim, canvas)' },
    { us: '18', uk: '110', metric: '110', type: 'Very Heavy (upholstery, thick denim)' },
    { us: '19', uk: '120', metric: '120', type: 'Extra Heavy (heavy canvas, leather)' },
    { us: '20', uk: '125', metric: '125', type: 'Extra Heavy (multiple layers)' },
    { us: '21', uk: '130', metric: '130', type: 'Industrial weight' },
  ];

  // Hand sewing needle sizes (different system)
  const handNeedles = [
    { us: '1', uk: '1', metric: '1.0mm', type: 'Sharps - Heavy fabric' },
    { us: '3', uk: '3', metric: '0.9mm', type: 'Sharps - Medium-heavy' },
    { us: '5', uk: '5', metric: '0.8mm', type: 'Sharps - Medium fabric' },
    { us: '7', uk: '7', metric: '0.7mm', type: 'Sharps - Light-medium' },
    { us: '9', uk: '9', metric: '0.6mm', type: 'Sharps - Lightweight' },
    { us: '10', uk: '10', metric: '0.5mm', type: 'Sharps - Very light' },
    { us: '12', uk: '12', metric: '0.4mm', type: 'Sharps - Finest' },
  ];

  const [needleType, setNeedleType] = useState<'machine' | 'hand'>('machine');

  const convert = () => {
    if (!selectedSize.trim()) return;

    const sizes = needleType === 'machine' ? needleSizes : handNeedles;
    const found = sizes.find(s => {
      if (fromSystem === 'us') return s.us === selectedSize.trim();
      if (fromSystem === 'uk') return s.uk === selectedSize.trim();
      return s.metric === selectedSize.trim();
    });

    if (found) {
      setResult(found);
    } else {
      setResult(null);
    }
  };

  const copyText = result
    ? `Needle Size Conversion:\nUS: ${result.us}\nUK: ${result.uk}\nMetric: ${result.metric}\nRecommended for: ${result.type}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Needle Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => { setNeedleType('machine'); setResult(null); }}
            className={`px-4 py-2 rounded text-sm font-medium ${needleType === 'machine' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Machine needles"
          >
            Machine Needles
          </button>
          <button
            onClick={() => { setNeedleType('hand'); setResult(null); }}
            className={`px-4 py-2 rounded text-sm font-medium ${needleType === 'hand' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Hand sewing needles"
          >
            Hand Sewing
          </button>
        </div>
      </InputArea>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Convert From</label>
        <select
          value={fromSystem}
          onChange={(e) => setFromSystem(e.target.value as 'us' | 'uk' | 'metric')}
          aria-label={`Source system for ${toolName}`}
          className="input-field"
        >
          <option value="us">US Size</option>
          <option value="uk">UK/European Size</option>
          <option value="metric">Metric (mm)</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Needle Size
        </label>
        <input
          id={`${toolId}-size`}
          type="text"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          placeholder={fromSystem === 'us' ? 'e.g. 12' : fromSystem === 'uk' ? 'e.g. 80' : 'e.g. 80'}
          aria-label={`Needle size for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert needle size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500">US</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.uk}</div>
                <div className="text-xs text-gray-500">UK/European</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.metric}</div>
                <div className="text-xs text-gray-500">Metric</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-800">Recommended for: {result.type}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {needleType === 'machine' ? 'Machine Needle' : 'Hand Needle'} Size Chart
        </h3>
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left p-1">US</th>
                <th className="text-left p-1">UK/EU</th>
                <th className="text-left p-1">Metric</th>
                <th className="text-left p-1">Use</th>
              </tr>
            </thead>
            <tbody>
              {(needleType === 'machine' ? needleSizes : handNeedles).map((s, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="p-1">{s.us}</td>
                  <td className="p-1">{s.uk}</td>
                  <td className="p-1">{s.metric}</td>
                  <td className="p-1 text-gray-600">{s.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
