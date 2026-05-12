'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NeedleGaugeConverter - Convert needle gauges between G, mm, and French.
 * Provides conversions for medical/industrial needle sizes.
 */
export default function NeedleGaugeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState('gauge');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<{ gauge: string; mm: string; french: string; inches: string; description: string } | null>(null);
  const [error, setError] = useState('');

  // Standard needle gauge data: gauge -> outer diameter in mm
  const gaugeData: Record<number, { mm: number; description: string }> = {
    7: { mm: 4.572, description: 'Very large bore - rarely used clinically' },
    8: { mm: 4.191, description: 'Large bore' },
    9: { mm: 3.810, description: 'Large bore' },
    10: { mm: 3.404, description: 'Large bore' },
    11: { mm: 3.048, description: 'Large bore' },
    12: { mm: 2.769, description: 'Large bore' },
    13: { mm: 2.413, description: 'Large bore' },
    14: { mm: 2.108, description: 'Large bore IV, blood donation' },
    15: { mm: 1.829, description: 'Large bore IV, rapid infusion' },
    16: { mm: 1.651, description: 'Blood transfusion, surgical' },
    17: { mm: 1.473, description: 'Blood donation, trauma' },
    18: { mm: 1.270, description: 'Blood products, CT contrast' },
    19: { mm: 1.067, description: 'General IV access' },
    20: { mm: 0.908, description: 'Standard IV, most infusions' },
    21: { mm: 0.819, description: 'Blood draw, IV for children' },
    22: { mm: 0.718, description: 'Pediatric IV, routine blood draw' },
    23: { mm: 0.641, description: 'Blood draw, small veins' },
    24: { mm: 0.566, description: 'Pediatric, neonatal' },
    25: { mm: 0.514, description: 'Subcutaneous injection' },
    26: { mm: 0.464, description: 'Subcutaneous, intradermal' },
    27: { mm: 0.413, description: 'Tuberculin test, insulin' },
    28: { mm: 0.362, description: 'Insulin injection' },
    29: { mm: 0.337, description: 'Insulin injection' },
    30: { mm: 0.311, description: 'Insulin, intradermal' },
    31: { mm: 0.261, description: 'Insulin pen needles' },
    32: { mm: 0.235, description: 'Insulin pen needles' },
    33: { mm: 0.210, description: 'Very fine, specialty use' },
    34: { mm: 0.184, description: 'Ultra-fine, specialty use' },
  };

  const convert = () => {
    setError('');
    setResult(null);

    const val = parseFloat(inputValue);
    if (!inputValue.trim() || isNaN(val)) {
      setError('Please enter a valid number');
      return;
    }

    let mm: number;
    let gauge: number | null = null;

    if (inputType === 'gauge') {
      const g = Math.round(val);
      if (!gaugeData[g]) {
        setError(`Gauge ${g}G not found. Supported range: 7G to 34G`);
        return;
      }
      mm = gaugeData[g].mm;
      gauge = g;
    } else if (inputType === 'mm') {
      mm = val;
      // Find closest gauge
      let closestGauge = 7;
      let closestDiff = Infinity;
      for (const [g, data] of Object.entries(gaugeData)) {
        const diff = Math.abs(data.mm - mm);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestGauge = parseInt(g);
        }
      }
      gauge = closestGauge;
    } else {
      // French to mm: French = mm * 3
      mm = val / 3;
      let closestGauge = 7;
      let closestDiff = Infinity;
      for (const [g, data] of Object.entries(gaugeData)) {
        const diff = Math.abs(data.mm - mm);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestGauge = parseInt(g);
        }
      }
      gauge = closestGauge;
    }

    const french = mm * 3;
    const inches = mm / 25.4;
    const description = gauge !== null && gaugeData[gauge] ? gaugeData[gauge].description : 'Custom size';

    setResult({
      gauge: gauge !== null ? `${gauge}G` : 'N/A',
      mm: mm.toFixed(3),
      french: french.toFixed(2),
      inches: inches.toFixed(4),
      description,
    });
  };

  const copyText = result
    ? `Needle Size Conversion:\nGauge: ${result.gauge}\nOuter Diameter: ${result.mm} mm\nFrench: ${result.french} Fr\nInches: ${result.inches}"\nUse: ${result.description}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Type
        </label>
        <select
          id={`${toolId}-type`}
          value={inputType}
          onChange={(e) => { setInputType(e.target.value); setResult(null); }}
          aria-label={`Input type for ${toolName}`}
          className="input-field mb-3"
        >
          <option value="gauge">Gauge (G)</option>
          <option value="mm">Millimeters (mm)</option>
          <option value="french">French (Fr)</option>
        </select>

        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); if (error) setError(''); }}
          placeholder={inputType === 'gauge' ? 'e.g. 18' : inputType === 'mm' ? 'e.g. 1.27' : 'e.g. 3.81'}
          aria-label={`Value input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert needle gauge">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.gauge}</div>
                <div className="text-xs text-gray-500">Gauge</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.mm} mm</div>
                <div className="text-xs text-gray-500">Millimeters</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.french} Fr</div>
                <div className="text-xs text-gray-500">French</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.inches}&quot;</div>
                <div className="text-xs text-gray-500">Inches</div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800"><span className="font-medium">Typical use:</span> {result.description}</p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Note: French = mm × 3. Higher gauge = smaller diameter.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
