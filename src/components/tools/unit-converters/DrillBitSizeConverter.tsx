'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DrillBitSizeConverter - Convert drill bit sizes between fractional, decimal, metric, letter, and number.
 */
export default function DrillBitSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState<'decimal' | 'fractional' | 'metric' | 'letter' | 'number'>('decimal');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ decimal: string; metric: string; fractional: string; closest: string } | null>(null);

  const letterSizes: Record<string, number> = {
    A: 0.234, B: 0.238, C: 0.242, D: 0.246, E: 0.250, F: 0.257, G: 0.261, H: 0.266,
    I: 0.272, J: 0.277, K: 0.281, L: 0.290, M: 0.295, N: 0.302, O: 0.316, P: 0.323,
    Q: 0.332, R: 0.339, S: 0.348, T: 0.358, U: 0.368, V: 0.377, W: 0.386, X: 0.397,
    Y: 0.404, Z: 0.413,
  };

  const numberSizes: Record<number, number> = {
    1: 0.2280, 2: 0.2210, 3: 0.2130, 4: 0.2090, 5: 0.2055, 6: 0.2040, 7: 0.2010,
    8: 0.1990, 9: 0.1960, 10: 0.1935, 11: 0.1910, 12: 0.1890, 13: 0.1850, 14: 0.1820,
    15: 0.1800, 16: 0.1770, 17: 0.1730, 18: 0.1695, 19: 0.1660, 20: 0.1610,
    21: 0.1590, 22: 0.1570, 23: 0.1540, 24: 0.1520, 25: 0.1495, 26: 0.1470,
    27: 0.1440, 28: 0.1405, 29: 0.1360, 30: 0.1285, 31: 0.1200, 32: 0.1160,
    33: 0.1130, 34: 0.1110, 35: 0.1100, 36: 0.1065, 37: 0.1040, 38: 0.1015,
    39: 0.0995, 40: 0.0980, 41: 0.0960, 42: 0.0935, 43: 0.0890, 44: 0.0860,
    45: 0.0820, 46: 0.0810, 47: 0.0785, 48: 0.0760, 49: 0.0730, 50: 0.0700,
    51: 0.0670, 52: 0.0635, 53: 0.0595, 54: 0.0550, 55: 0.0520, 56: 0.0465,
    57: 0.0430, 58: 0.0420, 59: 0.0410, 60: 0.0400, 61: 0.0390, 62: 0.0380,
    63: 0.0370, 64: 0.0360, 65: 0.0350, 66: 0.0330, 67: 0.0320, 68: 0.0310,
    69: 0.0292, 70: 0.0280, 71: 0.0260, 72: 0.0250, 73: 0.0240, 74: 0.0225,
    75: 0.0210, 76: 0.0200, 77: 0.0180, 78: 0.0160, 79: 0.0145, 80: 0.0135,
  };

  const commonFractions = [
    1/64, 1/32, 3/64, 1/16, 5/64, 3/32, 7/64, 1/8, 9/64, 5/32, 11/64, 3/16,
    13/64, 7/32, 15/64, 1/4, 17/64, 9/32, 19/64, 5/16, 21/64, 11/32, 23/64, 3/8,
    25/64, 13/32, 27/64, 7/16, 29/64, 15/32, 31/64, 1/2, 33/64, 17/32, 35/64, 9/16,
    37/64, 19/32, 39/64, 5/8, 41/64, 21/32, 43/64, 11/16, 45/64, 23/32, 47/64, 3/4,
    49/64, 25/32, 51/64, 13/16, 53/64, 27/32, 55/64, 7/8, 57/64, 29/32, 59/64, 15/16,
    61/64, 31/32, 63/64, 1,
  ];

  const fractionLabels = [
    '1/64', '1/32', '3/64', '1/16', '5/64', '3/32', '7/64', '1/8', '9/64', '5/32', '11/64', '3/16',
    '13/64', '7/32', '15/64', '1/4', '17/64', '9/32', '19/64', '5/16', '21/64', '11/32', '23/64', '3/8',
    '25/64', '13/32', '27/64', '7/16', '29/64', '15/32', '31/64', '1/2', '33/64', '17/32', '35/64', '9/16',
    '37/64', '19/32', '39/64', '5/8', '41/64', '21/32', '43/64', '11/16', '45/64', '23/32', '47/64', '3/4',
    '49/64', '25/32', '51/64', '13/16', '53/64', '27/32', '55/64', '7/8', '57/64', '29/32', '59/64', '15/16',
    '61/64', '31/32', '63/64', '1',
  ];

  const findClosestFraction = (inches: number): string => {
    let closest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < commonFractions.length; i++) {
      const diff = Math.abs(commonFractions[i] - inches);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }
    return `${fractionLabels[closest]}"`;
  };

  const convert = () => {
    setError('');
    setResult(null);

    let inches = 0;

    if (inputType === 'decimal') {
      inches = parseFloat(value);
      if (isNaN(inches) || inches <= 0) { setError('Enter a valid decimal inch value'); return; }
    } else if (inputType === 'metric') {
      const mm = parseFloat(value);
      if (isNaN(mm) || mm <= 0) { setError('Enter a valid mm value'); return; }
      inches = mm / 25.4;
    } else if (inputType === 'fractional') {
      const parts = value.trim().split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (isNaN(num) || isNaN(den) || den === 0) { setError('Enter a valid fraction (e.g. 3/16)'); return; }
        inches = num / den;
      } else {
        inches = parseFloat(value);
        if (isNaN(inches) || inches <= 0) { setError('Enter a valid fraction (e.g. 3/16)'); return; }
      }
    } else if (inputType === 'letter') {
      const letter = value.trim().toUpperCase();
      if (!letterSizes[letter]) { setError('Enter a valid letter (A-Z)'); return; }
      inches = letterSizes[letter];
    } else if (inputType === 'number') {
      const num = parseInt(value);
      if (!numberSizes[num]) { setError('Enter a valid number (1-80)'); return; }
      inches = numberSizes[num];
    }

    const metric = inches * 25.4;
    const fractional = findClosestFraction(inches);

    setResult({
      decimal: `${inches.toFixed(4)}"`,
      metric: `${metric.toFixed(3)} mm`,
      fractional,
      closest: `Decimal: ${inches.toFixed(4)}" | Metric: ${metric.toFixed(3)} mm | Fractional: ${fractional}`,
    });
  };

  const copyText = result ? result.closest : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Type
        </label>
        <select
          id={`${toolId}-type`}
          value={inputType}
          onChange={(e) => setInputType(e.target.value as 'decimal' | 'fractional' | 'metric' | 'letter' | 'number')}
          className="input-field mb-3"
          aria-label={`Input type for ${toolName}`}
        >
          <option value="decimal">Decimal Inches (e.g. 0.250)</option>
          <option value="fractional">Fractional Inches (e.g. 3/16)</option>
          <option value="metric">Metric mm (e.g. 6.35)</option>
          <option value="letter">Letter Size (A-Z)</option>
          <option value="number">Number Size (1-80)</option>
        </select>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputType === 'letter' ? 'e.g. F' : inputType === 'number' ? 'e.g. 7' : inputType === 'fractional' ? 'e.g. 3/16' : inputType === 'metric' ? 'e.g. 6.35' : 'e.g. 0.250'}
          aria-label={`Drill bit size for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert drill bit size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.decimal}</div>
                <div className="text-xs text-gray-500 mt-1">Decimal Inches</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.metric}</div>
                <div className="text-xs text-gray-500 mt-1">Metric (mm)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.fractional}</div>
                <div className="text-xs text-gray-500 mt-1">Nearest Fraction</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
