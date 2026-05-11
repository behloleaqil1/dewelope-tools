'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FenceCalculator - Calculate fencing materials needed (posts, rails, pickets).
 * Estimates materials based on fence length, height, and post spacing.
 */
export default function FenceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fenceLength, setFenceLength] = useState('');
  const [fenceHeight, setFenceHeight] = useState('6');
  const [postSpacing, setPostSpacing] = useState('8');
  const [railsPerSection, setRailsPerSection] = useState('2');
  const [picketWidth, setPicketWidth] = useState('3.5');
  const [picketGap, setPicketGap] = useState('0');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    posts: number;
    rails: number;
    pickets: number;
    sections: number;
    concretePerPost: number;
    totalConcrete: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const length = parseFloat(fenceLength);
    const spacing = parseFloat(postSpacing);
    const pWidth = parseFloat(picketWidth);

    if (!fenceLength.trim() || isNaN(length) || length <= 0) {
      newErrors.fenceLength = 'Enter a valid fence length';
    }
    if (isNaN(spacing) || spacing <= 0) {
      newErrors.postSpacing = 'Enter valid post spacing';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const sections = Math.ceil(length / spacing);
    const posts = sections + 1;
    const rails = sections * parseInt(railsPerSection);

    // Pickets calculation
    const gap = parseFloat(picketGap) || 0;
    const picketsPerSection = Math.ceil((spacing * (unit === 'feet' ? 12 : 100)) / ((pWidth) + gap));
    const pickets = picketsPerSection * sections;

    // Concrete: ~1/3 bag per post for standard 4x4 posts in feet, adjusted for meters
    const concretePerPost = unit === 'feet' ? 0.33 : 0.5;
    const totalConcrete = Math.ceil(posts * concretePerPost);

    setResult({ posts, rails, pickets, sections, concretePerPost, totalConcrete });
  };

  const unitLabel = unit === 'feet' ? 'ft' : 'm';
  const smallUnit = unit === 'feet' ? 'in' : 'cm';
  const copyText = result
    ? `Fence Materials Estimate:\nFence Length: ${fenceLength} ${unitLabel}\nSections: ${result.sections}\nPosts: ${result.posts}\nRails: ${result.rails}\nPickets: ${result.pickets}\nConcrete Bags (60lb): ${result.totalConcrete}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.fenceLength || errors.postSpacing}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'feet' | 'meters')} aria-label={`Unit for ${toolName}`} className="input-field">
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Fence Length ({unitLabel})</label>
            <input id={`${toolId}-length`} type="text" inputMode="decimal" value={fenceLength} onChange={(e) => { setFenceLength(e.target.value); if (errors.fenceLength) setErrors({}); }} placeholder="e.g. 100" aria-label={`Fence length for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Fence Height ({unitLabel})</label>
            <input id={`${toolId}-height`} type="text" inputMode="decimal" value={fenceHeight} onChange={(e) => setFenceHeight(e.target.value)} aria-label={`Fence height for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mb-1">Post Spacing ({unitLabel})</label>
            <input id={`${toolId}-spacing`} type="text" inputMode="decimal" value={postSpacing} onChange={(e) => { setPostSpacing(e.target.value); if (errors.postSpacing) setErrors({}); }} placeholder="8" aria-label={`Post spacing for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rails`} className="block text-sm font-medium text-gray-700 mb-1">Rails per Section</label>
            <select id={`${toolId}-rails`} value={railsPerSection} onChange={(e) => setRailsPerSection(e.target.value)} aria-label={`Rails per section for ${toolName}`} className="input-field">
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-picket-w`} className="block text-sm font-medium text-gray-700 mb-1">Picket Width ({smallUnit})</label>
            <input id={`${toolId}-picket-w`} type="text" inputMode="decimal" value={picketWidth} onChange={(e) => setPicketWidth(e.target.value)} aria-label={`Picket width for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">Picket Gap ({smallUnit})</label>
            <input id={`${toolId}-gap`} type="text" inputMode="decimal" value={picketGap} onChange={(e) => setPicketGap(e.target.value)} aria-label={`Picket gap for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate Fence Materials" className="btn-primary">
        Calculate Materials
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.sections}</div>
                <div className="text-xs text-gray-500 mt-1">Sections</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.posts}</div>
                <div className="text-xs text-gray-500 mt-1">Posts</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.rails}</div>
                <div className="text-xs text-gray-500 mt-1">Rails</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.pickets}</div>
                <div className="text-xs text-gray-500 mt-1">Pickets</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalConcrete}</div>
                <div className="text-xs text-gray-500 mt-1">Concrete Bags</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
