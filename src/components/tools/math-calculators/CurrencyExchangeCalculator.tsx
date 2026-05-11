'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CurrencyExchangeCalculator - Calculates currency exchange with manual rate input.
 */
export default function CurrencyExchangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<{ converted: number; inverseRate: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'KRW', 'SGD', 'HKD', 'SEK', 'NOK'];

  const calculate = () => {
    setError(undefined);
    setResult(null);

    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);

    if (!amount.trim() || isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }
    if (!rate.trim() || isNaN(rateNum) || rateNum <= 0) {
      setError('Please enter a valid exchange rate (greater than 0)');
      return;
    }

    const converted = amountNum * rateNum;
    const inverseRate = 1 / rateNum;

    setResult({ converted, inverseRate });
  };

  const copyText = result
    ? `${amount} ${fromCurrency} = ${result.converted.toFixed(4)} ${toCurrency}\nExchange Rate: 1 ${fromCurrency} = ${rate} ${toCurrency}\nInverse Rate: 1 ${toCurrency} = ${result.inverseRate.toFixed(6)} ${fromCurrency}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3">Currency exchange for {toolName}</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-amount`} className="block text-xs text-gray-500 mb-1">Amount</label>
            <input
              id={`${toolId}-amount`}
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              aria-label="Amount to convert"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-xs text-gray-500 mb-1">Exchange Rate</label>
            <input
              id={`${toolId}-rate`}
              type="text"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 0.92"
              aria-label="Exchange rate"
              className="input-field text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From Currency</label>
            <select
              id={`${toolId}-from`}
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              aria-label="Source currency"
              className="input-field text-sm"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To Currency</label>
            <select
              id={`${toolId}-to`}
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              aria-label="Target currency"
              className="input-field text-sm"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate exchange" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.converted.toFixed(4)} {toCurrency}</div>
              <div className="text-sm text-gray-500 mt-1">{amount} {fromCurrency} at rate {rate}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700">1 {fromCurrency} = {parseFloat(rate).toFixed(6)} {toCurrency}</div>
                <div className="text-xs text-gray-500 mt-1">Rate</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700">1 {toCurrency} = {result.inverseRate.toFixed(6)} {fromCurrency}</div>
                <div className="text-xs text-gray-500 mt-1">Inverse Rate</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
