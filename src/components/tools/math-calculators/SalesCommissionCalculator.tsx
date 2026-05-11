'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SalesCommissionCalculator - Calculate sales commission from revenue and rate tiers.
 * Supports flat rate and tiered commission structures.
 */
export default function SalesCommissionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [revenue, setRevenue] = useState('');
  const [mode, setMode] = useState<'flat' | 'tiered'>('flat');
  const [flatRate, setFlatRate] = useState('');
  const [tiers, setTiers] = useState([
    { upTo: '10000', rate: '5' },
    { upTo: '50000', rate: '8' },
    { upTo: '', rate: '12' },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ commission: number; effectiveRate: number; breakdown: string[] } | null>(null);

  const addTier = () => {
    setTiers([...tiers, { upTo: '', rate: '' }]);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const updateTier = (index: number, field: 'upTo' | 'rate', value: string) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const rev = parseFloat(revenue);

    if (!revenue.trim() || isNaN(rev) || rev < 0) {
      newErrors.revenue = 'Please enter a valid revenue amount';
    }

    if (mode === 'flat') {
      const rate = parseFloat(flatRate);
      if (!flatRate.trim() || isNaN(rate) || rate < 0 || rate > 100) {
        newErrors.flatRate = 'Please enter a valid rate (0-100)';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    if (mode === 'flat') {
      const rate = parseFloat(flatRate);
      const commission = rev * (rate / 100);
      setResult({
        commission,
        effectiveRate: rate,
        breakdown: [`$${rev.toFixed(2)} × ${rate}% = $${commission.toFixed(2)}`],
      });
    } else {
      let remaining = rev;
      let totalCommission = 0;
      let prevLimit = 0;
      const breakdown: string[] = [];

      for (let i = 0; i < tiers.length; i++) {
        const rate = parseFloat(tiers[i].rate);
        if (isNaN(rate)) continue;

        const limit = tiers[i].upTo ? parseFloat(tiers[i].upTo) : Infinity;
        if (isNaN(limit) && tiers[i].upTo) continue;

        const tierAmount = Math.min(remaining, limit - prevLimit);
        if (tierAmount <= 0) break;

        const tierCommission = tierAmount * (rate / 100);
        totalCommission += tierCommission;
        remaining -= tierAmount;

        const rangeLabel = limit === Infinity
          ? `$${prevLimit.toLocaleString()}+`
          : `$${prevLimit.toLocaleString()} – $${limit.toLocaleString()}`;
        breakdown.push(`${rangeLabel}: $${tierAmount.toFixed(2)} × ${rate}% = $${tierCommission.toFixed(2)}`);

        prevLimit = limit;
        if (remaining <= 0) break;
      }

      const effectiveRate = rev > 0 ? (totalCommission / rev) * 100 : 0;
      setResult({ commission: totalCommission, effectiveRate, breakdown });
    }
  };

  const copyText = result
    ? `Revenue: $${parseFloat(revenue).toFixed(2)}\nCommission: $${result.commission.toFixed(2)}\nEffective Rate: ${result.effectiveRate.toFixed(2)}%\n\nBreakdown:\n${result.breakdown.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.revenue}>
        <label htmlFor={`${toolId}-revenue`} className="block text-sm font-medium text-gray-700 mb-1">
          Total Sales Revenue ($)
        </label>
        <input
          id={`${toolId}-revenue`}
          type="text"
          inputMode="decimal"
          value={revenue}
          onChange={(e) => {
            setRevenue(e.target.value);
            if (errors.revenue) setErrors((prev) => ({ ...prev, revenue: '' }));
          }}
          placeholder="e.g. 75000"
          aria-label={`Revenue input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'flat'} onChange={() => setMode('flat')} className="text-blue-600" />
          <span className="text-sm text-gray-700">Flat Rate</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={mode === 'tiered'} onChange={() => setMode('tiered')} className="text-blue-600" />
          <span className="text-sm text-gray-700">Tiered Rates</span>
        </label>
      </div>

      {mode === 'flat' ? (
        <InputArea error={errors.flatRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Commission Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={flatRate}
            onChange={(e) => {
              setFlatRate(e.target.value);
              if (errors.flatRate) setErrors((prev) => ({ ...prev, flatRate: '' }));
            }}
            placeholder="e.g. 10"
            aria-label={`Commission rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Commission Tiers</label>
          {tiers.map((tier, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                inputMode="decimal"
                value={tier.upTo}
                onChange={(e) => updateTier(i, 'upTo', e.target.value)}
                placeholder={i === tiers.length - 1 ? '∞ (no limit)' : 'Up to $'}
                aria-label={`Tier ${i + 1} upper limit`}
                className="input-field flex-1"
              />
              <input
                type="text"
                inputMode="decimal"
                value={tier.rate}
                onChange={(e) => updateTier(i, 'rate', e.target.value)}
                placeholder="Rate %"
                aria-label={`Tier ${i + 1} rate`}
                className="input-field w-24"
              />
              <button onClick={() => removeTier(i)} className="text-red-500 text-sm hover:text-red-700" aria-label={`Remove tier ${i + 1}`}>✕</button>
            </div>
          ))}
          <button onClick={addTier} className="text-sm text-blue-600 hover:text-blue-800">+ Add Tier</button>
        </div>
      )}

      <button onClick={calculate} aria-label="Calculate commission" className="btn-primary">
        Calculate Commission
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.commission.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Commission Earned</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.effectiveRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Effective Rate</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Breakdown:</p>
              {result.breakdown.map((line, i) => (
                <p key={i} className="font-mono text-xs">{line}</p>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
