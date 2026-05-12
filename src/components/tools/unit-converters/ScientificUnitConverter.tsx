'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScientificUnitConverter - Convert between scientific units including
 * moles, particles (Avogadro), atomic mass units, electron volts, etc.
 */
export default function ScientificUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('amount');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);

  const AVOGADRO = 6.02214076e23;

  const categories: Record<string, { units: { id: string; name: string; toBase: number }[]; baseName: string }> = {
    amount: {
      baseName: 'mol',
      units: [
        { id: 'mol', name: 'Mole (mol)', toBase: 1 },
        { id: 'mmol', name: 'Millimole (mmol)', toBase: 1e-3 },
        { id: 'umol', name: 'Micromole (µmol)', toBase: 1e-6 },
        { id: 'nmol', name: 'Nanomole (nmol)', toBase: 1e-9 },
        { id: 'pmol', name: 'Picomole (pmol)', toBase: 1e-12 },
        { id: 'particles', name: 'Particles (Avogadro)', toBase: 1 / AVOGADRO },
      ],
    },
    energy: {
      baseName: 'J',
      units: [
        { id: 'J', name: 'Joule (J)', toBase: 1 },
        { id: 'kJ', name: 'Kilojoule (kJ)', toBase: 1000 },
        { id: 'eV', name: 'Electron Volt (eV)', toBase: 1.602176634e-19 },
        { id: 'keV', name: 'Kiloelectron Volt (keV)', toBase: 1.602176634e-16 },
        { id: 'MeV', name: 'Megaelectron Volt (MeV)', toBase: 1.602176634e-13 },
        { id: 'cal', name: 'Calorie (cal)', toBase: 4.184 },
        { id: 'kcal', name: 'Kilocalorie (kcal)', toBase: 4184 },
        { id: 'erg', name: 'Erg', toBase: 1e-7 },
      ],
    },
    mass: {
      baseName: 'kg',
      units: [
        { id: 'kg', name: 'Kilogram (kg)', toBase: 1 },
        { id: 'g', name: 'Gram (g)', toBase: 1e-3 },
        { id: 'mg', name: 'Milligram (mg)', toBase: 1e-6 },
        { id: 'ug', name: 'Microgram (µg)', toBase: 1e-9 },
        { id: 'amu', name: 'Atomic Mass Unit (u)', toBase: 1.66053906660e-27 },
        { id: 'Da', name: 'Dalton (Da)', toBase: 1.66053906660e-27 },
      ],
    },
    length: {
      baseName: 'm',
      units: [
        { id: 'm', name: 'Meter (m)', toBase: 1 },
        { id: 'nm', name: 'Nanometer (nm)', toBase: 1e-9 },
        { id: 'pm', name: 'Picometer (pm)', toBase: 1e-12 },
        { id: 'angstrom', name: 'Ångström (Å)', toBase: 1e-10 },
        { id: 'fm', name: 'Femtometer (fm)', toBase: 1e-15 },
        { id: 'um', name: 'Micrometer (µm)', toBase: 1e-6 },
        { id: 'bohr', name: 'Bohr Radius (a₀)', toBase: 5.29177210903e-11 },
      ],
    },
  };

  const currentUnits = categories[category]?.units || [];

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Enter a valid number');
      setResult(null);
      return;
    }
    if (!fromUnit || !toUnit) {
      setError('Select both units');
      setResult(null);
      return;
    }

    setError('');

    const from = currentUnits.find(u => u.id === fromUnit);
    const to = currentUnits.find(u => u.id === toUnit);

    if (!from || !to) {
      setError('Invalid unit selection');
      return;
    }

    const baseValue = num * from.toBase;
    const converted = baseValue / to.toBase;

    const formula = `${num} ${from.name.split(' (')[0]} = ${converted.toExponential(6)} ${to.name.split(' (')[0]}`;

    setResult({ value: converted, formula });
  };

  const copyText = result
    ? `${value} ${currentUnits.find(u => u.id === fromUnit)?.name || fromUnit} = ${result.value.toExponential(6)} ${currentUnits.find(u => u.id === toUnit)?.name || toUnit}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-category`} className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id={`${toolId}-category`}
          value={category}
          onChange={(e) => { setCategory(e.target.value); setFromUnit(''); setToUnit(''); setResult(null); }}
          aria-label={`Category for ${toolName}`}
          className="input-field"
        >
          <option value="amount">Amount of Substance</option>
          <option value="energy">Energy (Scientific)</option>
          <option value="mass">Mass (Scientific)</option>
          <option value="length">Length (Scientific)</option>
        </select>
      </InputArea>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 6.022e23"
          aria-label={`Value for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
            From Unit
          </label>
          <select
            id={`${toolId}-from`}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label={`From unit for ${toolName}`}
            className="input-field"
          >
            <option value="">Select unit...</option>
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">
            To Unit
          </label>
          <select
            id={`${toolId}-to`}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            aria-label={`To unit for ${toolName}`}
            className="input-field"
          >
            <option value="">Select unit...</option>
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.value.toExponential(6)}</div>
              <div className="text-xs text-gray-500 mt-1">{currentUnits.find(u => u.id === toUnit)?.name}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <strong>Constants used:</strong> Avogadro&apos;s number = 6.02214076 × 10²³ mol⁻¹
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
