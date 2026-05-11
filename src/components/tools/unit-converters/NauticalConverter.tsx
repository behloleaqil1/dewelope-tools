'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NauticalConverter - Converts between nautical miles, knots, fathoms, and cables.
 * Also shows conversions to standard units (km, mph, meters).
 */
export default function NauticalConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('nautical-miles');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const units = [
    { id: 'nautical-miles', label: 'Nautical Miles' },
    { id: 'knots', label: 'Knots (nm/h)' },
    { id: 'fathoms', label: 'Fathoms' },
    { id: 'cables', label: 'Cables' },
  ];

  // Conversion factors to base unit (meters for distance, m/s for speed)
  const toMeters: Record<string, number> = {
    'nautical-miles': 1852,
    'fathoms': 1.8288,
    'cables': 185.2,
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const val = parseFloat(value);

    if (!value.trim() || isNaN(val)) {
      newErrors.value = 'Please enter a valid number';
    } else if (val < 0) {
      newErrors.value = 'Value cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const results: Record<string, string> = {};

    if (unit === 'knots') {
      // Speed conversions: 1 knot = 1 nautical mile/hour = 1.852 km/h = 0.514444 m/s
      const kmh = val * 1.852;
      const mph = val * 1.15078;
      const ms = val * 0.514444;
      results['Knots'] = val.toFixed(4);
      results['km/h'] = kmh.toFixed(4);
      results['mph'] = mph.toFixed(4);
      results['m/s'] = ms.toFixed(4);
      results['ft/s'] = (ms * 3.28084).toFixed(4);
    } else {
      // Distance conversions
      const meters = val * toMeters[unit];
      results['Nautical Miles'] = (meters / 1852).toFixed(6);
      results['Cables'] = (meters / 185.2).toFixed(6);
      results['Fathoms'] = (meters / 1.8288).toFixed(4);
      results['Meters'] = meters.toFixed(4);
      results['Kilometers'] = (meters / 1000).toFixed(6);
      results['Miles'] = (meters / 1609.344).toFixed(6);
      results['Feet'] = (meters * 3.28084).toFixed(4);
      results['Yards'] = (meters / 0.9144).toFixed(4);
    }

    setResult(results);
  };

  const copyText = result
    ? Object.entries(result).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.value}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (errors.value) setErrors({}); }}
            placeholder="e.g. 10"
            aria-label={`Value input for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id={`${toolId}-unit`}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label={`Unit selection for ${toolName}`}
            className="input-field"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Convert nautical units" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result).map(([label, val]) => (
                <div key={label} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm font-bold text-gray-800">{val}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
