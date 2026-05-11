'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InvestmentReturnCalculator - Calculate total return and CAGR from investment data.
 */
export default function InvestmentReturnCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('');
  const [dividends, setDividends] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    totalReturn: number;
    totalReturnPercent: number;
    cagr: number;
    netProfit: number;
    annualizedReturn: number;
    totalWithDividends: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const period = parseFloat(years);
    const divs = parseFloat(dividends) || 0;

    if (!initialInvestment.trim() || isNaN(initial) || initial <= 0) {
      newErrors.initial = 'Enter a valid positive number';
    }
    if (!finalValue.trim() || isNaN(final) || final < 0) {
      newErrors.final = 'Enter a valid number';
    }
    if (!years.trim() || isNaN(period) || period <= 0) {
      newErrors.years = 'Enter a valid positive number of years';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const totalWithDividends = final + divs;
    const netProfit = totalWithDividends - initial;
    const totalReturnPercent = ((totalWithDividends - initial) / initial) * 100;
    const cagr = (Math.pow(totalWithDividends / initial, 1 / period) - 1) * 100;
    const annualizedReturn = netProfit / period;

    setResult({
      totalReturn: totalWithDividends,
      totalReturnPercent,
      cagr,
      netProfit,
      annualizedReturn,
      totalWithDividends,
    });
  };

  const copyText = result
    ? `Investment Return Summary\nInitial Investment: $${parseFloat(initialInvestment).toFixed(2)}\nFinal Value: $${parseFloat(finalValue).toFixed(2)}\nDividends Received: $${(parseFloat(dividends) || 0).toFixed(2)}\nPeriod: ${years} years\n\nNet Profit: $${result.netProfit.toFixed(2)}\nTotal Return: ${result.totalReturnPercent.toFixed(2)}%\nCAGR: ${result.cagr.toFixed(2)}%\nAnnualized Profit: $${result.annualizedReturn.toFixed(2)}/year`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.initial}>
          <label htmlFor={`${toolId}-initial`} className="block text-sm font-medium text-gray-700 mb-1">
            Initial Investment ($)
          </label>
          <input
            id={`${toolId}-initial`}
            type="text"
            inputMode="decimal"
            value={initialInvestment}
            onChange={(e) => { setInitialInvestment(e.target.value); if (errors.initial) setErrors(prev => ({ ...prev, initial: '' })); }}
            placeholder="e.g. 10000"
            aria-label={`Initial investment for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.final}>
          <label htmlFor={`${toolId}-final`} className="block text-sm font-medium text-gray-700 mb-1">
            Final Value ($)
          </label>
          <input
            id={`${toolId}-final`}
            type="text"
            inputMode="decimal"
            value={finalValue}
            onChange={(e) => { setFinalValue(e.target.value); if (errors.final) setErrors(prev => ({ ...prev, final: '' })); }}
            placeholder="e.g. 15000"
            aria-label={`Final value for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.years}>
          <label htmlFor={`${toolId}-years`} className="block text-sm font-medium text-gray-700 mb-1">
            Investment Period (years)
          </label>
          <input
            id={`${toolId}-years`}
            type="text"
            inputMode="decimal"
            value={years}
            onChange={(e) => { setYears(e.target.value); if (errors.years) setErrors(prev => ({ ...prev, years: '' })); }}
            placeholder="e.g. 5"
            aria-label={`Investment period for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-dividends`} className="block text-sm font-medium text-gray-700 mb-1">
            Total Dividends Received ($ optional)
          </label>
          <input
            id={`${toolId}-dividends`}
            type="text"
            inputMode="decimal"
            value={dividends}
            onChange={(e) => setDividends(e.target.value)}
            placeholder="e.g. 500"
            aria-label="Total dividends received"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate investment return" className="btn-primary">
        Calculate Return
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.totalReturnPercent >= 0 ? '+' : ''}{result.totalReturnPercent.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Return</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.cagr >= 0 ? '+' : ''}{result.cagr.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">CAGR</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${result.netProfit.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Net Profit</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">
                  ${result.annualizedReturn.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Avg. Annual Profit</div>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              <div>CAGR = (Final / Initial)^(1/years) - 1</div>
              <div className="mt-1">CAGR = ({result.totalWithDividends.toFixed(2)} / {parseFloat(initialInvestment).toFixed(2)})^(1/{years}) - 1 = {result.cagr.toFixed(2)}%</div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
