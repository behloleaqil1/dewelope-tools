'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface LineItem {
  name: string;
  value: string;
}

/**
 * NetWorthCalculator - Calculate net worth from assets and liabilities.
 * Net Worth = Total Assets - Total Liabilities.
 */
export default function NetWorthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [assets, setAssets] = useState<LineItem[]>([
    { name: 'Cash & Savings', value: '' },
    { name: 'Investments', value: '' },
    { name: 'Real Estate', value: '' },
    { name: 'Vehicles', value: '' },
  ]);
  const [liabilities, setLiabilities] = useState<LineItem[]>([
    { name: 'Mortgage', value: '' },
    { name: 'Car Loans', value: '' },
    { name: 'Student Loans', value: '' },
    { name: 'Credit Cards', value: '' },
  ]);
  const [result, setResult] = useState<{ totalAssets: number; totalLiabilities: number; netWorth: number } | null>(null);

  const updateItem = (list: LineItem[], setList: (items: LineItem[]) => void, index: number, field: keyof LineItem, val: string) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: val };
    setList(updated);
  };

  const addItem = (list: LineItem[], setList: (items: LineItem[]) => void) => {
    setList([...list, { name: '', value: '' }]);
  };

  const removeItem = (list: LineItem[], setList: (items: LineItem[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const totalAssets = assets.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    setResult({ totalAssets, totalLiabilities, netWorth });
  };

  const formatCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const copyText = result
    ? `Net Worth: ${formatCurrency(result.netWorth)}\nTotal Assets: ${formatCurrency(result.totalAssets)}\nTotal Liabilities: ${formatCurrency(result.totalLiabilities)}`
    : '';

  const renderItems = (label: string, items: LineItem[], setItems: (items: LineItem[]) => void) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(items, setItems, idx, 'name', e.target.value)}
            placeholder="Name"
            className="input-field flex-1"
            aria-label={`${label} item ${idx + 1} name`}
          />
          <input
            type="text"
            inputMode="decimal"
            value={item.value}
            onChange={(e) => updateItem(items, setItems, idx, 'value', e.target.value)}
            placeholder="Amount"
            className="input-field w-32"
            aria-label={`${label} item ${idx + 1} value`}
          />
          <button
            onClick={() => removeItem(items, setItems, idx)}
            className="text-red-500 hover:text-red-700 text-sm px-2"
            aria-label={`Remove ${label} item ${idx + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button onClick={() => addItem(items, setItems)} className="text-sm text-blue-600 hover:text-blue-800">
        + Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        {renderItems('Assets', assets, setAssets)}
      </InputArea>

      <InputArea>
        {renderItems('Liabilities', liabilities, setLiabilities)}
      </InputArea>

      <button onClick={calculate} aria-label={`Calculate net worth using ${toolName}`} className="btn-primary">
        Calculate Net Worth
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className={`text-3xl font-bold ${result.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(result.netWorth)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Net Worth</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{formatCurrency(result.totalAssets)}</div>
                <div className="text-xs text-gray-500">Total Assets</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{formatCurrency(result.totalLiabilities)}</div>
                <div className="text-xs text-gray-500">Total Liabilities</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
